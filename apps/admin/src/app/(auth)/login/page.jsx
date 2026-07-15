"use client";
import React, { useEffect } from "react";
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";
import { useLoginMutation } from "@/store/authApi";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setCredentials, selectIsAuthenticated } from "@/store/authSlice";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [showPassword, setShowPassword] = React.useState(false);
  const [formData, setFormData] = React.useState({
    mobile: "",
    password: "",
  });

  // Redirect already-authenticated admins away from login
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const mobile = formData.mobile.startsWith("+") ? formData.mobile : `+91${formData.mobile}`;
      const res = await login({ mobile, password: formData.password }).unwrap();
      const { user, accessToken } = res.data;
      if (user.role === "admin" || user.role === "moderator") {
        dispatch(setCredentials({ user, accessToken }));
        toast.success(`Welcome back, ${user.name}`);
        router.push("/");
      } else {
        toast.error("Access denied. Administrative clearance required.");
      }
    } catch (err) {
      toast.error(
        err?.data?.message || "Authentication failed. Check your clearance.",
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center md:text-left mb-8">
        <h1 className="text-3xl font-light font-serif tracking-tighter lowercase leading-none mb-2">
          admin <span className="text-primary italic font-serif">login</span>
        </h1>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] font-heading">
          Manage your Dunches store and orders
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2 group">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-4 font-heading">
            Mobile Number
          </label>
          <div className="relative">
            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
            <Input
              type="tel"
              placeholder="Enter your mobile number"
              maxLength={10}
              className="h-16 pl-14 pr-6 rounded-[1.25rem] bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold transition-all"
              value={formData.mobile}
              onChange={(e) =>
                setFormData({ ...formData, mobile: e.target.value.replace(/[^0-9]/g, "") })
              }
              required
            />
          </div>
        </div>

        <div className="space-y-2 group">
          <div className="flex items-center justify-between px-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 font-heading">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline font-heading"
            >
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="h-16 pl-14 pr-14 rounded-[1.25rem] bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold tracking-widest transition-all"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-18 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 group relative overflow-hidden mt-4 font-heading"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <span className="flex items-center gap-3">
              Sign In{" "}
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </span>
          )}
        </Button>
      </form>
    </div>
  );
}
