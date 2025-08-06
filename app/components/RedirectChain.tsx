"use client";

import React from "react";
import { RedirectStep as RedirectStepType } from "@/app/types";
import { RedirectStep } from "./RedirectStep";

interface RedirectChainProps {
    chain: RedirectStepType[];
}

export function RedirectChain({ chain }: RedirectChainProps) {
    if (chain.length === 0) {
        return null;
    }

    return (
        <div className="space-y-1">
            {chain.map((step, index) => (
                <RedirectStep
                    key={`${step.url}-${index}`}
                    step={step}
                    index={index}
                    isLast={index === chain.length - 1}
                />
            ))}
        </div>
    );
}
