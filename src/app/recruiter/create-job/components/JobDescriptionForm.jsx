"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import JoditEditorComponent from "@/components/ui/JoditEditor";

const JobDescriptionForm = ({ formData, onInputChange, errors = {} }) => {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Job Description
                </h2>
                <p className="text-gray-600">
                    Detail description of the job and requirements
                </p>
            </div>

            {/* Job Description */}
            <div className="space-y-2">
                <Label htmlFor="jobDescription">
                    Description <span className="text-red-500">*</span>
                </Label>
                <JoditEditorComponent
                    value={formData.jobDescription || ""}
                    onChange={(value) => onInputChange("jobDescription", value)}
                    placeholder="Detail description of the job, responsibilities and tasks..."
                    height="250px"
                />
                {errors.jobDescription && (
                    <p className="text-red-500 text-sm mt-1">{errors.jobDescription}</p>
                )}
            </div>

            {/* Requirements */}
            <div className="space-y-2">
                <Label htmlFor="requirements">
                    Requirements <span className="text-red-500">*</span>
                </Label>
                <JoditEditorComponent
                    value={formData.requirements || ""}
                    onChange={(value) => onInputChange("requirements", value)}
                    placeholder="Requirements about experience, skills and qualifications..."
                    height="200px"
                />
                {errors.requirements && (
                    <p className="text-red-500 text-sm mt-1">{errors.requirements}</p>
                )}
            </div>

            {/* Nice to Haves */}
            {/* <div className="space-y-2">
                <Label htmlFor="niceToHaves">Nice to Haves (Optional)</Label>
                <JoditEditorComponent
                    value={formData.niceToHaves || ""}
                    onChange={(value) => onInputChange("niceToHaves", value)}
                    placeholder="Additional requirements (optional)..."
                    height="150px"
                />
            </div> */}

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="datePost">Date Post</Label>
                    <input
                        id="datePost"
                        type="date"
                        value={formData.datePost || ""}
                        onChange={(e) =>
                            onInputChange("datePost", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="expiredDate">
                        Expired Date <span className="text-red-500">*</span>
                    </Label>
                    <input
                        id="expiredDate"
                        type="date"
                        value={formData.expiredDate || ""}
                        onChange={(e) =>
                            onInputChange("expiredDate", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            errors.expiredDate ? "border-red-500" : "border-gray-300"
                        }`}
                        min={formData.datePost || ""}
                    />
                    {errors.expiredDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.expiredDate}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobDescriptionForm;
