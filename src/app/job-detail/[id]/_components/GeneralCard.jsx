"use client";
import { Calendar, DollarSign, Shield, AlertTriangle } from "lucide-react";
import { formatDateDMY } from "../_utils/formatters";
import { t } from "@/i18n/i18n";

export default function GeneralCard({
    salary,
    postDate,
    expiredDate,
    trustLabel,
    scamScore,
}) {
    const isHighRisk = trustLabel === "SUSPICIOUS";
    const isWarning = trustLabel === "WARNING";
    const isVerified = trustLabel === "VERIFIED";
    const isNormal = trustLabel === "NORMAL";
    const hasWarning = isHighRisk || isWarning;
    const hasTrustInfo = Boolean(trustLabel);

    const trustText = (() => {
        if (isVerified) return t`Verified`;
        if (isHighRisk) return t`High risk`;
        if (isWarning) return t`Warning`;
        if (isNormal) return t`Normal`;
        return t`Unknown`;
    })();

    const trustIconBg = isVerified
        ? "bg-green-50"
        : hasWarning
        ? "bg-red-50"
        : isNormal
        ? "bg-emerald-50"
        : "bg-gray-50";

    const trustTextColor = isVerified
        ? "text-green-600"
        : isHighRisk
        ? "text-red-600"
        : isWarning
        ? "text-amber-600"
        : isNormal
        ? "text-emerald-600"
        : "text-gray-900";

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                {t`General`}
            </h2>

            <div className="space-y-4">
                {/* Salary */}
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                        <DollarSign className="text-green-600" size={20} />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">{t`Salary:`}</p>
                        <p className="text-base font-semibold text-gray-900">
                            {salary || t`N/A`}
                        </p>
                    </div>
                </div>

                {/* Post Date */}
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Calendar className="text-blue-600" size={20} />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">{t`Post Date:`}</p>
                        <p className="text-base font-semibold text-gray-900">
                            {formatDateDMY(postDate)}
                        </p>
                    </div>
                </div>

                {/* Expired Date */}
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                        <Calendar className="text-red-600" size={20} />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">{t`Expired Date:`}</p>
                        <p className="text-base font-semibold text-gray-900">
                            {formatDateDMY(expiredDate)}
                        </p>
                    </div>
                </div>

                {/* ✅ THÊM TRUST STATUS */}
                {hasTrustInfo && (
                    <div className="flex items-start gap-3 pt-2 border-t border-gray-200">
                        <div
                            className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${trustIconBg}`}
                        >
                            {isVerified ? (
                                <Shield className="text-green-600" size={20} />
                            ) : (
                                <AlertTriangle
                                    className={
                                        hasWarning
                                            ? "text-red-600"
                                            : isNormal
                                            ? "text-emerald-600"
                                            : "text-gray-600"
                                    }
                                    size={20}
                                />
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-500 mb-1">{t`Trust Status:`}</p>
                            <div className="flex items-center gap-2">
                                <p
                                    className={`text-base font-semibold ${trustTextColor}`}
                                >
                                    {trustText}
                                </p>
                                {scamScore !== null &&
                                    scamScore !== undefined &&
                                    !Number.isNaN(Number(scamScore)) && (
                                        <span className="text-xs text-gray-500">
                                            (
                                            {Math.round(
                                                Number(scamScore) * 100
                                            )}
                                            %)
                                        </span>
                                    )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
