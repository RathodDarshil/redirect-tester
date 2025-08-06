"use client";

import React from "react";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import { DeviceType } from "@/app/types";
import { cn } from "@/app/lib/utils";

interface DeviceSelectorProps {
    value: DeviceType;
    onChange: (device: DeviceType) => void;
    disabled?: boolean;
    className?: string;
}

const deviceOptions = [
    { value: "desktop" as DeviceType, label: "Desktop", icon: Monitor, category: "Desktop" },
    { value: "mobile-ios" as DeviceType, label: "iPhone (iOS)", icon: Smartphone, category: "Mobile" },
    { value: "mobile-android" as DeviceType, label: "Android Phone", icon: Smartphone, category: "Mobile" },
    { value: "tablet-ios" as DeviceType, label: "iPad (iOS)", icon: Tablet, category: "Tablet" },
    { value: "tablet-android" as DeviceType, label: "Android Tablet", icon: Tablet, category: "Tablet" },
];

export function DeviceSelector({ value, onChange, disabled, className }: DeviceSelectorProps) {
    const selectedOption = deviceOptions.find((opt) => opt.value === value);

    return (
        <div className={cn("relative", className)}>
            <label htmlFor="device-select" className="block text-sm font-medium text-gray-700 mb-2">
                Device Type
            </label>
            <div className="relative">
                <select
                    id="device-select"
                    value={value}
                    onChange={(e) => onChange(e.target.value as DeviceType)}
                    disabled={disabled}
                    className={cn(
                        "w-full pl-10 pr-4 py-3 text-base rounded-lg border transition-colors appearance-none cursor-pointer",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "border-gray-300",
                        "bg-white",
                        "text-gray-900"
                    )}
                    aria-label="Select device type"
                >
                    <optgroup label="Desktop">
                        <option value="desktop">Desktop (Windows/Mac/Linux)</option>
                    </optgroup>
                    <optgroup label="Mobile">
                        <option value="mobile-ios">iPhone (iOS)</option>
                        <option value="mobile-android">Android Phone</option>
                    </optgroup>
                    <optgroup label="Tablet">
                        <option value="tablet-ios">iPad (iOS)</option>
                        <option value="tablet-android">Android Tablet</option>
                    </optgroup>
                </select>

                {/* Icon */}
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    {selectedOption?.icon &&
                        React.createElement(selectedOption.icon, {
                            className: "h-5 w-5 text-gray-500",
                        })}
                </div>

                {/* Dropdown arrow */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 20 20">
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M6 8l4 4 4-4"
                        />
                    </svg>
                </div>
            </div>

            {/* Helper text showing current User-Agent */}
            {selectedOption && (
                <p className="mt-2 text-xs text-gray-500">
                    {selectedOption.category === "Desktop" && "Simulating desktop browser"}
                    {selectedOption.category === "Mobile" && `Simulating ${selectedOption.label}`}
                    {selectedOption.category === "Tablet" && `Simulating ${selectedOption.label}`}
                </p>
            )}
        </div>
    );
}
