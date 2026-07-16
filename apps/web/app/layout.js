import { Plus_Jakarta_Sans, Lora, Syne } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

export const metadata = {
  title: "Dunches | Fiery Crunch & Spicy Cravings",
  description: "Premium organic roasted lotus seeds and spicy snacks. Fiery flavor for late-night cravings with Dunches.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${lora.variable} ${syne.variable} h-full antialiased transition-colors duration-500`}
    >
      <body suppressHydrationWarning className={`min-h-full flex flex-col font-sans bg-background text-foreground`}>
        <Providers>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
