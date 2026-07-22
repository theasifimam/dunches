/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import {
  Search,
  Filter,
  Eye,
  Download,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  CreditCard,
  User,
  ShoppingBag,
  TrendingUp,
  Activity,
  Loader2,
  LayoutGrid,
  List,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/PageHeader";
import { useGetAllOrdersQuery } from "@/store/orderApi";
const OrderDetailsDialog = dynamic(
  () =>
    import("@/components/orders/OrderDetailsDialog").then(
      (mod) => mod.OrderDetailsDialog,
    ),
  { ssr: false },
);
import { Pagination } from "@/components/admin/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import { DUMMY_ORDERS } from "@/lib/dummyData";
import ViewSwitcher from "@/components/admin/ViewSwitcher";
import OrderCardsGrid from "./components/OrderCardsGrid";
const statusStyles = {
  delivered: "bg-primary/10 text-primary border-primary/20",
  confirmed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  shipped: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  placed: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};
const statusIcons = {
  delivered: CheckCircle2,
  confirmed: Clock,
  shipped: Truck,
  placed: Clock,
  cancelled: XCircle,
};
export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("list");
  React.useEffect(() => {
    const stored = localStorage.getItem("dunches_admin_view_orders");
    if (stored === "card" || stored === "list") {
      setViewMode(stored);
    }
  }, []);

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem("dunches_admin_view_orders", mode);
  };
  const { data: response, isLoading: apiLoading } = useGetAllOrdersQuery({
    page: page,
    limit: 20,
    status: filterStatus,
  });
  const orders = React.useMemo(() => {
    const rawOrders =
      response?.data?.orders && response.data.orders.length > 0
        ? response.data.orders
        : DUMMY_ORDERS;

    // Filter by status if we are using dummy data, because useGetAllOrdersQuery filters at the API level
    const statusFiltered =
      response?.data?.orders && response.data.orders.length > 0
        ? rawOrders
        : filterStatus === "All Status"
          ? rawOrders
          : rawOrders.filter((o) => o.orderStatus === filterStatus);

    if (!debouncedSearch) return statusFiltered;
    const lowSearch = debouncedSearch.toLowerCase();
    return statusFiltered.filter(
      (o) =>
        o._id.toLowerCase().includes(lowSearch) ||
        o.user?.name?.toLowerCase().includes(lowSearch) ||
        o.user?.email?.toLowerCase().includes(lowSearch),
    );
  }, [response, debouncedSearch, filterStatus]);
  const totalOrders =
    response?.data?.pagination?.total ||
    (response?.data?.orders && response.data.orders.length > 0
      ? 0
      : orders.length);
  // Quick summary calculation
  const netLiquidity = React.useMemo(
    () => orders.reduce((sum, o) => sum + o.finalAmount, 0),
    [orders],
  );
  const pulseStats = React.useMemo(
    () => [
      {
        label: "Total Orders",
        value: totalOrders.toString(),
        icon: Clock,
        color: "orange",
      },
      {
        label: "Carrier Transit",
        value:
          orders.filter((o) => o.orderStatus === "shipped").length + " Orders",
        icon: Truck,
        color: "blue",
      },
      {
        label: "Success (Delivered)",
        value:
          orders.filter((o) => o.orderStatus === "delivered").length + " Units",
        icon: CheckCircle2,
        color: "primary",
      },
      {
        label: "Net Liquidity (View)",
        value: "₹" + netLiquidity.toFixed(2),
        icon: CreditCard,
        color: "purple",
      },
    ],
    [totalOrders, orders, netLiquidity],
  );
  const isLoading = apiLoading && !response;
  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4 md:gap-6 w-full max-w-7xl mx-auto pb-12 animate-in fade-in duration-700">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-serif font-light tracking-tight text-foreground">
            Orders <span className="text-primary italic font-black font-sans">Fulfillment</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor the lifecycle of luxury. From order inception to signature delivery.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-4 bg-card border border-border/40 px-5 py-3 rounded-2xl shadow-sm">
            <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Monthly Velocity:</div>
            <div className="text-xl font-black text-primary font-serif leading-none">1,248</div>
          </div>
          <Button
            variant="outline"
            className="rounded-full px-5 h-11 text-xs font-bold uppercase tracking-wider"
          >
            Export Ledger
          </Button>
        </div>
      </div>

      {/* Fulfillment Pulse Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {pulseStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-card border border-border/40 p-4 md:p-5 rounded-2xl md:rounded-3xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon className="h-16 w-16 text-primary" />
              </div>
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center mb-4", 
                stat.color === "primary" ? "bg-primary/10 text-primary" : "bg-muted text-foreground"
              )}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">{stat.label}</p>
              <h4 className="text-2xl font-bold text-foreground leading-none">{stat.value}</h4>
            </div>
          );
        })}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row items-center gap-3 lg:gap-4 p-3.5 lg:p-4 rounded-2xl bg-card border border-border/40 w-full">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search by order ID, customer name, or email..."
            className="h-12 w-full pl-12 pr-4 bg-card border border-border/60 rounded-xl font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-none justify-between lg:justify-start">
          <div className="flex gap-2">
            {[
              "All Status",
              "placed",
              "confirmed",
              "shipped",
              "delivered",
              "cancelled",
            ].map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterStatus(filter)}
                className={cn(
                  "px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border",
                  filterStatus === filter
                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                    : "bg-background border-border/60 text-muted-foreground hover:bg-muted",
                )}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="h-10 w-[1px] bg-border/40 mx-2 hidden sm:block" />
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl hover:bg-muted border border-border/60"
            >
              <Filter className="h-4 w-4 text-muted-foreground" />
            </Button>
            <ViewSwitcher viewMode={viewMode} onViewModeChange={handleViewModeChange} />
          </div>
        </div>
      </div>

      {/* Orders Table / Cards */}
      {viewMode === "list" ? (
        <div className="rounded-2xl md:rounded-[2rem] bg-card border border-border/40 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/30 text-muted-foreground font-semibold">
                <tr>
                  <th className="px-4 py-4">ID</th>
                  <th className="px-4 py-4 text-center hidden sm:table-cell">Date</th>
                  <th className="px-4 py-4">Customer</th>
                  <th className="px-4 py-4 text-center w-12 hidden md:table-cell">Units</th>
                  <th className="px-4 py-4">Total</th>
                  <th className="px-4 py-4 hidden lg:table-cell">Delivery</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {orders.map((order) => {
                  const StatusIcon = statusIcons[order.orderStatus] || Clock;
                  return (
                    <tr
                      key={order._id}
                      className="group hover:bg-muted/10 transition-colors"
                    >
                      <td className="px-4 py-4 font-bold text-xs uppercase tracking-wider text-primary font-serif">
                        #{order._id.slice(-8)}
                      </td>
                      <td className="px-4 py-4 text-center text-xs font-medium text-muted-foreground whitespace-nowrap hidden sm:table-cell">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0 border border-primary/10">
                            {order.user?.name ? (
                              <span className="font-bold text-primary capitalize text-sm">
                                {order.user.name[0]}
                              </span>
                            ) : (
                              <User className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-foreground mb-0.5 leading-tight max-w-[100px] truncate">
                              {order.user?.name || "Unknown User"}
                            </p>
                            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide opacity-80 max-w-[100px] truncate hidden sm:block">
                              {order.user?.email || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center font-bold text-xs hidden md:table-cell">
                        {order.items.reduce((acc, item) => acc + item.qty, 0)}
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-bold text-primary font-serif">
                          ₹{order.finalAmount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <div
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                            statusStyles[order.orderStatus],
                          )}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {order.orderStatus}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "h-2 w-2 rounded-full",
                              order.paymentStatus === "paid"
                                ? "bg-primary shadow-[0_0_8px_rgba(245,158,11,1)]"
                                : "bg-orange-500",
                            )}
                          />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground opacity-80">
                            {order.paymentMethod}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-xl hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-all"
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Footer Audit */}
          <div className="p-4 md:p-6 border-t border-border/40 bg-muted/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  Average Basket Value
                </p>
                <h4 className="text-base font-bold text-foreground font-serif">
                  ₹
                  {orders.length > 0 ? (orders.reduce((acc, order) => acc + order.finalAmount, 0) /
                    orders.length).toFixed(2) : '0.00'}
                </h4>
              </div>
            </div>
            <Pagination
              currentPage={page}
              totalPages={response?.data?.pagination?.pages || 1}
              onPageChange={setPage}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <OrderCardsGrid
            orders={orders}
            statusIcons={statusIcons}
            statusStyles={statusStyles}
            setSelectedOrder={setSelectedOrder}
            setIsDialogOpen={setIsDialogOpen}
          />

          {/* Footer Audit */}
          <div className="p-4 md:p-6 rounded-2xl md:rounded-[2rem] bg-card border border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  Average Basket Value
                </p>
                <h4 className="text-base font-bold text-foreground font-serif">
                  ₹
                  {orders.length > 0 ? (orders.reduce((acc, order) => acc + order.finalAmount, 0) /
                    orders.length).toFixed(2) : '0.00'}
                </h4>
              </div>
            </div>
            <Pagination
              currentPage={page}
              totalPages={response?.data?.pagination?.pages || 1}
              onPageChange={setPage}
            />
          </div>
        </div>
      )}

      <OrderDetailsDialog
        order={selectedOrder}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
