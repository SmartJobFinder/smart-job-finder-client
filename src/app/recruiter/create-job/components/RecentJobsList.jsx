"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const RecentJobsList = ({ jobs }) => {
    if (!jobs || jobs.length === 0) {
        return null;
    }

    return (
        <Card className="mt-8">
            <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                    Recent Jobs ({jobs.length})
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                    {jobs.slice(-5).map((job) => (
                        <div
                            key={job.id}
                            className="text-sm p-2 bg-gray-50 rounded"
                        >
                            <strong>{job.title}</strong> - {job.category} (
                            {Array.isArray(job.workType)
                                ? job.workType.join(", ")
                                : job.workType}
                            )
                            <br />
                            <span className="text-gray-600">
                                ${job.salaryMin} - ${job.salaryMax} | Location:{" "}
                                {job.location} | Skills:{" "}
                                {Array.isArray(job.skill)
                                    ? job.skill.join(", ")
                                    : job.skill}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default RecentJobsList;
