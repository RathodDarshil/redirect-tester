import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function isValidUrl(urlString: string): boolean {
    try {
        const url = new URL(urlString);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
}

export function getStatusColor(statusCode: number): string {
    if (statusCode >= 200 && statusCode < 300) return "text-green-600";
    if (statusCode >= 300 && statusCode < 400) return "text-blue-600";
    if (statusCode >= 400 && statusCode < 500) return "text-orange-600";
    if (statusCode >= 500) return "text-red-600";
    return "text-gray-600";
}

export function formatResponseTime(ms: number): string {
    if (ms < 1000) {
        return `${ms.toFixed(0)}ms`;
    }
    return `${(ms / 1000).toFixed(2)}s`;
}

export function resolveUrl(base: string, relative: string): string {
    try {
        return new URL(relative, base).href;
    } catch {
        return relative;
    }
}

export function parseMetaRefresh(html: string): { url: string; delay: number } | null {
    const metaRefreshRegex = /<meta[^>]+http-equiv=["']refresh["'][^>]+content=["'](\d+);\s*url=([^"']+)["'][^>]*>/i;
    const match = html.match(metaRefreshRegex);

    if (match) {
        return {
            delay: parseInt(match[1], 10),
            url: match[2].trim(),
        };
    }

    return null;
}

export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        return false;
    }
}
