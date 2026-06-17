import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Taskers - Find Verified AI Trainers, Annotators & RLHF Specialists",
  description: "The largest verified AI training talent directory. Connect directly with verified AI trainers, data annotators, and RLHF specialists worldwide. No middlemen, no fees, no disputes.",
  keywords: [
    "AI trainers", "data annotators", "RLHF", "Outlier", "Handshake", "RWS",
    "Alignerr", "Appen", "UHRS", "Scale AI", "DataAnnotation",
    "AI training", "machine learning", "talent directory", "verified taskers",
  ],
  authors: [{ name: "AI Taskers" }],
  manifest: "/manifest.json",
  applicationName: "AI Taskers",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AI Taskers",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "AI Taskers - Verified AI Training Talent Directory",
    description: "Find verified AI trainers, data annotators, and RLHF specialists worldwide. No middlemen, no fees, no disputes.",
    siteName: "AI Taskers",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Taskers - Verified AI Training Talent Directory",
    description: "Find verified AI trainers, data annotators, and RLHF specialists worldwide.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1E2A5E" },
    { media: "(prefers-color-scheme: dark)", color: "#00C2D1" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AI Taskers" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('[PWA] SW registered:', registration.scope);
                  }).catch(function(err) {
                    console.warn('[PWA] SW registration failed:', err);
                  });
                });
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <SonnerToaster />
      </body>
    </html>
  );
}
