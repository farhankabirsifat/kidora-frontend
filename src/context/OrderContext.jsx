import { useState, useCallback, useEffect } from "react";
import { OrderContext } from "./OrderContextInternal";
import { listUserOrders } from "../services/orders";

// Map backend OrderOut to UI model used by pages
function toUiOrder(o) {
  // Translate backend enum to UI status keys
  const mapBackendStatusToUi = (s) => {
    const up = String(s || '').toUpperCase();
    switch (up) {
      case 'PENDING': return 'pending';
      case 'CONFIRMED': return 'processing';
      case 'PACKED': return 'packed';
      case 'OUT_FOR_DELIVERY': return 'out_for_delivery';
      case 'SHIPPED': return 'shipped';
      case 'DELIVERED': return 'delivered';
      case 'CANCELLED': return 'cancelled';
      default: return (String(s || '').toLowerCase() || 'pending');
    }
  };
  const status = mapBackendStatusToUi(o.status);
  const paymentStatus = String(o.paymentStatus || 'PENDING').toLowerCase();
  // Robust total: prefer numeric totalAmount, else compute from items safely
  const hasNumericTotal = Number.isFinite(Number(o?.totalAmount));
  const computedFromItems = Array.isArray(o.items)
    ? o.items.reduce((s, it) => s + Number(it?.price ?? 0) * Number(it?.quantity ?? 0), 0)
    : 0;
  const total = hasNumericTotal ? Number(o.totalAmount) : computedFromItems;
  const createdAt = o.createdAt || o.created_at || o.updatedAt || o.updated_at || null;
  const date = createdAt ? new Date(createdAt).toISOString().slice(0,10) : '';
  const items = Array.isArray(o.items) ? o.items.map((it, idx) => {
    const pid = it?.productId ?? it?.product_id ?? it?.pid ?? '';
    const qty = it?.quantity ?? it?.qty ?? 0;
    const price = it?.price ?? it?.unit_price ?? it?.amount ?? 0;
    return {
      id: it?.id ?? idx,
      title: `Product #${pid}`,
      qty: Number(qty ?? 0),
      price: Number(price ?? 0),
    };
  }) : [];
  // Build a generic tracking based on status
  const stepOrder = ["pending","processing","packed","shipped","out_for_delivery","delivered","cancelled"];
  const labelMap = {
    pending: "Pending",
    processing: "Processing",
    packed: "Packed",
    shipped: "Shipped",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  const steps = stepOrder.map(k => ({ key: k, label: labelMap[k], time: k === status ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null }));
  // If backend status is unknown, fall back to 'pending' (initial stage)
  const current = stepOrder.includes(status) ? status : "pending";
  // Display-friendly status should reflect the actual current step
  const displayStatus = current;

  return { id: o.id, date, status: displayStatus, paymentStatus, total, items, tracking: { steps, current } };
}

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const data = await listUserOrders();
        if (!ignore) setOrders(Array.isArray(data) ? data.map(toUiOrder) : []);
      } catch (e) {
        if (!ignore) setError(e?.message || 'Failed to load orders');
      } finally {
        if (!ignore) setLoaded(true);
      }
    })();
    return () => { ignore = true; };
  }, []);

  const advanceOrderStatus = useCallback((orderId) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const stepKeys = o.tracking.steps.map((s) => s.key);
        const currentIndex = stepKeys.indexOf(o.tracking.current);
        if (currentIndex < stepKeys.length - 1) {
          const nextKey = stepKeys[currentIndex + 1];
          const updatedSteps = o.tracking.steps.map((s) =>
            s.key === nextKey && !s.time
              ? { ...s, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }
              : s
          );
          return {
            ...o,
            status: nextKey === "delivered" ? "delivered" : o.status,
            tracking: { ...o.tracking, current: nextKey, steps: updatedSteps },
          };
        }
        return o;
      })
    );
  }, []);

  const addOrder = useCallback((orderOut) => {
    const ui = toUiOrder(orderOut);
    setOrders((prev) => [ui, ...prev]);
  }, []);

  return (
    <OrderContext.Provider value={{ orders, advanceOrderStatus, addOrder, loaded, error }}>
      {children}
    </OrderContext.Provider>
  );
};
