import { Search, ShoppingCart, Menu, X, Heart, User, ChevronRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/useOrders";
import { brandName } from "../utils/brand";
import { listProducts } from "../services/products";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItemsCount, wishlistItemsCount } = useCart();
  const { orders } = useOrders();
  const panelRef = useRef(null);

  const [searchInput, setSearchInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState([]); // backend products
  const [loadingSuggest, setLoadingSuggest] = useState(false);
  const HISTORY_KEY = "kidora_search_history";
  const getHistory = () => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  };
  const [history, setHistory] = useState(() => getHistory());
  const saveHistory = (term) => {
    const t = (term || "").trim();
    if (!t) return;
    const prev = getHistory().filter((x) => x.toLowerCase() !== t.toLowerCase());
    const next = [t, ...prev].slice(0, 10);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    setHistory(next);
  };
  const removeHistoryTerm = (term) => {
    const t = (term || "").toLowerCase();
    const next = getHistory().filter((x) => x.toLowerCase() !== t);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
    setHistory(next);
  };
  const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  };
  const [mobileSearchInput, setMobileSearchInput] = useState("");
  const [mobileSuggestions, setMobileSuggestions] = useState([]);
  const [loadingMobileSuggest, setLoadingMobileSuggest] = useState(false);
  const { isAuthenticated, isAdmin } = useAuth();

  const handleSearch = (e, inputValue) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const term = inputValue.trim();
      navigate(`/search?q=${encodeURIComponent(term)}`);
      saveHistory(term);
      setIsMobileMenuOpen(false);
      setShowDropdown(false);
    }
  };

  // Desktop: fetch live suggestions (debounced)
  useEffect(() => {
    const q = searchInput.trim();
    if (q.length < 2) { setSuggestions([]); setLoadingSuggest(false); return; }
    let cancelled = false;
    setLoadingSuggest(true);
    const h = setTimeout(async () => {
      try {
        const res = await listProducts({ page: 0, size: 8, search: q });
        if (cancelled) return;
        const arr = Array.isArray(res) ? res : [];
        setSuggestions(arr.slice(0, 8));
      } catch {
        if (!cancelled) setSuggestions([]);
      } finally {
        if (!cancelled) setLoadingSuggest(false);
      }
    }, 250);
    return () => { cancelled = true; clearTimeout(h); };
  }, [searchInput]);

  // Mobile: fetch live suggestions (debounced)
  useEffect(() => {
    const q = mobileSearchInput.trim();
    if (q.length < 2) { setMobileSuggestions([]); setLoadingMobileSuggest(false); return; }
    let cancelled = false;
    setLoadingMobileSuggest(true);
    const h = setTimeout(async () => {
      try {
        const res = await listProducts({ page: 0, size: 8, search: q });
        if (cancelled) return;
        const arr = Array.isArray(res) ? res : [];
        setMobileSuggestions(arr.slice(0, 8));
      } catch {
        if (!cancelled) setMobileSuggestions([]);
      } finally {
        if (!cancelled) setLoadingMobileSuggest(false);
      }
    }, 250);
    return () => { cancelled = true; clearTimeout(h); };
  }, [mobileSearchInput]);

  useEffect(()=>{
    // Close mobile menu whenever route changes
    setIsMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }, [location.pathname]);

  // Close on outside click
  useEffect(()=>{
    if(!isMobileMenuOpen) return;
    function handle(e){
      if(panelRef.current && !panelRef.current.contains(e.target)){
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return ()=>document.removeEventListener('mousedown', handle);
  },[isMobileMenuOpen]);

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-18">
          {/* Logo / Brand */}
          <div className="flex-shrink-0">
            <button
              onClick={() => navigate("/")}
              className="cursor-pointer select-none flex items-center"
              aria-label={brandName}
            >
              <img
                src="/Kidora-logo.png"
                alt="Kidora Logo"
                className="h-10 lg:h-14 w-auto object-contain"
              />
            </button>
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
                  setShowDropdown(!!e.target.value || history.length > 0);
                }}
                placeholder="Search for products, brands and more..."
                className="w-full pl-4 pr-12 py-3 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50 hover:bg-white transition-colors"
                autoComplete="off"
                onFocus={() => setShowDropdown(!!searchInput || history.length > 0)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-2 rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md"
              >
                <Search className="w-4 h-4" />
              </button>
              {showDropdown && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white border rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
                  {/* Product Suggestions */}
                  {searchInput.trim().length >= 2 && (
                    <div>
                      <div className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-500">Products</div>
                      {loadingSuggest ? (
                        <div className="px-4 py-2 text-gray-400 text-sm">Searching…</div>
                      ) : suggestions.length > 0 ? (
                        suggestions.map((p) => (
                          <div
                            key={p.id}
                            onMouseDown={() => {
                              navigate(`/product/${p.id}`);
                              setShowDropdown(false);
                            }}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                          >
                            {p.title}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-400 text-sm">No results</div>
                      )}
                      <div className="border-t my-2" />
                    </div>
                  )}
                  {/* Recent Searches */}
                  {history.length > 0 && (
                    <div>
                      <div className="px-4 pt-2 pb-1 text-xs font-semibold text-gray-500 flex items-center justify-between">
                        <span>Recent searches</span>
                        <button
                          type="button"
                          aria-label="Clear search history"
                          className="p-1 text-gray-400 hover:text-gray-600"
                          onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); clearHistory(); }}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      {history.slice(0, 5).map((term, i) => (
                        <div
                          key={term + i}
                          onMouseDown={() => {
                            navigate(`/search?q=${encodeURIComponent(term)}`);
                            setShowDropdown(false);
                          }}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm flex items-center justify-between gap-2"
                        >
                          <span className="truncate">{term}</span>
                          <button
                            type="button"
                            aria-label={`Remove ${term} from history`}
                            className="p-1 text-gray-300 hover:text-gray-600"
                            onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); removeHistoryTerm(term); }}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Desktop Icons */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Admin Panel (only for admin accounts) */}
            {isAdmin && (
              <button
                onClick={() => navigate("/kidora-admin")}
                className="px-3 py-1 rounded-full bg-blue-600 text-white text-sm font-semibold hover:shadow transition-colors"
              >
                Admin
              </button>
            )}
            {/* Profile */}
            <button
              onClick={() => navigate(isAuthenticated ? "/profile" : "/login")}
              className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors group"
              aria-label="Profile"
            >
              <User className="w-5 h-5" />
            </button>
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
              {/* Mobile Suggestions Panel */}
              {(mobileSearchInput.trim().length >= 2 || history.length > 0) && (
                <div className="mt-3 bg-white border rounded-lg shadow max-h-72 overflow-y-auto">
                  {mobileSearchInput.trim().length >= 2 && (
                    <div>
                      <div className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-500">Products</div>
                      {loadingMobileSuggest ? (
                        <div className="px-4 py-2 text-gray-400 text-sm">Searching…</div>
                      ) : mobileSuggestions.length > 0 ? (
                        mobileSuggestions.map((p) => (
                          <div
                            key={p.id}
                            onMouseDown={() => {
                              navigate(`/product/${p.id}`);
                              setMobileSearchOpen(false);
                            }}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                          >
                            {p.title}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-gray-400 text-sm">No results</div>
                      )}
                      <div className="border-t my-2" />
                    </div>
                  )}
                  {history.length > 0 && (
                    <div>
                      <div className="px-4 pt-2 pb-1 text-xs font-semibold text-gray-500 flex items-center justify-between">
                        <span>Recent searches</span>
                        <button
                          type="button"
                          aria-label="Clear search history"
                          className="p-1 text-gray-400 hover:text-gray-600"
                          onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); clearHistory(); }}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      {history.slice(0, 5).map((term, i) => (
                        <div
                          key={term + i}
                          onMouseDown={() => {
                            navigate(`/search?q=${encodeURIComponent(term)}`);
                            setMobileSearchOpen(false);
                          }}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm flex items-center justify-between gap-2"
                        >
                          <span className="truncate">{term}</span>
                          <button
                            type="button"
                            aria-label={`Remove ${term} from history`}
                            className="p-1 text-gray-300 hover:text-gray-600"
                            onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); removeHistoryTerm(term); }}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm lg:hidden" />
            <div ref={panelRef} className="fixed top-0 right-0 h-full w-80 max-w-full bg-white shadow-xl border-l border-gray-200 flex flex-col z-50 animate-slide-in">
              <div className="flex items-center justify-between px-5 h-16 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <img src="/Kidora-logo.png" alt="Kidora" className="h-8 w-auto" />
                  <span className="font-semibold text-gray-800">Menu</span>
                </div>
                <button onClick={()=>setIsMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-gray-100 text-gray-600"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-5 border-b border-gray-100">
                {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg">
                      {(/* initial */()=>{ const u = localStorage.getItem('kidora_user'); try{ const obj=JSON.parse(u); return (obj?.firstName?.[0]||obj?.email?.[0]||'U').toUpperCase(); }catch{return 'U';} })()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{(localStorage.getItem('kidora_user') && (()=>{ try { const o=JSON.parse(localStorage.getItem('kidora_user')); return (o.firstName||o.email||'User'); } catch { return 'User'; } })())}</p>
                      <p className="text-xs text-gray-500 truncate">{(localStorage.getItem('kidora_user') && (()=>{ try { const o=JSON.parse(localStorage.getItem('kidora_user')); return o.email; } catch { return ''; } })())}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">Welcome! Please login to see your profile and orders.</p>
                )}
                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-lg bg-blue-50">
                    <p className="text-sm font-semibold text-blue-600">{orders.length}</p>
                    <p className="text-[10px] uppercase tracking-wide text-blue-700">Orders</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50">
                    <p className="text-sm font-semibold text-green-600">{cartItemsCount}</p>
                    <p className="text-[10px] uppercase tracking-wide text-green-700">Cart</p>
                  </div>
                  <div className="p-3 rounded-lg bg-red-50">
                    <p className="text-sm font-semibold text-red-600">{wishlistItemsCount}</p>
                    <p className="text-[10px] uppercase tracking-wide text-red-700">Wishlist</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
                {isAdmin && (
                  <button onClick={()=>{ setIsMobileMenuOpen(false); navigate('/kidora-admin'); }} className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-blue-600 text-white text-sm font-medium shadow hover:bg-blue-700">
                    <span>Admin Dashboard</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
                <div className="space-y-2">
                  <button onClick={()=>{ setIsMobileMenuOpen(false); navigate(isAuthenticated ? '/profile' : '/login'); }} className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium">
                    <span className="flex items-center gap-2"><User className="w-4 h-4 text-blue-600" /> {isAuthenticated ? 'Profile' : 'Login'}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                  <button onClick={()=>{ setIsMobileMenuOpen(false); navigate('/wishlist'); }} className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium">
                    <span className="flex items-center gap-2"><Heart className="w-4 h-4 text-red-500" /> Wishlist ({wishlistItemsCount})</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                  <button onClick={()=>{ setIsMobileMenuOpen(false); navigate('/cart'); }} className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium">
                    <span className="flex items-center gap-2"><ShoppingCart className="w-4 h-4 text-green-500" /> Cart ({cartItemsCount})</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
              <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-[11px] text-gray-500">{brandName} © {new Date().getFullYear()}</p>
                <button onClick={()=>setIsMobileMenuOpen(false)} className="text-xs px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50">Close</button>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
