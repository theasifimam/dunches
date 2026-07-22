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
  Search,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { selectCartCount } from "@/features/cart/cartSlice";
import { selectActiveRestaurant } from "@/features/restaurant/restaurantSlice";
import {
  selectUser,
  logoutUser,
  setProfile,
  fetchProfile,
  setLogoutConfirmOpen,
  selectIsLogoutConfirmOpen,
} from "@/features/user/userSlice";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import GuestMenuPopover from "./navbar/GuestMenuPopover";
import UserMenuPopover from "./navbar/UserMenuPopover";
import GuestMenuSheet from "./navbar/GuestMenuSheet";
import UserMenuSheet from "./navbar/UserMenuSheet";
import LogoutConfirmModal from "./navbar/LogoutConfirmModal";

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
  const router = useRouter();
  const isLogoutConfirmOpen = useSelector(selectIsLogoutConfirmOpen);

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

      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          dispatch(setProfile(JSON.parse(savedUser)));
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
    dispatch(setLogoutConfirmOpen(true));
  };

  const handleConfirmLogout = async () => {
    await dispatch(logoutUser());
    dispatch(setLogoutConfirmOpen(false));
    if (pathname && pathname.startsWith("/profile")) {
      router.push("/");
    }
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

          {/* Actions */}
          <div className="flex items-center gap-1.5 md:gap-2">
            {/* Mobile Search Link */}
            <Link href="/explore" className="md:hidden">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-foreground/45 hover:text-primary bg-foreground/5 active:scale-95 transition-all cursor-pointer shrink-0">
                <Search className="w-4 h-4" />
              </div>
            </Link>

            {/* Guest Popover */}
            {!user && (
              <GuestMenuPopover theme={theme} toggleTheme={toggleTheme} />
            )}

            {/* Mobile Guest Menu Button */}
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
                <UserMenuPopover
                  user={user}
                  avatarSrc={avatarSrc}
                  theme={theme}
                  toggleTheme={toggleTheme}
                  handleLogout={handleLogout}
                />
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

      <GuestMenuSheet
        isOpen={isGuestMenuOpen}
        onClose={() => setIsGuestMenuOpen(false)}
        theme={theme}
        toggleTheme={toggleTheme}
        openAuth={openAuth}
      />

      <UserMenuSheet
        isOpen={isUserMenuOpen}
        onClose={() => setIsUserMenuOpen(false)}
        user={user}
        avatarSrc={avatarSrc}
        theme={theme}
        toggleTheme={toggleTheme}
        handleLogout={handleLogout}
      />

      <LogoutConfirmModal
        isOpen={isLogoutConfirmOpen}
        onClose={() => dispatch(setLogoutConfirmOpen(false))}
        onConfirmLogout={handleConfirmLogout}
      />
    </>
  );
}
