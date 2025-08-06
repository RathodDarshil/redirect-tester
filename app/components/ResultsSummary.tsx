"use client";

import React from "react";
import { Clock, Link, AlertTriangle, CheckCircle2 } from "lucide-react";
import { TestRedirectResponse, DeviceType } from "@/app/types";
import { CopyButton } from "./CopyButton";
import { formatResponseTime } from "@/app/lib/utils";
import { cn } from "@/app/lib/utils";

interface ResultsSummaryProps {
    results: TestRedirectResponse;
    device?: DeviceType;
}

export function ResultsSummary({ results }: ResultsSummaryProps) {
    if (!results.success || !results.data) {
        return null;
    }

    const { data } = results;
    const hasWarnings = data.warnings.length > 0;

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Summary</h2>

            {/* Final URL */}
            <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 mb-1">Final Destination</p>
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-mono text-gray-900 truncate">{data.finalUrl}</p>
                        <CopyButton text={data.finalUrl} />
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                    <Link className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-medium text-gray-700">Total Redirects</p>
                        <p className="text-lg font-semibold text-gray-900">{data.totalRedirects}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-medium text-gray-700">Total Time</p>
                        <p className="text-lg font-semibold text-gray-900">{formatResponseTime(data.totalTime)}</p>
                    </div>
                </div>
            </div>

            {/* Warnings */}
            {hasWarnings && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="text-sm font-medium text-yellow-800 mb-2">Warnings</h3>
                            <ul className="space-y-1">
                                {data.warnings.map((warning, index) => (
                                    <li key={index} className="text-sm text-yellow-700">
                                        • {warning}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Loop detected */}
            {data.hasLoop && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="text-sm font-medium text-red-800">Redirect Loop Detected</h3>
                            <p className="text-sm text-red-700 mt-1">
                                The URL redirects back to itself, creating an infinite loop.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
