"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import useCompanyDetailStore from "../store/companyDetailStore";
import { getImageUrl } from "@/lib/utils";
import { t } from "@/i18n/i18n";

const RelatedCompanies = () => {
    const { relatedCompanies } = useCompanyDetailStore();

    if (relatedCompanies.length === 0) return null;

    return (
        <div className="p-6 bg-white rounded-lg shadow-xl">
            <div className="p-6 mt-4 text-white rounded-t-lg bg-gradient-to-r from-[#0A66C2] to-[#1F2937]">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                        {t`Representative brands in the same field`}
                    </h2>
                    <span className="px-2 py-1 text-xs font-bold text-[#FF8A00] bg-[#FFFAF0] rounded">
                        Pro Company
                    </span>
                </div>
                <p className="mt-1 text-sm text-white/80">
                    {t`The brands that have established their position on the market.`}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-3">
                {relatedCompanies.slice(0, 10).map((company, index) => (
                    <Link
                        href={`/company/company-detail/${company.id}`}
                        key={company.id}
                        className="flex items-center gap-3 p-3 border rounded hover:shadow border-[#FF8A00]/30"
                    >
                        <div className="w-10 h-10">
                            <Image
                                src={getImageUrl(company.avatar)}
                                alt={company.companyName || "Company"}
                                width={40}
                                height={40}
                                className="object-contain w-full h-full"
                            />
                        </div>
                        <div className="w-full overflow-hidden text-sm">
                            <h3 className="text-sm font-semibold truncate text-[#1F2937]">
                                {company.companyName}
                            </h3>
                            <p className="text-xs text-gray-500">
                                {company.parentCategories?.join(", ")}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RelatedCompanies;
