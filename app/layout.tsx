import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";
import { AuthProvider } from "@/components/auth-provider";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";

import { Toaster } from "@/components/ui/sonner";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://klicktiv.io"),
  title: {
    default: "Klicktiv | Financial Orchestration for Field Service",
    template: "%s | Klicktiv",
  },
  description:
    "Klicktiv is a specialized financial orchestration platform designed for field service businesses. Centralize job reporting, automate commission splits, and track real-time revenue.",
  keywords: [
    "financial orchestration",
    "field service management",
    "commission automation",
    "job reporting",
    "revenue dashboard",
    "HVAC",
    "chimney service",
    "dryer vent service",
  ],
  authors: [{ name: "Klicktiv Team" }],
  creator: "Klicktiv",
  publisher: "Klicktiv",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://klicktiv.io",
    title: "Klicktiv | Financial Orchestration for Field Service",
    description:
      "Klicktiv centralizes job reporting, automates commission splits, and delivers synchronous revenue dashboards for field service businesses.",
    siteName: "Klicktiv",
    images: [
      {
        url: "/klicktiv.io.png",
        width: 1200,
        height: 630,
        alt: "Klicktiv Landing Page",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Klicktiv | Financial Orchestration for Field Service",
    description:
      "Klicktiv centralizes job reporting, automates commission splits, and delivers synchronous revenue dashboards for field service businesses.",
    images: ["/klicktiv.io.png"],
  },
};

const jsonLdGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://klicktiv.io/#organization",
      name: "Klicktiv",
      url: "https://klicktiv.io",
      logo: "https://klicktiv.io/kt_logo_only.png",
    },
    {
      "@type": "WebSite",
      "@id": "https://klicktiv.io/#website",
      url: "https://klicktiv.io",
      name: "Klicktiv",
      publisher: {
        "@id": "https://klicktiv.io/#organization",
      },
      inLanguage: "en-US",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="jsonld-organization"
          type="application/ld+json"
          strategy="beforeInteractive"
          // Structured data to help Google understand the brand entity.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
        />
      </head>
      <body className={`${dmSans.variable} antialiased`}>
        <Analytics />
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
