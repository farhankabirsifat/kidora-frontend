import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { HeroBannerProvider } from "./context/HeroBannerContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import SearchPage from "./pages/SearchPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProfilePage from "./pages/ProfilePage";
import OrdersPage from "./pages/OrdersPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import Products from "./admin/pages/Products";
import HeroBanners from "./admin/pages/HeroBanners";
import AdminOrders from "./admin/pages/Orders";
import "./App.css";

// Route guards
function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return !isAuthenticated ? children : <Navigate to="/" replace />;
}

function AdminRoute({ children }) {
  const { isAdmin: isAdminUser, loading } = useAuth();
  if (loading) return null;
  return isAdminUser ? children : <Navigate to="/admin/login" replace />;
}

function AppShell() {
  const location = useLocation();
  const pathname = location.pathname;
  const isAdmin = pathname.startsWith('/admin');
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const { loading } = useAuth();
  if (loading) return null;
  return (
    <div className={`min-h-screen bg-gray-50 flex flex-col ${!isAdmin && !isAuthPage ? 'pt-16' : ''}`}>
      {/* Header area: show Navbar on normal pages; for auth pages show centered logo */}
      {!isAdmin && !isAuthPage && <Navbar />}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="hero" element={<HeroBanners />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
        </Routes>
      </div>
      {!isAdmin && !isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <HeroBannerProvider>
            <Router>
              <AppShell />
            </Router>
          </HeroBannerProvider>
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
