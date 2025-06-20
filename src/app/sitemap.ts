import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://max-worth.vercel.app",
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: "https://max-worth.vercel.app/new-pairs",
      lastModified: new Date(),
      priority: 0.8,
    },
  ];
}
