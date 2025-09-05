import "@repo/ui/styles.css";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "BySkies - Your plans, guided by skies",
  description:
    "More than weather. Get intelligent activity suggestions based on real-time sky conditions, so you always know the perfect time for your plans.",
  keywords:
    "weather, activity suggestions, outdoor planning, sky conditions, weather app",
  authors: [{ name: "BySkies Team" }],
  creator: "BySkies",
  openGraph: {
    title: "BySkies - Your plans, guided by skies",
    description:
      "Get intelligent activity suggestions based on real-time sky conditions",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "BySkies - Your plans, guided by skies",
    description:
      "Get intelligent activity suggestions based on real-time sky conditions",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body
        className={`${inter.className} transition-colors duration-700 animate-fade-in-top antialiased`}
      >
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-sky-600 text-white px-4 py-2 rounded-lg z-50"
        >
          Skip to main content
        </a>

        {/* Background gradient that spans entire app */}
        <div className="fixed inset-0 bg-gradient-to-br from-sky-50 via-slate-50 to-sky-50 -z-10" />

        <main id="main-content" className="relative z-10">
          <AppProviders>
            {children}
          </AppProviders>
        </main>
      </body>
    </html>
  );
}
