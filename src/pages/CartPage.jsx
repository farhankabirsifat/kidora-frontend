import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { trackViewCart, trackBeginCheckout } from "../utils/analytics";
import {
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Heart,
  ShieldCheck,
} from "lucide-react";
import { useEffect } from "react";

const CartPage = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    updateCartQuantity,
    removeFromCart,
    getCartTotal,
    cartItemsCount,
    toggleWishlist,
  } = useCart();

  const handleQuantityChange = (id, selectedSize, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      updateCartQuantity(id, selectedSize, newQuantity);
    }
  };

  const handleRemoveItem = (id, selectedSize) => {
    removeFromCart(id, selectedSize);
  };

  const handleMoveToWishlist = (item) => {
    toggleWishlist(item);
    removeFromCart(item.id, item.selectedSize);
  };

  // Shipping logic (cart page preview):
  // - If ALL items have freeShipping => show Free (0)
  // - Else show Dhaka (70) / Outside (120) guidance (actual district picked at checkout)
  const allFreeShipping = cartItems.length > 0 && cartItems.every(it => it.freeShipping === true);
  const shippingCost = allFreeShipping ? 0 : null; // null => depends on district
  const finalTotal = getCartTotal(); // shipping added later at checkout

  // Track view_cart on mount/update
  useEffect(() => {
    if (cartItems.length > 0) {
      const mapped = cartItems.map((it) => ({
        item_id: String(it.id),
        item_name: it.title,
        item_category: it.category,
        price: parseFloat(it.price.replace(/[৳$\s]/g, "")) || 0,
        quantity: it.quantity,
        item_variant: it.selectedSize,
      }));
      trackViewCart(cartItems);
    }
  }, [cartItems]);

  if (cartItems.length === 0) {
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
                Shopping Cart
              </h1>
            </div>
          </div>
        </div>

        {/* Empty Cart */}
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added anything to your cart yet.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Continue Shopping
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
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Back</span>
            </button>
            <h1 className="ml-6 text-xl font-semibold text-gray-900">
              Shopping Cart ({cartItemsCount} items)
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 pb-32 sm:pb-8">
        {/* Mobile Cart List */}
        <div className="space-y-3 sm:hidden">
          {cartItems.map(item => (
            <div key={item.id + item.selectedSize} className="bg-white rounded-xl shadow-sm p-3 flex gap-3 relative">
              <div
                className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer"
                onClick={() => navigate(`/product/${item.id}`)}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=No+Image'; }}
                />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <h3
                  className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 cursor-pointer pr-8"
                  onClick={() => navigate(`/product/${item.id}`)}
                >{item.title}</h3>
                <p className="text-[11px] text-gray-500 mt-1">Size: {item.selectedSize} · {item.category}</p>
                <div className="mt-1 flex items-center justify-between">
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.selectedSize, item.quantity, -1)}
                      disabled={item.quantity === 1}
                      className="p-2 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.selectedSize, item.quantity, 1)}
                      className="p-2 hover:bg-gray-50"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">৳{(parseFloat(item.price.replace(/[৳$\s]/g, "")) * item.quantity).toFixed(0)}</p>
                    <p className="text-[11px] text-gray-500">৳{parseFloat(item.price.replace(/[৳$\s]/g, "")).toFixed(0)} each</p>
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleMoveToWishlist(item)}
                    className="flex-1 bg-gray-100 text-gray-700 rounded-lg py-2 text-xs font-medium hover:bg-gray-200 flex items-center justify-center gap-1"
                    aria-label="Move item to wishlist"
                  >
                    <Heart className="w-4 h-4" />
                    Wishlist
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item.id, item.selectedSize)}
                    className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 text-xs font-medium hover:bg-red-50 hover:text-red-600 flex items-center justify-center gap-1"
                    aria-label="Remove item from cart"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id + 'd' + item.selectedSize} className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div
                    className="w-full md:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/product/${item.id}`)}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=No+Image'; }}
                    />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3
                        className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                        onClick={() => navigate(`/product/${item.id}`)}
                      >{item.title}</h3>
                      <p className="text-sm text-gray-600">Size: {item.selectedSize} | Category: {item.category}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.selectedSize, item.quantity, -1)}
                            className="p-2 hover:bg-gray-50 transition-colors"
                            disabled={item.quantity === 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 font-medium">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.selectedSize, item.quantity, 1)}
                            className="p-2 hover:bg-gray-50 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-right min-w-[80px]">
                          <p className="font-bold text-lg text-gray-900">৳{(parseFloat(item.price.replace(/[৳$\s]/g, "")) * item.quantity).toFixed(0)}</p>
                          <p className="text-sm text-gray-600">৳{parseFloat(item.price.replace(/[৳$\s]/g, "")).toFixed(0)} each</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-4 pt-2">
                      <button
                        onClick={() => handleMoveToWishlist(item)}
                        className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
                        aria-label="Move to Wishlist"
                      >
                        <Heart className="w-4 h-4" />
                        <span>Move to Wishlist</span>
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item.id, item.selectedSize)}
                        className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
                        aria-label="Remove from Cart"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              <div className="space-y-4" role="region" aria-label="Order summary">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItemsCount} items)</span>
                  <span>৳{getCartTotal()}</span>
                </div>
                <div className="flex justify-between text-gray-600 items-start">
                  <span>Shipping</span>
                  {shippingCost === 0 ? (
                    <span className="text-green-600 font-medium">Free</span>
                  ) : (
                    <span className="text-xs text-gray-700 text-right leading-snug">
                      <span className="block font-medium">Dhaka: ৳70</span>
                      <span className="block font-medium">Outside: ৳120</span>
                      <span className="block text-[11px] text-gray-500">Calculated at checkout</span>
                    </span>
                  )}
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>৳{finalTotal}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const items = cartItems.map((it) => ({
                      item_id: String(it.id),
                      item_name: it.title,
                      item_category: it.category,
                      price: parseFloat(it.price.replace(/[৳$\s]/g, "")) || 0,
                      quantity: it.quantity,
                      item_variant: it.selectedSize,
                    }));
                    trackBeginCheckout(items, finalTotal);
                    navigate("/checkout");
                  }}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 mt-6"
                  aria-label="Proceed to checkout"
                >
                  Proceed to Checkout
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Continue Shopping
                </button>
              </div>
              <div className="mt-8 pt-6 border-t space-y-4">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <span>Secure payment & 30-day returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Summary Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg px-4 py-3 z-30 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500">Subtotal</p>
          <p className="font-semibold text-gray-900 text-sm">৳{getCartTotal()} <span className="text-[11px] text-gray-500">({cartItemsCount} items)</span></p>
          {shippingCost === 0 ? (
            <p className="text-[11px] text-green-600 font-medium">Free Shipping</p>
          ) : (
            <p className="text-[11px] text-gray-600 leading-tight">Dhaka: <span className="font-medium">৳70</span> · Outside: <span className="font-medium">৳120</span><br /><span className="text-[10px] text-gray-400">Calculated at checkout</span></p>
          )}
        </div>
        <button
          onClick={() => {
            const items = cartItems.map((it) => ({
              item_id: String(it.id),
              item_name: it.title,
              item_category: it.category,
              price: parseFloat(it.price.replace(/[৳$\s]/g, "")) || 0,
              quantity: it.quantity,
              item_variant: it.selectedSize,
            }));
            trackBeginCheckout(items, finalTotal);
            navigate('/checkout');
          }}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold text-sm hover:bg-blue-700"
          aria-label="Proceed to checkout"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
