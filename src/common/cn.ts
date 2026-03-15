/**
 * Utility for conditionally joining class names using clsx and tailwind-merge.
 * Ensures Tailwind classes are merged correctly without conflicts.
 */
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
