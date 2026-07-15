/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from "react";
import { Search, Bell, User, Sun, Moon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { selectCurrentUser, clearCredentials } from "@/store/authSlice";
import { useLogoutMutation } from "@/store/authApi";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import dynamic from "next/dynamic";
const LogoutConfirmDialog = dynamic(
  () =>
    import("@/components/admin/LogoutConfirmDialog").then(
      (mod) => mod.LogoutConfirmDialog,
    ),
  { ssr: false },
);
import { Settings, Shield } from "lucide-react";
export function Topbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();
  const router = useRouter();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      /* ignore */
    }
    dispatch(clearCredentials());
    toast.info("Session terminated.");
    router.push("/login");
  };
  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <div className="h-20 bg-background/20 backdrop-blur-md border-b border-border/10 sticky top-0 z-40 px-6 md:px-10 flex items-center justify-between transition-colors duration-500 gap-4">
      <div className="flex items-center gap-2 md:gap-4 flex-1 max-w-xl group relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60 group-focus-within:text-primary transition-colors z-10" />
        <Input
          type="text"
          placeholder="Search control center..."
          className="w-full h-10 bg-muted/40 border border-border/30 rounded-full pl-11 pr-4 text-xs font-medium focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:bg-background transition-all outline-none"
        />
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-10 w-10 rounded-full hover:bg-muted transition-all duration-300 group relative shrink-0"
        >
          {mounted &&
            (theme === "dark" ? (
              <Sun className="h-4 w-4 text-primary group-hover:rotate-45 transition-transform duration-500" />
            ) : (
              <Moon className="h-4 w-4 text-muted-foreground group-hover:-rotate-12 transition-transform duration-500" />
            ))}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full hover:bg-muted transition-all duration-300 relative shrink-0"
        >
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 bg-primary rounded-full shadow-[0_0_8px_var(--primary)]" />
        </Button>

        <div className="h-6 w-px bg-border/50 mx-1 md:mx-2 hidden xs:block" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-2 md:gap-3 pl-1 md:pl-2 group shrink-0 cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold leading-none mb-0.5 text-foreground group-hover:text-primary transition-colors">
                  {user?.name || "Admin User"}
                </p>
                <p className="text-[9px] font-medium text-muted-foreground/80 uppercase tracking-wider">
                  {user?.role || "Administrator"}
                </p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 p-px flex items-center justify-center transition-all group-hover:bg-primary/20 overflow-hidden ring-1 ring-border">
                <div className="h-full w-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                  )}
                </div>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>Control Center</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <Settings className="mr-3 h-4 w-4 text-muted-foreground" />
              Security Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <Shield className="mr-3 h-4 w-4 text-muted-foreground" />
              Admin Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setIsLogoutDialogOpen(true)}
              className="text-destructive focus:bg-destructive focus:text-white"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Terminate Session
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <LogoutConfirmDialog
          isOpen={isLogoutDialogOpen}
          onOpenChange={setIsLogoutDialogOpen}
          onConfirm={handleLogout}
        />
      </div>
    </div>
  );
}
