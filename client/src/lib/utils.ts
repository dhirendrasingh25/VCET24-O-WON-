/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const rupeeSymbol = "₹";

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export function encryptId(id: string) {
    return btoa(id);
}

export function extractCustomerIdFromUrl(url: string) {
    const parts = url.split("/");
    const customerId = parts[parts.length - 1];

    return customerId;
}