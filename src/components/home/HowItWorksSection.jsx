"use client";

import React from "react";
import { Search, Send, Upload, UserPlus } from "lucide-react";
import { t } from "@/i18n/i18n";

const HowItWorksSection = () => {
    const steps = [
        {
            icon: UserPlus,
            title: t`Create account`,
            description: t`Sign up in just a few steps and start your journey toward a brighter career.`,
        },
        {
            icon: Upload,
            title: t`Upload CV/Resume`,
            description: t`Add your resume to help employers understand your skills and experience.`,
        },
        {
            icon: Search,
            title: t`Find suitable job`,
            description: t`Browse through thousands of job listings tailored to your profile and interests.`,
        },
        {
            icon: Send,
            title: t`Apply job`,
            description: t`Submit your application with one click and get ready for new opportunities.`,
        },
    ];

    return (
        <section className="py-8 sm:py-12 lg:py-16">
            <div className="container px-2 mx-auto sm:px-4">
                <div className="mb-8 text-center sm:mb-12">
                    <h2 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
                        {t`How JobHuntly work`}
                    </h2>
                </div>

                <div className="relative">
                    <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-4">
                        {steps.map((step, index) => (
                            <div key={index} className="relative text-center">
                                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-white rounded-full shadow-lg sm:w-14 sm:h-14 lg:w-16 lg:h-16 sm:mb-4">
                                    <step.icon
                                        className={`h-5 w-5 sm:h-6 lg:h-8 sm:w-6 lg:w-8 ${
                                            index === 1
                                                ? "text-white bg-blue-600 rounded-full p-1"
                                                : "text-blue-600"
                                        }`}
                                    />
                                </div>
                                <h3 className="mb-2 text-sm font-semibold text-gray-900 sm:text-base lg:text-lg">
                                    {step.title}
                                </h3>
                                <p className="text-xs text-gray-600 sm:text-sm">
                                    {step.description}
                                </p>

                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute right-[-50px] top-6 sm:top-7 lg:top-8 w-24">
                                        <svg
                                            viewBox="0 0 100 20"
                                            className="w-full h-4"
                                            fill="none"
                                        >
                                            <path
                                                d="M0 10 L90 10 M85 5 L90 10 L85 15"
                                                stroke="#9CA3AF"
                                                strokeWidth="2"
                                                strokeDasharray="5,5"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
