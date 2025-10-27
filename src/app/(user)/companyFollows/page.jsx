"use client";

import {
    useGetFollowedCompaniesByUserQuery,
    useUnfollowCompanyMutation,
} from "@/services/followCompanyService";
import Link from "next/link";
import { Eye, Trash2, Building2, Users, Briefcase } from "lucide-react";
import LoadingScreen from "@/components/ui/loadingScreen";
import Image from "next/image";

export default function ListCompanyFollowed() {
    const {
        data: followedCompanies = { content: [] },
        error,
        isLoading,
    } = useGetFollowedCompaniesByUserQuery();

    const [unfollowCompany] = useUnfollowCompanyMutation();

    const handleUnfollow = async (companyId) => {
        if (
            await window.customConfirm({
                title: "Unfollow Company",
                description: "Are you sure you want to unfollow this company?",
                confirmText: "Unfollow",
                cancelText: "Cancel",
            })
        ) {
            try {
                await unfollowCompany(companyId).unwrap();
            } catch (err) {
                console.error("Error while unfollowing company:", err);
            }
        }
    };

    if (isLoading) {
        return <LoadingScreen message="Loading company list..." />;
    }

    if (error) {
        const errorMessage =
            error?.data?.message || error?.error || "An error occurred";
        return (
            <div className="container max-w-6xl p-6 mx-auto">
                <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                    <div className="p-4 bg-red-100 rounded-full">
                        <Building2 className="w-8 h-8 text-red-600" />
                    </div>
                    <div className="text-center">
                        <h2 className="mb-2 text-xl font-semibold text-red-600">
                            Unable to load data
                        </h2>
                        <p className="text-gray-600">Error: {errorMessage}</p>
                    </div>
                </div>
            </div>
        );
    }

    const companies = followedCompanies?.content || [];

    return (
        <div className="container">
            {/* Header Section */}
            <div className="px-4 py-3 mb-4 border-b border-gray-100 sm:px-6 sm:py-4 bg-gradient-to-r from-blue-200 to-indigo-50 rounded-xl">
                <div className="max-w-6xl mx-auto">
                    <h1 className="pl-3 text-xl font-bold text-gray-900 border-l-4 border-blue-800 sm:pl-4 sm:text-2xl">
                        Follow the companies you care about
                    </h1>
                </div>
            </div>

            {/* Companies List */}
            {companies.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                    <div className="p-6 mb-6 bg-gray-100 rounded-full">
                        <Building2 className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-gray-600">
                        No companies yet
                    </h3>
                    <p className="max-w-md text-center text-gray-500">
                        You haven’t followed any companies yet. Discover and
                        follow the ones you’re interested in.
                    </p>
                </div>
            ) : (
                <div className="space-y-3 sm:space-y-4">
                    {companies.map((company) => (
                        <div
                            key={company.companyId}
                            className="relative flex flex-col gap-4 px-4 py-4 transition-all duration-300 bg-white border border-gray-200 shadow-sm md:flex-row md:items-center sm:px-5 sm:py-6 z-2 group rounded-2xl hover:shadow-lg hover:border-blue-200"
                        >
                            <div className="flex-shrink-0 md:mr-6">
                                <Image
                                    width={72}
                                    height={72}
                                    src={
                                        company.companyAvatar ||
                                        "https://static.topcv.vn/company_logos/default-logo.png"
                                    }
                                    alt={`${company.companyName} logo`}
                                    className="object-cover transition-shadow duration-300 rounded-xl group-hover:shadow-md"
                                />
                            </div>

                            <div className="justify-start flex-1 min-w-0">
                                <h3 className="mb-1 text-base font-semibold text-gray-900 truncate sm:mb-2 sm:text-lg">
                                    {company.companyName}
                                </h3>

                                <div className="space-y-1">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Users className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0 text-gray-400" />
                                        <span className="text-base sm:text-lg">
                                            {company.quantityEmployee} employees
                                        </span>
                                    </div>

                                    <div className="flex items-center text-gray-500">
                                        <Briefcase className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0 text-gray-400" />
                                        <span>
                                            {company.jobsCount} open jobs
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center w-full gap-2 mt-1 md:w-auto md:items-center md:flex-shrink-0 md:ml-6 sm:gap-3 md:mt-0">
                                <Link
                                    href={`/company/company-detail/${company.companyId}`}
                                    className="flex-1 md:flex-none inline-flex items-center justify-center px-4 sm:px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
                                    aria-label={`View details of ${company.companyName}`}
                                >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                </Link>

                                <button
                                    onClick={() =>
                                        handleUnfollow(company.companyId)
                                    }
                                    className="p-2.5 cursor-pointer text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group/delete"
                                    aria-label={`Unfollow ${company.companyName}`}
                                >
                                    <Trash2 className="w-4 h-4 transition-transform duration-200 group-hover/delete:scale-110" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
// "use client";
// import { useState } from "react";
// import {
//     Eye,
//     Trash2,
//     Building2,
//     Users,
//     Briefcase,
//     Bell,
//     MapPin,
// } from "lucide-react";
// import LoadingScreen from "@/components/ui/loadingScreen";
// import Image from "next/image";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { companyUpdates } from "@/mock/data/companyUpdates";
// import { followedCompanies } from "@/mock/data/followedCompanies";

// export default function ListCompanyFollowed() {
//     const [loading, setLoading] = useState(false);

//     const handleUnfollow = (companyId) => {
//         // Mock unfollowing functionality
//         console.log("Unfollowing company:", companyId);
//     };

//     if (loading) return <LoadingScreen message="Loading ..." />;

//     return (
//         <div className="p-6 space-y-8">
//             <div className="flex justify-between items-center">
//                 <h1 className="text-2xl font-bold">Companies You Follow</h1>
//                 <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
//                     {followedCompanies.length} Companies
//                 </span>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {followedCompanies.map((company) => (
//                     <div
//                         key={company.id}
//                         className="border rounded-lg shadow-sm hover:shadow-md transition-shadow"
//                     >
//                         <div className="p-6">
//                             <div className="flex items-center justify-between mb-4">
//                                 <div className="flex items-center">
//                                     <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center mr-3">
//                                         <Image
//                                             src={company.logo}
//                                             alt={company.name}
//                                             width={40}
//                                             height={40}
//                                             className="object-contain"
//                                         />
//                                     </div>
//                                     <div>
//                                         <h3 className="font-medium">
//                                             {company.name}
//                                         </h3>
//                                         <p className="text-sm text-gray-500">
//                                             {company.industry}
//                                         </p>
//                                     </div>
//                                 </div>
//                                 <Button
//                                     size="sm"
//                                     variant="ghost"
//                                     onClick={() => handleUnfollow(company.id)}
//                                     className="text-gray-500 hover:text-red-600"
//                                 >
//                                     <Trash2 className="h-4 w-4" />
//                                 </Button>
//                             </div>

//                             <div className="space-y-2 mb-4">
//                                 <div className="flex items-center text-gray-600 text-sm">
//                                     <MapPin className="h-4 w-4 mr-2" />
//                                     <span>{company.location}</span>
//                                 </div>
//                                 <div className="flex items-center text-gray-600 text-sm">
//                                     <Users className="h-4 w-4 mr-2" />
//                                     <span>{company.size} employees</span>
//                                 </div>
//                                 <div className="flex items-center text-gray-600 text-sm">
//                                     <Briefcase className="h-4 w-4 mr-2" />
//                                     <span>
//                                         {company.openJobs} open positions
//                                     </span>
//                                 </div>
//                             </div>

//                             <div className="flex space-x-2 pt-3 border-t">
//                                 <Link
//                                     href={`/company/company-detail/${company.id}`}
//                                     className="flex-1"
//                                 >
//                                     <Button
//                                         variant="outline"
//                                         size="sm"
//                                         className="w-full"
//                                     >
//                                         <Eye className="h-4 w-4 mr-1" /> View
//                                     </Button>
//                                 </Link>
//                                 <Link
//                                     href={`/company/company-detail/${company.id}#jobs`}
//                                     className="flex-1"
//                                 >
//                                     <Button
//                                         size="sm"
//                                         className="w-full bg-blue-600 hover:bg-blue-700"
//                                     >
//                                         View Jobs
//                                     </Button>
//                                 </Link>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             <div className="mt-10 border-t pt-6">
//                 <div className="flex items-center mb-4">
//                     <Bell className="h-5 w-5 mr-2 text-blue-600" />
//                     <h2 className="text-xl font-semibold">Recent Updates</h2>
//                 </div>

//                 <div className="space-y-4">
//                     {companyUpdates.updates.map((update, index) => (
//                         <div
//                             key={index}
//                             className="p-4 border rounded-lg bg-gray-50"
//                         >
//                             <div className="flex items-center">
//                                 <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
//                                     <Building2 className="h-5 w-5 text-blue-600" />
//                                 </div>
//                                 <div className="flex-1">
//                                     <p className="font-medium">
//                                         {update.companyName}
//                                     </p>
//                                     <p className="text-sm text-gray-700">
//                                         {update.content}
//                                     </p>
//                                     <p className="text-xs text-gray-500 mt-1">
//                                         {new Date(
//                                             update.date
//                                         ).toLocaleDateString()}
//                                     </p>
//                                 </div>
//                             </div>
//                             {update.updateType === "hiring_event" && (
//                                 <div className="mt-3 pt-3 border-t">
//                                     <p className="text-sm font-medium">
//                                         {update.eventDetails.title}
//                                     </p>
//                                     <p className="text-xs text-gray-700">
//                                         {new Date(
//                                             update.eventDetails.date
//                                         ).toLocaleDateString()}{" "}
//                                         at{" "}
//                                         {new Date(
//                                             update.eventDetails.date
//                                         ).toLocaleTimeString()}
//                                     </p>
//                                     <Button
//                                         size="sm"
//                                         className="mt-2 bg-blue-600 hover:bg-blue-700 text-xs"
//                                     >
//                                         Register for Event
//                                     </Button>
//                                 </div>
//                             )}
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// }
