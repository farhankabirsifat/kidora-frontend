import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { listProducts, mapProductOutToUi } from "../services/products";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchPage = () => {
  const query = useQuery();
  const searchTerm = (query.get("q") || "").trim();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);

  // Map aliases to canonical categories understood by the backend
  const extractCategoriesAndSearch = (q) => {
    const tokens = q.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
    const aliases = new Map(
      [
        ["men", ["men", "man", "mens", "men's"]],
        ["women", ["women", "woman", "womens", "women's", "lady", "ladies", "female", "females"]],
        ["kid", ["kid", "kids", "child", "children"]], // use stem 'kid' for inclusive match
        ["boy", ["boy", "boys"]],
        ["girl", ["girl", "girls"]],
      ]
    );
    const aliasIndex = new Map();
    for (const [canon, list] of aliases.entries()) {
      for (const a of list) aliasIndex.set(a, canon);
    }
    const picked = [];
    const rest = [];
    for (const t of tokens) {
      const canon = aliasIndex.get(t);
      if (canon) {
        if (!picked.includes(canon)) picked.push(canon);
      } else {
        rest.push(t);
      }
    }
    return { categories: picked, restSearch: rest.join(" ").trim() };
  };

  const { categories, restSearch } = useMemo(() => extractCategoriesAndSearch(searchTerm), [searchTerm]);
  const prettyCat = (c) => ({ men: "Men", women: "Women", kid: "Kids", boy: "Boys", girl: "Girls" }[c] || c);
  const title = useMemo(() => {
    if (categories.length) {
      const cats = categories.map(prettyCat).join(", ");
      return restSearch ? `Results for "${restSearch}" in ${cats}` : cats;
    }
    return searchTerm ? `Results for "${searchTerm}"` : "Search";
  }, [categories, restSearch, searchTerm]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setError("");
      setLoading(true);
      try {
        if (!searchTerm) {
          setItems([]);
        } else {
          const opts = { page: 0, size: 20 };
          if (categories.length) {
            opts.category = categories.join(",");
          }
          // If restSearch present, search within categories; otherwise if only categories, don't pass search
          if (restSearch) {
            opts.search = restSearch;
          } else if (!categories.length) {
            opts.search = searchTerm;
          }
          const res = await listProducts(opts);
          const mapped = Array.isArray(res) ? res.map(mapProductOutToUi) : [];
          if (!cancelled) setItems(mapped);
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || "Search failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [searchTerm, categories, restSearch]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-2 sm:px-6 lg:px-8">
      {searchTerm && (
        <h2 className="text-center text-xl font-bold mb-6 text-gray-800">{title}</h2>
      )}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-16 text-gray-600">Searching…</div>
        ) : error ? (
          <div className="text-center py-16 text-red-600">{error}</div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : searchTerm ? (
          <div className="text-center py-16">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-500 text-sm sm:text-base">Sorry, we couldn't find any products matching your search.</p>
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">Type in the search bar to find products.</div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
