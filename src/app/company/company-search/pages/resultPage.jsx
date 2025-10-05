"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import SearchBar from "../components/SearchBar";
import FilterSidebar from "../components/FilterSidebar";
import ResultItem from "../components/ResultItem";
import useCompanyStore from "../store/companyStore";

const companySizes = [
    { id: "1-10", label: "1-10 employees" },
    { id: "11-50", label: "11-50 employees" },
    { id: "51-200", label: "51-200 employees" },
    { id: "201-500", label: "201-500 employees" },
    { id: "501+", label: "501+ employees" },
];
const ResultItemSkeleton = () => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 animate-pulse">
        <div className="flex items-start">
            {/* Logo Skeleton */}
            <div className="w-16 h-16 flex-shrink-0 mr-4 bg-gray-200 rounded-md"></div>

            {/* Content Skeleton */}
            <div className="flex-1">
                <div className="flex flex-wrap justify-between mb-2">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                </div>

                <div className="flex flex-wrap gap-3 mb-3">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-4 bg-gray-200 rounded w-28"></div>
                </div>

                <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
            </div>
        </div>
    </div>
);

const ITEMS_PER_PAGE = 8;

const ResultPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Lấy state và actions từ Zustand store
    const {
        companies,
        industries,
        filters,
        searchTerm,
        isLoading,
        error,
        fetchCompanies,
        fetchIndustries,
        setFilters,
        setSearchTerm,
        getFilteredCompanies,
        getFilterCounts,
    } = useCompanyStore();

    const [currentPage, setCurrentPage] = useState(1);
    const [isLoadingPage, setIsLoadingPage] = useState(true);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [resultsVisible, setResultsVisible] = useState(false);

    useEffect(() => {
        const company = searchParams.get("company") || "";
        const location = searchParams.get("location") || "";

        const categoryIdsParam = searchParams.get("categoryIds") || "";
        const categoryIds = categoryIdsParam
            ? categoryIdsParam.split(",").map(Number)
            : [];

        setSearchTerm({ company, location });

        if (categoryIds.length > 0) {
            setFilters((prev) => ({ ...prev, categoryIds }));
        }

        const fetchData = async () => {
            setIsLoadingPage(true);
            await Promise.all([fetchCompanies(), fetchIndustries()]);

            setTimeout(() => {
                setIsLoadingPage(false);

                // Hiệu ứng fade-in cho kết quả
                setTimeout(() => {
                    setResultsVisible(true);
                }, 100);
            }, 800);
        };

        fetchData();
    }, [searchParams]);

    // Lọc kết quả
    const filteredResults = getFilteredCompanies();
    const filterCounts = getFilterCounts();

    const handleSearch = (searchParams) => {
        setResultsVisible(false);
        setIsTransitioning(true);

        setTimeout(() => {
            setSearchTerm(searchParams);

            const queryParams = new URLSearchParams();

            if (searchParams.company) {
                queryParams.append("company", searchParams.company);
            }

            if (searchParams.location) {
                queryParams.append("location", searchParams.location);
            }

            if (
                searchParams.categoryIds &&
                searchParams.categoryIds.length > 0
            ) {
                queryParams.append(
                    "categoryIds",
                    searchParams.categoryIds.join(",")
                );
            }

            router.push(
                `/company/company-search/results?${queryParams.toString()}`
            );

            setTimeout(() => {
                setIsTransitioning(false);
                setResultsVisible(true);
            }, 300);
        }, 300);
    };

    // Logic phân trang
    const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);
    const paginatedResults = filteredResults.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page) => {
        // Hiệu ứng chuyển trang
        setResultsVisible(false);

        setTimeout(() => {
            setCurrentPage(page);
            window.scrollTo({
                top: 0,
                behavior: "smooth",
            });

            // Hiển thị kết quả mới sau khi chuyển trang
            setTimeout(() => {
                setResultsVisible(true);
            }, 100);
        }, 300);
    };

    const handleFilterChange = (newFilters) => {
        setResultsVisible(false);

        setTimeout(() => {
            setFilters(newFilters);
            setCurrentPage(1);

            setTimeout(() => {
                setResultsVisible(true);
            }, 100);
        }, 300);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
                <SearchBar onSearch={handleSearch} initialValues={searchTerm} />
            </div>

            <div
                className={`flex flex-col lg:flex-row gap-8 transition-opacity duration-300 ${
                    isTransitioning ? "opacity-50" : "opacity-100"
                }`}
            >
                <div className="lg:w-1/4">
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
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            All companies
                        </h2>
                        <p className="text-gray-600">
                            {isLoading || isLoadingPage
                                ? "Loading..."
                                : `Displaying ${filteredResults.length} results`}
                            {searchTerm.company &&
                                ` cho "${searchTerm.company}"`}
                            {searchTerm.location &&
                                searchTerm.company &&
                                " tại "}
                            {searchTerm.location && `${searchTerm.location}`}
                        </p>
                    </div>

                    {isLoading || isLoadingPage ? (
                        <div className="space-y-4">
                            {[...Array(4)].map((_, index) => (
                                <ResultItemSkeleton key={index} />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 bg-red-50 border border-red-200 rounded-lg shadow-sm">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-12 w-12 mx-auto text-red-500 mb-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <p className="text-red-500 text-lg mb-4">
                                An error occurred: {error}
                            </p>
                            <button
                                onClick={fetchCompanies}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Try again
                            </button>
                        </div>
                    ) : filteredResults.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-16 w-16 mx-auto text-gray-400 mb-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                />
                            </svg>
                            <p className="text-gray-500 text-lg mb-4">
                                No companies found that match your criteria.
                            </p>
                            <p className="text-gray-600">
                                Please adjust your search or filters.
                            </p>
                        </div>
                    ) : (
                        <div
                            className={`space-y-4 transition-all duration-500 ${
                                resultsVisible ? "opacity-100" : "opacity-0"
                            }`}
                        >
                            {paginatedResults.map((company, index) => (
                                <div
                                    key={company.id}
                                    style={{
                                        animation:
                                            "fadeInUp 0.5s ease forwards",
                                        animationDelay: `${index * 100}ms`,
                                    }}
                                >
                                    <ResultItem company={company} />
                                </div>
                            ))}

                            {/* Phân trang */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-8">
                                    <button
                                        onClick={() =>
                                            handlePageChange(currentPage - 1)
                                        }
                                        disabled={currentPage === 1}
                                        className={`w-10 h-10 flex items-center justify-center rounded-md transition-all ${
                                            currentPage === 1
                                                ? "text-gray-400 cursor-not-allowed"
                                                : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                                        }`}
                                        aria-label="Previous page"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 19l-7-7 7-7"
                                            />
                                        </svg>
                                    </button>

                                    {Array.from(
                                        { length: Math.min(totalPages, 5) },
                                        (_, i) => {
                                            // Hiển thị trang hiện tại và các trang xung quanh
                                            let pageNum = currentPage;
                                            if (pageNum <= 3) {
                                                pageNum = i + 1;
                                            } else if (
                                                pageNum >=
                                                totalPages - 2
                                            ) {
                                                pageNum = totalPages - 4 + i;
                                            } else {
                                                pageNum = pageNum - 2 + i;
                                            }

                                            // Nếu trang nằm ngoài phạm vi, không hiển thị
                                            if (
                                                pageNum <= 0 ||
                                                pageNum > totalPages
                                            ) {
                                                return null;
                                            }

                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() =>
                                                        handlePageChange(
                                                            pageNum
                                                        )
                                                    }
                                                    className={`w-10 h-10 flex items-center justify-center rounded-md transition-all ${
                                                        currentPage === pageNum
                                                            ? "bg-blue-600 text-white shadow-md"
                                                            : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                                                    }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        }
                                    )}

                                    {totalPages > 5 &&
                                        currentPage < totalPages - 2 && (
                                            <>
                                                {currentPage <
                                                    totalPages - 3 && (
                                                    <span className="px-2 text-gray-500">
                                                        ...
                                                    </span>
                                                )}
                                                <button
                                                    onClick={() =>
                                                        handlePageChange(
                                                            totalPages
                                                        )
                                                    }
                                                    className="w-10 h-10 flex items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-all"
                                                >
                                                    {totalPages}
                                                </button>
                                            </>
                                        )}

                                    <button
                                        onClick={() =>
                                            handlePageChange(currentPage + 1)
                                        }
                                        disabled={currentPage === totalPages}
                                        className={`w-10 h-10 flex items-center justify-center rounded-md transition-all ${
                                            currentPage === totalPages
                                                ? "text-gray-400 cursor-not-allowed"
                                                : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                                        }`}
                                        aria-label="Next page"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <style jsx global>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default ResultPage;
