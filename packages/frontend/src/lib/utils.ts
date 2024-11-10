import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge two or more strings (for React className props)
 * @param inputs List or array of strings to be merged
 * @returns {string} Merged className string (space delimited)
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

/**
 * Get initials from a full name e.g. Ian Yeoh => IY
 * @param fullName Full name to generate initials
 * @returns {string} Initials from full name
 */
export function initials(fullName: string): string {
    const allNames = fullName.trim().split(" ");
    const initials = allNames.reduce((acc, curr, index) => {
        if (index === 0 || index === allNames.length - 1) {
            acc = `${acc}${curr.charAt(0).toUpperCase()}`;
        }
        return acc;
    }, "");
    return initials;
}
