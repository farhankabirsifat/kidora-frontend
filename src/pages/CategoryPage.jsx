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

  // Get products based on category
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

  // Filter and sort products
  const getFilteredProducts = () => {
    let filteredProducts = getProductsByCategory();

    // Price filter
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

    // Rating filter
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

    // Sort products
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

  const clearFilters = () => {
    setFilters({
      priceRange: "all",
      rating: "all",
      sortBy: "default",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => navigate("/")}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="font-medium">Back to Home</span>
              </button>
              <div className="h-8 w-px bg-gray-200"></div>
              <div className="flex flex-col">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  {categoryTitle}
                  <span className="text-blue-600 ml-2">Collection</span>
                </h1>
                <div className="flex items-center space-x-4 mt-1">
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

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-5 py-2.5 border rounded-xl transition-all duration-200 font-medium ${
                  showFilters
                    ? "bg-blue-50 border-blue-300 text-blue-700 shadow-md"
                    : "border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700"
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
                {(filters.priceRange !== "all" || filters.rating !== "all") && (
                  <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {(filters.priceRange !== "all" ? 1 : 0) +
                      (filters.rating !== "all" ? 1 : 0)}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowSort(!showSort)}
                className={`flex items-center space-x-2 px-5 py-2.5 border rounded-xl transition-all duration-200 font-medium ${
                  showSort
                    ? "bg-purple-50 border-purple-300 text-purple-700 shadow-md"
                    : "border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700"
                }`}
              >
                <SortAsc className="w-4 h-4" />
                <span>Sort</span>
                {filters.sortBy !== "default" && (
                  <span className="bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    1
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Popup */}
      {showFilters && (
        <div className="relative">
          <div className="absolute top-0 right-0 mt-2 mr-4 bg-white rounded-lg shadow-xl border z-40 w-80">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Price Range Filter */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Price Range
                  </h4>
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

              <div className="flex justify-between items-center mt-6 pt-4 border-t">
                <button
                  onClick={() => {
                    setFilters((prev) => ({
                      ...prev,
                      priceRange: "all",
                      rating: "all",
                    }));
                  }}
                  className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sort Popup */}
      {showSort && (
        <div className="relative">
          <div className="absolute top-0 right-0 mt-2 mr-4 bg-white rounded-lg shadow-xl border z-40 w-64">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Sort By</h3>
                <button
                  onClick={() => setShowSort(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <div className="space-y-1">
                {[
                  { value: "default", label: "Default" },
                  { value: "price-low", label: "Price: Low to High" },
                  { value: "price-high", label: "Price: High to Low" },
                  { value: "rating", label: "Highest Rated" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center cursor-pointer p-2 hover:bg-gray-50 rounded"
                  >
                    <input
                      type="radio"
                      name="sortBy"
                      value={option.value}
                      checked={filters.sortBy === option.value}
                      onChange={(e) => {
                        handleFilterChange("sortBy", e.target.value);
                        setShowSort(false);
                      }}
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
        </div>
      )}

      {/* Active Filters Summary */}
      {(filters.priceRange !== "all" || filters.rating !== "all") && (
        <div className="bg-gray-50 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-700">
                  Active filters:
                </span>
                {filters.priceRange !== "all" && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Price:{" "}
                    {filters.priceRange === "under-500"
                      ? "Under ৳500"
                      : filters.priceRange === "500-1000"
                      ? "৳500-৳1000"
                      : "Over ৳1000"}
                    <button
                      onClick={() => handleFilterChange("priceRange", "all")}
                      className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.rating !== "all" && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Rating:{" "}
                    {filters.rating === "4-plus"
                      ? "4+ Stars"
                      : filters.rating === "4.5-plus"
                      ? "4.5+ Stars"
                      : "5 Stars"}
                    <button
                      onClick={() => handleFilterChange("rating", "all")}
                      className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.sortBy !== "default" && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Sort:{" "}
                    {filters.sortBy === "price-low"
                      ? "Price Low-High"
                      : filters.sortBy === "price-high"
                      ? "Price High-Low"
                      : "Highest Rated"}
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  setFilters((prev) => ({
                    ...prev,
                    priceRange: "all",
                    rating: "all",
                  }));
                }}
                className="text-sm text-gray-500 hover:text-gray-700 font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 5l7 7-7 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Products Found
            </h3>
            <p className="text-gray-500">
              Sorry, we couldn't find any products in this category.
            </p>
          </div>
        )}
      </div>

      {/* Category Features */}
      <div className="bg-white py-12 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Quality Guaranteed
              </h3>
              <p className="text-gray-600">
                All our products go through strict quality checks
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Free Shipping
              </h3>
              <p className="text-gray-600">Free delivery on orders above $50</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Easy Returns
              </h3>
              <p className="text-gray-600">30-day hassle-free return policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
