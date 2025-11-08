"use client";
import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { X, CheckCircle, AlertTriangle, XCircle, Loader2 } from "lucide-react";

const AiMatchModal = ({ onClose, jobId }) => {
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);

    // Mock data cho 3 trường hợp
    const getMockResult = () => {
        const mockScenarios = [
            // Trường hợp 1: 0-39% - Không phù hợp
            {
                score: 28,
                reasons: [
                    "Lack of required programming language experience (Python, Java).",
                    "No mention of database management skills (SQL, MongoDB).",
                    "Missing project management experience.",
                    "Educational background doesn't align with job requirements.",
                    "No relevant work experience in the industry.",
                ],
            },
            // Trường hợp 2: 40-69% - Phù hợp một phần
            {
                score: 55,
                reasons: [
                    "Has basic knowledge of required technologies but lacks depth.",
                    "Some relevant projects mentioned but not enough detail.",
                    "Educational background is suitable.",
                    "Missing some key skills like Docker and CI/CD.",
                    "Communication skills need improvement.",
                ],
            },
            // Trường hợp 3: 70-100% - Rất phù hợp
            {
                score: 86,
                reasons: [
                    "Strong match on Python and REST API experience.",
                    "Has knowledge of Django which aligns with the job description.",
                    "Machine learning experience is a plus and was mentioned.",
                    "Overall, a very good fit for this role.",
                    "Excellent communication and teamwork skills demonstrated.",
                ],
            },
        ];

        // Random chọn 1 trong 3 trường hợp
        return mockScenarios[Math.floor(Math.random() * 3)];
    };

    // Auto evaluate khi modal mở
    useEffect(() => {
        const evaluate = async () => {
            setLoading(true);

            // Giả lập độ trễ như gọi API thật
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Mock kết quả
            const mockResult = getMockResult();
            setResult(mockResult);
            setLoading(false);
        };

        evaluate();
    }, []);

    const onCloseModal = () => {
        onClose?.();
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
                label: "Poor Match",
                textColor: "text-red-700",
                buttonColor: "bg-gray-600 hover:bg-gray-700",
                buttonText: "Explore Other Opportunities",
            };
        }
    };

    return (
        <Dialog open={true} onClose={onCloseModal} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl space-y-5 max-h-[85vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <Dialog.Title className="text-lg font-semibold text-blue-600">
                            CV Suitability Assessment
                        </Dialog.Title>
                        <button
                            onClick={onCloseModal}
                            className="text-gray-400 hover:text-gray-600 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                            <p className="text-gray-600 font-medium">
                                Analyzing your CV...
                            </p>
                            <p className="text-sm text-gray-500">
                                This may take a few moments
                            </p>
                        </div>
                    )}

                    {/* Result Section */}
                    {!loading &&
                        result &&
                        (() => {
                            const status = getScoreStatus(result.score);
                            const StatusIcon = status.icon;

                            return (
                                <div
                                    className={`rounded-lg border-2 ${status.borderColor} ${status.bgColor} p-6 space-y-4`}
                                >
                                    {/* Score Display */}
                                    <div className="flex items-center gap-4">
                                        <StatusIcon
                                            className={`w-12 h-12 ${status.color} flex-shrink-0`}
                                        />
                                        <div>
                                            <div className="text-4xl font-bold text-gray-800">
                                                {result.score}%
                                            </div>
                                            <div
                                                className={`text-sm font-medium ${status.textColor}`}
                                            >
                                                {status.label}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Reasons List */}
                                    {Array.isArray(result.reasons) &&
                                        result.reasons.length > 0 && (
                                            <div className="space-y-2">
                                                <h3 className="font-semibold text-gray-800 text-sm">
                                                    Assessment Details:
                                                </h3>
                                                <div className="max-h-64 overflow-y-auto pr-2">
                                                    <ul className="space-y-2">
                                                        {result.reasons.map(
                                                            (r, i) => (
                                                                <li
                                                                    key={i}
                                                                    className="flex gap-2 text-sm text-gray-700"
                                                                >
                                                                    <span className="text-gray-400 font-medium">
                                                                        •
                                                                    </span>
                                                                    <span>
                                                                        {r}
                                                                    </span>
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}

                                    {/* Action Button */}
                                    <div className="pt-2">
                                        <button
                                            className={`w-full px-4 py-2.5 ${status.buttonColor} text-white rounded-lg transition font-medium shadow-sm`}
                                            onClick={() => {
                                                console.log(
                                                    "Button clicked:",
                                                    status.buttonText
                                                );
                                                onCloseModal();
                                            }}
                                        >
                                            {status.buttonText}
                                        </button>
                                    </div>
                                </div>
                            );
                        })()}
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default AiMatchModal;
