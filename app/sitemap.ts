import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://klicktiv.io";

  // Public pages that should be indexed
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    // Add other public landing pages here if they exist
    // e.g., features, pricing, etc.
  ];
}
