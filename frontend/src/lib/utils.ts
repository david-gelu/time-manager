import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalizeCalendarValue(value: any) {
  if (!value) return null;

  if (value instanceof Date) return value;

  if (Array.isArray(value)) {
    const filtered = value.filter((v): v is Date => v instanceof Date && v !== null);
    if (filtered.length === 0) return null;
    if (filtered.length === 1) return filtered[0];
    return filtered;
  }

  return null;
}

