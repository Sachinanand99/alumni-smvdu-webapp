import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {month: "long", day: "numeric", year:"numeric"})
}

export function  parseServerActionResponse<T>(response: T){
  return JSON.parse(JSON.stringify(response));
}

// -1 not exist 0 past 1 ongoing 2 upcoming
export function eventStatus(start: Date, end: Date){
  const now = new Date();
  return !start || !end
     ? -1
     : now < start
        ? 2
        : now <= end
           ? 1
           : 0;
}

export const isEventAdmin = (email: string | undefined | null): boolean => {
  if (!email) return false;
  const admins = process.env.EVENTS_ADMIN?.split(",").map(e => e.trim().toLowerCase()) || [];
  return admins.includes(email.toLowerCase());
};
