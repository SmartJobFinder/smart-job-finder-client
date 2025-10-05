"use client";

import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
    useMemo,
} from "react";
import {
    Search,
    MapPin,
    Building,
    Tag,
    X,
    ChevronDown,
    Loader2,
} from "lucide-react";
import useCompanySearchStore from "../store/companySearchStore";

// Custom hook for debouncing
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

const SearchBar = ({
    onSearch,
    initialValues = { company: "", location: "", categoryIds: [] },
}) => {
    const {
        locations,
        industries,
        fetchLocations,
        fetchIndustries,
        isLoading,
    } = useCompanySearchStore();

    const [searchParams, setSearchParams] = useState({
        company: initialValues.company || "",
        location: initialValues.location || "",
        categoryIds: initialValues.categoryIds || [],
    });

    const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);
    const [showLocationSuggestions, setShowLocationSuggestions] =
        useState(false);
    const [showCategorySuggestions, setShowCategorySuggestions] =
        useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categorySearchTerm, setCategorySearchTerm] = useState("");
    const [isCategoryInputFocused, setIsCategoryInputFocused] = useState(false);

    const companyRef = useRef(null);
    const locationRef = useRef(null);
    const categoryRef = useRef(null);
    const containerRef = useRef(null);

    const isUpdatingFromInitial = useRef(false);
    const hasInitializedCategories = useRef(false);

    const stableCategoryIds = useMemo(() => {
        return initialValues.categoryIds || [];
    }, [JSON.stringify(initialValues.categoryIds || [])]);

    // Debounced search terms for better performance
    const debouncedCompany = useDebounce(searchParams.company, 300);
    const debouncedLocation = useDebounce(searchParams.location, 300);
    const debouncedCategorySearch = useDebounce(categorySearchTerm, 200);

    // Load data on mount
    useEffect(() => {
        if (industries.length === 0) {
            fetchIndustries();
        }
        if (locations.length === 0) {
            fetchLocations();
        }
    }, [fetchIndustries, fetchLocations]);

    // Update searchParams when initialValues change - FIXED
    useEffect(() => {
        const hasChanged =
            initialValues.company !== searchParams.company ||
            initialValues.location !== searchParams.location ||
            JSON.stringify(stableCategoryIds) !==
                JSON.stringify(searchParams.categoryIds);

        if (hasChanged && !isUpdatingFromInitial.current) {
            isUpdatingFromInitial.current = true;
            setSearchParams({
                company: initialValues.company || "",
                location: initialValues.location || "",
                categoryIds: stableCategoryIds,
            });
            // Reset the flag after a short delay
            setTimeout(() => {
                isUpdatingFromInitial.current = false;
            }, 100);
        }
    }, [initialValues.company, initialValues.location, stableCategoryIds]);

    // Initialize selectedCategories from initialValues - FIXED TO PREVENT INFINITE LOOP
    useEffect(() => {
        if (industries.length > 0) {
            const currentCategoryIds = selectedCategories
                .map((cat) => cat.cate_id)
                .sort();
            const newCategoryIds = stableCategoryIds.slice().sort();

            if (
                JSON.stringify(currentCategoryIds) !==
                JSON.stringify(newCategoryIds)
            ) {
                if (stableCategoryIds.length > 0) {
                    const newSelectedCategories = industries.filter((ind) =>
                        stableCategoryIds.includes(ind.cate_id)
                    );
                    setSelectedCategories(newSelectedCategories);
                } else {
                    setSelectedCategories([]);
                }
                hasInitializedCategories.current = true;
            } else if (
                !hasInitializedCategories.current &&
                stableCategoryIds.length === 0
            ) {
                setSelectedCategories([]);
                hasInitializedCategories.current = true;
            }
        }
    }, [industries.length > 0 ? industries : [], stableCategoryIds.join(",")]);

    // Memoized filtered locations
    const filteredLocations = useMemo(() => {
        if (!debouncedLocation) return locations.slice(0, 8);
        return locations
            .filter((location) =>
                location.toLowerCase().includes(debouncedLocation.toLowerCase())
            )
            .slice(0, 8);
    }, [locations, debouncedLocation]);

    // Memoized filtered industries
    const filteredIndustries = useMemo(() => {
        if (!debouncedCategorySearch) return industries.slice(0, 10);
        return industries
            .filter((industry) =>
                industry.cate_name
                    .toLowerCase()
                    .includes(debouncedCategorySearch.toLowerCase())
            )
            .slice(0, 10);
    }, [industries, debouncedCategorySearch]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setShowCompanySuggestions(false);
                setShowLocationSuggestions(false);
                setShowCategorySuggestions(false);
                setIsCategoryInputFocused(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Handle input changes with debouncing
    const handleInputChange = useCallback((field, value) => {
        setSearchParams((prev) => {
            const newParams = {
                ...prev,
                [field]: value,
            };
            return newParams;
        });

        if (field === "location") {
            setShowLocationSuggestions(true);
            setShowCompanySuggestions(false);
            setShowCategorySuggestions(false);
        } else if (field === "company") {
            setShowCompanySuggestions(true);
            setShowLocationSuggestions(false);
            setShowCategorySuggestions(false);
        }
    }, []);

    // Handle category search
    const handleCategorySearch = useCallback((value) => {
        setCategorySearchTerm(value);
        setShowCategorySuggestions(true);
        setShowCompanySuggestions(false);
        setShowLocationSuggestions(false);
    }, []);

    // Handle category input focus
    const handleCategoryFocus = useCallback(() => {
        setShowCategorySuggestions(true);
        setShowCompanySuggestions(false);
        setShowLocationSuggestions(false);
        setIsCategoryInputFocused(true);
    }, []);

    // Handle location selection
    const handleLocationSelect = useCallback((location) => {
        setSearchParams((prev) => ({
            ...prev,
            location,
        }));
        setShowLocationSuggestions(false);
    }, []);

    // Handle category toggle
    const handleCategoryToggle = useCallback(
        (category) => {
            const isSelected = selectedCategories.some(
                (cat) => cat.cate_id === category.cate_id
            );

            let newSelectedCategories;
            if (isSelected) {
                newSelectedCategories = selectedCategories.filter(
                    (cat) => cat.cate_id !== category.cate_id
                );
            } else {
                newSelectedCategories = [...selectedCategories, category];
            }

            setSelectedCategories(newSelectedCategories);

            setSearchParams((prev) => ({
                ...prev,
                categoryIds: newSelectedCategories.map((cat) => cat.cate_id),
            }));

            // Clear search term and close dropdown after selection
            setCategorySearchTerm("");
            setShowCategorySuggestions(false);
        },
        [selectedCategories]
    );

    // Handle remove category
    const handleRemoveCategory = useCallback(
        (categoryId) => {
            const newSelectedCategories = selectedCategories.filter(
                (cat) => cat.cate_id !== categoryId
            );
            setSelectedCategories(newSelectedCategories);
            setSearchParams((prev) => ({
                ...prev,
                categoryIds: newSelectedCategories.map((cat) => cat.cate_id),
            }));
        },
        [selectedCategories]
    );

    // Handle form submission
    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault();

            onSearch(searchParams);
            setShowCompanySuggestions(false);
            setShowLocationSuggestions(false);
            setShowCategorySuggestions(false);
            setIsCategoryInputFocused(false);
        },
        [onSearch, searchParams]
    );

    // Handle clear all
    const handleClearAll = useCallback(() => {
        setSearchParams({
            company: "",
            location: "",
            categoryIds: [],
        });
        setSelectedCategories([]);
        setCategorySearchTerm("");
        setIsCategoryInputFocused(false);
    }, []);

    // Get display text for category input
    const getCategoryDisplayText = () => {
        if (selectedCategories.length === 0) return "";
        if (selectedCategories.length === 1)
            return selectedCategories[0].cate_name;
        return `${selectedCategories.length} ngành nghề đã chọn`;
    };

    // Get the actual value to display in category input - SIMPLIFIED LOGIC
    const getCategoryInputValue = () => {
        if (isCategoryInputFocused && categorySearchTerm) {
            return categorySearchTerm;
        }

        return getCategoryDisplayText();
    };

    return (
        <div className="w-full mx-auto max-w-7xl" ref={containerRef}>
            {/* Main Search Container */}
            <div className="relative p-4 bg-white border border-gray-100 shadow-xl rounded-2xl md:p-6">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 md:space-y-6"
                >
                    {/* Header */}
                    <div className="mb-4 text-center md:mb-6">
                        <h1 className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl">
                            Search for a company
                        </h1>
                        <p className="text-sm text-gray-600 md:text-base">
                            Discover companies that match your interests and
                            skills. Search by name, location, industry, or size.
                        </p>
                    </div>

                    {/* Search Inputs - All in one row */}
                    <div className="flex flex-col gap-3 lg:flex-row md:gap-4">
                        {/* Company Name Input */}
                        <div className="relative flex-1 group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none md:pl-4">
                                <Building className="w-4 h-4 text-gray-400 transition-colors md:h-5 md:w-5 group-focus-within:text-blue-500" />
                            </div>
                            <input
                                ref={companyRef}
                                type="text"
                                placeholder="Company name..."
                                value={searchParams.company}
                                onChange={(e) => {
                                    handleInputChange(
                                        "company",
                                        e.target.value
                                    );
                                }}
                                onFocus={() => {
                                    setShowCompanySuggestions(true);
                                    setShowLocationSuggestions(false);
                                    setShowCategorySuggestions(false);
                                }}
                                className="w-full py-3 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 transition-all duration-200 border-2 border-transparent md:pl-12 md:py-4 bg-gray-50 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 md:text-base"
                            />
                        </div>

                        {/* Location Input */}
                        <div className="relative flex-1 group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none md:pl-4">
                                <MapPin className="w-4 h-4 text-gray-400 transition-colors md:h-5 md:w-5 group-focus-within:text-blue-500" />
                            </div>
                            <input
                                ref={locationRef}
                                type="text"
                                placeholder="Location..."
                                value={searchParams.location}
                                onChange={(e) => {
                                    handleInputChange(
                                        "location",
                                        e.target.value
                                    );
                                }}
                                onFocus={() => {
                                    setShowLocationSuggestions(true);
                                    setShowCompanySuggestions(false);
                                    setShowCategorySuggestions(false);
                                }}
                                className="w-full py-3 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 transition-all duration-200 border-2 border-transparent md:pl-12 md:py-4 bg-gray-50 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 md:text-base"
                            />

                            {/* Location Dropdown - Positioned under this input */}
                            {showLocationSuggestions &&
                                filteredLocations.length > 0 && (
                                    <div className="absolute left-0 z-50 w-full mt-2 overflow-y-auto bg-white border border-gray-200 shadow-xl rounded-xl max-h-60 top-full">
                                        {filteredLocations.map(
                                            (location, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleLocationSelect(
                                                            location
                                                        );
                                                    }}
                                                    className="flex items-center w-full gap-3 px-4 py-3 text-sm text-left transition-colors hover:bg-blue-50 first:rounded-t-xl last:rounded-b-xl md:text-base"
                                                >
                                                    <MapPin className="flex-shrink-0 w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-700 truncate">
                                                        {location}
                                                    </span>
                                                </button>
                                            )
                                        )}
                                    </div>
                                )}
                        </div>

                        {/* Category Selection */}
                        <div className="relative flex-1 group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none md:pl-4">
                                <Tag className="w-4 h-4 text-gray-400 transition-colors md:h-5 md:w-5 group-focus-within:text-blue-500" />
                            </div>
                            <input
                                ref={categoryRef}
                                type="text"
                                placeholder="Select industry..."
                                value={getCategoryInputValue()}
                                onChange={(e) => {
                                    handleCategorySearch(e.target.value);
                                }}
                                onFocus={handleCategoryFocus}
                                onBlur={() => {
                                    // Delay to allow click on dropdown items
                                    setTimeout(() => {
                                        setIsCategoryInputFocused(false);
                                    }, 200);
                                }}
                                className="w-full py-3 pl-10 pr-10 text-sm text-gray-900 placeholder-gray-500 transition-all duration-200 border-2 border-transparent md:pl-12 md:py-4 bg-gray-50 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 md:text-base"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none md:pr-4">
                                <ChevronDown className="w-4 h-4 text-gray-400 md:h-5 md:w-5" />
                            </div>

                            {/* Category Dropdown - Positioned under this input */}
                            {showCategorySuggestions &&
                                filteredIndustries.length > 0 && (
                                    <div className="absolute left-0 z-50 w-full mt-2 overflow-y-auto bg-white border border-gray-200 shadow-xl rounded-xl max-h-60 top-full">
                                        {filteredIndustries.map((industry) => (
                                            <button
                                                key={industry.cate_id}
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleCategoryToggle(
                                                        industry
                                                    );
                                                }}
                                                className="flex items-center w-full gap-3 px-4 py-3 text-sm text-left transition-colors hover:bg-blue-50 first:rounded-t-xl last:rounded-b-xl md:text-base"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCategories.some(
                                                        (cat) =>
                                                            cat.cate_id ===
                                                            industry.cate_id
                                                    )}
                                                    onChange={() => {}}
                                                    className="flex-shrink-0 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <Tag className="flex-shrink-0 w-4 h-4 text-gray-400" />
                                                <span className="text-gray-700 truncate">
                                                    {industry.cate_name}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                            <button
                                type="button"
                                onClick={handleClearAll}
                                className="px-4 md:px-6 py-2.5 md:py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all duration-200 font-semibold text-sm md:text-base whitespace-nowrap"
                            >
                                Clear all
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-6 md:px-8 py-2.5 md:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base whitespace-nowrap"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                                ) : (
                                    <Search className="w-4 h-4 md:w-5 md:h-5" />
                                )}
                                {isLoading ? "Searching..." : "Search"}
                            </button>
                        </div>
                    </div>

                    {/* Selected Categories */}
                    {selectedCategories.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {selectedCategories.map((category) => (
                                <span
                                    key={category.cate_id}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-blue-100 text-blue-800 text-xs md:text-sm rounded-full border border-blue-200"
                                >
                                    <Tag className="flex-shrink-0 w-3 h-3" />
                                    <span className="truncate max-w-32 md:max-w-none">
                                        {category.cate_name}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveCategory(
                                                category.cate_id
                                            )
                                        }
                                        className="flex-shrink-0 ml-1 transition-colors hover:text-blue-600"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </form>
            </div>

            {/* Quick Search Tags
            <div className="mt-4 md:mt-6">
                <h3 className="mb-2 text-xs font-medium text-gray-700 md:text-sm md:mb-3">
                    Quick search:
                </h3>
                <div className="flex flex-wrap gap-2">
                    {[
                        "International Technology",
                        "Marketing",
                        "Accounting",
                        "Human Resources",
                        "Business",
                    ].map((tag) => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => {
                                const industry = industries.find(
                                    (ind) => ind.cate_name === tag
                                );
                                if (industry) {
                                    handleCategoryToggle(industry);
                                }
                            }}
                            className="px-3 md:px-4 py-1.5 md:py-2 bg-gray-100 text-gray-700 rounded-full text-xs md:text-sm hover:bg-blue-100 hover:text-blue-700 transition-colors"
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div> */}
        </div>
    );
};

export default SearchBar;
