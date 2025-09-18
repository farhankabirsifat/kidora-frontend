import { useOrders } from "../context/useOrders";
import { Package, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const statusColors = {
  pending: "bg-gray-100 text-gray-700",
  processing: "bg-amber-100 text-amber-700",
  packed: "bg-purple-100 text-purple-700",
  shipped: "bg-blue-100 text-blue-700",
  out_for_delivery: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const paymentColors = {
  pending: "bg-amber-50 text-amber-700 border border-amber-200",
  paid: "bg-green-50 text-green-700 border border-green-200",
  refunded: "bg-blue-50 text-blue-700 border border-blue-200",
};

export default function OrdersPage() {
  const { orders } = useOrders();
  const navigate = useNavigate();
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2"><Package className="w-6 h-6 text-gray-600" /> Your Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage all your orders</p>
        </div>
        <button onClick={()=>navigate('/profile')} className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Profile
        </button>
      </div>
      <div className="space-y-6">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-900">{order.id}</p>
                <p className="text-xs text-gray-500 mt-0.5">Placed on {order.date} • {order.items.length} items</p>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[order.status]}`}>{order.status}</span>
                {order.paymentStatus && (
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${paymentColors[order.paymentStatus]}`}>{order.paymentStatus}</span>
                )}
                <p className="text-sm font-semibold text-gray-900">৳ {order.total}</p>
              </div>
            </div>
            <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
              {order.items.map(it => (
                <div key={it.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
                  <div className="pr-2">
                    <p className="font-medium text-gray-800 line-clamp-1">{it.title}</p>
                    <p className="text-[10px] uppercase tracking-wide text-gray-500">Qty: {it.qty}{it.selectedSize ? ` • Size: ${it.selectedSize}` : ''}</p>
                  </div>
                  <p className="text-gray-900 font-semibold text-xs">৳ {it.price * it.qty}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {orders.length === 0 && (
        <div className="text-center py-16">
          <Package className="w-12 h-12 mx-auto text-gray-300" />
          <p className="mt-4 text-gray-600 font-medium">No orders yet</p>
          <button onClick={()=>navigate('/')} className="mt-4 px-5 py-2.5 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800">Start Shopping</button>
        </div>
      )}
    </div>
  );
}
