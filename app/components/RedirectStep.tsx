"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight, AlertCircle, CheckCircle, Lock, LockOpen } from "lucide-react";
import { RedirectStep as RedirectStepType } from "@/app/types";
import { CopyButton } from "./CopyButton";
import { cn, getStatusColor, formatResponseTime } from "@/app/lib/utils";

interface RedirectStepProps {
    step: RedirectStepType;
    index: number;
    isLast: boolean;
}

export function RedirectStep({ step, index, isLast }: RedirectStepProps) {
    const [showHeaders, setShowHeaders] = useState(false);
    const statusColor = getStatusColor(step.statusCode);

    return (
        <div className="relative">
            {/* Connection line */}
            {!isLast && <div className="absolute left-6 top-16 w-0.5 h-8 bg-gray-300" />}

            <div className="bg-white border border-gray-200 rounded-lg p-4 transition-all hover:shadow-md">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        {/* Step number and URL */}
                        <div className="flex items-center gap-3 mb-2">
                            <span className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                                {index + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-mono text-gray-900 truncate">{step.url}</h3>
                                    {step.isSSL ? (
                                        <Lock
                                            className="h-4 w-4 text-green-600 flex-shrink-0"
                                            aria-label="Secure HTTPS"
                                        />
                                    ) : (
                                        <LockOpen
                                            className="h-4 w-4 text-gray-400 flex-shrink-0"
                                            aria-label="Insecure HTTP"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Status and response time */}
                        <div className="flex items-center gap-4 ml-15">
                            <div className="flex items-center gap-2">
                                {step.error ? (
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                ) : step.statusCode >= 200 && step.statusCode < 300 ? (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                ) : null}
                                <span className={cn("text-sm font-medium", statusColor)}>
                                    {step.statusCode || "Error"} {step.statusText}
                                </span>
                            </div>
                            <span className="text-sm text-gray-500">{formatResponseTime(step.responseTime)}</span>
                        </div>

                        {/* Error message */}
                        {step.error && <p className="mt-2 ml-15 text-sm text-red-600">{step.error}</p>}

                        {/* Headers toggle */}
                        {Object.keys(step.headers).length > 0 && (
                            <button
                                onClick={() => setShowHeaders(!showHeaders)}
                                className="mt-3 ml-15 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                {showHeaders ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                )}
                                {showHeaders ? "Hide" : "Show"} response headers
                            </button>
                        )}

                        {/* Headers content */}
                        {showHeaders && (
                            <div className="mt-3 ml-15 p-3 bg-gray-50 rounded-md">
                                <pre className="text-xs font-mono text-gray-700 overflow-x-auto">
                                    {Object.entries(step.headers)
                                        .sort(([a], [b]) => a.localeCompare(b))
                                        .map(([key, value]) => (
                                            <div key={key} className="py-0.5">
                                                <span className="text-blue-600">{key}:</span> {value}
                                            </div>
                                        ))}
                                </pre>
                            </div>
                        )}
                    </div>

                    {/* Copy button */}
                    <CopyButton text={step.url} className="flex-shrink-0" />
                </div>
            </div>

            {/* Arrow indicator */}
            {!isLast && (
                <div className="flex justify-center mt-2 mb-2">
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                </div>
            )}
        </div>
    );
}
