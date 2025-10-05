"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2, MapPin, Clock } from "lucide-react";
import { formatNumber, formatSalary } from "@/lib/utils";

const JobReviewHeader = ({
    title,
    company,
    location,
    workType,
    salaryMin,
    salaryMax,
    salaryType,
}) => {
    return (
        <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                    {title ? title.charAt(0).toUpperCase() : "J"}
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {title || "No title"}
                    </h1>
                    <div className="flex items-center gap-4 text-gray-600">
                        <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{location || "No address"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>
                                {workType && workType.length > 0
                                    ? workType.join(", ")
                                    : "No job type"}
                            </span>
                        </div>
                    </div>
                    <div className="mt-2 text-lg font-semibold text-green-600">
                        {formatSalary(salaryMin, salaryMax, salaryType)}
                    </div>
                </div>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                </Button>
            </div>
        </div>
    );
};

export default JobReviewHeader;
