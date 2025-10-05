"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";

const CompanyDetails = ({ formData, errors, onInputChange }) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
                <Calendar className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-semibold">Company Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="foundedYear">Founded Year *</Label>
                    <Input
                        id="foundedYear"
                        type="number"
                        value={formData.foundedYear}
                        onChange={(e) => onInputChange("foundedYear", parseInt(e.target.value))}
                        min="1800"
                        max={new Date().getFullYear()}
                        className={errors.foundedYear ? "border-red-500" : ""}
                    />
                    {errors.foundedYear && (
                        <p className="text-sm text-red-500">{errors.foundedYear}</p>
                    )}
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="quantityEmployee">Number of Employees *</Label>
                    <Input
                        id="quantityEmployee"
                        type="number"
                        value={formData.quantityEmployee}
                        onChange={(e) => onInputChange("quantityEmployee", parseInt(e.target.value))}
                        min="1"
                        className={errors.quantityEmployee ? "border-red-500" : ""}
                    />
                    {errors.quantityEmployee && (
                        <p className="text-sm text-red-500">{errors.quantityEmployee}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompanyDetails; 