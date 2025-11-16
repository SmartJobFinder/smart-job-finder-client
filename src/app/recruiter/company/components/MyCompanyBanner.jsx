"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import useMyCompanyStore from "../store/myCompanyStore";
import { getImageUrl } from "@/lib/utils";
import { t } from "@/i18n/i18n";

const MyCompanyBanner = () => {
    const { company } = useMyCompanyStore();

    if (!company) return null;

    return (
        <div className="relative mx-auto overflow-hidden rounded-lg shadow-lg max-w-7xl">
            {/* Background Cover Image */}
            <div
                className="relative h-64 bg-center bg-cover"
                style={{
                    backgroundImage: `url(${
                        getImageUrl(company.avatarCover) ||
                        "https://static.topcv.vn/company_covers/tap-doan-cong-nghiep-vien-thong-quan-doi-e3c6e7727df189e29507b150c6a7d893-64c328ef424bd.jpg"
                    })`,
                }}
            >
                {/* Dark Overlay for better text contrast */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/70"></div>

                {/* Company Info Section */}
                <div className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-white/90 backdrop-blur-sm border-t-2 border-white/50">
                    <div className="flex items-center justify-between">
                        {/* Left: Logo + Info */}
                        <div className="flex items-center gap-4">
                            {/* Company Logo */}
                            <div className="w-20 h-20 p-2 bg-white border-2 border-gray-200 rounded-lg shadow-md flex-shrink-0">
                                <Image
                                    src={getImageUrl(company.avatar)}
                                    alt={company.companyName}
                                    width={80}
                                    height={80}
                                    className="object-contain w-full h-full"
                                />
                            </div>

                            {/* Company Details */}
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                                    {company.companyName}
                                </h1>
                                <div className="flex flex-wrap items-center gap-3 text-sm">
                                    {/* VIP Badge */}
                                    <span
                                        className={`inline-flex items-center px-2.5 py-1 rounded-full font-semibold ${
                                            company.proCompany
                                                ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 shadow-sm"
                                                : "bg-gray-100 text-gray-700"
                                        }`}
                                    >
                                        {company.proCompany ? (
                                            <>
                                                <svg
                                                    className="w-3.5 h-3.5 mr-1"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                                VIP Company
                                            </>
                                        ) : (
                                            "Normal"
                                        )}
                                    </span>

                                    {/* Website */}
                                    <a
                                        href={company.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
                                    >
                                        {company.website?.replace(
                                            /^https?:\/\//,
                                            ""
                                        )}
                                    </a>

                                    {/* Employees */}
                                    <span className="text-gray-600">
                                        <span className="font-semibold text-gray-900">
                                            {company.quantityEmployee}+
                                        </span>{" "}
                                        {t`employees`}
                                    </span>

                                    {/* Followers */}
                                    <span className="text-gray-600">
                                        <span className="font-semibold text-gray-900">
                                            {company.followersCount || 0}
                                        </span>{" "}
                                        {t`followers`}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Action Buttons */}
                        <div className="flex gap-3">
                            <Link href="/recruiter/company/edit">
                                <button className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md">
                                    <svg
                                        className="w-4 h-4 inline-block mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                        />
                                    </svg>
                                    {t`Edit Company`}
                                </button>
                            </Link>
                            <Link href="/recruiter/manage-job">
                                <button className="px-5 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors shadow-sm hover:shadow-md">
                                    <svg
                                        className="w-4 h-4 inline-block mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                    {t`Manage Jobs`}
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyCompanyBanner;
