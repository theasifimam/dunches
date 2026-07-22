"use client";

import React from "react";
import { CheckCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotificationList({
  notifications,
  TYPE_CONFIG,
  formatTime,
  handleNotifClick,
  markAsRead,
  deleteNotification,
}) {
  return (
    <div className="divide-y divide-border/20">
      {notifications.map((notif) => {
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
                    !notif.isRead ? "text-foreground" : "text-muted-foreground",
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
                title="Delete notification"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
