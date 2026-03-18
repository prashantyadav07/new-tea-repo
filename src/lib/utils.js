import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getOptimizedCloudinaryUrl(url) {
  return url; // Returning raw URL for "pure" quality per user request
}
