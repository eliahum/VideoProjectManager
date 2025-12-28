/**
 * Utility functions for date handling
 */

/**
 * Converts a date to UTC format with noon (12:00) time to avoid timezone shifting issues.
 * This ensures the date is stored consistently regardless of user's timezone.
 * 
 * @param date - The date to convert (can be Date object or null)
 * @returns Date object in UTC format with time set to 12:00, or undefined if input is null/undefined
 */
export function convertDateToUTC(date: Date | null | undefined): Date | undefined {
  if (!date) return undefined;
  
  const localDate = new Date(date);
  return new Date(Date.UTC(
    localDate.getFullYear(),
    localDate.getMonth(),
    localDate.getDate(),
    12, 0, 0, 0
  ));
}
