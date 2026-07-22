"use client";

import React from "react";
import { CheckCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotificationCardsGrid({
  notifications,
  TYPE_CONFIG,
  formatTime,
  handleNotifClick,
  markAsRead,
  deleteNotification,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 md:gap-6 md:p-6 bg-muted/5">
      {notifications.map((notif) => {
        const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.new_order;
        const Icon = config.icon;
        return (
          <div
            key={notif._id}
            className={cn(
              "group relative rounded-2xl md:rounded-[2rem] bg-card border border-border/40 p-4 md:p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer",
              !notif.isRead && "bg-primary/2 border-primary/20",
            )}
            onClick={() => handleNotifClick(notif)}
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div
                  className={cn(
                    "h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110",
                    config.bg,
                  )}
                >
                  <Icon className={cn("h-5 w-5", config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm font-black uppercase tracking-wide truncate",
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
                  <span className="text-[10px] font-bold text-muted-foreground/60 block mt-0.5">
                    {formatTime(notif.createdAt)}
                  </span>
                </div>
              </div>

              {/* Message */}
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {notif.message}
              </p>

              {/* Tags / Data */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/10">
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
            <div className="flex items-center justify-end gap-1 mt-4 pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
