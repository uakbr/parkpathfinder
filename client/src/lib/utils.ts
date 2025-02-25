import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCurrentMonth(): string {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const date = new Date();
  return months[date.getMonth()];
}

export function formatNumberWithCommas(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const activityIcons: Record<string, string> = {
  "Hiking": "bx-walk",
  "Photography": "bx-camera",
  "Waterfalls": "bx-water",
  "Biking": "bx-cycling",
  "Camping": "bx-bowl-hot",
  "Scenic Views": "bx-landscape",
  "Wildlife Viewing": "bx-bug",
  "Fishing": "bx-hook",
  "Canyoneering": "bx-terrain",
  "Rock Climbing": "bx-trending-up",
  "Bird Watching": "bx-eagle",
  "Wildflowers": "bx-spa",
  "Stargazing": "bx-star",
  "Scenic Drives": "bx-car",
  "Rock Formations": "bx-cube",
  "Rafting": "bx-ship",
};

export const weatherIcons: Record<string, string> = {
  high: "bx-sun",
  low: "bx-moon",
  precipitation: "bx-cloud-rain",
};

export function getMapCenter(): { lat: number; lng: number } {
  return { lat: 39.8283, lng: -98.5795 }; // Center of the US
}

export function getMapZoom(): number {
  return 4; // Default zoom level for US view
}

export function getActivityIcon(activity: string): string {
  return activityIcons[activity] || "bx-question-mark";
}
