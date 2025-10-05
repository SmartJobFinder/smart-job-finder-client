import React from "react";
import Image from "next/image";
import Link from "next/link";

const CompanyCard = ({ company }) => {
    // Đảm bảo company có dữ liệu
    if (!company) return null;

    // Đảm bảo đường dẫn logo được xử lý đúng
    const logoSrc = company.logo?.startsWith("/public/")
        ? company.logo.replace("/public/", "/")
        : company.logo || "/file.svg";

    return (
        <div className="bg-white border rounded-lg p-6 relative hover:shadow-md transition-shadow">
            {/* Job Count Badge */}
            <div className="absolute top-6 right-6 text-indigo-600 font-medium">
                {company.jobCount || 3} Jobs
            </div>

            {/* Logo and Company Name */}
            <div className="mb-4">
                <div className="w-20 h-20 rounded-full mb-4 flex items-center justify-center">
                    <Image
                        src={logoSrc}
                        alt={`${company.name} logo`}
                        width={80}
                        height={80}
                        className="object-contain"
                    />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                    {company.name}
                </h3>
            </div>

            {/* Company Description */}
            <p className="text-gray-600 text-sm mb-6">
                {company.location && <span>{company.location}. </span>}
                {company.description
                    ? company.description.length > 120
                        ? `${company.description.substring(0, 120)}...`
                        : company.description
                    : "Company information is being updated"}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
                <span className="px-4 py-1 bg-amber-50 text-amber-500 rounded-full border border-amber-200 text-sm">
                    Business Service
                </span>
                {company.tags?.map((tag, index) => (
                    <span
                        key={index}
                        className="px-4 py-1 bg-indigo-50 text-indigo-500 rounded-full border border-indigo-100 text-sm"
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default CompanyCard;
