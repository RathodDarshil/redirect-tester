"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { copyToClipboard } from "@/app/lib/utils";

interface CopyButtonProps {
    text: string;
    className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        const success = await copyToClipboard(text);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={cn(
                "inline-flex items-center justify-center p-2 rounded-md transition-colors",
                "hover:bg-gray-100",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                "group relative",
                className
            )}
            aria-label={copied ? "Copied!" : "Copy to clipboard"}
        >
            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-gray-600" />}

            {/* Tooltip */}
            <span
                className={cn(
                    "absolute -top-8 left-1/2 -translate-x-1/2",
                    "px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded",
                    "pointer-events-none whitespace-nowrap",
                    "opacity-0 group-hover:opacity-100",
                    "transition-opacity duration-200",
                    copied && "opacity-100"
                )}
            >
                {copied ? "Copied!" : "Copy"}
            </span>
        </button>
    );
}
