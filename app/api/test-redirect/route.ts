import { NextRequest, NextResponse } from "next/server";
import { testRedirectChain } from "@/app/lib/redirect-tester";
import { TestRedirectRequest } from "@/app/types";
import { isValidUrl } from "@/app/lib/utils";

// Rate limiting map (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // 10 requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const userLimit = rateLimitMap.get(ip);

    if (!userLimit || now > userLimit.resetTime) {
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return true;
    }

    if (userLimit.count >= RATE_LIMIT) {
        return false;
    }

    userLimit.count++;
    return true;
}

export async function POST(request: NextRequest) {
    try {
        // Get client IP for rate limiting
        const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";

        // Check rate limit
        if (!checkRateLimit(ip)) {
            return NextResponse.json(
                { success: false, error: "Rate limit exceeded. Please try again later." },
                { status: 429 }
            );
        }

        // Parse request body
        const body: TestRedirectRequest = await request.json();

        // Validate request
        if (!body.url) {
            return NextResponse.json({ success: false, error: "URL is required" }, { status: 400 });
        }

        if (!isValidUrl(body.url)) {
            return NextResponse.json(
                { success: false, error: "Invalid URL format. Please enter a valid HTTP or HTTPS URL." },
                { status: 400 }
            );
        }

        if (!["desktop", "mobile-ios", "mobile-android", "tablet-ios", "tablet-android"].includes(body.device)) {
            return NextResponse.json({ success: false, error: "Invalid device type" }, { status: 400 });
        }

        // Set defaults
        const maxRedirects = body.maxRedirects || 10;
        const timeout = body.timeout || 30000;

        // Validate limits
        if (maxRedirects < 0 || maxRedirects > 20) {
            return NextResponse.json(
                { success: false, error: "Max redirects must be between 0 and 20" },
                { status: 400 }
            );
        }

        if (timeout < 1000 || timeout > 60000) {
            return NextResponse.json(
                { success: false, error: "Timeout must be between 1 and 60 seconds" },
                { status: 400 }
            );
        }

        // Test the redirect chain
        const result = await testRedirectChain(body.url, body.device, maxRedirects, timeout);

        // Return appropriate status code based on result
        if (!result.success) {
            return NextResponse.json(result, { status: 400 });
        }

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Error in test-redirect API:", error);
        return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
    }
}

// Clean up old rate limit entries periodically
if (typeof global !== "undefined" && !(global as any).rateLimitCleanupInterval) {
    (global as any).rateLimitCleanupInterval = setInterval(() => {
        const now = Date.now();
        for (const [ip, limit] of rateLimitMap.entries()) {
            if (now > limit.resetTime) {
                rateLimitMap.delete(ip);
            }
        }
    }, RATE_LIMIT_WINDOW);
}
