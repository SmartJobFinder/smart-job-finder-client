"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { t } from "@/i18n/i18n";

const JobSidebar = ({ categories, skills, levels, workTypes }) => {
    const safeWorkTypes = Array.isArray(workTypes) ? workTypes : [];
    const safeSkills = Array.isArray(skills) ? skills : [];
    const safeLevels = Array.isArray(levels) ? levels : [];
    const safeCategories = Array.isArray(categories) ? categories : [];

    return (
        <div className="space-y-6">
            {/* About This Role */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">
                        Job Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Category</span>
                        <span className="font-medium">
                            {safeCategories.length > 0
                                ? safeCategories.join(", ")
                                : "Not selected"}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Job Type</span>
                        <span className="font-medium">
                            {safeWorkTypes.length > 0
                                ? safeWorkTypes.join(", ")
                                : "Not selected"}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Skills */}
            {safeSkills.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">{t`Skills`}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {safeSkills.map((skill, index) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-xs"
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
                        <CardTitle className="text-lg">Levels</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {safeLevels.map((level, index) => (
                                <Badge
                                    key={index}
                                    variant="outline"
                                    className="text-xs"
                                >
                                    {level}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default JobSidebar;
