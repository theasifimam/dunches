import { Plus_Jakarta_Sans, Lora, Syne } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { StoreProvider } from "@/store/StoreProvider";

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
    title: "Dunches | Admin Panel",
    description: "Dunches Premium Snacking Brand Administrative Console",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
          <body className={`${jakarta.variable} ${lora.variable} ${syne.variable} antialiased font-sans bg-background text-foreground`}>
            <StoreProvider>
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                {children}
                <Toaster position="bottom-right" closeButton/>
              </ThemeProvider>
            </StoreProvider>
          </body>
        </html>
    );
}

