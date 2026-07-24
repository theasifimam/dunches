"use client";
import React, { useState } from "react";
import {
  Bell,
  ShoppingBag,
  MessageSquareWarning,
  CreditCard,
  XCircle,
  CheckCheck,
  Trash2,
  ArrowRight,
  Package,
  Loader2,
  BellOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  useGetUnreadCountQuery,
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} from "@/store/notificationApi";

const TYPE_CONFIG = {
  new_order: {
    icon: ShoppingBag,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    label: "New Order",
  },
  new_complaint: {
    icon: MessageSquareWarning,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    label: "Review",
  },
  order_cancelled: {
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    label: "Cancelled",
  },
  payment_verified: {
    icon: CreditCard,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    label: "Payment",
  },
  low_stock: {
    icon: Package,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    label: "Stock",
  },
};

function formatRelativeTime(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const secs = Math.floor(diff / 1000);
  const mins = Math.floor(secs / 60);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (secs < 60) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "yesterday";
  return `${days}d ago`;
}

export function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const { data: countData } = useGetUnreadCountQuery(undefined, {
    pollingInterval: 30000,
  });
  const unreadCount = countData?.data?.count || 0;

  const { data: notifData, isLoading } = useGetNotificationsQuery(
    { limit: 10 },
    { skip: !open, refetchOnMountOrArgChange: true },
  );
  const notifications = notifData?.data?.notifications || [];

  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead, { isLoading: markingAll }] = useMarkAllAsReadMutation();

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  const handleNotifClick = async (notif) => {
    if (!notif.isRead) {
      markAsRead(notif._id);
    }
    setOpen(false);
    if (
      notif.type === "new_order" ||
      notif.type === "order_cancelled" ||
      notif.type === "payment_verified"
    ) {
      router.push("/orders");
    } else if (notif.type === "new_complaint") {
      const email = notif.data?.customerEmail || "";
      const subject = encodeURIComponent(notif.title || "Complaint Received");
      const descMessage = notif.data?.comment || notif.message || "";
      const body = encodeURIComponent(
        `Dear Customer,\n\nWe received your complaint:\n"${descMessage}"\n\n`,
      );
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {/* Bell Button */}
        <Button
          variant="ghost"
          size="icon"
          id="notification-bell-btn"
          className={cn(
            "h-10 w-10 rounded-full hover:bg-muted transition-all duration-300 relative shrink-0",
            open && "bg-muted",
          )}
        >
          <Bell
            className={cn(
              "h-4 w-4",
              unreadCount > 0 ? "text-primary" : "text-muted-foreground",
            )}
          />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-black text-white shadow-lg animate-pulse">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        collisionPadding={12}
        className="w-[calc(100vw-2rem)] sm:w-95 max-w-95 p-0 border border-border/40 bg-card rounded-3xl overflow-hidden shadow-2xl shadow-black/20 mt-2 z-50 animate-in fade-in slide-in-from-top-4 duration-300"
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/30 bg-card">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <Bell className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <p className="text-[10px] text-muted-foreground font-semibold">
                  {unreadCount} unread
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllRead}
                disabled={markingAll}
                className="h-8 px-3 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/10 hover:text-primary"
              >
                {markingAll ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <CheckCheck className="h-3 w-3 mr-1" />
                )}
                All Read
              </Button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-80 sm:max-h-100 overflow-y-auto scrollbar-hide">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
              <div className="h-14 w-14 rounded-2xl bg-muted/50 flex items-center justify-center">
                <BellOff className="h-7 w-7 text-muted-foreground/40" />
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">
                All caught up!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/20">
              {notifications.map((notif) => {
                const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.new_order;
                const Icon = config.icon;
                return (
                  <button
                    key={notif._id}
                    id={`notif-${notif._id}`}
                    onClick={() => handleNotifClick(notif)}
                    className={cn(
                      "w-full flex items-start gap-3 px-5 py-4 text-left transition-all duration-200 hover:bg-muted/40 group",
                      !notif.isRead && "bg-primary/3",
                    )}
                  >
                    {/* Icon */}
                    <div
                      className={cn(
                        "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110",
                        config.bg,
                      )}
                    >
                      <Icon className={cn("h-4 w-4", config.color)} />
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p
                          className={cn(
                            "text-[11px] font-black uppercase tracking-wide leading-tight truncate",
                            !notif.isRead
                              ? "text-foreground"
                              : "text-muted-foreground",
                          )}
                        >
                          {notif.title}
                        </p>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {!notif.isRead && (
                            <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                          )}
                          <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wide">
                            {formatRelativeTime(notif.createdAt)}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                        {notif.message}
                      </p>
                      <span
                        className={cn(
                          "inline-block mt-1.5 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                          config.bg,
                          config.color,
                          config.border,
                        )}
                      >
                        {config.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border/30 bg-muted/20">
          <Button
            variant="ghost"
            onClick={() => {
              setOpen(false);
              router.push("/notifications");
            }}
            className="w-full h-9 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/10 hover:text-primary justify-between group"
          >
            View All Notifications
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
