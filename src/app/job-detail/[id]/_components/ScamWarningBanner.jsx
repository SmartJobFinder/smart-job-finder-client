"use client";
import { AlertTriangle, Shield, Info } from "lucide-react";
import { useEffect } from "react";

export default function ScamWarningBanner({ trustLabel, scamScore }) {
    const isHighRisk = trustLabel === "SUSPICIOUS";
    const isWarning = trustLabel === "WARNING";
    const hasWarning = isHighRisk || isWarning;

    // ✅ THÊM DEBUG LOG
    useEffect(() => {
        console.log("ScamWarningBanner received:", {
            trustLabel,
            scamScore,
            isHighRisk,
            isWarning,
            hasWarning,
        });
    }, [trustLabel, scamScore, isHighRisk, isWarning, hasWarning]);

    if (!hasWarning) {
        console.log("ScamWarningBanner: No warning to display");
        return null;
    }

    return (
        <div
            className={`relative overflow-hidden rounded-xl border-2 ${
                isHighRisk
                    ? "bg-red-50 border-red-300"
                    : "bg-amber-50 border-amber-300"
            } p-6 mb-6 shadow-lg`}
        >
            {/* Watermark Background */}
            <div
                className="absolute right-8 top-1/2 pointer-events-none select-none opacity-[0.08]"
                style={{
                    transform: "translateY(-50%) rotate(-15deg)",
                }}
            >
                <AlertTriangle
                    className={`w-48 h-48 ${
                        isHighRisk ? "text-red-600" : "text-amber-600"
                    }`}
                    strokeWidth={3}
                />
            </div>

            {/* Content */}
            <div className="relative z-10 flex items-start gap-4">
                {/* Icon */}
                <div
                    className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center ${
                        isHighRisk
                            ? "bg-red-100 border-2 border-red-400"
                            : "bg-amber-100 border-2 border-amber-400"
                    }`}
                >
                    <AlertTriangle
                        className={`w-8 h-8 ${
                            isHighRisk ? "text-red-600" : "text-amber-600"
                        }`}
                        strokeWidth={2.5}
                    />
                </div>

                {/* Text Content */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <h3
                            className={`text-xl font-bold ${
                                isHighRisk ? "text-red-800" : "text-amber-800"
                            }`}
                        >
                            {isHighRisk ? "SCAM ALERT" : "CAUTION"}
                        </h3>
                        {scamScore && (
                            <span
                                className={`px-3 py-1 text-xs font-bold rounded-full ${
                                    isHighRisk
                                        ? "bg-red-200 text-red-900"
                                        : "bg-amber-200 text-amber-900"
                                }`}
                            >
                                Risk Score: {Math.round(scamScore * 100)}%
                            </span>
                        )}
                    </div>

                    <p
                        className={`text-[15px] leading-relaxed mb-4 ${
                            isHighRisk ? "text-red-900" : "text-amber-900"
                        }`}
                    >
                        {isHighRisk ? (
                            <>
                                <strong className="font-bold">
                                    This job posting has been flagged as
                                    potentially fraudulent
                                </strong>{" "}
                                by our AI detection system. Please exercise
                                extreme caution before proceeding.
                            </>
                        ) : (
                            <>
                                <strong className="font-bold">
                                    This job posting requires careful
                                    verification
                                </strong>{" "}
                                and has been flagged for review by our AI
                                system.
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}
