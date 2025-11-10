"use client";
import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import {
    X,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Loader2,
    ArrowRight,
} from "lucide-react";
import { useGetCombinedProfileQuery } from "@/services/profileService";
import { convertJobToText } from "@/utils/jobToText";
import { convertProfileToText } from "@/utils/profileToText";
import { calculateProfileCompletion } from "@/features/profile/profileCompletion";
import { checkCVMatching } from "@/services/cvMatchingService";
import { toast } from "react-toastify";
import { normalizeProfileData } from "@/features/profile/normalizeProfileData";
import { useRouter } from "next/navigation";

const AiMatchModal = ({ onClose, job }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [profileCompletion, setProfileCompletion] = useState(null);

    // Get combined profile
    const { data: combinedProfile, isLoading: isLoadingProfile } =
        useGetCombinedProfileQuery();

    useEffect(() => {
        const evaluate = async () => {
            if (isLoadingProfile) return;

            console.log("Combined Profile from API:", combinedProfile);

            if (!combinedProfile) {
                setError("Unable to load your profile. Please try again.");
                setLoading(false);
                return;
            }

            // Normalize profile data
            const normalizedProfile = normalizeProfileData(combinedProfile);
            console.log("Normalized Profile:", normalizedProfile);

            // Check profile completion
            const completion = calculateProfileCompletion(normalizedProfile);
            console.log("Profile completion:", completion);
            setProfileCompletion(completion);

            if (completion.percent < 80) {
                setError(
                    `Your profile is only ${completion.percent}% complete. Please complete at least 80% of your profile before using CV matching.`
                );
                setLoading(false);
                toast.error(
                    `Profile completion: ${completion.percent}%. Need 80% to use AI matching.`
                );
                return;
            }

            try {
                setLoading(true);

                // Convert job and profile to text
                const jdText = convertJobToText(job);
                const cvText = convertProfileToText(combinedProfile);

                console.log("JD Text:", jdText);
                console.log("CV Text:", cvText);

                if (!jdText || !cvText) {
                    throw new Error("Failed to convert job or profile data");
                }

                // Call CV Matching API
                const matchResult = await checkCVMatching(jdText, cvText);
                console.log("Match Result:", matchResult);

                // Convert score to percentage (0-1 -> 0-100)
                const scorePercent = Math.round(
                    matchResult.similarityScore * 100
                );

                setResult({
                    score: scorePercent,
                    matchLevel: matchResult.matchLevel,
                    profileCompletion: completion.percent,
                });

                setLoading(false);
            } catch (err) {
                console.error("CV Matching Error:", err);
                setError(err.message || "Failed to check CV matching");
                setLoading(false);
                toast.error("Failed to check CV matching");
            }
        };

        evaluate();
    }, [job, combinedProfile, isLoadingProfile]);

    const onCloseModal = () => {
        onClose?.();
    };

    const handleGoToProfile = () => {
        onCloseModal();
        router.push("/profile");
    };

    // Hàm xác định icon và màu sắc dựa trên điểm số
    const getScoreStatus = (score) => {
        if (score >= 70) {
            return {
                icon: CheckCircle,
                color: "text-green-600",
                bgColor: "bg-green-50",
                borderColor: "border-green-200",
                label: "Excellent Match",
                textColor: "text-green-700",
                buttonColor: "bg-green-600 hover:bg-green-700",
                buttonText: "Proceed to Apply",
            };
        } else if (score >= 40) {
            return {
                icon: AlertTriangle,
                color: "text-yellow-600",
                bgColor: "bg-yellow-50",
                borderColor: "border-yellow-200",
                label: "Partial Match",
                textColor: "text-yellow-700",
                buttonColor: "bg-yellow-600 hover:bg-yellow-700",
                buttonText: "Improve Your CV",
            };
        } else {
            return {
                icon: XCircle,
                color: "text-red-600",
                bgColor: "bg-red-50",
                borderColor: "border-red-200",
                label: "Low Match",
                textColor: "text-red-700",
                buttonColor: "bg-red-600 hover:bg-red-700",
                buttonText: "Update Your Profile",
            };
        }
    };

    const status = result ? getScoreStatus(result.score) : null;

    return (
        <Dialog open={true} onClose={onCloseModal} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-xl shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b">
                        <Dialog.Title className="text-2xl font-bold text-gray-900">
                            AI CV Matching Result
                        </Dialog.Title>
                        <button
                            onClick={onCloseModal}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {loading && (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-4" />
                                <p className="text-gray-600 text-lg">
                                    Analyzing your profile...
                                </p>
                                <p className="text-gray-400 text-sm mt-2">
                                    This may take a few seconds
                                </p>
                            </div>
                        )}

                        {error && (
                            <div className="flex flex-col items-center justify-center py-12">
                                <XCircle className="w-16 h-16 text-red-600 mb-4" />
                                <p className="text-red-600 text-lg font-semibold mb-2">
                                    Profile Incomplete
                                </p>
                                <p className="text-gray-600 text-center max-w-md mb-4">
                                    {error}
                                </p>

                                {/* Missing Sections */}
                                {profileCompletion &&
                                    profileCompletion.missingSections.length >
                                        0 && (
                                        <div className="w-full max-w-md mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                                            <p className="text-sm font-semibold text-orange-800 mb-2">
                                                Missing sections:
                                            </p>
                                            <ul className="space-y-1">
                                                {profileCompletion.missingSections.map(
                                                    (section, index) => (
                                                        <li
                                                            key={index}
                                                            className="text-sm text-orange-700 flex items-center gap-2"
                                                        >
                                                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                                                            <span className="capitalize">
                                                                {section
                                                                    .replace(
                                                                        /([A-Z])/g,
                                                                        " $1"
                                                                    )
                                                                    .trim()}
                                                            </span>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>
                                    )}

                                {/* Profile Completion Bar */}
                                {profileCompletion && (
                                    <div className="w-full max-w-md mb-6">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">
                                                Profile Completion
                                            </span>
                                            <span className="text-sm font-bold text-blue-600">
                                                {profileCompletion.percent}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${profileCompletion.percent}%`,
                                                }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2 text-center">
                                            Need{" "}
                                            {80 - profileCompletion.percent}%
                                            more to use AI matching
                                        </p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-3 w-full max-w-md">
                                    <button
                                        onClick={onCloseModal}
                                        className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={handleGoToProfile}
                                        className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
                                    >
                                        Complete Profile
                                        <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {!loading && !error && result && status && (
                            <div className="space-y-6">
                                {/* Score Display */}
                                <div
                                    className={`${status.bgColor} ${status.borderColor} border-2 rounded-xl p-6`}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <status.icon
                                                className={`${status.color} w-8 h-8`}
                                            />
                                            <span
                                                className={`${status.textColor} text-xl font-bold`}
                                            >
                                                {status.label}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <div
                                                className={`${status.textColor} text-4xl font-bold`}
                                            >
                                                {result.score}%
                                            </div>
                                            <div className="text-gray-600 text-sm">
                                                Match Score
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className={`h-3 rounded-full transition-all duration-500 ${
                                                result.score >= 70
                                                    ? "bg-green-600"
                                                    : result.score >= 40
                                                    ? "bg-yellow-600"
                                                    : "bg-red-600"
                                            }`}
                                            style={{
                                                width: `${result.score}%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Profile Completion Info */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-blue-900 font-semibold mb-1">
                                        Profile Completion:{" "}
                                        {result.profileCompletion}%
                                    </p>
                                    <p className="text-blue-700 text-sm">
                                        {result.matchLevel}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={onCloseModal}
                                        className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (result.score >= 70) {
                                                toast.success(
                                                    "Ready to apply!"
                                                );
                                                onCloseModal();
                                            } else {
                                                handleGoToProfile();
                                            }
                                        }}
                                        className={`flex-1 px-6 py-3 ${status.buttonColor} text-white rounded-lg transition-colors font-medium`}
                                    >
                                        {status.buttonText}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default AiMatchModal;
