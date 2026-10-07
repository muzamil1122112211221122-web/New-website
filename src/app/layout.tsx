import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond, Josefin_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import LoadingScreen from "@/components/LoadingScreen";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

// Josefin Sans — elegant, geometric, thin — best free Optima alternative
const josefin = Josefin_Sans({
  subsets: ["latin"],
  variable: "--font-josefin",
  weight: ["100", "200", "300", "400"],
  display: "swap",
});

import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "IJC – Ijaz Casting & Jewellery Centre",
  description: "Pakistan's finest jewellery craftsmanship since decades. Custom rings, necklaces, bracelets and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${cormorant.variable} ${josefin.variable}`}>
      <body className="bg-[#EFE9E1] text-[#2c1810] antialiased flex flex-col min-h-screen">
        <CartProvider>
          <LoadingScreen />
          <SmoothScrollProvider>
            <PageTransition>{children}</PageTransition>
          </SmoothScrollProvider>
        </CartProvider>
      </body>
    </html>
  );
}
