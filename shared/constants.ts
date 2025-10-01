/**
 * Shared constants used across client and server
 */

export const VALID_MONTHS = [
  "January", 
  "February", 
  "March", 
  "April", 
  "May", 
  "June", 
  "July", 
  "August", 
  "September", 
  "October", 
  "November", 
  "December"
] as const;

export type Month = typeof VALID_MONTHS[number];
