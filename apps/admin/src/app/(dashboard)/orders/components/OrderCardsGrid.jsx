"use client";

import React from "react";
import { User, Eye, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function OrderCardsGrid({
  orders,
  statusIcons,
  statusStyles,
  setSelectedOrder,
  setIsDialogOpen,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {orders.map((order) => {
        const StatusIcon = statusIcons[order.orderStatus] || Clock;
        return (
          <div
            key={order._id}
            className="group rounded-2xl md:rounded-[2rem] bg-card border border-border/40 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div className="p-4 space-y-3 md:p-5 md:space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-primary font-serif">
                  #{order._id.slice(-8)}
                </span>
                <span className="text-[10px] font-medium text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Customer Info */}
              <div className="flex items-center gap-3 py-2 border-y border-border/20">
                <div className="h-8 w-8 rounded-xl bg-primary/15 flex items-center justify-center shrink-0 border border-primary/10">
                  {order.user?.name ? (
                    <span className="font-bold text-primary capitalize text-xs">
                      {order.user.name[0]}
                    </span>
                  ) : (
                    <User className="h-3.5 w-3.5 text-primary" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-xs text-foreground truncate">
                    {order.user?.name || "Unknown User"}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {order.user?.email || "N/A"}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-muted-foreground">
                  {order.items.reduce((acc, item) => acc + item.qty, 0)} items
                </span>
                <span className="font-bold text-primary font-serif text-sm">
                  ₹{order.finalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-4 py-3 bg-muted/10 border-t border-border/30 flex items-center justify-between md:px-5">
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
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border",
                    statusStyles[order.orderStatus],
                  )}
                >
                  <StatusIcon className="h-3 w-3" />
                  {order.orderStatus}
                </div>
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
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
