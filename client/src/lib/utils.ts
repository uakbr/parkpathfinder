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

// Default center of the USA as fallback coordinates
const DEFAULT_LAT = 39.8283;
const DEFAULT_LNG = -98.5795;

// Utility to validate and ensure coordinates are safe for Leaflet
export function safeCoordinates(
  lat: string | number | null | undefined, 
  lng: string | number | null | undefined,
  useFallback = false
): [number, number] | null {
  // Early return with default USA center coordinates if fallback is requested
  if (useFallback) {
    return [DEFAULT_LAT, DEFAULT_LNG];
  }
  
  // Check for null or undefined values
  if (lat === null || lat === undefined || lng === null || lng === undefined) {
    console.warn('safeCoordinates received null or undefined input');
    return null;
  }
  
  try {
    // Parse string coordinates to numbers
    const parsedLat = typeof lat === 'string' ? parseFloat(lat) : Number(lat);
    const parsedLng = typeof lng === 'string' ? parseFloat(lng) : Number(lng);
    
    // Check for NaN values
    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      return null;
    }
    
    // Check that values are within valid range for latitude (-90 to 90) and longitude (-180 to 180)
    if (parsedLat < -90 || parsedLat > 90 || parsedLng < -180 || parsedLng > 180) {
      return null;
    }
    
    return [parsedLat, parsedLng];
  } catch (error) {
    console.error('Error in safeCoordinates:', error);
    return null;
  }
}

export function getActivityIcon(activity: string): string {
  return activityIcons[activity] || "bx-question-mark";
}
