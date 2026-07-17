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
  Package,
  Loader2,
  BellOff,
  Filter,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/admin/PageHeader";
import { useRouter } from "next/navigation";
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
  useClearAllNotificationsMutation,
} from "@/store/notificationApi";

const TYPE_CONFIG = {
  new_order: {
    icon: ShoppingBag,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    label: "New Order",
    filterLabel: "Orders",
  },
  new_complaint: {
    icon: MessageSquareWarning,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    label: "Review / Complaint",
    filterLabel: "Reviews",
  },
  order_cancelled: {
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    label: "Order Cancelled",
    filterLabel: "Cancelled",
  },
  payment_verified: {
    icon: CreditCard,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    label: "Payment Verified",
    filterLabel: "Payments",
  },
  low_stock: {
    icon: Package,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    label: "Low Stock",
    filterLabel: "Stock",
  },
};

const FILTER_TABS = [
  { key: "all", label: "All", icon: Bell },
  { key: "new_order", label: "Orders", icon: ShoppingBag },
  { key: "new_complaint", label: "Reviews", icon: MessageSquareWarning },
  { key: "payment_verified", label: "Payments", icon: CreditCard },
  { key: "order_cancelled", label: "Cancelled", icon: XCircle },
];

function formatTime(date) {
  const now = new Date();
  const d = new Date(date);
  const diff = now - d;
  const secs = Math.floor(diff / 1000);
  const mins = Math.floor(secs / 60);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (secs < 60) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [page, setPage] = useState(1);
  const router = useRouter();

  const queryArgs = {
    page,
    limit: 20,
    ...(activeTab !== "all" && { type: activeTab }),
    ...(showUnreadOnly && { isRead: false }),
  };

  const { data, isLoading, isFetching, refetch } = useGetNotificationsQuery(
    queryArgs,
    { refetchOnMountOrArgChange: true },
  );

  const notifications = data?.data?.notifications || [];
  const unreadCount = data?.data?.unreadCount || 0;
  const pagination = data?.data?.pagination || {};

  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead, { isLoading: markingAll }] = useMarkAllAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [clearAll, { isLoading: clearing }] =
    useClearAllNotificationsMutation();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleNotifClick = async (notif) => {
    if (!notif.isRead) await markAsRead(notif._id);
    if (
      notif.type === "new_order" ||
      notif.type === "order_cancelled" ||
      notif.type === "payment_verified"
    ) {
      router.push("/orders");
    } else if (notif.type === "new_complaint") {
      router.push("/customers");
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <PageHeader
        badgeIcon={Bell}
        badgeText={`${unreadCount} Unread`}
        titleMain="Notification"
        titleAccent="Center"
        description="Stay on top of every order, review, and payment event. All alerts in one place."
        showAction={false}
      >
        <div className="flex gap-3">
          {unreadCount > 0 && (
            <Button
              onClick={markAllAsRead}
              disabled={markingAll}
              variant="outline"
              className="h-10 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest border-2 gap-2"
            >
              {markingAll ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCheck className="h-3.5 w-3.5" />
              )}
              Mark All Read
            </Button>
          )}
          <Button
            onClick={clearAll}
            disabled={clearing}
            variant="outline"
            className="h-10 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest border-2 gap-2 text-destructive border-destructive/30 hover:bg-destructive hover:text-white"
          >
            {clearing ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            Clear All
          </Button>
          <Button
            onClick={() => refetch()}
            variant="ghost"
            size="icon"
            disabled={isFetching}
            className="h-10 w-10 rounded-xl"
          >
            <RefreshCw
              className={cn("h-4 w-4", isFetching && "animate-spin")}
            />
          </Button>
        </div>
      </PageHeader>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {FILTER_TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              id={`notif-filter-${tab.key}`}
              onClick={() => handleTabChange(tab.key)}
              className={cn(
                "flex items-center gap-2 px-4 h-9 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300",
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                  : "bg-card text-muted-foreground border-border/40 hover:border-primary/40 hover:text-foreground",
              )}
            >
              <Icon className="h-3 w-3" />
              {tab.label}
            </button>
          );
        })}
        <button
          onClick={() => {
            setShowUnreadOnly(!showUnreadOnly);
            setPage(1);
          }}
          className={cn(
            "flex items-center gap-2 px-4 h-9 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-300 ml-auto",
            showUnreadOnly
              ? "bg-amber-500 text-white border-amber-500"
              : "bg-card text-muted-foreground border-border/40 hover:border-amber-500/40",
          )}
        >
          <Filter className="h-3 w-3" />
          {showUnreadOnly ? "Showing Unread" : "Unread Only"}
        </button>
      </div>

      {/* Notifications List */}
      <div className="rounded-[2rem] bg-card border border-border/40 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="h-20 w-20 rounded-3xl bg-muted/40 flex items-center justify-center">
              <BellOff className="h-10 w-10 text-muted-foreground/30" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                No notifications
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                {showUnreadOnly
                  ? "No unread notifications in this category."
                  : "Nothing to show here yet."}
              </p>
            </div>
          </div>
        ) : (
          <div>
            {notifications.map((notif, idx) => {
              const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.new_order;
              const Icon = config.icon;
              return (
                <div
                  key={notif._id}
                  className={cn(
                    "group flex items-start gap-4 px-6 py-5 border-b border-border/20 last:border-0 transition-all duration-200 hover:bg-muted/30",
                    !notif.isRead && "bg-primary/2",
                  )}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      "h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110",
                      config.bg,
                    )}
                  >
                    <Icon className={cn("h-5 w-5", config.color)} />
                  </div>

                  {/* Content */}
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => handleNotifClick(notif)}
                  >
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <p
                        className={cn(
                          "text-sm font-black uppercase tracking-wide",
                          !notif.isRead
                            ? "text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {notif.title}
                        {!notif.isRead && (
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary ml-2 mb-0.5" />
                        )}
                      </p>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-[10px] font-bold text-muted-foreground/60">
                          {formatTime(notif.createdAt)}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border",
                          config.bg,
                          config.color,
                          config.border,
                        )}
                      >
                        {config.label}
                      </span>
                      {notif.data?.amount && (
                        <span className="text-[9px] font-black text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-full">
                          Rs.{Number(notif.data.amount).toFixed(2)}
                        </span>
                      )}
                      {notif.data?.customerName && (
                        <span className="text-[9px] font-semibold text-muted-foreground/70">
                          {notif.data.customerName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
                    {!notif.isRead && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notif._id);
                        }}
                        className="h-8 w-8 rounded-xl hover:bg-primary/10 hover:text-primary"
                        title="Mark as read"
                      >
                        <CheckCheck className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notif._id);
                      }}
                      className="h-8 w-8 rounded-xl hover:bg-destructive/10 hover:text-destructive"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border/20 bg-muted/10">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Page {pagination.page} of {pagination.pages} • {pagination.total}{" "}
              total
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="h-8 px-4 text-[10px] font-black uppercase tracking-widest rounded-xl"
              >
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setPage((p) => Math.min(pagination.pages, p + 1))
                }
                disabled={page >= pagination.pages}
                className="h-8 px-4 text-[10px] font-black uppercase tracking-widest rounded-xl"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
