"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2 } from "lucide-react";

const BasicInformation = ({ formData, errors, onInputChange }) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold">Basic Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="companyName">
                        Company Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => onInputChange("companyName", e.target.value)}
                        placeholder="Enter company name"
                        className={errors.companyName ? "border-red-500" : ""}
                    />
                    {errors.companyName && (
                        <p className="text-sm text-red-500">{errors.companyName}</p>
                    )}
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="email">
                        Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => onInputChange("email", e.target.value)}
                        placeholder="contact@company.com"
                        className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                        <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="phoneNumber">
                        Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={(e) => onInputChange("phoneNumber", e.target.value)}
                        placeholder="+84 123 456 789"
                        className={errors.phoneNumber ? "border-red-500" : ""}
                    />
                    {errors.phoneNumber && (
                        <p className="text-sm text-red-500">{errors.phoneNumber}</p>
                    )}
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                        id="website"
                        value={formData.website}
                        onChange={(e) => onInputChange("website", e.target.value)}
                        placeholder="https://company.com"
                    />
                </div>
            </div>
            
            <div className="mt-6 space-y-2">
                <Label htmlFor="description">Company Description</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => onInputChange("description", e.target.value)}
                    placeholder="Tell us about your company..."
                    rows={4}
                />
            </div>
        </div>
    );
};

export default BasicInformation; 