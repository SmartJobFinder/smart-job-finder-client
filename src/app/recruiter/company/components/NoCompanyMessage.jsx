"use client";

import React from "react";
import Link from "next/link";

const NoCompanyMessage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <div className="max-w-md p-8 text-center bg-white rounded-lg shadow-xl">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg
                        className="w-10 h-10 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                    </svg>
                </div>
                <h2 className="mb-4 text-2xl font-bold text-gray-900">
                    No Company Found
                </h2>
                <p className="mb-6 text-gray-600">
                    You don't have any company yet. Would you like to create a new one?
                </p>
                <div className="space-y-3">
                    <Link
                        href="/recruiter/create-company"
                        className="inline-block w-full px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Create New Company
                    </Link>
                    <Link
                        href="/recruiter/dashboard"
                        className="inline-block w-full px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NoCompanyMessage;