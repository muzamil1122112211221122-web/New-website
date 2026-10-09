import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import LoadingScreen from "@/components/LoadingScreen";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "IC – Ijaz Casting & Jewellery Centre",
  description: "Pakistan's finest jewellery craftsmanship since decades. Custom rings, necklaces, bangles and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@100;200;300;400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap" rel="stylesheet" />
        {/* Preload hero video so it's ready before LoadingScreen hides */}
        <link rel="preload" href="/upscaled-video.mp4" as="video" type="video/mp4" />
      </head>
      <body className="bg-[#ffffff] text-[#2c1810] antialiased flex flex-col min-h-screen">
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
