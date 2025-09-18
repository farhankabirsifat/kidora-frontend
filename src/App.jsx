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

function AppShell() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const { isAuthenticated, loading, isAdmin: isAdminUser } = useAuth();
  if (loading) return null;
  return (
    <div className={`min-h-screen bg-gray-50 flex flex-col ${!isAdmin ? 'pt-16' : ''}`}>
      {!isAdmin && <Navbar />}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" replace />} />
          <Route path="/orders" element={isAuthenticated ? <OrdersPage /> : <Navigate to="/login" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={isAdminUser ? <AdminLayout /> : <Navigate to="/admin/login" replace />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="hero" element={<HeroBanners />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
        </Routes>
      </div>
      {!isAdmin && <Footer />}
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
