import { useEffect, useMemo, useState } from "react";
import HeroBanner from "../components/HeroBanner";
import Categories from "../components/Categories";
import ProductSection from "../components/ProductSection";
import ParentCard from "../components/ParentCard";
// Footer is added in AppShell outside page
import { listProducts, mapProductOutToUi } from "../services/products";

const HomePage = () => {
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true); setError("");
        const data = await listProducts({ page: 0, size: 100 });
        const mapped = data.map(mapProductOutToUi);
        if (!ignore) setAll(mapped);
      } catch (e) {
        if (!ignore) setError(e?.message || "Failed to load products");
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  const boysItems = useMemo(() => all.filter(p => (p.category || '').toLowerCase() === 'kids-boys').slice(0, 8), [all]);
  const girlsDresses = useMemo(() => all.filter(p => (p.category || '').toLowerCase() === 'kids-girls').slice(0, 8), [all]);
  const menItems = useMemo(() => all.filter(p => (p.category || '').toLowerCase() === 'men').slice(0, 8), [all]);
  const womenItems = useMemo(() => all.filter(p => (p.category || '').toLowerCase() === 'women').slice(0, 8), [all]);
  const parentsItems = useMemo(() => all.filter(p => (p.category || '').toLowerCase() === 'parents').slice(0, 4), [all]);
  const kidsItems = useMemo(() => all.filter(p => (p.category || '').toLowerCase() === 'kids').slice(0, 8), [all]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner Section */}
      <HeroBanner />

      {/* Categories Section */}
      <Categories />

      {/* Boys Items Section */}
      {!loading && boysItems.length > 0 && (
        <ProductSection title="Boy's Item" products={boysItems} bgColor="bg-white" />
      )}

      {/* Girls Section */}
      {!loading && girlsDresses.length > 0 && (
        <ProductSection title="Girls" products={girlsDresses} bgColor="bg-gray-50" />
      )}

      {/* Kids Section */}
      {!loading && kidsItems.length > 0 && (
        <ProductSection title="Kids" products={kidsItems} bgColor="bg-white" />
      )}

      {/* Men Section */}
      {!loading && menItems.length > 0 && (
        <ProductSection title="Men" products={menItems} bgColor="bg-white" />
      )}

      {/* Women Section */}
      {!loading && womenItems.length > 0 && (
        <ProductSection title="Women" products={womenItems} bgColor="bg-gray-50" />
      )}

      {/* Parents Items Section - 2x2 Grid Card Style */}
      {!loading && parentsItems.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-blue-600 mb-8 text-left">
              Parents <span className="text-black">item</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {parentsItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex"
              >
                <div className="w-1/3 bg-gray-50 flex items-center justify-center p-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-auto object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {item.description ||
                        "Premium materials and comfortable fit for everyday wear."}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-gray-900">
                      ৳ {Number(item.price || 0).toFixed(0)}
                    </span>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-500 text-base">★</span>
                      <span className="text-sm text-gray-700 font-medium">
                        {item.rating || 4.9}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({item.reviews || "145+"})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
    </div>
  );
};

export default HomePage;
