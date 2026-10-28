import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NYC Airbnb Room Type Predictor | Random Forest ML Pipeline",
  description:
    "Production Machine Learning classifier predicting NYC Airbnb room types (Entire home/apt, Private room, Shared room) using tuned Random Forest pipeline and FastAPI backend.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  keywords: [
    "NYC Airbnb",
    "Machine Learning",
    "Random Forest",
    "Room Type Classifier",
    "FastAPI",
    "Scikit-Learn",
    "Next.js",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#05070E",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} dark antialiased h-full`}
    >
      <body className="min-h-full flex flex-col bg-dark-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
