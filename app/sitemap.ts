import type { MetadataRoute } from "next";
import { LOCALES } from "@/lib/i18n";
import { SITE_URL, TOOLS } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/about", "/privacy", "/terms", "/contact"];
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const path of staticPages) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: path === "" ? 1 : 0.5,
      });
    }
    for (const tool of TOOLS) {
      entries.push({
        url: `${SITE_URL}/${locale}/${tool.slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.9,
      });
    }
  }

  return entries;
}
