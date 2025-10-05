"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    X,
    Loader2,
    MapPin,
    Briefcase,
    DollarSign,
    Star,
    Wrench,
} from "lucide-react";
import ProvinceCombobox from "./province-combobox";
import SkillSelector from "./SkillSelector";
import ReactSelect from "react-select";

const JobInformationForm = ({
    formData,
    onInputChange,
    errors,
    jobLevels = [],
    cities = [],
    wards = [],
    categories = [],
    skills = [],
    workTypes = [],
    isLoadingLevels = false,
    isLoadingCities = false,
    isLoadingCategories = false,
    isLoadingWorkTypes = false,
    isLoadingSkills = false,
}) => {
    const handleSalaryTypeChange = (type) => {
        onInputChange("salaryType", type);
    };

    const handleWorkTypeChange = (workType, checked) => {
        const currentWorkTypes = formData.workType || [];
        if (checked) {
            onInputChange("workType", [...currentWorkTypes, workType]);
        } else {
            onInputChange(
                "workType",
                currentWorkTypes.filter((wt) => wt !== workType)
            );
        }
    };

    const handleLevelChange = (level, checked) => {
        const currentLevels = formData.level || [];
        if (checked) {
            onInputChange("level", [...currentLevels, level]);
        } else {
            onInputChange(
                "level",
                currentLevels.filter((l) => l !== level)
            );
        }
    };

    const handleSkillAdd = (skill) => {
        const currentSkills = formData.skill || [];
        if (!currentSkills.includes(skill)) {
            onInputChange("skill", [...currentSkills, skill]);
        }
    };

    const handleSkillRemove = (skill) => {
        const currentSkills = formData.skill || [];
        onInputChange(
            "skill",
            currentSkills.filter((s) => s !== skill)
        );
    };

    const handleWardChange = (wardId, checked) => {
        const currentWardIds = formData.wardIds || [];
        if (checked) {
            onInputChange("wardIds", [...currentWardIds, wardId]);
        } else {
            onInputChange(
                "wardIds",
                currentWardIds.filter((id) => id !== wardId)
            );
        }
    };

    const categoryOptions = (categories || []).map((c) => ({
        value: c.name,
        label: c.name,
    }));

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="text-center pb-6 border-b border-gray-200">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    Basic Information
                </h2>
                <p className="text-gray-600 text-lg">
                    This information will be displayed publicly
                </p>
            </div>

            {/* Job Title Section */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="space-y-3">
                    <Label
                        htmlFor="jobTitle"
                        className={`text-base font-semibold ${
                            errors.jobTitle ? "text-red-500" : "text-gray-700"
                        }`}
                    >
                        Job Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="jobTitle"
                        value={formData.jobTitle || ""}
                        onChange={(e) =>
                            onInputChange("jobTitle", e.target.value)
                        }
                        placeholder="Example: Senior Frontend Developer"
                        className={`h-12 text-base ${
                            errors.jobTitle
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                : ""
                        }`}
                    />
                    {errors.jobTitle && (
                        <p className="text-red-500 text-sm font-medium">
                            {errors.jobTitle}
                        </p>
                    )}
                </div>
            </div>

            {/* Categories Section */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="space-y-3">
                    <Label
                        className={`text-base font-semibold ${
                            errors.categories ? "text-red-500" : "text-gray-700"
                        }`}
                    >
                        Categories <span className="text-red-500">*</span>
                    </Label>
                    {isLoadingCategories ? (
                        <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
                            <Loader2 className="w-5 h-5 animate-spin mr-3" />
                            <span className="text-gray-600">
                                Loading categories...
                            </span>
                        </div>
                    ) : (
                        <ReactSelect
                            isMulti
                            classNamePrefix="react-select"
                            options={categoryOptions}
                            value={(formData.categories || []).map((name) => ({
                                value: name,
                                label: name,
                            }))}
                            onChange={(selected) =>
                                onInputChange(
                                    "categories",
                                    (selected || []).map((opt) => opt.value)
                                )
                            }
                            placeholder="Select one or more categories"
                            className="text-base"
                        />
                    )}
                    {errors.categories && (
                        <p className="text-red-500 text-sm font-medium">
                            {errors.categories}
                        </p>
                    )}
                </div>
            </div>

            {/* Location Section */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="space-y-6">
                    <div className="flex items-center space-x-2 mb-4">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-800">
                            Location
                        </h3>
                    </div>

                    {/* City */}
                    <div className="space-y-3">
                        <Label
                            htmlFor="city"
                            className={`text-base font-semibold ${
                                errors.city ? "text-red-500" : "text-gray-700"
                            }`}
                        >
                            City <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={formData.city || ""}
                            onValueChange={(value) =>
                                onInputChange("city", value)
                            }
                        >
                            <SelectTrigger
                                className={`h-12 text-base ${
                                    errors.city
                                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                        : ""
                                }`}
                            >
                                <SelectValue placeholder="Select city" />
                            </SelectTrigger>
                            <SelectContent>
                                {isLoadingCities ? (
                                    <div className="flex items-center justify-center p-4">
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        Loading...
                                    </div>
                                ) : (
                                    cities.map((city, index) => (
                                        <SelectItem
                                            key={index}
                                            value={city.city_name}
                                        >
                                            {city.city_name}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                        {errors.city && (
                            <p className="text-red-500 text-sm font-medium">
                                {errors.city}
                            </p>
                        )}
                    </div>

                    {/* Wards */}
                    {formData.city && (
                        <div className="space-y-3">
                            <Label className="text-base font-semibold text-gray-700">
                                District/Ward{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            {wards.length > 0 ? (
                                <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto p-3 bg-gray-50 rounded-lg">
                                    {wards.map((ward) => (
                                        <div
                                            key={ward.id}
                                            className="flex items-center space-x-3 p-2 hover:bg-white rounded-md transition-colors"
                                        >
                                            <Checkbox
                                                id={`ward-${ward.id}`}
                                                checked={
                                                    formData.wardIds?.includes(
                                                        ward.id
                                                    ) || false
                                                }
                                                onCheckedChange={(checked) =>
                                                    handleWardChange(
                                                        ward.id,
                                                        checked
                                                    )
                                                }
                                            />
                                            <Label
                                                htmlFor={`ward-${ward.id}`}
                                                className="text-sm font-medium cursor-pointer flex-1"
                                            >
                                                {ward.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-sm text-gray-500 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                    No district/ward found in city:{" "}
                                    {formData.city}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Address */}
                    <div className="space-y-3">
                        <Label
                            htmlFor="address"
                            className={`text-base font-semibold ${
                                errors.address
                                    ? "text-red-500"
                                    : "text-gray-700"
                            }`}
                        >
                            Detailed Address{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="address"
                            value={formData.address || ""}
                            onChange={(e) =>
                                onInputChange("address", e.target.value)
                            }
                            placeholder="Example: 123 ABC Street, District 1"
                            className={`h-12 text-base ${
                                errors.address
                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                    : ""
                            }`}
                        />
                        {errors.address && (
                            <p className="text-red-500 text-sm font-medium">
                                {errors.address}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Work Type Section */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-800">
                            Job Type
                        </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {isLoadingWorkTypes ? (
                            <div className="flex items-center justify-center p-8 col-span-2 bg-gray-50 rounded-lg">
                                <Loader2 className="w-5 h-5 animate-spin mr-3" />
                                <span className="text-gray-600">
                                    Loading work types...
                                </span>
                            </div>
                        ) : (
                            workTypes.map((workType) => (
                                <div
                                    key={workType.name}
                                    className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <Checkbox
                                        id={`workType-${workType.name}`}
                                        checked={
                                            formData.workType?.includes(
                                                workType.name
                                            ) || false
                                        }
                                        onCheckedChange={(checked) =>
                                            handleWorkTypeChange(
                                                workType.name,
                                                checked
                                            )
                                        }
                                    />
                                    <Label
                                        htmlFor={`workType-${workType.name}`}
                                        className="text-sm font-medium cursor-pointer flex-1"
                                    >
                                        {workType.name}
                                    </Label>
                                </div>
                            ))
                        )}
                    </div>
                    {errors.workType && (
                        <p className="text-red-500 text-sm font-medium">
                            {errors.workType}
                        </p>
                    )}
                </div>
            </div>

            {/* Salary Section */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <h3 className="text-lg font-semibold text-gray-800">
                            Salary
                        </h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="salary-range"
                                    checked={formData.salaryType === 0}
                                    onCheckedChange={() =>
                                        handleSalaryTypeChange(0)
                                    }
                                />
                                <Label
                                    htmlFor="salary-range"
                                    className="text-base font-medium"
                                >
                                    Salary Range
                                </Label>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="salary-negotiate"
                                    checked={formData.salaryType === 1}
                                    onCheckedChange={() =>
                                        handleSalaryTypeChange(1)
                                    }
                                />
                                <Label
                                    htmlFor="salary-negotiate"
                                    className="text-base font-medium"
                                >
                                    Negotiable
                                </Label>
                            </div>
                        </div>

                        {formData.salaryType === 0 && (
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="salaryMin"
                                        className="text-sm font-semibold text-gray-700"
                                    >
                                        Minimum Salary (VND)
                                    </Label>
                                    <Input
                                        id="salaryMin"
                                        type="number"
                                        min="0"
                                        value={formData.salaryMin || ""}
                                        onChange={(e) => {
                                            const value =
                                                parseInt(e.target.value) || 0;
                                            if (value >= 0) {
                                                onInputChange(
                                                    "salaryMin",
                                                    value
                                                );
                                            }
                                        }}
                                        placeholder="Example: 10000000"
                                        className="h-12 text-base"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="salaryMax"
                                        className="text-sm font-semibold text-gray-700"
                                    >
                                        Maximum Salary (VND)
                                    </Label>
                                    <Input
                                        id="salaryMax"
                                        type="number"
                                        min="0"
                                        value={formData.salaryMax || ""}
                                        onChange={(e) => {
                                            const value =
                                                parseInt(e.target.value) || 0;
                                            if (value >= 0) {
                                                onInputChange(
                                                    "salaryMax",
                                                    value
                                                );
                                            }
                                        }}
                                        placeholder="Example: 20000000"
                                        className="h-12 text-base"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Level Section */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                        <Star className="w-5 h-5 text-yellow-600" />
                        <h3 className="text-lg font-semibold text-gray-800">
                            Experience Level
                        </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {isLoadingLevels ? (
                            <div className="flex items-center justify-center p-8 col-span-2 bg-gray-50 rounded-lg">
                                <Loader2 className="w-5 h-5 animate-spin mr-3" />
                                <span className="text-gray-600">
                                    Loading levels...
                                </span>
                            </div>
                        ) : (
                            jobLevels.map((level) => (
                                <div
                                    key={level.id}
                                    className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <Checkbox
                                        id={`level-${level.id}`}
                                        checked={
                                            formData.level?.includes(
                                                level.name
                                            ) || false
                                        }
                                        onCheckedChange={(checked) =>
                                            handleLevelChange(
                                                level.name,
                                                checked
                                            )
                                        }
                                    />
                                    <Label
                                        htmlFor={`level-${level.id}`}
                                        className="text-sm font-medium cursor-pointer flex-1"
                                    >
                                        {level.name}
                                    </Label>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Skills Section */}
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                        <Wrench className="w-5 h-5 text-purple-600" />
                        <h3 className="text-lg font-semibold text-gray-800">
                            Skills
                        </h3>
                    </div>
                    {formData.categories && formData.categories.length > 0 ? (
                        <SkillSelector
                            availableSkills={skills}
                            selectedSkills={formData.skill || []}
                            onSkillAdd={handleSkillAdd}
                            onSkillRemove={handleSkillRemove}
                            isLoading={isLoadingSkills}
                        />
                    ) : (
                        <div className="text-sm text-gray-500 p-6 border border-gray-200 rounded-lg bg-gray-50 text-center">
                            Please select at least one category before viewing
                            the skill list
                        </div>
                    )}

                    {/* Selected Skills Display */}
                    {formData.skill && formData.skill.length > 0 && (
                        <div className="space-y-3 pt-4 border-t border-gray-200">
                            <Label className="text-sm font-semibold text-gray-700">
                                Selected Skills
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                {formData.skill.map((skill) => (
                                    <Badge
                                        key={skill}
                                        variant="secondary"
                                        className="flex items-center gap-2 px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                                    >
                                        {skill}
                                        <X
                                            className="w-3 h-3 cursor-pointer hover:text-red-600"
                                            onClick={() =>
                                                handleSkillRemove(skill)
                                            }
                                        />
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobInformationForm;
