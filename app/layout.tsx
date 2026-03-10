import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Masked Euphoria - Prom Night",
  description: "Register for the biggest college prom night: Masked Euphoria. Where mystery meets elegance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased text-white`}
      >
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
           {/* Subtle particle/mask background placeholders directly in CSS layout */}
           <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
           <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <main className="min-h-screen flex flex-col items-center pt-8 pb-16 px-4 sm:px-8">
          {children}
        </main>
      </body>
    </html>
  );
}
