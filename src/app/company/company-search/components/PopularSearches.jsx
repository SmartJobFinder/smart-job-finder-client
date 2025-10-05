"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building } from "lucide-react";
import useCompanySearchStore from "../store/companySearchStore";

const PopularSearches = () => {
    const router = useRouter();
    const { industries, fetchIndustries } = useCompanySearchStore();

    useEffect(() => {
        fetchIndustries();
    }, [fetchIndustries]);

    // Lấy 8 ngành nghề phổ biến
    const popularIndustries = industries.slice(0, 8);

    // Xử lý tìm kiếm theo category
    const handleCategorySearch = (categoryId, categoryName) => {
        // Đảm bảo categoryId là số nguyên, nhưng giữ nguyên dạng chuỗi cho URL
        router.push(
            `/company/company-search/results?categoryIds=${categoryId}&page=0&size=10&sort=id,asc`
        );
    };

    return (
        <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Popular searches
            </h2>

            <div className="space-y-6">
                {/* Ngành nghề phổ biến */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                        <Building className="mr-2 h-5 w-5 text-[#0A66C2]" />
                        Industry
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {popularIndustries.map((industry) => (
                            <button
                                key={industry.cate_id}
                                onClick={() =>
                                    handleCategorySearch(
                                        industry.cate_id,
                                        industry.cate_name
                                    )
                                }
                                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-[#0A66C2] rounded-full text-sm transition-colors flex items-center"
                            >
                                <Building className="mr-1 h-4 w-4" />
                                {industry.cate_name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PopularSearches;
