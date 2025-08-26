import HeroBanner from "../components/HeroBanner";
import Categories from "../components/Categories";
import ProductSection from "../components/ProductSection";
import ParentCard from "../components/ParentCard";
import Footer from "../components/Footer";
import { boysItems, girlsDresses, parentsItems } from "../data/products";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner Section */}
      <HeroBanner />

      {/* Categories Section */}
      <Categories />

      {/* Boys Items Section */}
      <ProductSection
        title="Boy's Item"
        products={boysItems}
        bgColor="bg-white"
      />

      {/* Girls Dresses Section */}
      <ProductSection
        title="Girl's Dresses"
        products={girlsDresses}
        bgColor="bg-gray-50"
      />

      {/* Parents Items Section - 2x2 Grid Card Style */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-blue-600 mb-8 text-left">
            Parent’s <span className="text-black">item</span>
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
                        "In the 11th century, women in Europe wore dresses that were similar to men's tunics and were loose, with..."}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-gray-900">
                      {item.price}
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

      {/* Footer */}
    </div>
  );
};

export default HomePage;
