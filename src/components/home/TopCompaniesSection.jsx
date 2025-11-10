"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { t } from "@/i18n/i18n";

const NEXT_PUBLIC_API_PROXY_TARGET = process.env.NEXT_PUBLIC_API_PROXY_TARGET;
const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE = NEXT_PUBLIC_API_PROXY_TARGET + NEXT_PUBLIC_API_BASE_URL;

async function fetchCompanies(signal) {
    const url = `${API_BASE}/companies?page=0&size=12`;
    const res = await fetch(url, { signal, credentials: "include" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

function normalizeCompany(c) {
    return {
        id: c.id,
        name: c.companyName || "Unknown Company",
        logo: c.avatar || "/logo-placeholder.png",
        location: `${c.locationCity || ""}, ${c.locationCountry || ""}`,
        openPositions: c.jobsCount || 0,
        pro: !!c.isProCompany,
    };
}

function sortWithPro(companies) {
    return [...companies].sort((a, b) => {
        if (a.pro !== b.pro) return a.pro ? -1 : 1;
        return b.openPositions - a.openPositions;
    });
}

const TopCompaniesSection = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            try {
                setLoading(true);
                const data = await fetchCompanies(controller.signal);
                const items = Array.isArray(data?.content) ? data.content : [];
                const normalized = items.map(normalizeCompany);
                const finalList = sortWithPro(normalized);
                setCompanies(finalList);
            } catch (e) {
                if (e.name !== "AbortError")
                    setErr(e.message || "Failed to load");
            } finally {
                setLoading(false);
            }
        })();
        return () => controller.abort();
    }, []);

    const body = useMemo(() => {
        if (loading) {
            return (
                <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="p-3 bg-white border border-gray-200 rounded-lg sm:p-4 lg:p-6 animate-pulse"
                        >
                            <div className="flex items-start mb-3 sm:mb-4">
                                <div className="w-10 h-10 mr-2 bg-gray-200 rounded-lg sm:w-12 sm:h-12 sm:mr-3" />
                                <div>
                                    <div className="w-32 h-4 mb-2 bg-gray-200 rounded" />
                                    <div className="w-20 h-3 bg-gray-200 rounded" />
                                </div>
                            </div>
                            <div className="w-24 h-4 mb-3 bg-gray-200 rounded sm:mb-4" />
                            <div className="w-full h-8 bg-gray-200 rounded" />
                        </div>
                    ))}
                </div>
            );
        }

        if (err) {
            return (
                <div className="p-3 text-xs text-red-700 border border-red-200 rounded sm:p-4 lg:p-6 sm:text-sm bg-red-50">
                    Failed to load company list. {err}
                </div>
            );
        }

        if (companies.length === 0) {
            return (
                <div className="p-3 text-xs text-gray-600 bg-white border border-gray-200 rounded sm:p-4 lg:p-6 sm:text-sm">
                    No companies are currently available.
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                {companies.map((company) => {
                    const href = `/company/company-detail/${company.id}`;
                    return (
                        <div
                            key={company.id}
                            className="p-3 transition-shadow bg-white border border-gray-200 rounded-lg sm:p-4 lg:p-6 hover:shadow-lg"
                        >
                            <div className="flex items-start justify-between mb-3 sm:mb-4">
                                <Link
                                    href={href}
                                    className="flex items-center group"
                                >
                                    <div className="flex items-center justify-center w-8 h-8 mr-2 overflow-hidden bg-white border rounded-lg sm:w-10 sm:h-10 lg:w-12 lg:h-12 sm:mr-3">
                                        <img
                                            src={company.logo}
                                            alt={company.name}
                                            className="object-contain w-full h-full"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900 sm:text-base group-hover:underline">
                                            {company.name}
                                        </h3>
                                        {company.pro && (
                                            <div className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded inline-block mt-1">
                                                PRO Company
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            </div>
                            <div className="flex items-center mb-3 text-xs text-gray-600 sm:mb-4 sm:text-sm">
                                <MapPin className="w-3 h-3 mr-1 sm:w-4 sm:h-4" />
                                {company.location}
                            </div>
                            <Link href={href} className="w-full">
                                <Button className="w-full text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 sm:text-base">
                                    Open Positions ({company.openPositions})
                                </Button>
                            </Link>
                        </div>
                    );
                })}
            </div>
        );
    }, [companies, loading, err]);

    return (
        <section className="py-8 sm:py-12 lg:py-16">
            <div className="container px-2 mx-auto sm:px-4">
                <div className="flex items-center justify-between mb-8 sm:mb-12">
                    <h2 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
                        {t`Top companies`}
                    </h2>
                    <Link
                        href="/company/company-search/results"
                        className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 sm:text-base"
                    >
                        {t`View All`}{" "}
                        <ArrowRight className="w-3 h-3 ml-2 sm:w-4 sm:h-4" />
                    </Link>
                </div>
                {body}
            </div>
        </section>
    );
};

export default TopCompaniesSection;
