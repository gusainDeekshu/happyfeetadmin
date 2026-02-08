import type { ServicePageData } from "../types/service";

/**
 * Maps ServicePage editor data to backend CategoryBase schema
 * Backend model remains UNCHANGED
 */
export function mapServicePageToApi(data: ServicePageData) {
  return {
    // REQUIRED by backend CategoryBase
    title: data.pageTitle,
    slug: data.slug,
    image: extractCoverImage(data) ?? fallbackImage(),
    shortDescription: buildShortDescription(data),

    // Shared structure
    groups: data.groups.map(group => ({
      groupTitle: group.groupTitle,
      items: group.items.map(item => ({
        title: item.title,
        model: item.model,
        description: item.description,
        image: item.image,
        features: item.features ?? [],
      })),
    })),
  };
}

/* ---------------- helpers ---------------- */

function extractCoverImage(data: ServicePageData): string | null {
  for (const group of data.groups) {
    for (const item of group.items) {
      if (item.image && item.image.trim() !== "") {
        return item.image;
      }
    }
  }
  return null;
}

function fallbackImage() {
  // Must exist in /public
  return "/images/placeholders/service-page.jpg";
}

function buildShortDescription(data: ServicePageData) {
  return (
    data.groups?.[0]?.groupTitle ||
    data.pageTitle ||
    "Service Page"
  );
}
