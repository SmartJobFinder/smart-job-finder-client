"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "../components/SearchBar";
import PopularSearches from "../components/PopularSearches";
import RecommendedCompanies from "../components/RecommendedCompanies";
import CallToAction from "../components/CallToAction";
import useCompanySearchStore from "../store/companySearchStore";
import { t } from "@/i18n/i18n";

const SearchPageContent = () => {
    const router = useRouter();
    const { fetchAllCompanies, fetchIndustries, fetchLocations } =
        useCompanySearchStore();

    useEffect(() => {
        // Load initial data
        fetchAllCompanies(); // Load all companies for recommendations
        fetchIndustries();
        fetchLocations();
    }, [fetchAllCompanies, fetchIndustries, fetchLocations]);

    const handleSearch = (searchParams) => {
        const queryParams = new URLSearchParams();

        if (searchParams.company) {
            queryParams.append("company", searchParams.company);
        }

        if (searchParams.location) {
            queryParams.append("location", searchParams.location);
        }

        if (searchParams.categoryIds?.length) {
            queryParams.append(
                "categoryIds",
                searchParams.categoryIds.join(",")
            );
        }

        // Add pagination params
        queryParams.append("page", "0");
        queryParams.append("size", "10");
        queryParams.append("sort", "id,asc");

        router.push(
            `/company/company-search/results?${queryParams.toString()}`
        );
    };

    return (
        <div className="py-12">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <h1 className="mb-4 text-4xl font-bold text-gray-900">
                        {t`Search for a company`}
                    </h1>
                    <p className="max-w-3xl mx-auto text-xl text-gray-600">
                        {t`Discover companies that match your interests and skills. Search by name, location, industry, or size.`}
                    </p>
                </div>

                <div className="mb-16">
                    <SearchBar onSearch={handleSearch} />
                </div>

                <div className="mb-16">
                    <PopularSearches />
                </div>

                <div className="mb-16">
                    <RecommendedCompanies />
                </div>

                <div>
                    <CallToAction />
                </div>
            </div>
        </div>
    );
};

export default SearchPageContent;
