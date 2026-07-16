"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/features/user/userSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  ChevronRight,
  ShoppingBag,
  ArrowLeft,
  RotateCcw,
  MapPin,
  CreditCard,
  Flame,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const STATUS_CONFIG = {
  placed: {
    label: "Order Placed",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    icon: Clock,
  },
  confirmed: {
    label: "Confirmed",
    color: "text-primary",
    bg: "bg-primary/10 border-primary/20",
    icon: CheckCircle2,
  },
  processing: {
    label: "Processing",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    icon: RotateCcw,
  },
  shipped: {
    label: "Shipped",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    icon: Truck,
  },
  delivered: {
    label: "Delivered",
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
    icon: XCircle,
  },
};

const PAYMENT_CONFIG = {
  pending: { label: "Pending", color: "text-amber-400" },
  paid: { label: "Paid", color: "text-green-400" },
  failed: { label: "Failed", color: "text-red-400" },
  refunded: { label: "Refunded", color: "text-blue-400" },
  cod: { label: "Pay on Delivery", color: "text-foreground/60" },
};

function OrderCard({ order }) {
  const status = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.placed;
  const StatusIcon = status.icon;
  const paymentLabel =
    order.paymentMethod === "cod"
      ? "Cash on Delivery"
      : PAYMENT_CONFIG[order.paymentStatus]?.label || order.paymentStatus;

  const date = new Date(order.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-foreground/2 border border-border/50 rounded-[1.75rem] overflow-hidden hover:border-primary/20 transition-all group"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center border ${status.bg}`}
          >
            <StatusIcon className={`w-4 h-4 ${status.color}`} />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/30">
              Order
            </p>
            <p className="text-xs font-black font-mono text-foreground/70">
              #{order._id.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p
            className={`text-[9px] font-black uppercase tracking-widest ${status.color}`}
          >
            {status.label}
          </p>
          <p className="text-[9px] text-foreground/30 font-medium mt-0.5">
            {date}
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="px-6 py-4 space-y-2">
        {order.items.slice(0, 3).map((item, i) => (
          <div key={i} className="flex justify-between items-center">
            <p className="text-[11px] font-medium text-foreground/70 truncate flex-1 pr-4">
              {item.name}{" "}
              <span className="text-foreground/30">× {item.qty}</span>
            </p>
            <p className="text-[11px] font-bold shrink-0">
              ₹{(item.price * item.qty).toLocaleString()}
            </p>
          </div>
        ))}
        {order.items.length > 3 && (
          <p className="text-[9px] text-foreground/30 font-bold uppercase tracking-widest">
            +{order.items.length - 3} more item
            {order.items.length - 3 > 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-4 bg-foreground/1.5 border-t border-border/40">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <CreditCard className="w-3 h-3 text-foreground/30" />
            <span className="text-[9px] font-bold text-foreground/40">
              {paymentLabel}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-foreground/30" />
            <span className="text-[9px] font-bold text-foreground/40">
              {order.shippingAddress?.city || "—"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-black text-primary">
            ₹
            {order.finalAmount?.toLocaleString() ??
              order.totalAmount?.toLocaleString()}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-foreground/20 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </motion.div>
  );
}

export default function OrdersPage() {
  const user = useSelector(selectUser);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    if (!user) return;
    fetchOrders(1);
  }, [user]);

  const fetchOrders = async (pageNum) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/v1/orders/my?page=${pageNum}&limit=10`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load orders");
      setOrders(data.data.orders || []);
      setPagination(data.data.pagination);
      setPage(pageNum);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-5">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-foreground/30 mb-1">
            My Orders
          </p>
          <h1 className="text-2xl font-black font-heading tracking-tight">
            Order History
          </h1>
        </div>
        <Link href="/menu">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border-border/50 text-[10px] font-black uppercase tracking-widest hover:border-primary/40 hover:text-primary"
          >
            <ShoppingBag className="w-3.5 h-3.5 mr-2" /> Shop More
          </Button>
        </Link>
      </motion.div>

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 bg-foreground/3 rounded-[1.75rem] animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="p-6 text-center bg-red-500/5 border border-red-500/10 rounded-2xl">
          <p className="text-sm font-bold text-red-500">{error}</p>
          <button
            onClick={() => fetchOrders(page)}
            className="mt-3 text-[10px] font-black uppercase tracking-widest text-primary hover:text-amber-500 transition-colors"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && orders.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 bg-foreground/2 border border-border/50 rounded-4xl"
        >
          <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/10">
            <Package className="w-9 h-9 text-primary/30" strokeWidth={1} />
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.25em] text-foreground/30 mb-3">
            No orders yet
          </p>
          <h2 className="text-3xl font-light font-serif tracking-tighter mb-4 lowercase">
            time to snack.
          </h2>
          <p className="text-[10px] text-foreground/40 mb-8 font-medium">
            Your order history will appear here once you place your first order.
          </p>
          <Link href="/menu">
            <Button className="rounded-full px-8 text-[10px] font-black uppercase tracking-widest shadow-xl">
              <Flame className="w-3.5 h-3.5 mr-2" /> Browse Menu
            </Button>
          </Link>
        </motion.div>
      )}

      {/* Orders list */}
      {!loading && !error && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <OrderCard order={order} />
            </motion.div>
          ))}

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center gap-3 pt-2">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => fetchOrders(page - 1)}
                className="rounded-full text-[10px] font-black uppercase tracking-widest border-border/50"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Prev
              </Button>
              <span className="flex items-center text-[10px] font-black uppercase tracking-widest text-foreground/30">
                {page} / {pagination.pages}
              </span>
              <Button
                variant="outline"
                disabled={page >= pagination.pages}
                onClick={() => fetchOrders(page + 1)}
                className="rounded-full text-[10px] font-black uppercase tracking-widest border-border/50"
              >
                Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
