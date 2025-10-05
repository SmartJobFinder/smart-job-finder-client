import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import SearchBar from "../components/SearchBar";
import PopularSearches from "../components/PopularSearches";
import RecommendedCompanies from "../components/RecommendedCompanies";
import CallToAction from "../components/CallToAction";
import CompanyGrid from "../components/CompanyGrid";
import {
    recommendedCompanies,
    popularCompanies,
    designCompanies,
} from "../utils/mockData";

const SearchCompanyPage = () => {
    const router = useRouter();

    const handleSearch = (searchParams) => {
        const queryParams = new URLSearchParams();

        if (searchParams.company) {
            queryParams.append("company", searchParams.company);
        }

        if (searchParams.location) {
            queryParams.append("location", searchParams.location);
        }

        router.push(
            `/company/company-search/results?${queryParams.toString()}`
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    Find your{" "}
                    <span className="text-blue-500">dream companies</span>
                </h1>
                <p className="text-gray-600">
                    Find the dream companies you dream work for
                </p>
            </div>

            <SearchBar onSearch={handleSearch} />

            <PopularSearches companies={popularCompanies} />

            <RecommendedCompanies companies={recommendedCompanies} />

            <CallToAction />

            <CompanyGrid
                companies={designCompanies}
                title="Design Companies"
                viewMoreLink="/company/company-search/results?category=design"
            />
        </div>
    );
};

export default SearchCompanyPage;

