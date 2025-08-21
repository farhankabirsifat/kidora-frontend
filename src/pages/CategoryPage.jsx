import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Filter, SortAsc, X } from "lucide-react";
import { useState } from "react";
import ProductCard from "../components/ProductCard";
import { boysItems, girlsDresses, parentsItems } from "../data/products";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: "all",
    rating: "all",
    sortBy: "default",
  });

  const getProductsByCategory = () => {
    switch (categoryName?.toLowerCase()) {
      case "women":
        return girlsDresses;
      case "men":
        return boysItems;
      case "kids":
        return parentsItems;
      default:
        return [];
    }
  };

  const getFilteredProducts = () => {
    let filteredProducts = getProductsByCategory();

    if (filters.priceRange !== "all") {
      filteredProducts = filteredProducts.filter((product) => {
        const price = parseFloat(product.price.replace(/[৳$\s]/g, ""));
        switch (filters.priceRange) {
          case "under-500":
            return price < 500;
          case "500-1000":
            return price >= 500 && price <= 1000;
          case "over-1000":
            return price > 1000;
          default:
            return true;
        }
      });
    }

    if (filters.rating !== "all") {
      filteredProducts = filteredProducts.filter((product) => {
        const rating = product.rating;
        switch (filters.rating) {
          case "4-plus":
            return rating >= 4;
          case "4.5-plus":
            return rating >= 4.5;
          case "5":
            return rating === 5;
          default:
            return true;
        }
      });
    }

    switch (filters.sortBy) {
      case "price-low":
        filteredProducts.sort((a, b) => {
          const priceA = parseFloat(a.price.replace(/[৳$\s]/g, ""));
          const priceB = parseFloat(b.price.replace(/[৳$\s]/g, ""));
          return priceA - priceB;
        });
        break;
      case "price-high":
        filteredProducts.sort((a, b) => {
          const priceA = parseFloat(a.price.replace(/[৳$\s]/g, ""));
          const priceB = parseFloat(b.price.replace(/[৳$\s]/g, ""));
          return priceB - priceA;
        });
        break;
      case "rating":
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return filteredProducts;
  };

  const products = getFilteredProducts();
  const categoryTitle =
    categoryName?.charAt(0).toUpperCase() + categoryName?.slice(1);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 space-y-3 md:space-y-0">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
              <button
                onClick={() => navigate("/")}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="font-medium text-sm sm:text-base">
                  Back to Home
                </span>
              </button>
              <div className="hidden md:block h-8 w-px bg-gray-200"></div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                  {categoryTitle}
                  <span className="text-blue-600 ml-2">Collection</span>
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="text-sm text-gray-500 font-medium">
                    {products.length} {products.length === 1 ? "item" : "items"}{" "}
                    found
                  </span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-medium">
                      Live Inventory
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center w-full">
              <div className="flex items-center space-x-2 sm:space-x-3 flex-1 md:justify-end">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-all duration-200 font-medium text-sm sm:text-base ${
                    showFilters
                      ? "bg-blue-50 border-blue-300 text-blue-700 shadow-md"
                      : "border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
                <button
                  onClick={() => setShowSort(!showSort)}
                  className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-all duration-200 font-medium text-sm sm:text-base ${
                    showSort
                      ? "bg-purple-50 border-purple-300 text-purple-700 shadow-md"
                      : "border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700"
                  }`}
                >
                  <SortAsc className="w-4 h-4" />
                  <span>Sort</span>
                </button>
              </div>
              {/* Show Clear All only if any filter/sort is active */}
              {(filters.priceRange !== "all" ||
                filters.rating !== "all" ||
                filters.sortBy !== "default") && (
                <button
                  onClick={() =>
                    setFilters({
                      priceRange: "all",
                      rating: "all",
                      sortBy: "default",
                    })
                  }
                  className="ml-2 text-xs flex items-center gap-1 text-blue-500 hover:text-white hover:bg-blue-500 px-2 py-1 rounded-full font-semibold transition-colors duration-150 focus:outline-none shadow-sm"
                  style={{ border: "none", background: "none" }}
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 20 20"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 6l8 8M6 14L14 6"
                    />
                  </svg>
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
            {products.map((product) => (
              <div key={product.id} className="p-1 sm:p-2">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              No Products Found
            </h3>
            <p className="text-gray-500 text-sm sm:text-base">
              Sorry, we couldn't find any products in this category.
            </p>
          </div>
        )}
      </div>

      {/* Filter Popup */}
      {showFilters && (
        <div className="fixed inset-0 z-50">
          {/* Overlay for mobile, click to close */}
          <div
            className="absolute inset-0 bg-black/30 md:bg-transparent"
            onClick={() => setShowFilters(false)}
          />
          {/* Popup next to Filter button on desktop, centered on mobile */}
          <div
            className="absolute md:top-[84px] md:right-12 top-1/2 left-1/2 md:left-auto md:translate-x-0 md:-translate-y-0 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-xs sm:max-w-sm bg-white rounded-xl shadow-2xl border p-6 animate-scaleFadeIn"
            style={{
              transition:
                "transform 0.25s cubic-bezier(.4,0,.2,1), opacity 0.25s",
            }}
          >
            <button
              onClick={() => setShowFilters(false)}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100"
              aria-label="Close filter popup"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Filters
            </h3>
            <div className="space-y-6">
              {/* Price Range Filter */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-2">
                  {[
                    { value: "all", label: "All Prices" },
                    { value: "under-500", label: "Under ৳500" },
                    { value: "500-1000", label: "৳500 - ৳1000" },
                    { value: "over-1000", label: "Over ৳1000" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="priceRange"
                        value={option.value}
                        checked={filters.priceRange === option.value}
                        onChange={(e) =>
                          handleFilterChange("priceRange", e.target.value)
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Rating Filter */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Rating</h4>
                <div className="space-y-2">
                  {[
                    { value: "all", label: "All Ratings" },
                    { value: "4-plus", label: "4+ Stars" },
                    { value: "4.5-plus", label: "4.5+ Stars" },
                    { value: "5", label: "5 Stars" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="rating"
                        value={option.value}
                        checked={filters.rating === option.value}
                        onChange={(e) =>
                          handleFilterChange("rating", e.target.value)
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-8 pt-4 border-t">
              <button
                onClick={() => {
                  setFilters({
                    priceRange: "all",
                    rating: "all",
                    sortBy: filters.sortBy,
                  });
                }}
                className="text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                Clear
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sort Popup */}
      {showSort && (
        <div className="fixed inset-0 z-50">
          {/* Overlay for mobile, click to close */}
          <div
            className="absolute inset-0 bg-black/30 md:bg-transparent"
            onClick={() => setShowSort(false)}
          />
          {/* Popup next to Sort button on desktop, centered on mobile */}
          <div
            className="absolute md:top-[84px] md:right-2 top-1/2 left-1/2 md:left-auto md:translate-x-0 md:-translate-y-0 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-xs sm:max-w-sm bg-white rounded-xl shadow-2xl border p-6 animate-scaleFadeIn"
            style={{
              transition:
                "transform 0.25s cubic-bezier(.4,0,.2,1), opacity 0.25s",
            }}
          >
            <button
              onClick={() => setShowSort(false)}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100"
              aria-label="Close sort popup"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Sort By
            </h3>
            <div className="space-y-6">
              {/* Sort Options */}
              <div>
                <div className="space-y-2">
                  {[
                    { value: "default", label: "Default" },
                    { value: "price-low", label: "Price: Low to High" },
                    { value: "price-high", label: "Price: High to Low" },
                    { value: "rating", label: "Rating: High to Low" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="sortBy"
                        value={option.value}
                        checked={filters.sortBy === option.value}
                        onChange={(e) =>
                          handleFilterChange("sortBy", e.target.value)
                        }
                        className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center mt-8 pt-4 border-t">
              <button
                onClick={() => {
                  setFilters({ ...filters, sortBy: "default" });
                  setShowSort(false);
                }}
                className="text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                Clear
              </button>
              <button
                onClick={() => setShowSort(false)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Features */}
      <div className="bg-white py-8 sm:py-12 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                Quality Guaranteed
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                All our products go through strict quality checks
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 5l7 7-7 7"
                  />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                Free Shipping
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Free delivery on orders above $50
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                  />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                Easy Returns
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                30-day hassle-free return policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;

/* Add this to your global CSS or tailwind config:
.animate-scaleFadeIn {
  animation: scaleFadeIn 0.25s cubic-bezier(.4,0,.2,1);
}
@keyframes scaleFadeIn {
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}
*/
