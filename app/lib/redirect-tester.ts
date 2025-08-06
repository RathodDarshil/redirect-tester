import { DeviceType, RedirectStep, TestRedirectResponse } from "@/app/types";
import { USER_AGENTS } from "./user-agents";
import { resolveUrl, parseMetaRefresh } from "./utils";

const BLOCKED_IPS = [
    "127.0.0.1",
    "localhost",
    "0.0.0.0",
    "10.0.0.0/8",
    "172.16.0.0/12",
    "192.168.0.0/16",
    "169.254.0.0/16",
    "fc00::/7",
    "::1",
];

function isBlockedIP(hostname: string): boolean {
    return BLOCKED_IPS.some((ip) => hostname.includes(ip));
}

function isInternalUrl(url: string): boolean {
    try {
        const parsedUrl = new URL(url);
        return isBlockedIP(parsedUrl.hostname);
    } catch {
        return false;
    }
}

export async function testRedirectChain(
    url: string,
    device: DeviceType,
    maxRedirects: number = 10,
    timeout: number = 30000
): Promise<TestRedirectResponse> {
    if (isInternalUrl(url)) {
        return {
            success: false,
            error: "Access to internal/private URLs is not allowed for security reasons.",
        };
    }

    const chain: RedirectStep[] = [];
    const visitedUrls = new Set<string>();
    let currentUrl = url;
    let totalTime = 0;
    const warnings: string[] = [];

    try {
        for (let i = 0; i <= maxRedirects; i++) {
            if (visitedUrls.has(currentUrl)) {
                warnings.push("Redirect loop detected");
                return {
                    success: true,
                    data: {
                        chain,
                        finalUrl: currentUrl,
                        totalRedirects: chain.length,
                        totalTime,
                        hasLoop: true,
                        warnings,
                    },
                };
            }

            visitedUrls.add(currentUrl);
            const startTime = Date.now();

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            try {
                const response = await fetch(currentUrl, {
                    method: "GET",
                    headers: USER_AGENTS[device] as unknown as HeadersInit,
                    redirect: "manual",
                    signal: controller.signal,
                });

                clearTimeout(timeoutId);
                const responseTime = Date.now() - startTime;
                totalTime += responseTime;

                const headers: Record<string, string> = {};
                response.headers.forEach((value, key) => {
                    headers[key] = value;
                });

                const isSSL = currentUrl.startsWith("https://");

                const step: RedirectStep = {
                    url: currentUrl,
                    statusCode: response.status,
                    statusText: response.statusText,
                    responseTime,
                    headers,
                    isSSL,
                };

                chain.push(step);

                // Check if this is a redirect
                if (response.status >= 300 && response.status < 400) {
                    const location = response.headers.get("location");
                    if (location) {
                        currentUrl = resolveUrl(currentUrl, location);
                        if (isInternalUrl(currentUrl)) {
                            warnings.push("Redirect to internal/private URL blocked");
                            break;
                        }
                        continue;
                    }
                }

                // Check for meta refresh redirect
                if (response.status === 200) {
                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.includes("text/html")) {
                        try {
                            const text = await response.text();
                            const metaRefresh = parseMetaRefresh(text);
                            if (metaRefresh) {
                                currentUrl = resolveUrl(currentUrl, metaRefresh.url);
                                if (isInternalUrl(currentUrl)) {
                                    warnings.push("Meta refresh to internal/private URL blocked");
                                    break;
                                }
                                warnings.push(`Meta refresh redirect detected (${metaRefresh.delay}s delay)`);
                                continue;
                            }
                        } catch (error) {
                            // Ignore errors in parsing HTML
                        }
                    }
                }

                // If we get here, we've reached the final destination
                break;
            } catch (error: any) {
                if (error.name === "AbortError") {
                    return {
                        success: false,
                        error: `Request timed out after ${timeout / 1000} seconds`,
                    };
                }

                const step: RedirectStep = {
                    url: currentUrl,
                    statusCode: 0,
                    statusText: "Network Error",
                    responseTime: Date.now() - startTime,
                    headers: {},
                    isSSL: currentUrl.startsWith("https://"),
                    error: error.message,
                };

                chain.push(step);
                break;
            }
        }

        if (chain.length > maxRedirects) {
            warnings.push(`Maximum redirect limit (${maxRedirects}) exceeded`);
        }

        return {
            success: true,
            data: {
                chain,
                finalUrl: chain.length > 0 ? chain[chain.length - 1].url : url,
                totalRedirects: Math.max(0, chain.length - 1),
                totalTime,
                hasLoop: false,
                warnings,
            },
        };
    } catch (error: any) {
        return {
            success: false,
            error: error.message || "An unexpected error occurred",
        };
    }
}
