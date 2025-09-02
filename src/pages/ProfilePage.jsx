import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { CheckCircle2, Package, Truck, Clock, ChevronRight, ChevronDown, ShoppingCart, Heart, BadgeCheck, User, RefreshCcw, LogOut } from "lucide-react";
import { useOrders } from "../context/useOrders";

// Orders now come from OrderContext

const statusColors = {
  processing: "bg-amber-100 text-amber-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const { cartItems, wishlistItems } = useCart();
  const { orders, advanceOrderStatus } = useOrders();
  const [activeOrder, setActiveOrder] = useState(orders[0] || null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleAdvanceStatus = (orderId) => {
    advanceOrderStatus(orderId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 relative">
            <button
              type="button"
              onClick={()=>setMenuOpen(o=>!o)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:border-blue-400 transition"
              aria-label={menuOpen ? 'Collapse menu' : 'Expand menu'}
            >
              {menuOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            <div className="flex items-center space-x-4 pr-10">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-xl">
                U
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  User Name <BadgeCheck className="w-5 h-5 text-blue-500" />
                </h2>
                <p className="text-sm text-gray-500">user@example.com</p>
              </div>
            </div>
            <div className={`mt-6 space-y-2 text-sm ${menuOpen ? 'block' : 'hidden'} animate-fade-in`}>  
              <button className="flex w-full items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50">
                <span className="flex items-center gap-2"><User className="w-4 h-4" /> Account Info</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button onClick={()=>navigate('/orders')} className="flex w-full items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50">
                <span className="flex items-center gap-2"><ShoppingCart className="w-4 h-4" /> Orders ({orders.length})</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button onClick={()=>navigate('/wishlist')} className="flex w-full items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50">
                <span className="flex items-center gap-2"><Heart className="w-4 h-4" /> Wishlist ({wishlistItems.length})</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button onClick={()=>navigate('/cart')} className="flex w-full items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50">
                <span className="flex items-center gap-2"><ShoppingCart className="w-4 h-4" /> Cart ({cartItems.length})</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button className="flex w-full items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50">
                <span className="flex items-center gap-2"><RefreshCcw className="w-4 h-4" /> Returns</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
              <button className="flex w-full items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 text-red-600">
                <span className="flex items-center gap-2"><LogOut className="w-4 h-4" /> Logout</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 space-y-4">
            <h3 className="font-semibold text-gray-800">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 rounded-xl bg-blue-50">
                <p className="text-xl font-bold text-blue-600">{orders.length}</p>
                <p className="text-xs text-blue-700 font-medium">Orders</p>
              </div>
              <div className="p-3 rounded-xl bg-green-50">
                <p className="text-xl font-bold text-green-600">{wishlistItems.length}</p>
                <p className="text-xs text-green-700 font-medium">Wishlist</p>
              </div>
              <div className="p-3 rounded-xl bg-indigo-50 col-span-2">
                <p className="text-xl font-bold text-indigo-600">৳ {orders.reduce((s,o)=>s+o.total,0)}</p>
                <p className="text-xs text-indigo-700 font-medium">Total Spent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Active Order Tracking */}
          {activeOrder && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    Order Tracking <Package className="w-5 h-5 text-gray-500" />
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Order ID: {activeOrder.id} • Placed on {activeOrder.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[activeOrder.status]}`}>{activeOrder.status}</span>
                  {activeOrder.status !== 'delivered' && (
                    <button onClick={()=>handleAdvanceStatus(activeOrder.id)} className="text-xs px-3 py-1 rounded-full bg-gray-900 text-white hover:bg-gray-800">Advance Status</button>
                  )}
                </div>
              </div>

              {/* Tracking Steps */}
              <div className="relative">
                <div className="flex justify-between text-xs font-medium text-gray-500 mb-4">
                  {activeOrder.tracking.steps.map(step => (
                    <div key={step.key} className="flex-1 text-center">
                      <p className={step.key === activeOrder.tracking.current ? 'text-gray-900 font-semibold' : ''}>{step.label}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-wide">{step.time || '—'}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  {activeOrder.tracking.steps.map(step => {
                    const index = activeOrder.tracking.steps.findIndex(s=>s.key===step.key);
                    const currentIndex = activeOrder.tracking.steps.findIndex(s=>s.key===activeOrder.tracking.current);
                    const completed = index <= currentIndex;
                    return (
                      <div key={step.key} className="flex-1 flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shadow ${completed ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gray-200 text-gray-500'}`}>{completed ? <CheckCircle2 className="w-5 h-5 text-white" /> : index+1}</div>
                        {index < activeOrder.tracking.steps.length -1 && (
                          <div className={`h-1 flex-1 mx-1 md:mx-2 rounded ${completed && index < currentIndex ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-gray-200'}`}></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Items */}
              <div className="mt-6 border-t pt-6">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">Items ({activeOrder.items.length}) <Truck className="w-4 h-4 text-gray-500" /></h4>
                <div className="divide-y">
                  {activeOrder.items.map(it => (
                    <div key={it.id} className="py-3 flex items-center justify-between text-sm">
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 line-clamp-1">{it.title}</p>
                        <p className="text-xs text-gray-500">Qty: {it.qty}</p>
                      </div>
                      <p className="font-semibold text-gray-900">৳ {it.price * it.qty}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between text-sm font-medium">
                  <span>Total</span>
                  <span>৳ {activeOrder.total}</span>
                </div>
              </div>
            </div>
          )}

          {/* Orders List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">Recent Orders <Clock className="w-5 h-5 text-gray-500" /></h3>
              <button onClick={()=>navigate('/orders')} className="text-xs px-3 py-1 rounded-full bg-gray-900 text-white hover:bg-gray-800">View All</button>
            </div>
            <div className="divide-y">
              {orders.map(o => (
                <button
                  key={o.id}
                  onClick={()=>setActiveOrder(o)}
                  className={`w-full text-left py-4 flex items-center justify-between gap-4 hover:bg-gray-50 rounded-lg px-2 transition ${activeOrder.id === o.id ? 'bg-gray-50' : ''}`}
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{o.id}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{o.date}</p>
                  </div>
                  <div className="hidden md:block text-sm font-medium text-gray-700">৳ {o.total}</div>
                  <span className={`px-2 py-1 text-[10px] font-medium rounded-full ${statusColors[o.status]}`}>{o.status}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
