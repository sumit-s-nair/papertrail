import type { Metadata } from "next";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "../stack/client";
import { TRPCProvider } from "@/components/providers/trpc-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Papertrail - Multi-User Blogging Platform",
    template: "%s | Papertrail"
  },
  description: "Create, edit, and manage blog posts with category management. A modern blogging platform built with Next.js, tRPC, and PostgreSQL.",
  keywords: ["blog", "blogging platform", "Next.js", "tRPC", "PostgreSQL", "markdown", "content management"],
  authors: [{ name: "Sumit S Nair" }],
  creator: "Sumit S Nair",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://papertrail-chi.vercel.app",
    title: "Papertrail - Multi-User Blogging Platform",
    description: "Create, edit, and manage blog posts with category management",
    siteName: "Papertrail",
  },
  twitter: {
    card: "summary_large_image",
    title: "Papertrail - Multi-User Blogging Platform",
    description: "Create, edit, and manage blog posts with category management",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCProvider>
            <StackProvider app={stackClientApp}>
              <StackTheme>
                {children}
                <Toaster />
              </StackTheme>
            </StackProvider>
          </TRPCProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
