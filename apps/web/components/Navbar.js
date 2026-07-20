"use client";

import Link from "next/link";
import {
  ShoppingBag,
  Menu,
  Flame,
  Sun,
  Moon,
  ArrowRight,
  User,
  LogOut,
  ChevronDown,
  Search,
  HelpCircle,
  Lock,
  BookOpen,
  MessageSquare,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { selectCartCount } from "@/features/cart/cartSlice";
import { selectActiveRestaurant } from "@/features/restaurant/restaurantSlice";
import {
  selectUser,
  logoutUser,
  setProfile,
  fetchProfile,
} from "@/features/user/userSlice";
import { Button } from "./ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import BottomSheet from "./BottomSheet";

const AuthModal = dynamic(() => import("./AuthModal"), { ssr: false });

export default function Navbar() {
  const cartCount = useSelector(selectCartCount);
  const activeRestaurant = useSelector(selectActiveRestaurant);
  const user = useSelector(selectUser);
  const avatarSrc = user?.avatar
    ? user.avatar.startsWith("/uploads")
      ? user.avatar
      : `/uploads/${user.avatar}`
    : null;
  const dispatch = useDispatch();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [hasOpenedAuth, setHasOpenedAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);
  const [isGuestMenuOpen, setIsGuestMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    try {
      const savedTheme = localStorage.getItem("theme") || "dark";
      setTheme(savedTheme);
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.add("light");
      }

      // Hydrate Redux from localStorage if not already loaded
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          dispatch(setProfile(JSON.parse(savedUser)));
          // Also re-fetch from server to get fresh data
          dispatch(fetchProfile());
        } catch {}
      }
    } catch (error) {
      console.warn("localStorage is not accessible:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    document.title = "Dunches | Fiery Crunch & Spicy Cravings";

    if (activeRestaurant) {
      const primaryColor =
        theme === "dark"
          ? activeRestaurant.colors.dark
          : activeRestaurant.colors.light;
      document.documentElement.style.setProperty("--primary", primaryColor);
      document.documentElement.style.setProperty("--ring", primaryColor);
    }
  }, [activeRestaurant, theme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openAuth = (mode) => {
    setHasOpenedAuth(true);
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const navLinkClass = (path) => `
    text-[11px] font-black tracking-[0.2em] uppercase transition-all duration-300
    ${pathname === path ? "text-primary" : "text-foreground/40 hover:text-foreground hover:scale-105"}
  `;

  if (!mounted) return null;

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-100 transition-all duration-500 p-0 md:px-8 md:py-4 flex flex-col">
        <nav
          className={`
            flex items-center justify-between transition-all duration-500
            w-full h-14 px-5 border-b border-border/10 bg-background backdrop-blur-2xl
            md:container md:mx-auto md:max-w-7xl md:h-16 md:px-6 md:rounded-full md:border md:border-border/50
            ${
              isScrolled
                ? "md:bg-background/80 md:backdrop-blur-2xl md:shadow-2xl md:scale-[0.98] md:scale-100"
                : "md:bg-transparent md:border-transparent"
            }
          `}
        >
          {/* Brand - Desktop Logo */}
          <Link href="/" className="group hidden md:flex items-center gap-2">
            <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center rotate-6 group-hover:rotate-0 transition-transform shadow-sm">
              <Flame className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-light tracking-widest text-foreground font-serif lowercase group-hover:tracking-[0.15em] transition-all duration-500">
              Dunches
            </span>
          </Link>

          {/* Profile Welcome Row - Mobile Greeting Header */}
          <div className="flex items-center gap-3 md:hidden">
            {user && (
              <button
                onClick={() => setIsUserMenuOpen(true)}
                className="w-8 h-8 rounded-full border border-primary/20 overflow-hidden flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-transform bg-foreground/5 outline-hidden"
              >
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-foreground/45" />
                )}
              </button>
            )}
            <div className="flex flex-col leading-none">
              <span className="text-[9px] text-foreground/40 font-bold uppercase tracking-wider font-sans">
                hello,
              </span>
              <span className="text-[11px] font-extrabold text-foreground font-sans tracking-tight">
                {user ? user.name : "craver"}
              </span>
            </div>
          </div>

          {/* Desktop Nav Only */}
          <div className="hidden lg:flex items-center gap-10">
            <Link href="/" className={navLinkClass("/")}>
              Home
            </Link>
            <Link href="/menu" className={navLinkClass("/menu")}>
              Shop
            </Link>
            <Link href="/about" className={navLinkClass("/about")}>
              About Us
            </Link>
            <Link href="/contact" className={navLinkClass("/contact")}>
              Contact
            </Link>
          </div>

          {/* Actions - Cleaned for Mobile */}
          <div className="flex items-center gap-1.5 md:gap-2">
            {/* Mobile-Only Actions */}
            <Link href="/explore" className="md:hidden">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-foreground/45 hover:text-primary bg-foreground/5 active:scale-95 transition-all cursor-pointer shrink-0">
                <Search className="w-4 h-4" />
              </div>
            </Link>

            {/* Guest Actions - Desktop Popover */}
            {!user && (
              <div className="hidden md:block">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="w-10 h-10 rounded-full flex items-center justify-center text-foreground/45 hover:text-primary bg-foreground/5 hover:bg-foreground/10 active:scale-95 transition-all cursor-pointer shrink-0">
                      <Menu className="w-4 h-4" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    className="w-56 p-4 rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl flex flex-col gap-2 z-150"
                  >
                    <div className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground/30 px-1 pb-1 border-b border-border/10">
                      Menu
                    </div>

                    <button
                      onClick={toggleTheme}
                      className="w-full flex items-center justify-between text-left text-[9px] font-black uppercase tracking-widest text-foreground/60 hover:text-primary py-2 px-1 rounded-lg hover:bg-foreground/3 transition-all font-heading cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        {theme === "dark" ? (
                          <Sun className="w-3.5 h-3.5" />
                        ) : (
                          <Moon className="w-3.5 h-3.5" />
                        )}
                        Theme Mode
                      </span>
                      <span className="text-[8px] opacity-40 font-bold">
                        {theme === "dark" ? "Dark" : "Light"}
                      </span>
                    </button>

                    <div className="h-px bg-border/10 my-1" />

                    <Link href="/about" className="w-full">
                      <button className="w-full flex items-center gap-2 text-left text-[9px] font-black uppercase tracking-widest text-foreground/60 hover:text-primary py-2 px-1 rounded-lg hover:bg-foreground/3 transition-all font-heading cursor-pointer">
                        <HelpCircle className="w-3.5 h-3.5" />
                        About Us
                      </button>
                    </Link>

                    <Link href="/privacy" className="w-full">
                      <button className="w-full flex items-center gap-2 text-left text-[9px] font-black uppercase tracking-widest text-foreground/60 hover:text-primary py-2 px-1 rounded-lg hover:bg-foreground/3 transition-all font-heading cursor-pointer">
                        <Lock className="w-3.5 h-3.5" />
                        Privacy Policy
                      </button>
                    </Link>

                    <Link href="/terms" className="w-full">
                      <button className="w-full flex items-center gap-2 text-left text-[9px] font-black uppercase tracking-widest text-foreground/60 hover:text-primary py-2 px-1 rounded-lg hover:bg-foreground/3 transition-all font-heading cursor-pointer">
                        <BookOpen className="w-3.5 h-3.5" />
                        Terms & Conditions
                      </button>
                    </Link>

                    <Link href="/contact" className="w-full">
                      <button className="w-full flex items-center gap-2 text-left text-[9px] font-black uppercase tracking-widest text-foreground/60 hover:text-primary py-2 px-1 rounded-lg hover:bg-foreground/3 transition-all font-heading cursor-pointer">
                        <MessageSquare className="w-3.5 h-3.5" />
                        Contact Us
                      </button>
                    </Link>
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {/* Guest Actions - Mobile Menu Button */}
            {!user && (
              <button
                onClick={() => setIsGuestMenuOpen(true)}
                className="md:hidden w-8 h-8 rounded-full flex items-center justify-center text-foreground/45 hover:text-primary bg-foreground/5 active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <Menu className="w-4 h-4" />
              </button>
            )}

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-full flex items-center justify-center text-foreground/40 hover:text-primary transition-all"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
              <div className="w-px h-4 bg-border mx-1" />

              {user ? (
                <Popover>
                  <PopoverTrigger className="flex items-center gap-2 border border-border/50 hover:border-primary/40 rounded-full p-1 pr-4 transition-all bg-foreground/2 hover:bg-foreground/4 group outline-hidden cursor-pointer">
                    <div className="w-8 h-8 rounded-full border border-primary/50 overflow-hidden flex items-center justify-center shrink-0 bg-foreground/5">
                      {avatarSrc ? (
                        <img
                          src={avatarSrc}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-foreground/45" />
                      )}
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-foreground/60 group-hover:text-primary transition-all font-heading">
                      {user.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-foreground/30 group-hover:text-primary transition-colors" />
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    className="w-56 p-4 rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl flex flex-col gap-2.5 z-150"
                  >
                    <div className="flex items-center gap-3 pb-3 border-b border-border/10">
                      <div className="w-10 h-10 rounded-full border border-primary/50 overflow-hidden shrink-0 flex items-center justify-center bg-foreground/5">
                        {avatarSrc ? (
                          <img
                            src={avatarSrc}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-foreground/45" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[11px] font-black font-heading uppercase tracking-widest text-foreground truncate">
                          {user.name}
                        </span>
                        <span className="text-[9px] font-medium text-foreground/40 truncate">
                          {user.email || "ayaan.ahmed@makhana.wellness"}
                        </span>
                      </div>
                    </div>
                    <Link href="/profile" className="w-full">
                      <button className="w-full flex items-center gap-2 text-left text-[9px] font-black uppercase tracking-widest text-foreground/60 hover:text-primary py-2 px-1 rounded-lg hover:bg-foreground/3 transition-all font-heading cursor-pointer">
                        <User className="w-3.5 h-3.5" />
                        View Profile
                      </button>
                    </Link>

                    {/* Theme Toggle (especially for mobile) */}
                    <button
                      onClick={toggleTheme}
                      className="w-full flex items-center justify-between text-left text-[9px] font-black uppercase tracking-widest text-foreground/60 hover:text-primary py-2 px-1 rounded-lg hover:bg-foreground/3 transition-all font-heading cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        {theme === "dark" ? (
                          <Sun className="w-3.5 h-3.5" />
                        ) : (
                          <Moon className="w-3.5 h-3.5" />
                        )}
                        Theme Mode
                      </span>
                      <span className="text-[8px] opacity-40 font-bold">
                        {theme === "dark" ? "Dark" : "Light"}
                      </span>
                    </button>

                    <div className="h-px bg-border/10 my-1" />

                    <Link href="/about" className="w-full">
                      <button className="w-full flex items-center gap-2 text-left text-[9px] font-black uppercase tracking-widest text-foreground/60 hover:text-primary py-2 px-1 rounded-lg hover:bg-foreground/3 transition-all font-heading cursor-pointer">
                        <HelpCircle className="w-3.5 h-3.5" />
                        About Us
                      </button>
                    </Link>

                    <Link href="/privacy" className="w-full">
                      <button className="w-full flex items-center gap-2 text-left text-[9px] font-black uppercase tracking-widest text-foreground/60 hover:text-primary py-2 px-1 rounded-lg hover:bg-foreground/3 transition-all font-heading cursor-pointer">
                        <Lock className="w-3.5 h-3.5" />
                        Privacy Policy
                      </button>
                    </Link>

                    <Link href="/terms" className="w-full">
                      <button className="w-full flex items-center gap-2 text-left text-[9px] font-black uppercase tracking-widest text-foreground/60 hover:text-primary py-2 px-1 rounded-lg hover:bg-foreground/3 transition-all font-heading cursor-pointer">
                        <BookOpen className="w-3.5 h-3.5" />
                        Terms & Conditions
                      </button>
                    </Link>

                    <Link href="/contact" className="w-full">
                      <button className="w-full flex items-center gap-2 text-left text-[9px] font-black uppercase tracking-widest text-foreground/60 hover:text-primary py-2 px-1 rounded-lg hover:bg-foreground/3 transition-all font-heading cursor-pointer">
                        <MessageSquare className="w-3.5 h-3.5" />
                        Contact Us
                      </button>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 text-left text-[9px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 py-2 px-1 rounded-lg hover:bg-red-500/5 transition-all font-heading border-t border-border/10 pt-3 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Logout
                    </button>
                  </PopoverContent>
                </Popover>
              ) : (
                <button
                  onClick={() => openAuth("login")}
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center sm:hidden text-foreground/40"
                >
                  <User className="w-4 h-4" />
                </button>
              )}

              <div className="hidden sm:flex items-center gap-2">
                {!user && (
                  <button
                    onClick={() => openAuth("login")}
                    className="text-[9px] font-black uppercase tracking-widest text-foreground/40 hover:text-primary px-3 transition-all font-heading cursor-pointer"
                  >
                    Login
                  </button>
                )}

                <Link href="/cart">
                  <div className="relative w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full glass hover:bg-primary hover:text-primary-foreground transition-all group">
                    <ShoppingBag
                      className="w-4 h-4 md:w-5 md:h-5"
                      strokeWidth={2}
                    />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 md:h-5 md:w-5 items-center justify-center rounded-full bg-primary text-[8px] md:text-[10px] font-black text-primary-foreground shadow-lg border-2 border-background">
                        {cartCount}
                      </span>
                    )}
                  </div>
                </Link>

                {!user && (
                  <Button
                    onClick={() => openAuth("signup")}
                    className="hidden md:flex h-12 px-8 rounded-full text-xs font-black tracking-widest uppercase group"
                  >
                    Join Us{" "}
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>

      {hasOpenedAuth && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={(userData) => {
            dispatch(setProfile(userData));
            localStorage.setItem("user", JSON.stringify(userData));
          }}
        />
      )}

      {/* Guest Bottom Sheet */}
      <BottomSheet
        isOpen={isGuestMenuOpen}
        onClose={() => setIsGuestMenuOpen(false)}
      >
        <div className="flex flex-col gap-1.5">
          <div className="pb-3 mb-2 border-b border-border/10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/35">
              Menu
            </h3>
          </div>

          {/* Theme Mode */}
          <button
            onClick={() => {
              toggleTheme();
              setIsGuestMenuOpen(false);
            }}
            className="w-full flex items-center justify-between py-3 px-3 rounded-2xl hover:bg-foreground/5 text-foreground/80 hover:text-primary transition-all duration-200 cursor-pointer group text-left"
          >
            <div className="flex items-center gap-3.5">
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-foreground/45 group-hover:text-primary transition-colors shrink-0" />
              ) : (
                <Moon className="w-4 h-4 text-foreground/45 group-hover:text-primary transition-colors shrink-0" />
              )}
              <span className="text-xs font-bold uppercase tracking-wider">
                Theme Mode
              </span>
            </div>
            <span className="text-[9px] uppercase font-black tracking-widest bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
              {theme === "dark" ? "Dark" : "Light"}
            </span>
          </button>

          {/* About Us */}
          <Link
            href="/about"
            className="w-full"
            onClick={() => setIsGuestMenuOpen(false)}
          >
            <div className="w-full flex items-center gap-3.5 py-3 px-3 rounded-2xl hover:bg-foreground/5 text-foreground/80 hover:text-primary transition-all duration-200 cursor-pointer group">
              <HelpCircle className="w-4 h-4 text-foreground/45 group-hover:text-primary transition-colors shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider">
                About Us
              </span>
            </div>
          </Link>

          {/* Contact Us */}
          <Link
            href="/contact"
            className="w-full"
            onClick={() => setIsGuestMenuOpen(false)}
          >
            <div className="w-full flex items-center gap-3.5 py-3 px-3 rounded-2xl hover:bg-foreground/5 text-foreground/80 hover:text-primary transition-all duration-200 cursor-pointer group">
              <MessageSquare className="w-4 h-4 text-foreground/45 group-hover:text-primary transition-colors shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Contact Support
              </span>
            </div>
          </Link>

          {/* Privacy Policy */}
          <Link
            href="/privacy"
            className="w-full"
            onClick={() => setIsGuestMenuOpen(false)}
          >
            <div className="w-full flex items-center gap-3.5 py-3 px-3 rounded-2xl hover:bg-foreground/5 text-foreground/80 hover:text-primary transition-all duration-200 cursor-pointer group">
              <Lock className="w-4 h-4 text-foreground/45 group-hover:text-primary transition-colors shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Privacy Policy
              </span>
            </div>
          </Link>

          {/* Terms & Conditions */}
          <Link
            href="/terms"
            className="w-full"
            onClick={() => setIsGuestMenuOpen(false)}
          >
            <div className="w-full flex items-center gap-3.5 py-3 px-3 rounded-2xl hover:bg-foreground/5 text-foreground/80 hover:text-primary transition-all duration-200 cursor-pointer group">
              <BookOpen className="w-4 h-4 text-foreground/45 group-hover:text-primary transition-colors shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Terms of Use
              </span>
            </div>
          </Link>

          {/* Login Actions */}
          <div className="flex flex-col gap-2 border-t border-border/10 pt-4 mt-2">
            <button
              onClick={() => {
                setIsGuestMenuOpen(false);
                openAuth("login");
              }}
              className="w-full h-12 rounded-3xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-wider hover:bg-primary/90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99] duration-150"
            >
              <User className="w-4 h-4" />
              Login
            </button>
            <button
              onClick={() => {
                setIsGuestMenuOpen(false);
                openAuth("signup");
              }}
              className="w-full h-12 rounded-3xl border border-primary/20 text-primary font-black text-xs uppercase tracking-wider hover:bg-primary/5 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] duration-150"
            >
              Join Dunches
            </button>
          </div>
        </div>
      </BottomSheet>

      {/* User Bottom Sheet */}
      {user && (
        <BottomSheet
          isOpen={isUserMenuOpen}
          onClose={() => setIsUserMenuOpen(false)}
        >
          <div className="flex flex-col gap-1.5">
            {/* User Profile Info Card */}
            <div className="flex items-center gap-3 pb-4 mb-2 border-b border-border/10">
              <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 flex items-center justify-center bg-foreground/5 border border-border/20">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-4.5 h-4.5 text-foreground/45" />
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-black uppercase tracking-wider text-foreground truncate">
                  {user.name}
                </span>
                <span className="text-[10px] font-medium text-foreground/40 mt-0.5 truncate">
                  {user.email || "craver@makhana.wellness"}
                </span>
              </div>
            </div>

            {/* Profile Dashboard Link */}
            <Link
              href="/profile"
              className="w-full"
              onClick={() => setIsUserMenuOpen(false)}
            >
              <div className="w-full flex items-center gap-3.5 py-3 px-3 rounded-2xl hover:bg-foreground/5 text-foreground/80 hover:text-primary transition-all duration-200 cursor-pointer group">
                <User className="w-4 h-4 text-foreground/45 group-hover:text-primary transition-colors shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Profile Dashboard
                </span>
              </div>
            </Link>

            {/* Theme Mode */}
            <button
              onClick={() => {
                toggleTheme();
                setIsUserMenuOpen(false);
              }}
              className="w-full flex items-center justify-between py-3 px-3 rounded-2xl hover:bg-foreground/5 text-foreground/80 hover:text-primary transition-all duration-200 cursor-pointer group text-left"
            >
              <div className="flex items-center gap-3.5">
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-foreground/45 group-hover:text-primary transition-colors shrink-0" />
                ) : (
                  <Moon className="w-4 h-4 text-foreground/45 group-hover:text-primary transition-colors shrink-0" />
                )}
                <span className="text-xs font-bold uppercase tracking-wider">
                  Theme Mode
                </span>
              </div>
              <span className="text-[9px] uppercase font-black tracking-widest bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                {theme === "dark" ? "Dark" : "Light"}
              </span>
            </button>

            {/* About Us */}
            <Link
              href="/about"
              className="w-full"
              onClick={() => setIsUserMenuOpen(false)}
            >
              <div className="w-full flex items-center gap-3.5 py-3 px-3 rounded-2xl hover:bg-foreground/5 text-foreground/80 hover:text-primary transition-all duration-200 cursor-pointer group">
                <HelpCircle className="w-4 h-4 text-foreground/45 group-hover:text-primary transition-colors shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  About Us
                </span>
              </div>
            </Link>

            {/* Contact Us */}
            <Link
              href="/contact"
              className="w-full"
              onClick={() => setIsUserMenuOpen(false)}
            >
              <div className="w-full flex items-center gap-3.5 py-3 px-3 rounded-2xl hover:bg-foreground/5 text-foreground/80 hover:text-primary transition-all duration-200 cursor-pointer group">
                <MessageSquare className="w-4 h-4 text-foreground/45 group-hover:text-primary transition-colors shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Contact Support
                </span>
              </div>
            </Link>

            {/* Privacy Policy */}
            <Link
              href="/privacy"
              className="w-full"
              onClick={() => setIsUserMenuOpen(false)}
            >
              <div className="w-full flex items-center gap-3.5 py-3 px-3 rounded-2xl hover:bg-foreground/5 text-foreground/80 hover:text-primary transition-all duration-200 cursor-pointer group">
                <Lock className="w-4 h-4 text-foreground/45 group-hover:text-primary transition-colors shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Privacy Policy
                </span>
              </div>
            </Link>

            {/* Terms & Conditions */}
            <Link
              href="/terms"
              className="w-full"
              onClick={() => setIsUserMenuOpen(false)}
            >
              <div className="w-full flex items-center gap-3.5 py-3 px-3 rounded-2xl hover:bg-foreground/5 text-foreground/80 hover:text-primary transition-all duration-200 cursor-pointer group">
                <BookOpen className="w-4 h-4 text-foreground/45 group-hover:text-primary transition-colors shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Terms of Use
                </span>
              </div>
            </Link>

            {/* Logout button */}
            <button
              onClick={() => {
                setIsUserMenuOpen(false);
                handleLogout();
              }}
              className="w-full h-12 rounded-3xl bg-red-500/10 hover:bg-red-500/15 text-red-500 font-black text-xs uppercase tracking-wider transition-all mt-4 cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99] duration-150 border border-red-500/10"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </BottomSheet>
      )}
    </>
  );
}
