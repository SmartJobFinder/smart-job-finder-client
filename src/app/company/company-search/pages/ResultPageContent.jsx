"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
    Building,
    MapPin,
    Search,
    Filter,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import SearchBar from "../components/SearchBar";
import FilterSidebar from "../components/FilterSidebar";
import ResultItem from "../components/ResultItem";
import useCompanySearchStore from "../store/companySearchStore";

const companySizes = [
    { id: "1-10", label: "1-10 employees" },
    { id: "11-50", label: "11-50 employees" },
    { id: "51-200", label: "51-200 employees" },
    { id: "201-500", label: "201-500 employees" },
    { id: "501+", label: "501+ employees" },
];

const ITEMS_PER_PAGE = 10;

const ResultPageContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showFilterOnMobile, setShowFilterOnMobile] = useState(false);

    // Lấy state và actions từ Zustand store
    const {
        companies,
        industries,
        locations,
        filters,
        searchTerm,
        pagination,
        sort,
        isLoading,
        error,
        fetchCompanies,
        searchCompanies,
        fetchCompaniesByCategories,
        fetchCompaniesByLocation,
        fetchIndustries,
        fetchLocations,
        setFilters,
        setSearchTerm,
        setPagination,
        setSort,
        getFilterCounts,
    } = useCompanySearchStore();

    // Khởi tạo dữ liệu
    useEffect(() => {
        fetchIndustries();
        fetchLocations();
    }, [fetchIndustries, fetchLocations]);

    // Xử lý tìm kiếm từ URL params
    useEffect(() => {
        const name =
            searchParams.get("name") || searchParams.get("company") || "";
        const location = searchParams.get("location") || "";
        const categoryIdsParam = searchParams.get("categoryIds") || "";
        const categoryIds = categoryIdsParam
            ? categoryIdsParam.split(",").map(Number)
            : [];
        const page = parseInt(searchParams.get("page")) || 0;
        const size = parseInt(searchParams.get("size")) || ITEMS_PER_PAGE;
        const sortParam = searchParams.get("sort") || "id,asc";

        setSearchTerm({ company: name, location });
        setPagination({ page, size });
        setSort({
            field: sortParam.split(",")[0],
            direction: sortParam.split(",")[1],
        });

        if (categoryIds.length > 0) {
            setFilters((prev) => ({ ...prev, categoryIds }));
        }

        const performSearch = async () => {
            try {
                if (name && categoryIds.length > 0) {
                    // Tìm kiếm kết hợp
                    await searchCompanies(
                        { name, categoryIds },
                        page,
                        size,
                        sortParam
                    );
                } else if (categoryIds.length > 0) {
                    await fetchCompaniesByCategories(
                        categoryIds,
                        page,
                        size,
                        sortParam
                    );
                } else if (name) {
                    await searchCompanies({ name }, page, size, sortParam);
                } else if (location) {
                    await fetchCompaniesByLocation(
                        location,
                        page,
                        size,
                        sortParam
                    );
                } else {
                    await fetchCompanies(page, size, sortParam);
                }
            } catch (error) {
                console.error("Error performing search:", error);
            }
        };

        performSearch();
    }, [searchParams]);

    // Xử lý tìm kiếm từ SearchBar
    const handleSearch = (searchParams) => {
        setSearchTerm(searchParams);
        setPagination({ page: 0, size: ITEMS_PER_PAGE });

        const queryParams = new URLSearchParams();
        if (searchParams.company)
            queryParams.append("company", searchParams.company);
        if (searchParams.location)
            queryParams.append("location", searchParams.location);
        if (searchParams.categoryIds?.length) {
            queryParams.append(
                "categoryIds",
                searchParams.categoryIds.join(",")
            );
        }
        queryParams.append("page", "0");
        queryParams.append("size", ITEMS_PER_PAGE.toString());

        window.history.pushState(
            null,
            "",
            `/company/company-search/results?${queryParams.toString()}`
        );

        searchCompanies(
            {
                name: searchParams.company,
                location: searchParams.location,
                categoryIds: searchParams.categoryIds,
            },
            0,
            ITEMS_PER_PAGE,
            `${sort.field},${sort.direction}`
        );
    };

    // Xử lý thay đổi bộ lọc
    const handleFilterChange = async (newFilters) => {
        const updatedFilters = { ...filters, ...newFilters };
        setFilters(updatedFilters);
        setPagination({ page: 0, size: ITEMS_PER_PAGE });

        try {
            if (
                updatedFilters.categoryIds &&
                updatedFilters.categoryIds.length > 0
            ) {
                const categoryIds = updatedFilters.categoryIds.join(",");
                await fetchCompaniesByCategories(
                    categoryIds,
                    0,
                    ITEMS_PER_PAGE,
                    `${sort.field},${sort.direction}`
                );
            } else {
                await fetchCompanies(
                    0,
                    ITEMS_PER_PAGE,
                    `${sort.field},${sort.direction}`
                );
            }
        } catch (error) {
            console.error("Error updating filters:", error);
        }
    };

    // Xử lý thay đổi trang
    const handlePageChange = (newPage) => {
        setPagination({ page: newPage, size: ITEMS_PER_PAGE });

        const queryParams = new URLSearchParams(window.location.search);
        queryParams.set("page", newPage.toString());

        window.history.pushState(
            null,
            "",
            `/company/company-search/results?${queryParams.toString()}`
        );

        // Thực hiện tìm kiếm với trang mới
        const name =
            searchParams.get("name") || searchParams.get("company") || "";
        const location = searchParams.get("location") || "";
        const categoryIdsParam = searchParams.get("categoryIds") || "";
        const categoryIds = categoryIdsParam
            ? categoryIdsParam.split(",").map(Number)
            : [];

        const performSearch = async () => {
            try {
                if (name && categoryIds.length > 0) {
                    await searchCompanies(
                        { name, categoryIds },
                        newPage,
                        ITEMS_PER_PAGE,
                        `${sort.field},${sort.direction}`
                    );
                } else if (categoryIds.length > 0) {
                    await fetchCompaniesByCategories(
                        categoryIds,
                        newPage,
                        ITEMS_PER_PAGE,
                        `${sort.field},${sort.direction}`
                    );
                } else if (name) {
                    await searchCompanies(
                        { name },
                        newPage,
                        ITEMS_PER_PAGE,
                        `${sort.field},${sort.direction}`
                    );
                } else if (location) {
                    await fetchCompaniesByLocation(
                        location,
                        newPage,
                        ITEMS_PER_PAGE,
                        `${sort.field},${sort.direction}`
                    );
                } else {
                    await fetchCompanies(
                        newPage,
                        ITEMS_PER_PAGE,
                        `${sort.field},${sort.direction}`
                    );
                }
            } catch (error) {
                console.error("Error changing page:", error);
            }
        };

        performSearch();
        window.scrollTo(0, 0);
    };

    // Xử lý thay đổi sắp xếp
    const handleSortChange = (field) => {
        const newDirection =
            sort.field === field && sort.direction === "asc" ? "desc" : "asc";
        setSort({ field, direction: newDirection });
        setPagination({ page: 0, size: ITEMS_PER_PAGE });

        const queryParams = new URLSearchParams(window.location.search);
        queryParams.set("sort", `${field},${newDirection}`);
        queryParams.set("page", "0");

        window.history.pushState(
            null,
            "",
            `/company/company-search/results?${queryParams.toString()}`
        );

        // Thực hiện tìm kiếm với sắp xếp mới
        const name =
            searchParams.get("name") || searchParams.get("company") || "";
        const location = searchParams.get("location") || "";
        const categoryIdsParam = searchParams.get("categoryIds") || "";
        const categoryIds = categoryIdsParam
            ? categoryIdsParam.split(",").map(Number)
            : [];

        const performSearch = async () => {
            try {
                if (name && categoryIds.length > 0) {
                    await searchCompanies(
                        { name, categoryIds },
                        0,
                        ITEMS_PER_PAGE,
                        `${field},${newDirection}`
                    );
                } else if (categoryIds.length > 0) {
                    await fetchCompaniesByCategories(
                        categoryIds,
                        0,
                        ITEMS_PER_PAGE,
                        `${field},${newDirection}`
                    );
                } else if (name) {
                    await searchCompanies(
                        { name },
                        0,
                        ITEMS_PER_PAGE,
                        `${field},${newDirection}`
                    );
                } else if (location) {
                    await fetchCompaniesByLocation(
                        location,
                        0,
                        ITEMS_PER_PAGE,
                        `${field},${newDirection}`
                    );
                } else {
                    await fetchCompanies(
                        0,
                        ITEMS_PER_PAGE,
                        `${field},${newDirection}`
                    );
                }
            } catch (error) {
                console.error("Error changing sort:", error);
            }
        };

        performSearch();
    };

    const toggleFilterOnMobile = () => {
        setShowFilterOnMobile(!showFilterOnMobile);
    };

    const filterCounts = getFilterCounts();

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
                <SearchBar onSearch={handleSearch} initialValues={searchTerm} />
            </div>

            <div className="lg:hidden mb-4">
                <button
                    onClick={toggleFilterOnMobile}
                    className="w-full py-2 px-4 flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                    <Filter className="w-4 h-4" />
                    {showFilterOnMobile ? "Hide filter" : "Show filter"}
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <div
                    className={`${
                        showFilterOnMobile ? "block" : "hidden"
                    } lg:block lg:w-1/4`}
                >
                    <FilterSidebar
                        filters={filters}
                        setFilters={handleFilterChange}
                        industries={industries}
                        companySizes={companySizes}
                        filterCounts={filterCounts}
                    />
                </div>

                <div className="lg:w-3/4">
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                                <Building className="mr-2 h-6 w-6 text-[#0A66C2]" />
                                All companies
                            </h2>

                            {/* Sắp xếp */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">
                                    Sort by:
                                </span>
                                <select
                                    value={`${sort.field},${sort.direction}`}
                                    onChange={(e) => {
                                        const [field, direction] =
                                            e.target.value.split(",");
                                        handleSortChange(field);
                                    }}
                                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="id,asc">
                                        Default (A-Z)
                                    </option>
                                    <option value="companyName,asc">
                                        Company Name (A-Z)
                                    </option>
                                    <option value="companyName,desc">
                                        Company Name (Z-A)
                                    </option>
                                    <option value="locationCity,asc">
                                        Location (A-Z)
                                    </option>
                                    <option value="locationCity,desc">
                                        Location (Z-A)
                                    </option>
                                    <option value="foundedYear,desc">
                                        Founded Year (Newest)
                                    </option>
                                    <option value="foundedYear,asc">
                                        Founded Year (Oldest)
                                    </option>
                                </select>
                            </div>
                        </div>

                        {/* Thông tin kết quả */}
                        <div className="text-sm text-gray-600 mb-4">
                            Displaying {pagination.page * pagination.size + 1} -{" "}
                            {Math.min(
                                (pagination.page + 1) * pagination.size,
                                pagination.totalElements
                            )}{" "}
                            out of {pagination.totalElements} companies
                        </div>
                    </div>

                    {/* Loading state */}
                    {isLoading && (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    )}

                    {/* Error state */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                            <p className="text-red-600">{error}</p>
                        </div>
                    )}

                    {/* Kết quả */}
                    {!isLoading && !error && (
                        <>
                            {companies.length === 0 ? (
                                <div className="text-center py-12">
                                    <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        No companies found
                                    </h3>
                                    <p className="text-gray-500">
                                        Try changing your search or filter
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {companies.map((company) => (
                                        <ResultItem
                                            key={company.id}
                                            company={company}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="mt-8 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() =>
                                                handlePageChange(
                                                    pagination.page - 1
                                                )
                                            }
                                            disabled={pagination.first}
                                            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>

                                        <div className="flex items-center gap-1">
                                            {Array.from(
                                                {
                                                    length: Math.min(
                                                        5,
                                                        pagination.totalPages
                                                    ),
                                                },
                                                (_, i) => {
                                                    const pageNum =
                                                        Math.max(
                                                            0,
                                                            Math.min(
                                                                pagination.totalPages -
                                                                    5,
                                                                pagination.page -
                                                                    2
                                                            )
                                                        ) + i;
                                                    return (
                                                        <button
                                                            key={pageNum}
                                                            onClick={() =>
                                                                handlePageChange(
                                                                    pageNum
                                                                )
                                                            }
                                                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                                                                pageNum ===
                                                                pagination.page
                                                                    ? "bg-blue-600 text-white"
                                                                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                                                            }`}
                                                        >
                                                            {pageNum + 1}
                                                        </button>
                                                    );
                                                }
                                            )}
                                        </div>

                                        <button
                                            onClick={() =>
                                                handlePageChange(
                                                    pagination.page + 1
                                                )
                                            }
                                            disabled={pagination.last}
                                            className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="text-sm text-gray-700">
                                        Page {pagination.page + 1} /{" "}
                                        {pagination.totalPages}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResultPageContent;
