import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";
import { AuthProvider } from "@/components/auth-provider";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const syne = Syne({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
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
      <body className={`${dmSans.variable} ${syne.variable} antialiased`}>
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="teal"
            themes={["light", "dark", "teal", "teal-dark"]}
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
