import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { boysItems, girlsDresses, parentsItems } from "../data/products";
import ProductCard from "../components/ProductCard";
import Fuse from "fuse.js";

function getAllProducts() {
  return [
    ...boysItems.map((p) => ({ ...p, category: "men" })),
    ...girlsDresses.map((p) => ({ ...p, category: "women" })),
    ...parentsItems.map((p) => ({ ...p, category: "kids" })),
  ];
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchPage = () => {
  const navigate = useNavigate();
  const query = useQuery();
  const searchTerm = query.get("q") || "";
  const [input, setInput] = useState(searchTerm);

  const allProducts = getAllProducts();
  // Fuse.js config
  const fuse = new Fuse(allProducts, {
    keys: ["title", "description", "brand", "category", "keywords"],
    threshold: 0.4,
    distance: 100,
  });

  const filtered =
    searchTerm.trim() === ""
      ? []
      : fuse.search(searchTerm).map((result) => result.item);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(input)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-2 sm:px-6 lg:px-8">
      {/* <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-4 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border border-gray-300 rounded-l px-3 py-1 text-base"
        />
        <button
          type="submit"
          className="px-4 py-1 bg-blue-500 text-white rounded-r"
        >
          Search
        </button>
      </form> */}
      {searchTerm && (
        <h2 className="text-center text-xl font-bold mb-6 text-gray-800">
          {searchTerm}
        </h2>
      )}
      <div className="max-w-7xl mx-auto">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filtered.map((product) => (
              <ProductCard
                key={product.id + product.category}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              No Products Found
            </h3>
            <p className="text-gray-500 text-sm sm:text-base">
              Sorry, we couldn't find any products matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
