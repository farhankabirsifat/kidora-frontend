import { useParams, useNavigate } from "react-router-dom";
import { Filter, SortAsc, X } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import ProductCard from "../components/ProductCard";
import { listProductsByCategory, listCategories, mapProductOutToUi } from "../services/products";

const CategoryPage = () => {
  // Banner images for categories
  const categoryBanners = {
    women: {
      image: "/woman-category-banner.png",
      alt: "Women Category Banner",
    },
    men: {
      image: "/man-category-banner.png",
      alt: "Men Category Banner",
    },
    kids: {
      image: "/man-category-banner.png",
      alt: "Kids Category Banner",
    },
  };
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: "all",
    rating: "all",
    sortBy: "default",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rawProducts, setRawProducts] = useState([]);
  const [page] = useState(0); // reserved for future pagination
  const [size] = useState(100);
  const [availableCategories, setAvailableCategories] = useState([]);

  // Fetch distinct categories once (optional use)
  useEffect(() => {
    listCategories()
      .then(cats => setAvailableCategories(cats))
      .catch(()=>{});
  }, []);

  useEffect(() => {
    let cat = categoryName?.toLowerCase();
    // For kids category include girls and boys as well
    if (cat === 'kids') {
      // Use stems to include singular/plural and compounds: kid/kids, girl/girls, boy/boys, child/children
      cat = ['kid','girl','boy','child'];
    }
    if (!cat) return;
    setLoading(true); setError("");
  listProductsByCategory(cat, { page, size })
      .then(data => {
        const mapped = data.map(mapProductOutToUi);
        // Deduplicate by id (array could have overlaps across categories)
        const unique = [];
        const seen = new Set();
        for (const p of mapped) {
          if (!seen.has(p.id)) { seen.add(p.id); unique.push(p); }
        }
        setRawProducts(unique);
      })
      .catch(e => setError(e?.message || 'Failed to load products'))
      .finally(() => setLoading(false));
  }, [categoryName, page, size]);

  const products = useMemo(() => {
    let list = [...rawProducts];
    if (filters.priceRange !== 'all') {
      list = list.filter(p => {
        const priceNum = parseFloat(String(p.price).replace(/[৳$\s]/g, '')) || 0;
        if (filters.priceRange === 'under-500') return priceNum < 500;
        if (filters.priceRange === '500-1000') return priceNum >= 500 && priceNum <= 1000;
        if (filters.priceRange === 'over-1000') return priceNum > 1000;
        return true;
      });
    }
    if (filters.rating !== 'all') {
      list = list.filter(p => {
        const r = p.rating || 0;
        if (filters.rating === '4-plus') return r >= 4;
        if (filters.rating === '4.5-plus') return r >= 4.5;
        if (filters.rating === '5') return r === 5;
        return true;
      });
    }
    switch (filters.sortBy) {
      case 'price-low':
        list.sort((a,b)=> (parseFloat(String(a.price).replace(/[৳$\s]/g, ''))||0) - (parseFloat(String(b.price).replace(/[৳$\s]/g, ''))||0));
        break;
      case 'price-high':
        list.sort((a,b)=> (parseFloat(String(b.price).replace(/[৳$\s]/g, ''))||0) - (parseFloat(String(a.price).replace(/[৳$\s]/g, ''))||0));
        break;
      case 'rating':
        list.sort((a,b)=> (b.rating||0) - (a.rating||0));
        break;
      default:
        break;
    }
    return list;
  }, [rawProducts, filters]);
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
      {/* Poster/Banner */}

      {/* Products Grid */}
      {/* Category Banner below filter/sort section */}
      {(categoryName?.toLowerCase() === "women" ||
        categoryName?.toLowerCase() === "men" ||
        categoryName?.toLowerCase() === "kids") && (
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2">
          <div className="relative w-full">
            <img
              src={categoryBanners[categoryName?.toLowerCase()].image}
              alt={categoryBanners[categoryName?.toLowerCase()].alt}
              className="w-full rounded-lg object-cover sm:max-h-[320px] sm:min-h-[260px] max-h-[200px] min-h-[140px] object-center"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
            <div className="absolute inset-0 flex flex-col items-start justify-center text-left z-10 pl-6 sm:pl-12">
              <h2
                className="text-2xl sm:text-4xl font-bold text-yellow-200 drop-shadow-lg"
                style={{ textShadow: "0 2px 8px rgba(0,0,0,0.18)" }}
              >
                {categoryTitle}
              </h2>
              <p
                className="text-base sm:text-lg text-white font-medium mt-1 flex items-center gap-1"
                style={{ textShadow: "0 2px 8px rgba(0,0,0,0.18)" }}
              >
                <span
                  className="cursor-pointer underline hover:text-yellow-200 transition"
                  onClick={() => navigate("/")}
                >
                  Home
                </span>
                <span>&gt;</span>
                <span>{categoryTitle}</span>
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Sticky Filter/Sort toolbar below banner */}
      <div className="sticky top-16 z-30 bg-white/90 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 border rounded-lg transition-all duration-200 font-medium text-sm ${
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
              className={`flex items-center space-x-2 px-3 sm:px-4 py-2 border rounded-lg transition-all duration-200 font-medium text-sm ${
                showSort
                  ? "bg-purple-50 border-purple-300 text-purple-700 shadow-md"
                  : "border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700"
              }`}
            >
              <SortAsc className="w-4 h-4" />
              <span>Sort</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-gray-600 font-medium">
              {loading ? 'Loading...' : error ? 'Error' : `${products.length} ${products.length === 1 ? 'item' : 'items'}`}
            </span>
            {(filters.priceRange !== "all" || filters.rating !== "all" || filters.sortBy !== "default") && (
              <button
                onClick={() => setFilters({ priceRange: 'all', rating: 'all', sortBy: 'default' })}
                className="text-[11px] sm:text-xs flex items-center gap-1 text-blue-600 hover:text-white hover:bg-blue-600 px-2 py-1 rounded-full font-semibold transition-colors duration-150"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l8 8M6 14L14 6" />
                </svg>
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {error && (
          <div className="text-center py-12 text-red-600 font-medium">{error}</div>
        )}
        {loading && !error && (
          <div className="text-center py-12 text-gray-500 animate-pulse">Loading products…</div>
        )}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
            {products.map((product) => (
              <div key={product.id} className="p-1 sm:p-2">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12 text-gray-500">No products found in this category.</div>
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
            className="absolute md:top-28 md:right-12 top-1/2 left-1/2 md:left-auto md:translate-x-0 md:-translate-y-0 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-xs sm:max-w-sm bg-white rounded-xl shadow-2xl border p-6 animate-scaleFadeIn"
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
            className="absolute md:top-28 md:right-2 top-1/2 left-1/2 md:left-auto md:translate-x-0 md:-translate-y-0 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-xs sm:max-w-sm bg-white rounded-xl shadow-2xl border p-6 animate-scaleFadeIn"
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
                Free delivery on orders above ৳50
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
