import { useState, useCallback } from "react";
import { OrderContext } from "./OrderContextInternal";

const initialOrders = [
  {
    id: "ORD-1001",
    date: "2025-09-01",
    status: "processing",
    total: 1567,
    items: [
      { id: 1, title: "Stylish Check Shirt", qty: 1, price: 567 },
      { id: 2, title: "Casual Blue Shirt", qty: 2, price: 500 },
    ],
    tracking: {
      steps: [
        { key: "processing", label: "Processing", time: "09:30" },
        { key: "packed", label: "Packed", time: null },
        { key: "shipped", label: "Shipped", time: null },
        { key: "out_for_delivery", label: "Out for Delivery", time: null },
        { key: "delivered", label: "Delivered", time: null },
      ],
      current: "processing",
    },
  },
  {
    id: "ORD-1000",
    date: "2025-08-30",
    status: "delivered",
    total: 890,
    items: [
      { id: 5, title: "Premium Kids Tee", qty: 1, price: 450 },
      { id: 6, title: "Soft Cotton Shorts", qty: 1, price: 440 },
    ],
    tracking: {
      steps: [
        { key: "processing", label: "Processing", time: "08:10" },
        { key: "packed", label: "Packed", time: "09:00" },
        { key: "shipped", label: "Shipped", time: "12:40" },
        { key: "out_for_delivery", label: "Out for Delivery", time: "15:30" },
        { key: "delivered", label: "Delivered", time: "19:10" },
      ],
      current: "delivered",
    },
  },
];

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(initialOrders);

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

  const addOrder = useCallback((order) => {
    setOrders((prev) => [order, ...prev]);
  }, []);

  return (
    <OrderContext.Provider value={{ orders, advanceOrderStatus, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
