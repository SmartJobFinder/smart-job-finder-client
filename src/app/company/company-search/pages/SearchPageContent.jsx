"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "../components/SearchBar";
import PopularSearches from "../components/PopularSearches";
import RecommendedCompanies from "../components/RecommendedCompanies";
import CallToAction from "../components/CallToAction";
import useCompanySearchStore from "../store/companySearchStore";

const SearchPageContent = () => {
    const router = useRouter();
    const { fetchCompanies, fetchIndustries } = useCompanySearchStore();

    useEffect(() => {
        fetchCompanies();
        fetchIndustries();
    }, [fetchCompanies, fetchIndustries]);

    const handleSearch = (searchParams) => {
        const queryParams = new URLSearchParams();

        if (searchParams.company) {
            queryParams.append("name", searchParams.company);
        }

        if (searchParams.location) {
            queryParams.append("location", searchParams.location);
        }

        if (searchParams.categoryIds && searchParams.categoryIds.length > 0) {
            queryParams.append(
                "categoryIds",
                searchParams.categoryIds.join(",")
            );
        }

        console.log("Searching with params:", queryParams.toString());
        router.push(
            `/company/company-search/results?${queryParams.toString()}`
        );
    };

    return (
        <div className="py-12">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <h1 className="mb-4 text-4xl font-bold text-gray-900">
                        Search for a company
                    </h1>
                    <p className="max-w-3xl mx-auto text-xl text-gray-600">
                        Discover companies that match your interests and skills.
                        Search by name, location, industry, or size.
                    </p>
                </div>

                <div className="mb-16">
                    <SearchBar onSearch={handleSearch} />
                </div>

                <div className="mb-16">
                    <RecommendedCompanies />
                </div>
                
                <div className="mb-16">
                    <PopularSearches />
                </div>


                <div>
                    <CallToAction />
                </div>
            </div>
        </div>
    );
};

export default SearchPageContent;
