import { Search, ShoppingCart, Menu, X, Heart } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Fuse from "fuse.js";
import { getAllProducts } from "../utils/fuseProducts";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { cartItemsCount, wishlistItemsCount } = useCart();

  const [searchInput, setSearchInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const allProducts = getAllProducts();
  const fuse = new Fuse(allProducts, {
    keys: ["title", "description", "brand", "category", "keywords"],
    threshold: 0.4,
    distance: 100,
  });
  const [mobileSearchInput, setMobileSearchInput] = useState("");

  const handleSearch = (e, inputValue) => {
    e.preventDefault();
    if (inputValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(inputValue.trim())}`);
      setIsMobileMenuOpen(false);
      setShowDropdown(false);
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-18">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src="/Kidora-logo.png"
              alt="KIDORA"
              className="h-10 lg:h-12 w-auto cursor-pointer"
              onClick={() => navigate("/")}
            />
          </div>

          {/* Search Bar - Center positioned */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-8">
            <form
              className="relative w-full"
              onSubmit={(e) => handleSearch(e, searchInput)}
            >
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setShowDropdown(!!e.target.value);
                }}
                placeholder="Search for products, brands and more..."
                className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50 hover:bg-white transition-colors"
                autoComplete="off"
                onFocus={() => setShowDropdown(!!searchInput)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-2 rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md"
              >
                <Search className="w-4 h-4" />
              </button>
              {showDropdown && searchInput && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {fuse
                    .search(searchInput)
                    .slice(0, 5)
                    .map((result) => (
                      <div
                        key={result.item.id + result.item.category}
                        onMouseDown={() => {
                          navigate(`/product/${result.item.id}`);
                          setShowDropdown(false);
                        }}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                      >
                        {result.item.title}
                      </div>
                    ))}
                  {fuse.search(searchInput).length === 0 && (
                    <div className="px-4 py-2 text-gray-400 text-sm">
                      No results
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Desktop Icons */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Wishlist */}
            <button
              onClick={() => navigate("/wishlist")}
              className="relative p-2 text-gray-600 hover:text-red-500 transition-colors group"
            >
              <Heart className="w-5 h-5" />
              {wishlistItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-semibold">
                  {wishlistItemsCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => navigate("/cart")}
              className="relative p-2 text-gray-600 hover:text-green-500 transition-colors group"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-semibold">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* User Profile and Notifications removed as requested */}
          </div>

          {/* Mobile Search and Menu */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Mobile Search Icon (opens only search panel) */}
            <button
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              onClick={() => {
                setMobileSearchOpen((s) => !s);
                setIsMobileMenuOpen(false);
              }}
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Mobile Cart */}
            <button
              onClick={() => navigate("/cart")}
              className="relative p-2 text-gray-600 hover:text-green-500 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-semibold">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => {
                setIsMobileMenuOpen((s) => !s);
                setMobileSearchOpen(false);
              }}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Panel */}
        {mobileSearchOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-4 pt-4 pb-2">
              <form
                className="relative"
                onSubmit={(e) => {
                  handleSearch(e, mobileSearchInput);
                  setMobileSearchOpen(false);
                }}
              >
                <input
                  type="text"
                  value={mobileSearchInput}
                  onChange={(e) => setMobileSearchInput(e.target.value)}
                  placeholder="Search for products, brands and more..."
                  className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-2 rounded-full"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-4 pt-4 pb-6 space-y-4">
              {/* Mobile Menu Items */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <button
                  onClick={() => navigate("/wishlist")}
                  className="flex flex-col items-center space-y-2 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Heart className="w-6 h-6 text-red-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Wishlist ({wishlistItemsCount})
                  </span>
                </button>

                <button
                  onClick={() => navigate("/cart")}
                  className="flex flex-col items-center space-y-2 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ShoppingCart className="w-6 h-6 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Cart ({cartItemsCount})
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
