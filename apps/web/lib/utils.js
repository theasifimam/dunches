import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Phone-login users get a system-generated dummy email like:
 *   user_919876543210@dunches.com
 * These should never be displayed as the user's email.
 */
export function isRealEmail(email) {
  if (!email) return false;
  if (/^user_\d+@dunches\.com$/.test(email)) return false;
  return true;
}

