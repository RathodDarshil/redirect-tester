"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { isValidUrl } from "@/app/lib/utils";

interface URLInputProps {
    onSubmit: (url: string) => void;
    disabled?: boolean;
    className?: string;
}

export function URLInput({ onSubmit, disabled, className }: URLInputProps) {
    const [url, setUrl] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!url) {
            setError("Please enter a URL");
            return;
        }

        let validatedUrl = url;

        // Add protocol if missing
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            validatedUrl = "https://" + url;
        }

        if (!isValidUrl(validatedUrl)) {
            setError("Please enter a valid URL");
            return;
        }

        setError("");
        onSubmit(validatedUrl);
    };

    return (
        <form onSubmit={handleSubmit} className={cn("w-full", className)}>
            <div className="relative">
                <input
                    type="text"
                    value={url}
                    onChange={(e) => {
                        setUrl(e.target.value);
                        setError("");
                    }}
                    placeholder="Enter URL to test (e.g., example.com)"
                    disabled={disabled}
                    className={cn(
                        "w-full px-4 py-3 pr-12 text-base rounded-lg border transition-colors",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        error ? "border-red-500 focus:ring-red-500" : "border-gray-300",
                        "bg-white",
                        "text-gray-900",
                        "placeholder-gray-500"
                    )}
                    aria-label="URL to test"
                    aria-invalid={!!error}
                    aria-describedby={error ? "url-error" : undefined}
                />
                <button
                    type="submit"
                    disabled={disabled}
                    className={cn(
                        "absolute right-2 top-1/2 -translate-y-1/2",
                        "p-2 rounded-md transition-colors",
                        "hover:bg-gray-100",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500",
                        "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                    aria-label="Test URL"
                >
                    <Search className="h-5 w-5 text-gray-600" />
                </button>
            </div>

            {error && (
                <p id="url-error" className="mt-2 text-sm text-red-600">
                    {error}
                </p>
            )}
        </form>
    );
}
