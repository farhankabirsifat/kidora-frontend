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

      {/* Parents Items Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              For Parents
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stylish and comfortable clothing for the whole family
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {parentsItems.map((item) => (
              <ParentCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
     
    </div>
  );
};

export default HomePage;
