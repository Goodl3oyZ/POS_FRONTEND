/**
 * Utility functions for handling image URLs
 */

/**
 * Transforms MinIO URLs from Docker internal hostname to localhost
 * This fixes the issue where browsers can't access Docker internal hostnames
 *
 * @param imageUrl - The original image URL (may contain minio:9000)
 * @returns The transformed URL with localhost:9000
 */
export function transformImageUrl(imageUrl?: string): string | undefined {
  if (!imageUrl) return undefined;

  // Replace minio:9000 with localhost:9000 for browser access
  return imageUrl.replace(/minio:9000/g, "localhost:9000");
}

/**
 * Transforms an array of menu items to have browser-accessible image URLs
 *
 * @param items - Array of menu items with image_url fields
 * @returns Array with transformed image URLs
 */
export function transformMenuItemsImageUrls<T extends { image_url?: string }>(
  items: T[]
): T[] {
  return items.map((item) => ({
    ...item,
    image_url: transformImageUrl(item.image_url),
  }));
}
