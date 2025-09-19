import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ArrowLeft, Heart, ShoppingCart, Trash2, Star } from "lucide-react";

const WishlistPage = () => {
  const navigate = useNavigate();
  const {
    wishlistItems,
    toggleWishlist,
    addToCart,
    wishlistItemsCount,
  } = useCart();

  const handleAddToCart = (item) => {
    addToCart(item, 1, "M"); // Default quantity 1 and size M
    // Also remove from wishlist when adding to cart from wishlist page
    toggleWishlist(item);
  };

  const handleRemoveFromWishlist = (item) => {
    toggleWishlist(item);
  };

  const handleMoveToCart = (item) => {
    addToCart(item, 1, "M");
    toggleWishlist(item);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                <span className="font-medium">Back</span>
              </button>
              <h1 className="ml-6 text-xl font-semibold text-gray-900">
                My Wishlist
              </h1>
            </div>
          </div>
        </div>

        {/* Empty Wishlist */}
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your wishlist is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Save your favorite items here to buy them later.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Back</span>
            </button>
            <h1 className="ml-6 text-xl font-semibold text-gray-900">
              My Wishlist ({wishlistItemsCount} items)
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <p className="text-gray-600">
              {wishlistItemsCount} item{wishlistItemsCount !== 1 ? "s" : ""} in
              your wishlist
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  wishlistItems.forEach((item) => {
                    addToCart(item, 1, "M");
                    toggleWishlist(item);
                  });
                  alert("All items moved to cart!");
                }}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Move All to Cart</span>
              </button>
            </div>
          </div>
        </div>

        {/* Wishlist Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group"
            >
              {/* Product Image (cart style) */}
              <div className="relative">
                <div
                  className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden cursor-pointer mx-auto"
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      console.log('Wishlist image failed:', item.image);
                      e.currentTarget.src = 'https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=No+Image';
                    }}
                    loading="lazy"
                  />
                </div>
              </div>
              {/* Remove + overlay retained below original image area */}
              <div className="relative h-0">
                <button
                  onClick={(e) => { e.stopPropagation(); handleRemoveFromWishlist(item); }}
                  className="absolute top-3 right-4 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-red-600 hover:bg-red-50 transition-colors duration-200"
                  title="Remove from wishlist"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </div>

              {/* Product Details */}
              <div className="p-4">
                <h3
                  className="font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  {item.title}
                </h3>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(item.rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">
                    {item.rating}
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-lg font-bold text-gray-900">
                    {item.price}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    {item.originalPrice || ''}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Move to Cart</span>
                  </button>

                  <button
                    onClick={() => handleRemoveFromWishlist(item)}
                    className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium flex items-center justify-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate("/")}
            className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
