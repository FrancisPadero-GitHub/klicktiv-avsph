import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";
import { AuthProvider } from "@/components/auth-provider";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Klicktiv",
  description:
    "Klicktiv is a specialized financial orchestration platform designed for field service businesses.",
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
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            themes={["light", "dark", "caffeine_light", "caffeine_dark"]}
            disableTransitionOnChange
          >
            <AuthProvider>{children}</AuthProvider>
            <Toaster />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
