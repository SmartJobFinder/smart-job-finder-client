"use client";

import React from "react";
import parse from "html-react-parser";
import {
    Heart,
    Plane,
    GraduationCap,
    Coffee,
    Car,
    Home,
    Shield,
    Zap,
    Users,
    Trophy,
    Clock,
} from "lucide-react";

// CSS styles cho HTML content
const htmlContentStyles = `
    .parse-info-job { 
        font-size: 1rem !important; /* 16px đồng bộ với trang */
        line-height: 1.625 !important; /* gần với leading-relaxed */
    }
    .parse-info-job ul {
        list-style-type: disc !important;
        padding-left: 1.5rem !important;
        margin: 0.5rem 0 !important;
    }
    .parse-info-job li {
        margin: 0.25rem 0 !important;
        display: list-item !important;
    }
    .parse-info-job ol {
        list-style-type: decimal !important;
        padding-left: 1.5rem !important;
        margin: 0.5rem 0 !important;
    }
    .parse-info-job p {
        margin: 0.5rem 0 !important;
    }
    .parse-info-job h1, .parse-info-job h2, .parse-info-job h3, .parse-info-job h4, .parse-info-job h5, .parse-info-job h6 {
        margin: 1rem 0 0.5rem 0 !important;
        font-weight: 600 !important;
        color: #1f2937 !important; /* text-gray-800 */
    }
    .parse-info-job h1 { font-size: 1.5rem !important; }
    .parse-info-job h2 { font-size: 1.25rem !important; }
    .parse-info-job h3 { font-size: 1.125rem !important; }
    .parse-info-job h4 { font-size: 1rem !important; }
    .parse-info-job h5 { font-size: 0.9375rem !important; }
    .parse-info-job h6 { font-size: 0.875rem !important; }
    .parse-info-job strong, .parse-info-job b {
        font-weight: 600 !important;
        color: #111827 !important; /* text-gray-900 */
    }
    .parse-info-job em, .parse-info-job i {
        font-style: italic !important;
    }
    .parse-info-job a {
        color: #2563eb !important; /* text-blue-600 */
        text-decoration: underline !important;
    }
    .parse-info-job a:hover {
        color: #1d4ed8 !important; /* hover:text-blue-700 */
    }
`;

// Icon mapping cho benefits
const benefitIcons = {
    heart: Heart,
    plane: Plane,
    graduation: GraduationCap,
    coffee: Coffee,
    car: Car,
    home: Home,
    shield: Shield,
    zap: Zap,
    users: Users,
    trophy: Trophy,
    clock: Clock,
};

/**
 * Parse benefits JSON string thành array
 */
const parseBenefits = (benefits) => {
    if (!benefits) return [];
    try {
        if (typeof benefits === "string") {
            return JSON.parse(benefits);
        }
        return Array.isArray(benefits) ? benefits : [];
    } catch (error) {
        console.error("Error parsing benefits:", error);
        return [];
    }
};

/**
 * Lấy icon component cho benefit
 */
const getBenefitIcon = (iconType) => {
    const IconComponent = benefitIcons[iconType] || Heart;
    return <IconComponent className="w-5 h-5 text-blue-500" />;
};

/**
 * Component chính để parse và hiển thị job information
 */
const ParseInfoJob = ({
    description,
    requirements,
    benefits,
    showDescription = true,
    showRequirements = true,
    showBenefits = true,
    className = "",
    descriptionTitle = "Job Description",
    requirementsTitle = "Requirements",
    benefitsTitle = "Benefits",
    contentClassName = "text-base",
}) => {
    const parsedBenefits = parseBenefits(benefits);

    return (
        <>
            <style>{htmlContentStyles}</style>
            <div className={`space-y-6 ${className}`}>
                {/* Description */}
                {showDescription && description && (
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {descriptionTitle}
                        </h3>
                        <div
                            className={`${contentClassName} text-gray-700 leading-relaxed parse-info-job`}
                        >
                            {parse(description)}
                        </div>
                    </div>
                )}

                {/* Requirements */}
                {showRequirements && requirements && (
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {requirementsTitle}
                        </h3>
                        <div
                            className={`${contentClassName} text-gray-700 leading-relaxed parse-info-job`}
                        >
                            {parse(requirements)}
                        </div>
                    </div>
                )}

                {/* Benefits */}
                {showBenefits && parsedBenefits.length > 0 && (
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {benefitsTitle}
                        </h3>
                        <div className="space-y-4">
                            {parsedBenefits.map((benefit, index) => (
                                <div
                                    key={benefit.id || index}
                                    className="border border-gray-200 rounded-lg p-4"
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 mt-1">
                                            {getBenefitIcon(benefit.icon)}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-base font-semibold text-gray-900 mb-1">
                                                {benefit.title}
                                            </h4>
                                            <div
                                                className={`${contentClassName} text-gray-700 leading-relaxed parse-info-job`}
                                            >
                                                {parse(benefit.description)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ParseInfoJob;
