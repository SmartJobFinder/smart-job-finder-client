import React from "react";
import Image from "next/image";
import Link from "next/link";

const CompanyGridItem = ({ company, simple = false }) => {
    // Đảm bảo company có dữ liệu
    if (!company) return null;

    // Đảm bảo đường dẫn logo được xử lý đúng
    const logoSrc = company.logo?.startsWith("/public/")
        ? company.logo.replace("/public/", "/")
        : company.logo || "/file.svg";

    if (simple) {
        return (
            <div className="bg-white border rounded-lg p-6 hover:shadow-sm transition-shadow text-center">
                <div className="mb-4 flex justify-center">
                    <Image
                        src={logoSrc}
                        alt={`${company.name} logo`}
                        width={64}
                        height={64}
                        className="object-contain"
                    />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                    {company.name}
                </h3>
                <div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-sm inline-block">
                    {company.jobCount || 3} Jobs
                </div>
            </div>
        );
    }

    return (
        <Link
            href={`/company/${company.id || company.company_id}`}
            className="block"
        >
            <div className="bg-white border rounded-lg p-6 hover:shadow-sm transition-shadow text-center">
                <div className="mb-3 flex justify-center">
                    <Image
                        src={logoSrc}
                        alt={`${company.name} logo`}
                        width={64}
                        height={64}
                        className="object-contain"
                    />
                </div>
                <h3 className="font-medium text-gray-800 mb-2">
                    {company.name}
                </h3>
                <div className="text-indigo-600 text-sm">
                    {company.jobCount ||
                        (company.name === "Wolff Olins" ? 2 : 3)}{" "}
                    Jobs
                </div>
            </div>
        </Link>
    );
};

const CompanyGrid = ({
    companies = [],
    title,
    simple = false,
    viewMoreLink = null,
}) => {
    // Kiểm tra nếu không có dữ liệu công ty
    if (!companies || companies.length === 0) {
        return (
            <div className="mt-12">
                {title && (
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        {title}
                    </h2>
                )}
                <p className="text-center text-gray-500">
                    No companies in this category
                </p>
            </div>
        );
    }

    return (
        <div className="mt-12">
            {title && (
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    {title}
                </h2>
            )}

            <div
                className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${
                    simple ? "xl:grid-cols-8" : ""
                }`}
            >
                {companies.map((company) => (
                    <CompanyGridItem
                        key={company.id || company.company_id}
                        company={company}
                        simple={simple}
                    />
                ))}
            </div>

            {viewMoreLink && (
                <div className="mt-8 text-center">
                    <Link
                        href={viewMoreLink}
                        className="text-blue-600 hover:underline inline-flex items-center"
                    >
                        View more {title ? title.toLowerCase() : "companies"}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default CompanyGrid;
