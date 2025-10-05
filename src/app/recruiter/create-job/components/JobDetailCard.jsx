"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import parse from "html-react-parser";
import { t } from "@/i18n/i18n";

const JobDetailCard = ({
    description,
    requirements,
    benefits,
    skills,
    levels,
}) => {
    const safeRequirements = requirements || "";
    const safeBenefits = Array.isArray(benefits) ? benefits : [];
    const safeSkills = Array.isArray(skills) ? skills : [];
    const safeLevels = Array.isArray(levels) ? levels : [];

    // Custom CSS cho bullet points
    const bulletStyles = `
        .job-detail-content ul {
            list-style-type: disc !important;
            padding-left: 1.5rem !important;
            margin: 0.5rem 0 !important;
        }
        .job-detail-content li {
            margin: 0.25rem 0 !important;
            display: list-item !important;
        }
        .job-detail-content ol {
            list-style-type: decimal !important;
            padding-left: 1.5rem !important;
            margin: 0.5rem 0 !important;
        }
    `;

    return (
        <>
            <style>{bulletStyles}</style>
            <div className="space-y-6">
                {/* Job Description */}
                {description && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">
                                Job Description
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="prose-sm prose max-w-none prose-gray job-detail-content">
                                {parse(description)}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Requirements */}
                {safeRequirements && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Requirements</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="prose-sm prose max-w-none prose-gray job-detail-content">
                                {parse(safeRequirements)}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Skills */}
                {safeSkills.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">{t`Skills`}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {safeSkills.map((skill, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="text-sm"
                                    >
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Levels */}
                {safeLevels.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Levels</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {safeLevels.map((level, index) => (
                                    <Badge
                                        key={index}
                                        variant="outline"
                                        className="text-sm"
                                    >
                                        {level}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Benefits */}
                {safeBenefits.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">
                                Benefits & Perks
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                {safeBenefits.map((benefit, index) => (
                                    <div key={benefit.id || index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                                        <h4 className="mb-3 text-lg font-semibold text-gray-900">
                                            {benefit.title}
                                        </h4>
                                        <div className="prose-sm prose max-w-none prose-gray job-detail-content">
                                            {parse(benefit.description)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
};

export default JobDetailCard;
