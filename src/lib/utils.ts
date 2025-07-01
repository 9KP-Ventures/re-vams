import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function obfuscateName(name: string): string {
  if (!name) return name;

  const trimmedName = name.trim();
  const words = trimmedName.split(/\s+/);

  if (words.length >= 2) {
    // Multiple words: obfuscate each word separately
    return words
      .map(word => {
        if (word.length <= 3) {
          return word.charAt(0);
        }

        const firstTwo = word.slice(0, 2);
        const lastOne = word.slice(-1);
        const middleLength = word.length - 3;

        return `${firstTwo}${"•".repeat(middleLength)}${lastOne}`;
      })
      .join(" ");
  } else {
    // Single word
    if (trimmedName.length <= 3) {
      return trimmedName.charAt(0);
    }

    const firstTwo = trimmedName.slice(0, 2);
    const lastOne = trimmedName.slice(-1);
    const middleLength = trimmedName.length - 3;

    return `${firstTwo}${"•".repeat(middleLength)}${lastOne}`;
  }
}

export function capitalizeName(name: string): string {
  if (!name) return name;

  return name
    .trim()
    .split(/\s+/) // Split by any whitespace
    .map(word => {
      if (word.length === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}
