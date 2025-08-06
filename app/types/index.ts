export type DeviceType = "desktop" | "mobile-ios" | "mobile-android" | "tablet-ios" | "tablet-android";

export interface TestRedirectRequest {
    url: string;
    device: DeviceType;
    maxRedirects?: number;
    timeout?: number;
}

export interface RedirectStep {
    url: string;
    statusCode: number;
    statusText: string;
    responseTime: number;
    headers: Record<string, string>;
    isSSL: boolean;
    error?: string;
}

export interface TestRedirectResponse {
    success: boolean;
    data?: {
        chain: RedirectStep[];
        finalUrl: string;
        totalRedirects: number;
        totalTime: number;
        hasLoop: boolean;
        warnings: string[];
    };
    error?: string;
}

export interface AppState {
    url: string;
    device: DeviceType;
    loading: boolean;
    results: TestRedirectResponse | null;
    error: string | null;
    history: TestRedirectResponse[];
}

export interface UserAgentConfig {
    "User-Agent": string;
    Accept: string;
    "Accept-Language": string;
    "Accept-Encoding": string;
    DNT?: string;
    Connection: string;
    "Upgrade-Insecure-Requests"?: string;
    "Sec-CH-UA"?: string;
    "Sec-CH-UA-Mobile"?: string;
    "Sec-CH-UA-Platform"?: string;
}

export type UserAgents = Record<DeviceType, UserAgentConfig>;
