export interface Park {
  id: number;
  name: string;
  state: string;
  description: string;
  image_url: string;
  latitude: string;
  longitude: string;
  rating: string;
  review_count: number;
  activities: string[];
  weather: Record<string, MonthlyWeather>;
  highlights: string[];
  best_months: string[];
  monthly_notes: Record<string, string>;
}

export interface MonthlyWeather {
  high: string;
  low: string;
  precipitation: string;
}

export interface Marker {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  state: string;
  rating: string;
  isSelected: boolean;
}

export interface ParkCardProps {
  park: Park;
  isSelected: boolean;
  onClick: () => void;
}

export interface ParkDetailProps {
  park: Park;
  selectedMonth: string;
  onClose: () => void;
}

export interface AIRecommendationResponse {
  recommendation: string;
}

export type Month = 
  | "January" 
  | "February" 
  | "March" 
  | "April" 
  | "May" 
  | "June" 
  | "July" 
  | "August" 
  | "September" 
  | "October" 
  | "November" 
  | "December";

export const monthsArray: Month[] = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

export const monthsShortArray = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
