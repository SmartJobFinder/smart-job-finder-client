"use client";

import React from "react";
import Image from "next/image";
import frontendDevImage from "@/assets/images/frontend-dev-job-match.png"; // bạn có thể thay bằng ảnh mới bạn vừa upload
import { t } from "@/i18n/i18n";

export default function AboutUsSection() {
    return (
        <section
            id="about-us"
            className="py-12 mx-4 bg-white rounded-lg sm:py-16 lg:py-20"
        >
            <div className="grid items-center grid-cols-1 lg:grid-cols-2 lg:gap-0">
                {/* Text Content */}
                <div className="container px-6 py-8 mx-auto sm:px-8 lg:px-12">
                    <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl">
                        {t`About JobHuntly: from First job to Big future`}
                    </h2>
                    <p className="mb-4 text-base leading-relaxed text-gray-600 sm:text-lg">
                        {t`JobHuntly was born from a simple idea: to create a job search platform that is honest, effective, and easy to use. We know that finding the right first job can feel overwhelming, so our focus is on building a clean, straightforward space where new job seekers and growing companies can connect. We're on a mission to help you find more than just a job—we're here to help you build a career.`}
                    </p>
                    <p className="mb-6 text-base leading-relaxed text-gray-600 sm:text-lg">
                        {t`As a new platform, we're building this community one connection at a time. Our mission is to foster a space where meaningful careers can begin. Your feedback and participation are the most important part of our growth. We are here to evolve with you and for you, helping turn your first step into a great future.`}
                    </p>

                    {/* Replacing stats with core values */}
                    <div className="grid grid-cols-2 gap-6 sm:gap-8">
                        <div>
                            <p className="text-2xl font-bold text-indigo-600">
                                {t`Honesty & Quality`}
                            </p>
                            <p className="text-sm text-gray-600">
                                {t`We focus on a curated selection of verified and high-quality job listings.`}
                            </p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-indigo-600">
                                {t`Simplicity`}
                            </p>
                            <p className="text-sm text-gray-600">
                                {t`A streamlined, minimalist interface to make your search fast and stress-free.`}
                            </p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-indigo-600">
                                {t`Community-Driven`}
                            </p>
                            <p className="text-sm text-gray-600">
                                {t`We're building a valuable recruitment community with you.`}
                            </p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-indigo-600">
                                {t`Feedback Matters`}
                            </p>
                            <p className="text-sm text-gray-600">
                                {t`Our platform evolves based on the insights you share.`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Illustration (Responsive) */}
                <div className="relative flex items-center justify-center w-full h-[400px] sm:h-[500px] lg:h-full overflow-hidden">
                    {/* Background Grid */}
                    <div className="absolute inset-0 opacity-10">
                        <svg
                            width="100%"
                            height="100%"
                            className="text-gray-400"
                        >
                            <defs>
                                <pattern
                                    id="grid"
                                    width="20"
                                    height="20"
                                    patternUnits="userSpaceOnUse"
                                >
                                    <path
                                        d="M 20 0 L 0 0 0 20"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                    />
                                </pattern>
                            </defs>
                            <rect
                                width="100%"
                                height="100%"
                                fill="url(#grid)"
                            />
                        </svg>
                    </div>

                    {/* Person Image */}
                    <div className="relative z-10 w-64 sm:w-80 md:w-96">
                        <Image
                            src={frontendDevImage}
                            alt="Professional man with glasses"
                            width={400}
                            height={500}
                            className="object-cover w-full h-auto"
                            priority
                        />

                        {/* Floating Card Top Right */}
                        <div className="absolute p-3 transform bg-white rounded-lg shadow-lg top-10 -right-6 sm:p-4 rotate-3">
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full">
                                    <svg
                                        className="w-4 h-4 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-sm font-medium">
                                        Job Match
                                    </div>
                                    <div className="text-xs text-gray-500 sm:text-sm">
                                        95% Match
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Card Bottom Left */}
                        <div className="absolute p-3 transform bg-white rounded-lg shadow-lg bottom-10 -left-6 sm:p-4 -rotate-3">
                            <div className="flex items-center space-x-3">
                                <div className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full">
                                    <svg
                                        className="w-4 h-4 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-sm font-medium">
                                        New Job
                                    </div>
                                    <div className="text-xs text-gray-500 sm:text-sm">
                                        Frontend Dev
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Shapes */}
                        <div className="absolute w-12 h-12 transform rotate-45 border-2 rounded-lg opacity-50 -top-4 right-10 border-blue-400/20"></div>
                        <div className="absolute w-8 h-8 bg-yellow-200 rounded-full top-16 -right-6 opacity-60"></div>
                        <div className="absolute w-6 h-6 bg-purple-200 rounded-full opacity-50 bottom-20 right-12"></div>
                        <div className="absolute w-10 h-10 border-2 border-green-200 rounded-full -bottom-2 left-16 opacity-40"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
