import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { listAdminOrdersByUser } from '../../services/orders';
import { listAdminUsers } from '../../services/adminUsers';

export default function CustomerOrders() {
  const { userId } = useParams();
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const users = await listAdminUsers();
        if (cancelled) return;
        const u = users.find(usr => String(usr.id) === String(userId));
        setUser(u || null);
        const raw = await listAdminOrdersByUser(userId);
        if (cancelled) return;
        const normalized = Array.isArray(raw) ? raw.map(o => ({
          id: o.id,
          items: (o.items || o.orderItems || []).map(it => ({
            productId: it.productId ?? it.product_id,
            quantity: it.quantity ?? 0,
            selectedSize: it.selectedSize ?? it.selected_size ?? null,
            price: it.price ?? 0,
          })),
          status: o.status || o.orderStatus || 'PENDING',
          paymentStatus: o.paymentStatus || o.payment_status || 'PENDING',
          totalAmount: o.totalAmount ?? o.total_amount ?? o.total ?? 0,
          paymentMethod: o.paymentMethod || o.payment_method || 'UNKNOWN',
          createdAt: o.createdAt || o.created_at || o.created || null,
          updatedAt: o.updatedAt || o.updated_at || null,
        })) : [];
        setOrders(normalized);
      } catch (e) {
        console.error(e);
        if (!cancelled) setError(e.message || 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, [userId]);

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center gap-4">
        <Link to="/kidora-admin/customers" className="text-sm text-blue-600 hover:underline">← Back to Customers</Link>
        <h2 className="text-xl font-semibold">Customer Orders</h2>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <>
          <div className="mb-6 bg-white shadow p-4 rounded">
            <h3 className="font-medium text-lg mb-4">Customer Info</h3>
            {user ? (() => {
              const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
              const displayName = fullName || user.name || '—';
              const totalOrders = orders.length;
              const totalSpent = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
              const totalItems = orders.reduce((sum, o) => sum + o.items.reduce((s, it) => s + (it.quantity || 0), 0), 0);
              const statusCounts = orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {});
              return (
                <div className="space-y-4">
                  <ul className="text-sm space-y-1">
                    <li><span className="font-semibold">ID:</span> {user.id}</li>
                    <li><span className="font-semibold">Name:</span> {displayName}</li>
                    <li><span className="font-semibold">Email:</span> {user.email}</li>
                    <li><span className="font-semibold">Role:</span> {user.role}</li>
                  </ul>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded border p-3 bg-gray-50">
                      <p className="text-[11px] uppercase font-semibold text-gray-600">Total Orders</p>
                      <p className="text-lg font-semibold text-gray-900">{totalOrders}</p>
                    </div>
                    <div className="rounded border p-3 bg-gray-50">
                      <p className="text-[11px] uppercase font-semibold text-gray-600">Total Spent</p>
                      <p className="text-lg font-semibold text-gray-900">৳{totalSpent.toFixed(2)}</p>
                    </div>
                    <div className="rounded border p-3 bg-gray-50">
                      <p className="text-[11px] uppercase font-semibold text-gray-600">Total Items</p>
                      <p className="text-lg font-semibold text-gray-900">{totalItems}</p>
                    </div>
                  </div>
                  {totalOrders > 0 && (
                    <div className="text-xs text-gray-600 flex flex-wrap gap-2">
                      {Object.entries(statusCounts).map(([st, ct]) => (
                        <span key={st} className="inline-flex items-center px-2 py-1 rounded bg-gray-100 font-medium">{st}: {ct}</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })() : (
              <div className="text-sm text-gray-600">User not found (may have been deleted)</div>
            )}
          </div>

          <div className="bg-white shadow rounded overflow-hidden">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">Order ID</th>
                  <th className="px-3 py-2 text-left">Created</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Payment</th>
                  <th className="px-3 py-2 text-left">Total</th>
                  <th className="px-3 py-2 text-left">Items</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 && (
                  <tr>
                    <td className="px-3 py-4 text-center text-gray-500" colSpan={6}>No orders for this user.</td>
                  </tr>
                )}
                {orders.map(o => {
                  const created = o.createdAt ? new Date(o.createdAt).toLocaleString() : '—';
                  return (
                    <tr key={o.id} className="border-t">
                      <td className="px-3 py-2">{o.id}</td>
                      <td className="px-3 py-2">{created}</td>
                      <td className="px-3 py-2">{o.status}</td>
                      <td className="px-3 py-2">{o.paymentStatus}</td>
                      <td className="px-3 py-2 font-medium">৳{(o.totalAmount || 0).toFixed(2)}</td>
                      <td className="px-3 py-2">
                        <ul className="space-y-1">
                          {o.items.map(it => (
                            <li key={it.productId + '-' + (it.selectedSize || '')} className="flex gap-2">
                              <span>#{it.productId}</span>
                              <span>x{it.quantity}</span>
                              {it.selectedSize && <span className="text-xs text-gray-500">[{it.selectedSize}]</span>}
                              <span className="text-xs text-gray-600">@ ৳{(it.price || 0).toFixed(2)}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
