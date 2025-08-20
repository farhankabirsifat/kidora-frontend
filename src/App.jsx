import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import Categories from './components/Categories';
import ProductSection from './components/ProductSection';
import Footer from './components/Footer';
import { boysItems, girlsDresses, parentsItems } from './data/products';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <HeroBanner />
      <Categories />
      
      {/* Boys Items Section */}
      <ProductSection 
        title="Boy's Item" 
        products={boysItems} 
        titleColor="text-blue-600"
      />
      
      {/* Girls Dress Section */}
      <div className="bg-white">
        <ProductSection 
          title="Girls Dress" 
          products={girlsDresses} 
          titleColor="text-pink-600"
        />
      </div>
      
      {/* Parent's Item Section */}
      <ProductSection 
        title="Parent's Item" 
        products={parentsItems} 
        titleColor="text-green-600"
        isParentSection={true}
      />
      
      <Footer />
    </div>
  );
}

export default App;
