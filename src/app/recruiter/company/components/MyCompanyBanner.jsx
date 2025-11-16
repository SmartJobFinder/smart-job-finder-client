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
        <div
            className="relative h-64 mx-auto overflow-hidden bg-center bg-cover rounded-lg shadow max-w-7xl"
            style={{
                backgroundImage: `url(${
                    getImageUrl(company.avatarCover) ||
                    "https://static.topcv.vn/company_covers/tap-doan-cong-nghiep-vien-thong-quan-doi-e3c6e7727df189e29507b150c6a7d893-64c328ef424bd.jpg"
                })`,
            }}
        >
            <div className="absolute bottom-0 left-0 flex items-center justify-between w-full px-4 py-4 border rounded-b-lg bg-white/30 backdrop-blur-sm border-white/30">
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 p-1 bg-white border border-gray-300 rounded">
                        <Image
                            src={getImageUrl(company.avatar)}
                            alt={company.companyName}
                            width={64}
                            height={64}
                            className="object-contain w-full h-full"
                        />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white drop-shadow-lg">
                            {company.companyName}
                        </h1>
                        <div className="mt-2 text-sm text-white drop-shadow-md">
                            <span
                                className={`px-2 py-0.5 mr-2 rounded ${
                                    company.proCompany
                                        ? "text-yellow-800 bg-yellow-100"
                                        : "text-gray-800 bg-gray-100"
                                }`}
                            >
                                {company.proCompany ? "VIP Company" : "Normal"}
                            </span>
                            <a
                                href={company.website}
                                className="hover:text-blue-200 underline"
                            >
                                {company.website?.replace("https://", "")}
                            </a>
                            <span className="text-white">
                                {" "}
                                · {company.quantityEmployee}+ employees ·{" "}
                                {company.followersCount || 0} followers
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <Link href="/recruiter/company/edit">
                        <button className="px-4 py-2 text-sm font-semibold text-white transition bg-blue-600 rounded hover:bg-blue-700">
                            Edit Company
                        </button>
                    </Link>
                    <Link
                        href="/recruiter/manage-job"
                        className="px-4 py-2 text-sm font-semibold text-white transition bg-green-600 rounded hover:bg-green-700"
                    >
                        {t`Manage Jobs`}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default MyCompanyBanner;

// "use client";

// import React from "react";
// import { Button } from "@/components/ui/button";
// import { Edit, Star } from "lucide-react";
// import useMyCompanyStore from "../store/myCompanyStore";
// import Link from "next/link";
// import Image from "next/image";

// const MyCompanyBanner = () => {
//     const { company } = useMyCompanyStore();

//     if (!company) return null;

//     return (
//         <div className="overflow-hidden rounded-xl">
//             {/* Cover Image */}
//             <div className="relative h-60 bg-gray-200">
//                 {company.avatarCover ? (
//                     <img
//                         src={company.avatarCover}
//                         alt="Company Cover"
//                         className="object-cover w-full h-full"
//                     />
//                 ) : (
//                     <div className="w-full h-full bg-gradient-to-r from-blue-400 to-blue-600" />
//                 )}

//                 {/* Overlay */}
//                 <div className="absolute inset-0 flex items-end bg-black/30">
//                     <div className="container flex items-center gap-6 p-6">
//                         {/* Company Logo */}
//                         <div className="w-24 h-24 overflow-hidden bg-white border-4 border-white rounded-xl shadow-lg">
//                             <img
//                                 src={company.avatar || "/placeholder.svg"}
//                                 alt={company.company_name}
//                                 className="object-cover w-full h-full"
//                             />
//                         </div>

//                         {/* Company Info */}
//                         <div className="flex-1">
//                             <div className="flex flex-wrap items-center gap-3">
//                                 <h1 className="text-2xl font-bold text-white">
//                                     {company.company_name}
//                                 </h1>
//                                 {company.proCompany && (
//                                     <span className="px-2 py-1 text-xs font-bold bg-yellow-500 rounded text-yellow-900">
//                                         VIP
//                                     </span>
//                                 )}
//                             </div>
//                             <div className="flex flex-wrap gap-4 mt-2 text-sm text-white/80">
//                                 <span>
//                                     {company.locationCity},{" "}
//                                     {company.locationCountry}
//                                 </span>
//                                 <span>
//                                     {company.quantityEmployee}+ employees
//                                 </span>
//                                 <span>
//                                     {new Date().getFullYear() -
//                                         company.foundedYear}{" "}
//                                     years in business
//                                 </span>
//                             </div>
//                         </div>

//                         {/* Actions */}
//                         <div className="flex gap-3">
//                             <Link href="/recruiter/company/edit">
//                                 <Button
//                                     variant="secondary"
//                                     className="bg-white"
//                                 >
//                                     <Edit className="w-4 h-4 mr-2" />
//                                     Edit Company
//                                 </Button>
//                             </Link>
//                             <Link href="/recruiter/companyVip">
//                                 <Button className="text-black bg-yellow-500 hover:bg-yellow-600">
//                                     <Star className="w-4 h-4 mr-2" />
//                                     Upgrade to VIP
//                                 </Button>
//                             </Link>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default MyCompanyBanner;
