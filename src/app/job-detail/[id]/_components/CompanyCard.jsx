"use client";
import Link from "next/link";
import { Crown } from "lucide-react";

export default function CompanyCard({ avatar, companyName, companyId, isProCompany = false }) {
    const imageSrc = typeof avatar === "string" && avatar.trim() !== "" ? avatar : undefined;
    return (
        <div className="relative flex flex-col items-center justify-center p-6 space-y-3 text-center bg-white shadow-lg rounded-xl">
            {isProCompany && (
                <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-gradient-to-r from-blue-600 to-sky-500 shadow">
                    <Crown size={12} className="text-white" /> VIP
                </span>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div className="w-full h-24 border rounded-md bg-white overflow-hidden">
                {imageSrc ? (
                    <img
                        src={imageSrc}
                        alt="Company Logo"
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        No Logo
                    </div>
                )}
            </div>
            {companyId ? (
                <Link
                    href={`/company/company-detail/${companyId}`}
                    className="transition hover:underline hover:text-blue-600"
                >
                    {companyName}
                </Link>
            ) : (
                <div className="text-gray-800">{companyName}</div>
            )}
        </div>
    );
}
