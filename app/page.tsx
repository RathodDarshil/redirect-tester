"use client";

import React, { useState } from "react";
import { URLInput } from "./components/URLInput";
import { DeviceSelector } from "./components/DeviceSelector";
import { RedirectChain } from "./components/RedirectChain";
import { ResultsSummary } from "./components/ResultsSummary";
import { DeviceType, TestRedirectResponse } from "./types";
import { Link2 } from "lucide-react";

export default function Home() {
    const [url, setUrl] = useState("");
    const [device, setDevice] = useState<DeviceType>("desktop");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<TestRedirectResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleTestUrl = async (testUrl: string) => {
        setUrl(testUrl);
        setLoading(true);
        setError(null);
        setResults(null);

        try {
            const response = await fetch("/api/test-redirect", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    url: testUrl,
                    device,
                }),
            });

            const data: TestRedirectResponse = await response.json();

            if (!response.ok) {
                setError(data.error || "An error occurred while testing the URL");
                return;
            }

            setResults(data);
        } catch (err) {
            setError("Failed to connect to the server. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-3">
                        <Link2 className="h-8 w-8 text-blue-600" />
                        <h1 className="text-2xl font-bold text-gray-900">Redirect Chain Tester</h1>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                        Test and visualize the complete redirect chain for any URL with device simulation
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-8">
                    {/* Input Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
                        <URLInput onSubmit={handleTestUrl} disabled={loading} />

                        <DeviceSelector value={device} onChange={setDevice} disabled={loading} />
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center gap-3">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <p className="text-gray-600">Testing redirect chain...</p>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && !loading && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                            <div className="flex items-start gap-3">
                                <svg className="h-5 w-5 text-red-600 mt-0.5" fill="none" viewBox="0 0 20 20">
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 9v4m0 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <div>
                                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                                    <p className="mt-1 text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Results */}
                    {results && results.success && results.data && !loading && (
                        <>
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold text-gray-900">Redirect Chain</h2>
                                <RedirectChain chain={results.data.chain} />
                            </div>

                            <ResultsSummary results={results} />
                        </>
                    )}

                    {/* Empty State */}
                    {!loading && !error && !results && (
                        <div className="text-center py-12">
                            <Link2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">Enter a URL above to test its redirect chain</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
