"use client";

import React, { useState } from "react";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { t } from "@/i18n/i18n";

const FilterSidebar = ({
    filters,
    setFilters,
    industries,
    companySizes,
    filterCounts,
}) => {
    const [expandedSections, setExpandedSections] = useState({
        industry: true,
        companySize: true,
        foundingYear: false,
    });

    const toggleSection = (section) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const handleIndustryChange = (industryId) => {
        const newCategoryIds = filters.categoryIds.includes(industryId)
            ? filters.categoryIds.filter((id) => id !== industryId)
            : [...filters.categoryIds, industryId];

        setFilters({ categoryIds: newCategoryIds });
    };

    const handleCompanySizeChange = (size) => {
        const newSizes = filters.companySize.includes(size)
            ? filters.companySize.filter((s) => s !== size)
            : [...filters.companySize, size];

        setFilters({ companySize: newSizes });
    };

    const handleFoundingYearChange = (year) => {
        setFilters({ foundingYear: year });
    };

    const clearAllFilters = () => {
        setFilters({
            categoryIds: [],
            companySize: [],
            foundingYear: "any",
        });
    };

    const hasActiveFilters =
        filters.categoryIds.length > 0 ||
        filters.companySize.length > 0 ||
        filters.foundingYear !== "any";

    return (
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                    <Filter className="w-5 h-5" />
                    {t`Filter`}
                </h3>
                {hasActiveFilters && (
                    <button
                        onClick={clearAllFilters}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                    >
                        <X className="w-4 h-4" />
                        {t`Clear all`}
                    </button>
                )}
            </div>

            <div className="space-y-6">
                {/* Industry Filter */}
                <div>
                    <button
                        onClick={() => toggleSection("industry")}
                        className="flex items-center justify-between w-full mb-3 font-medium text-left text-gray-900"
                    >
                        {t`Industry`}
                        {expandedSections.industry ? (
                            <ChevronUp className="w-4 h-4" />
                        ) : (
                            <ChevronDown className="w-4 h-4" />
                        )}
                    </button>

                    {expandedSections.industry && (
                        <div className="space-y-2 overflow-y-auto max-h-60">
                            {industries.map((industry) => (
                                <label
                                    key={industry.cate_id}
                                    className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-50"
                                >
                                    <input
                                        type="checkbox"
                                        checked={filters.categoryIds.includes(
                                            industry.cate_id
                                        )}
                                        onChange={() =>
                                            handleIndustryChange(
                                                industry.cate_id
                                            )
                                        }
                                        className="text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="flex-1 text-sm text-gray-700">
                                        {industry.cate_name}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Company Size Filter */}
                <div>
                    <button
                        onClick={() => toggleSection("companySize")}
                        className="flex items-center justify-between w-full mb-3 font-medium text-left text-gray-900"
                    >
                        {t`Company size`}
                        {expandedSections.companySize ? (
                            <ChevronUp className="w-4 h-4" />
                        ) : (
                            <ChevronDown className="w-4 h-4" />
                        )}
                    </button>

                    {expandedSections.companySize && (
                        <div className="space-y-2">
                            {companySizes.map((size) => (
                                <label
                                    key={size.id}
                                    className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-50"
                                >
                                    <input
                                        type="checkbox"
                                        checked={filters.companySize.includes(
                                            size.id
                                        )}
                                        onChange={() =>
                                            handleCompanySizeChange(size.id)
                                        }
                                        className="text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="flex-1 text-sm text-gray-700">
                                        {size.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Founding Year Filter */}
                <div>
                    <button
                        onClick={() => toggleSection("foundingYear")}
                        className="flex items-center justify-between w-full mb-3 font-medium text-left text-gray-900"
                    >
                        {t`Founded year`}
                        {expandedSections.foundingYear ? (
                            <ChevronUp className="w-4 h-4" />
                        ) : (
                            <ChevronDown className="w-4 h-4" />
                        )}
                    </button>

                    {expandedSections.foundingYear && (
                        <div className="space-y-2">
                            <label className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-50">
                                <input
                                    type="radio"
                                    name="foundingYear"
                                    value="any"
                                    checked={filters.foundingYear === "any"}
                                    onChange={(e) =>
                                        handleFoundingYearChange(e.target.value)
                                    }
                                    className="text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">
                                    All
                                </span>
                            </label>

                            {[
                                2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017,
                                2016, 2015,
                            ].map((year) => (
                                <label
                                    key={year}
                                    className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-50"
                                >
                                    <input
                                        type="radio"
                                        name="foundingYear"
                                        value={year}
                                        checked={
                                            filters.foundingYear ===
                                            year.toString()
                                        }
                                        onChange={(e) =>
                                            handleFoundingYearChange(
                                                e.target.value
                                            )
                                        }
                                        className="text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">
                                        {year}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;
