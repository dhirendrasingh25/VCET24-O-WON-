import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const rupeeSymbol = "₹";

export const parseStringify = (value: unknown): unknown => JSON.parse(JSON.stringify(value));