"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Mail,
  Phone,
  MapPin,
  Flame,
  ArrowUpRight,
  Globe,
  MessageCircle,
  Share2,
  Star,
  Clock,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAllRestaurants,
  selectActiveRestaurantIndex,
  setActiveRestaurantIndex,
  selectActiveRestaurant,
} from "@/features/restaurant/restaurantSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Footer() {
  const dispatch = useDispatch();
  const restaurants = useSelector(selectAllRestaurants);
  const activeRestaurantIndex = useSelector(selectActiveRestaurantIndex);
  const activeRestaurant = useSelector(selectActiveRestaurant);
  const pathname = usePathname();

  if (!activeRestaurant) return null;
  if (pathname?.startsWith('/book')) return null;

  return (
    <footer className="bg-background pt-24 sm:pt-40 pb-32 sm:pb-20 relative overflow-hidden text-foreground border-t border-border/50">
      {/* Design System Texture & Lighting */}
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-[0.03]" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/5 blur-[180px] rounded-t-full -z-10" />



      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Cinematic Master CTA - Fixed for Small Screens */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12 sm:gap-16 pb-20 sm:pb-32 border-b border-border mb-20 sm:mb-32">
          <div className="text-left space-y-4 sm:space-y-6 max-w-2xl animate-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">
                Special Updates
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-8xl font-black font-heading tracking-tighter leading-[0.9] lg:leading-none">
              Stay in <br />
              <span className="opacity-30 italic font-serif">the Know.</span>
            </h2>
            <p className="text-foreground/40 font-medium text-base md:text-lg lg:text-xl leading-relaxed">
              Join our private list for exclusive tasting events and seasonal
              reveals.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row w-full lg:w-fit gap-3 sm:gap-0 sm:h-16 lg:h-20 bg-foreground/3 backdrop-blur-xl border border-border/50 rounded-3xl sm:rounded-full p-2 group focus-within:border-primary transition-all">
            <input
              type="email"
              placeholder="YOUR EMAIL"
              className="bg-transparent px-6 sm:px-8 h-14 sm:h-full flex-1 outline-none text-foreground font-black tracking-[0.2em] text-[10px] placeholder:text-foreground/20 text-center sm:text-left"
            />
            <button className="bg-primary hover:bg-foreground hover:text-background text-primary-foreground px-10 h-14 sm:h-full rounded-xl sm:rounded-full font-black tracking-[0.2em] uppercase text-[10px] transition-all flex items-center justify-center gap-2">
              JOIN <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Grid System */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-20 mb-20 md:mb-32">
          <div className="space-y-8 sm:space-y-12">
            <div className="space-y-4">
              <div className="group flex items-center gap-2">
                <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center rotate-6 group-hover:rotate-0 transition-transform shadow-sm">
                  <Flame className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xl font-light tracking-widest text-foreground font-serif lowercase">
                  Dunches
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-foreground/40 text-sm sm:text-base font-medium leading-relaxed italic md:pr-10">
                &quot;Fiery snacks for late-night cravings and bold routines.&quot;
              </p>
              <div className="flex items-center gap-1.5 text-xs text-foreground/40">
                <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                <span className="font-bold text-foreground">
                  {activeRestaurant.rating} / 5.0
                </span>
                <span>Google Rating</span>
              </div>
            </div>
            {/* Socials */}
            {/* Socials */}
            <div className="flex gap-4">
              <a
                href="https://instagram.com/eatdunches"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full glass border border-border/50 flex items-center justify-center text-foreground/40 hover:text-primary transition-all hover:scale-105"
                title="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a
                href="https://fb.com/eatdunches"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full glass border border-border/50 flex items-center justify-center text-foreground/40 hover:text-primary transition-all hover:scale-105"
                title="Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a
                href="mailto:eatdunches@gmail.com"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full glass border border-border/50 flex items-center justify-center text-foreground/40 hover:text-primary transition-all hover:scale-105"
                title="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="space-y-8 sm:space-y-10">
            <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-primary">
              Discover
            </h4>
            <ul className="space-y-3 sm:space-y-4 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-foreground/40">
              <li>
                <Link href="/" className="hover:text-primary transition-all">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/menu"
                  className="hover:text-primary transition-all"
                >
                  Shop Products
                </Link>
              </li>
              <li>
                <Link
                  href="/book"
                  className="hover:text-primary transition-all"
                >
                  Subscribe
                </Link>
              </li>
              <li>
                <Link
                  href="#about"
                  className="hover:text-primary transition-all"
                >
                  Our Story
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-8 sm:space-y-10">
            <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-primary">
              Flavors
            </h4>
            <ul className="space-y-3 sm:space-y-4 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-foreground/40">
              <li>
                <Link
                  href="/menu"
                  className="hover:text-primary transition-all"
                >
                  Himalayan Pink Salt
                </Link>
              </li>
              <li>
                <Link
                  href="/menu"
                  className="hover:text-primary transition-all"
                >
                  Smoked Chili Lime
                </Link>
              </li>
              <li>
                <Link
                  href="/menu"
                  className="hover:text-primary transition-all"
                >
                  Sesame Black Pepper
                </Link>
              </li>
              <li>
                <Link
                  href="/menu"
                  className="hover:text-primary transition-all"
                >
                  Organic Jaggery Fennel
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-8 sm:space-y-12">
            <h4 className="text-[10px] uppercase tracking-[0.4em] font-black text-primary">
              Location & Contact
            </h4>
            <ul className="space-y-5 sm:space-y-6 text-foreground/40 font-medium">
              <li className="flex items-start gap-4 group transition-all hover:text-foreground">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <a
                  href={activeRestaurant.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="uppercase tracking-widest text-[9px] sm:text-[10px] font-black leading-relaxed hover:underline"
                >
                  {activeRestaurant.address}
                </a>
              </li>
              {activeRestaurant.phone_number && (
                <li className="flex items-center gap-4 group transition-all hover:text-foreground text-xs sm:text-sm">
                  <Phone className="w-5 h-5 text-primary" />
                  <a
                    href={`tel:${activeRestaurant.phone_number.replace(/\s+/g, "")}`}
                    className="font-bold tracking-widest uppercase hover:underline"
                  >
                    {activeRestaurant.phone_number}
                  </a>
                </li>
              )}
              <li className="flex items-start gap-4 group transition-all text-xs sm:text-sm">
                <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1 text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                  <span>Hours of Operation</span>
                  <span className="text-foreground/60">
                    {activeRestaurant.opening_hours.Monday}
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div> 
        {/* Global Finale */}
        <div className="pt-16 sm:pt-24 border-t border-border flex flex-col md:flex-row items-center justify-between gap-10 text-[9px] sm:text-[10px] uppercase tracking-[0.5em] text-foreground/20 font-black">
          <div className="flex items-center gap-8 sm:gap-12 flex-wrap justify-center md:justify-start leading-loose">
            <span>
              &copy; {new Date().getFullYear()} {activeRestaurant.name}
            </span>
            <span className="hidden md:block h-1 w-1 bg-border rounded-full" />
            <span>Spicy Snacking</span>
          </div>

          <div className="flex gap-8 sm:gap-12 flex-wrap justify-center md:justify-end">
            <span>PRIVACY POLICY</span>
            <span>TERMS OF SERVICE</span>
          </div>
        </div>

        {/* Epic Underlay Watermark */}
        <div className="mt-16 sm:mt-24 text-[12vw] sm:text-[10vw] leading-none font-black font-heading opacity-[0.02] select-none pointer-events-none text-center uppercase">
          {activeRestaurant.name.split(" ")[0]}
        </div>
      </div>
    </footer>
  );
}
