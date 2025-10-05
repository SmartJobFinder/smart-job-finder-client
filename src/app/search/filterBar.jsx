"use client";

import React, {useCallback, useEffect, useMemo, useState} from "react";
import {ChevronDown, ChevronUp} from "lucide-react";
import clsx from "clsx";
import {useJobSearchStore} from "@/store/jobSearchStore";
import {
    useGetCategoriesQuery,
    useGetLevelsQuery,
    useGetWorkTypesQuery,
    useLazyGetSkillsByCategoryQuery,
} from "@/services/filterService";
import {t} from "@/i18n/i18n";

export default function FilterBar() {
    const [showCategories, setShowCategories] = useState(false);
    const [showLevels, setShowLevels] = useState(false);
    const [showWorkTypes, setShowWorkTypes] = useState(false);
    const [showSkills, setShowSkills] = useState(false);

    const {filters, setFilters} = useJobSearchStore();

    const {data: categoriesRes} = useGetCategoriesQuery();
    const {data: levelsRes} = useGetLevelsQuery();
    const {data: workTypesRes} = useGetWorkTypesQuery();
    const [getSkillsByCategory, {data: skillsRes}] =
        useLazyGetSkillsByCategoryQuery();

    const [allSkills, setAllSkills] = useState([]);

    useEffect(() => {
        if (!filters.categories?.length) {
            setAllSkills([]);
            return;
        }
        Promise.all(
            filters.categories.map((cate) =>
                getSkillsByCategory(cate)
                    .unwrap()
                    .catch(() => [])
            )
        ).then((lists) => {
            const merged = lists.flat().map((s) => s?.name ?? s);
            setAllSkills(Array.from(new Set(merged.filter(Boolean))));
        });
    }, [filters.categories, getSkillsByCategory]);

    const toggleValue = useCallback(
        (listName, value) => {
            setFilters({
                ...filters,
                [listName]: filters[listName].includes(value)
                    ? filters[listName].filter((v) => v !== value)
                    : [...filters[listName], value],
            });
        },
        [filters, setFilters]
    );

    const renderTags = useCallback(
        (items, listName, colorClass, selectedBg, textClass) => (
            <div className="flex flex-wrap gap-2">
                {(items || []).map((item) => {
                    const label = typeof item === "string" ? item : item?.name;
                    if (!label) return null;
                    const isSelected = filters[listName].includes(label);
                    return (
                        <div
                            key={label}
                            onClick={() => toggleValue(listName, label)}
                            className={clsx(
                                "px-3 py-1 text-sm rounded-full cursor-pointer border transition select-none",
                                colorClass,
                                isSelected
                                    ? `${selectedBg} ${textClass} font-medium`
                                    : "bg-white text-gray-600 hover:bg-gray-100"
                            )}
                        >
                            {label}
                        </div>
                    );
                })}
            </div>
        ),
        [filters, toggleValue]
    );

    const shouldShowPickCategoryHint = useMemo(
        () =>
            showSkills &&
            (!filters.categories || filters.categories.length === 0),
        [showSkills, filters.categories]
    );

    return (
        <div className="p-4 space-y-4 bg-white rounded-lg shadow">
            {/* Work Types */}
            <div>
                <div
                    onClick={() => setShowWorkTypes(!showWorkTypes)}
                    className="flex items-center justify-between mb-2 font-semibold cursor-pointer"
                >
                    <span>{t`Work Type`}</span>
                    {showWorkTypes ? (
                        <ChevronUp size={18}/>
                    ) : (
                        <ChevronDown size={18}/>
                    )}
                </div>
                {showWorkTypes &&
                    renderTags(
                        workTypesRes || [],
                        "workTypes",
                        "border-yellow-500",
                        "bg-yellow-100",
                        "text-yellow-700"
                    )}
            </div>

            {/* Levels */}
            <div>
                <div
                    onClick={() => setShowLevels(!showLevels)}
                    className="flex items-center justify-between mb-2 font-semibold cursor-pointer"
                >
                    <span>{t`Levels`}</span>
                    {showLevels ? (
                        <ChevronUp size={18}/>
                    ) : (
                        <ChevronDown size={18}/>
                    )}
                </div>
                {showLevels &&
                    renderTags(
                        levelsRes || [],
                        "levels",
                        "border-green-500",
                        "bg-green-100",
                        "text-green-700"
                    )}
            </div>

            {/* Categories */}
            <div>
                <div
                    onClick={() => setShowCategories(!showCategories)}
                    className="flex items-center justify-between mb-2 font-semibold cursor-pointer"
                >
                    <span>{t`Categories`}</span>
                    {showCategories ? (
                        <ChevronUp size={18}/>
                    ) : (
                        <ChevronDown size={18}/>
                    )}
                </div>
                {showCategories &&
                    renderTags(
                        categoriesRes || [],
                        "categories",
                        "border-purple-500",
                        "bg-purple-100",
                        "text-purple-700"
                    )}
            </div>

            {/* Skills */}
            <div>
                <div
                    onClick={() => setShowSkills(!showSkills)}
                    className="flex items-center justify-between mb-2 font-semibold cursor-pointer"
                >
                    <span>{t`Skills`}</span>
                    {showSkills ? (
                        <ChevronUp size={18}/>
                    ) : (
                        <ChevronDown size={18}/>
                    )}
                </div>
                {shouldShowPickCategoryHint ? (
                    <p className="text-sm text-gray-500">
                        {t`Please select at least 1 Category to display the list Skills.`}
                    </p>
                ) : (
                    showSkills &&
                    renderTags(
                        allSkills,
                        "skills",
                        "border-blue-700",
                        "bg-blue-100",
                        "text-blue-700"
                    )
                )}
            </div>
        </div>
    );
}
