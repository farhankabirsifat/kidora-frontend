import { createContext, useContext, useState, useEffect, useRef } from "react";
import { getBasicCreds } from "../services/auth";
import { getCart as apiGetCart, addOrUpdateCartItem, removeCartItem as apiRemoveCartItem, clearCart as apiClearCart } from "../services/cart";
import { getWishlist as apiGetWishlist, toggleWishlist as apiToggleWishlist, removeWishlistItem as apiRemoveWishlistItem } from "../services/wishlist";
import { getProductById, mapProductOutToUi } from "../services/products";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

// Custom hook to use cart context
const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// Main CartProvider component
export default function CartProvider({ children }) {
  const { isAuthenticated, user } = useAuth() || {};
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("kidora-cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [wishlistItems, setWishlistItems] = useState(() => {
    const savedWishlist = localStorage.getItem("kidora-wishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [wishlistSynced, setWishlistSynced] = useState(false);
  const serverSyncInFlight = useRef(false);

  const parseMoney = (val) => {
    if (typeof val === 'number') return val;
    const n = parseFloat(String(val || '').replace(/[৳$\s,]/g, ""));
    return Number.isFinite(n) ? n : 0;
  };

  const computeDiscountedAmount = (base, discountPercent) => {
    const baseNum = parseMoney(base);
    const pct = Number(discountPercent) || 0;
    if (!pct) return Math.round(baseNum);
    // JS Math.round equivalent for positive numbers
    return Math.round(baseNum * (1 - pct / 100));
  };

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("kidora-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("kidora-wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // If user is not authenticated, ensure we don't carry over any guest lists
  useEffect(() => {
    if (!isAuthenticated) {
      if (cartItems.length || wishlistItems.length) {
        setCartItems([]);
        setWishlistItems([]);
      }
      try {
        localStorage.removeItem("kidora-cart");
        localStorage.removeItem("kidora-wishlist");
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // On first load, normalize any legacy/minimal wishlist items saved locally
  // that might be missing image/price/title by fetching product details.
  useEffect(() => {
    let cancelled = false;
    const needsNormalize = Array.isArray(wishlistItems) && wishlistItems.some(it => !it?.image || !it?.price || !it?.title);
    if (!needsNormalize) return;
    (async () => {
      try {
        const updated = await Promise.all(
          wishlistItems.map(async (it) => {
            if (it?.image && it?.price && it?.title) return it;
            try {
              const p = await getProductById(it.id);
              const ui = mapProductOutToUi(p);
              return {
                id: ui.id,
                title: ui.title,
                image: ui.image,
                rating: ui.rating ?? 0,
                price: `৳ ${parseMoney(ui.price).toFixed(0)}`,
                category: ui.category,
                addedAt: it.addedAt || new Date().toISOString(),
              };
            } catch {
              // Fallback: keep item, ensure required fields exist
              return {
                id: it.id,
                title: it.title || `Product #${it.id}`,
                image: it.image || "",
                rating: Number.isFinite(it?.rating) ? it.rating : 0,
                price: it.price || "৳ 0",
                category: it.category || "",
                addedAt: it.addedAt || new Date().toISOString(),
              };
            }
          })
        );
        if (!cancelled) setWishlistItems(updated);
      } catch {}
    })();
    return () => { cancelled = true; };
  }, []);

  // Helper to load wishlist and cart from backend
  const loadFromServer = async () => {
    if (serverSyncInFlight.current) return; // de-dupe parallel calls
    serverSyncInFlight.current = true;
    const basic = getBasicCreds();
    if (!basic) return;
    // Capture locally saved wishlist to merge later (handles offline/add failures)
    let localSaved = [];
    try { localSaved = JSON.parse(localStorage.getItem("kidora-wishlist") || "[]"); } catch {}
    // Load wishlist
    const wl = await apiGetWishlist();
    const productIds = Array.isArray(wl.items) ? wl.items.map(i => i.productId) : [];
    const products = await Promise.all(productIds.map(id => getProductById(id).catch(() => null)));
    const wlUi = products.filter(Boolean).map(p => {
      const ui = mapProductOutToUi(p);
      const discounted = computeDiscountedAmount(ui.price, ui.discount);
      return {
        id: ui.id,
        title: ui.title,
        image: ui.image,
        rating: ui.rating ?? 0,
        price: `৳ ${discounted.toFixed(0)}`,
        originalPrice: `৳ ${parseMoney(ui.price).toFixed(0)}`,
        discountPercent: ui.discount || 0,
        category: ui.category,
      };
    });
    // Merge: add any locally saved items not in server yet
    const serverIds = new Set(wlUi.map(i => i.id));
    const localExtras = (Array.isArray(localSaved) ? localSaved : []).filter(x => !serverIds.has(x.id));
    // Try to push extras to server so they persist
    if (localExtras.length) {
      for (const it of localExtras) {
        try { await apiToggleWishlist(it.id); } catch {}
      }
    }
    // Normalize local extras to ensure UI fields exist
    const normalizedLocalExtras = await Promise.all(
      localExtras.map(async (x) => {
        try {
          const p = await getProductById(x.id);
          const ui = mapProductOutToUi(p);
          const discounted = computeDiscountedAmount(ui.price, ui.discount);
          return {
            id: ui.id,
            title: ui.title,
            image: ui.image,
            rating: ui.rating ?? 0,
            price: `৳ ${discounted.toFixed(0)}`,
            originalPrice: `৳ ${parseMoney(ui.price).toFixed(0)}`,
            discountPercent: ui.discount || 0,
            category: ui.category,
          };
        } catch {
          return {
            id: x.id,
            title: x.title || `Product #${x.id}`,
            image: x.image || "",
            rating: Number.isFinite(x?.rating) ? x.rating : 0,
            price: x.price || "৳ 0",
            originalPrice: x.originalPrice || x.price || "৳ 0",
            discountPercent: Number.isFinite(x?.discountPercent) ? x.discountPercent : 0,
            category: x.category || "",
          };
        }
      })
    );
    const merged = [...wlUi, ...normalizedLocalExtras];
  setWishlistItems(merged);
    try { localStorage.setItem("kidora-wishlist", JSON.stringify(merged)); } catch {}
  setWishlistSynced(true);
  serverSyncInFlight.current = false;

    // Load cart
    const cart = await apiGetCart();
    const cartItemsArr = Array.isArray(cart.items) ? cart.items : [];
    const cartProducts = await Promise.all(cartItemsArr.map(i => getProductById(i.productId).catch(() => null)));
    const cartUi = cartItemsArr.map((ci, idx) => {
      const p = cartProducts[idx];
      if (p) {
        const ui = mapProductOutToUi(p);
        const discounted = computeDiscountedAmount(ui.price, ui.discount);
        return {
          id: ui.id,
          title: ui.title,
          image: ui.image,
          price: `৳ ${discounted.toFixed(0)}`,
          originalPrice: `৳ ${parseMoney(ui.price).toFixed(0)}`,
          discountPercent: ui.discount || 0,
          category: ui.category,
          selectedSize: ci.selectedSize,
          quantity: ci.quantity,
        };
      }
      return {
        id: ci.productId,
        title: `Product #${ci.productId}`,
        image: "",
        price: `৳ 0`,
        originalPrice: `৳ 0`,
        discountPercent: 0,
        category: "",
        selectedSize: ci.selectedSize,
        quantity: ci.quantity,
      };
    });
    setCartItems(cartUi);
  };

  // Removed duplicate initial sync; rely on auth-driven sync below

  // React to auth changes: on login load server data; on explicit logout clear lists
  const prevAuthRef = useRef(isAuthenticated);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const wasAuth = prevAuthRef.current;
      if (isAuthenticated && !wishlistSynced && !serverSyncInFlight.current) {
        try {
          setLoading(true);
          await loadFromServer();
        } catch (e) {
          if (!cancelled) setError(e?.message || "Failed to load user data");
        } finally {
          if (!cancelled) setLoading(false);
        }
      } else if (wasAuth && !isAuthenticated) {
        // Only clear on transition from logged-in -> logged-out
        setWishlistItems([]);
        setCartItems([]);
        setError("");
        setWishlistSynced(false);
      }
      prevAuthRef.current = isAuthenticated;
    })();
    return () => { cancelled = true; };
  }, [isAuthenticated, user?.email, wishlistSynced]);

  // Cart functions
  const addToCart = async (product, quantity = 1, selectedSize = "M") => {
    // Require login for cart operations
    const basic = getBasicCreds();
    if (!basic) {
      alert("Please login to add items to your cart.");
      return;
    }
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.id === product.id && item.selectedSize === selectedSize
      );

      if (existingItem) {
        const next = prevItems.map((item) =>
          item.id === product.id && item.selectedSize === selectedSize
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        // Sync backend
        const updated = next.find(i => i.id === product.id && i.selectedSize === selectedSize);
        if (updated) addOrUpdateCartItem({ productId: product.id, selectedSize, quantity: updated.quantity }).catch(()=>{});
        return next;
      }

      const next = [
        ...prevItems,
        (() => {
          const ui = mapProductOutToUi(product);
          const discounted = computeDiscountedAmount(ui.price, ui.discount);
          return {
            id: ui.id,
            title: ui.title,
            image: ui.image,
            price: `৳ ${discounted.toFixed(0)}`,
            originalPrice: `৳ ${parseMoney(ui.price).toFixed(0)}`,
            discountPercent: ui.discount || 0,
            category: ui.category,
            quantity,
            selectedSize,
            addedAt: new Date().toISOString(),
          };
        })(),
      ];
      addOrUpdateCartItem({ productId: product.id, selectedSize, quantity }).catch(()=>{});
      return next;
    });
  };

  const removeFromCart = (productId, selectedSize) => {
    setCartItems((prevItems) => prevItems.filter((item) => !(item.id === productId && item.selectedSize === selectedSize)));
    const basic = getBasicCreds();
    if (basic) apiRemoveCartItem({ productId, selectedSize }).catch(()=>{});
  };

  const updateCartQuantity = (productId, selectedSize, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedSize);
      return;
    }

    setCartItems((prevItems) => prevItems.map((item) => item.id === productId && item.selectedSize === selectedSize ? { ...item, quantity } : item));
    const basic = getBasicCreds();
    if (basic) addOrUpdateCartItem({ productId, selectedSize, quantity }).catch(()=>{});
  };

  const clearCart = () => {
    setCartItems([]);
    const basic = getBasicCreds();
    if (basic) apiClearCart().catch(()=>{});
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[৳$\s]/g, ""));
      return total + price * item.quantity;
    }, 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Wishlist functions
  const addToWishlist = async (product) => {
    const basic = getBasicCreds();
    // Require login for wishlist operations
    if (!basic) {
      alert("Please login to use your wishlist.");
      return;
    }
    if (basic && !wishlistSynced && !serverSyncInFlight.current) {
      try {
        setLoading(true);
        await loadFromServer();
      } catch (e) {
        // ignore, will fallback to optimistic
      } finally {
        setLoading(false);
      }
    }
    setWishlistItems((prevItems) => {
      const exists = prevItems.find((item) => item.id === product.id);
      if (exists) return prevItems;

      const optimistic = [
        ...prevItems,
        (() => {
          const ui = mapProductOutToUi(product);
          const discounted = computeDiscountedAmount(ui.price, ui.discount);
          return {
            id: ui.id,
            title: ui.title,
            image: ui.image,
            rating: ui.rating ?? 0,
            price: `৳ ${discounted.toFixed(0)}`,
            originalPrice: `৳ ${parseMoney(ui.price).toFixed(0)}`,
            discountPercent: ui.discount || 0,
            category: ui.category,
            addedAt: new Date().toISOString(),
          };
        })(),
      ];
      // Try to persist on server; rollback on failure
      (async () => {
        try { await apiToggleWishlist(product.id); }
        catch { setWishlistItems(prev => prev.filter(i => i.id !== product.id)); }
      })();
      return optimistic;
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    const basic = getBasicCreds();
    if (basic) apiRemoveWishlistItem(productId).catch(()=>{});
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const cartItemsCount = isAuthenticated ? getCartItemsCount() : 0;
  const wishlistItemsCount = isAuthenticated ? wishlistItems.length : 0;

  const value = {
    // Cart state and functions
    cartItems,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    cartItemsCount,

    // Wishlist state and functions
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    clearWishlist,
    wishlistItemsCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Export both useCart hook and CartProvider component
// eslint-disable-next-line react-refresh/only-export-components
export { useCart, CartProvider };
