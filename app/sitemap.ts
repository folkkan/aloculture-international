import type { MetadataRoute } from "next";
import { getPlants } from "@/lib/airtable";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.netlify.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const plants = await getPlants();
  const now = new Date();

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    ...plants.map((p) => ({
      url: `${SITE_URL}/plants/${p.id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
