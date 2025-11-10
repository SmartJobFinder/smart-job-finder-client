"use client";

import CompanyGuard from "@/components/recruiter/CompanyGuard";
import RecruiterJobsList from "@/components/recruiter/RecruiterJobsList";

export default function ManageJobIndexPage() {
    return (
        <CompanyGuard>
            <div className="p-4">
                <h1 className="text-xl font-semibold mb-4">
                    Manage Jobs - All
                </h1>
                <RecruiterJobsList tab="all" />
            </div>
        </CompanyGuard>
    );
}

// "use client";

// import React, { useState, useEffect } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//     Briefcase,
//     Plus,
//     Search,
//     Calendar,
//     MapPin,
//     Users,
//     Eye,
//     Clock,
//     FileText,
// } from "lucide-react";
// import Link from "next/link";
// import CompanyGuard from "@/components/recruiter/CompanyGuard";
// import { getJobsByStatus } from "@/mock/data/recruiterJobs";

// export default function ManageJobPage() {
//     const [activeTab, setActiveTab] = useState("all");
//     const [searchTerm, setSearchTerm] = useState("");
//     const [jobs, setJobs] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         // Simulate API call with delay
//         const timer = setTimeout(() => {
//             const fetchedJobs = getJobsByStatus(activeTab);

//             // Filter by search term if needed
//             const filteredJobs = searchTerm
//                 ? fetchedJobs.filter((job) =>
//                       job.title.toLowerCase().includes(searchTerm.toLowerCase())
//                   )
//                 : fetchedJobs;

//             setJobs(filteredJobs);
//             setLoading(false);
//         }, 500);

//         return () => clearTimeout(timer);
//     }, [activeTab, searchTerm]);

//     const getJobStatusClass = (status) => {
//         switch (status) {
//             case "ACTIVE":
//                 return "bg-green-100 text-green-800";
//             case "EXPIRED":
//                 return "bg-red-100 text-red-800";
//             case "DRAFT":
//                 return "bg-gray-100 text-gray-800";
//             default:
//                 return "bg-blue-100 text-blue-800";
//         }
//     };

//     return (
//         <CompanyGuard>
//             <div className="space-y-6">
//                 <div className="flex items-center justify-between">
//                     <h1 className="text-2xl font-bold text-gray-900">
//                         Quản lý tin tuyển dụng
//                     </h1>
//                     <Link href="/recruiter/manage-job/new">
//                         <Button className="flex items-center gap-2">
//                             <Plus className="w-4 h-4" />
//                             <span>Đăng tin mới</span>
//                         </Button>
//                     </Link>
//                 </div>

//                 <div className="relative">
//                     <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
//                     <Input
//                         placeholder="Tìm kiếm tin tuyển dụng..."
//                         className="pl-10"
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                 </div>

//                 <Tabs
//                     defaultValue="all"
//                     value={activeTab}
//                     onValueChange={setActiveTab}
//                 >
//                     <TabsList className="grid grid-cols-4 mb-8">
//                         <TabsTrigger value="all">Tất cả</TabsTrigger>
//                         <TabsTrigger value="ACTIVE">Đang tuyển</TabsTrigger>
//                         <TabsTrigger value="DRAFT">Nháp</TabsTrigger>
//                         <TabsTrigger value="EXPIRED">Hết hạn</TabsTrigger>
//                     </TabsList>

//                     <TabsContent value={activeTab}>
//                         {loading ? (
//                             <div className="flex justify-center py-8">
//                                 <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//                             </div>
//                         ) : jobs.length === 0 ? (
//                             <div className="text-center py-8">
//                                 <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-3" />
//                                 <h3 className="text-lg font-medium text-gray-900">
//                                     Không có tin tuyển dụng
//                                 </h3>
//                                 <p className="text-gray-500 mt-1">
//                                     {searchTerm
//                                         ? `Không tìm thấy tin tuyển dụng phù hợp với "${searchTerm}"`
//                                         : `Chưa có tin tuyển dụng ${
//                                               activeTab === "all"
//                                                   ? ""
//                                                   : activeTab === "ACTIVE"
//                                                   ? "đang tuyển"
//                                                   : activeTab === "DRAFT"
//                                                   ? "nháp"
//                                                   : "hết hạn"
//                                           }`}
//                                 </p>
//                                 <Link href="/recruiter/manage-job/new">
//                                     <Button className="mt-4">
//                                         <Plus className="w-4 h-4 mr-2" />
//                                         Đăng tin tuyển dụng
//                                     </Button>
//                                 </Link>
//                             </div>
//                         ) : (
//                             <div className="space-y-4">
//                                 {jobs.map((job) => (
//                                     <Card
//                                         key={job.id}
//                                         className="overflow-hidden transition-shadow hover:shadow-md"
//                                     >
//                                         <CardContent className="p-0">
//                                             <div className="flex flex-col lg:flex-row">
//                                                 <div className="flex-1 p-6">
//                                                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                                                         <h3 className="text-lg font-semibold text-gray-900">
//                                                             {job.title}
//                                                         </h3>
//                                                         <div className="flex flex-wrap gap-2">
//                                                             <span
//                                                                 className={`px-3 py-1 rounded-full text-xs font-medium ${getJobStatusClass(
//                                                                     job.status
//                                                                 )}`}
//                                                             >
//                                                                 {job.status ===
//                                                                 "ACTIVE"
//                                                                     ? "Đang tuyển"
//                                                                     : job.status ===
//                                                                       "DRAFT"
//                                                                     ? "Nháp"
//                                                                     : "Hết hạn"}
//                                                             </span>
//                                                             {job.featured && (
//                                                                 <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
//                                                                     Nổi bật
//                                                                 </span>
//                                                             )}
//                                                         </div>
//                                                     </div>

//                                                     <div className="mt-4 space-y-2">
//                                                         <div className="flex items-center text-gray-600 text-sm">
//                                                             <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
//                                                             <span>
//                                                                 {job.location}
//                                                             </span>
//                                                         </div>

//                                                         <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
//                                                             <div className="flex items-center">
//                                                                 <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
//                                                                 <span>
//                                                                     {job.date_post
//                                                                         ? new Date(
//                                                                               job.date_post
//                                                                           ).toLocaleDateString(
//                                                                               "vi-VN"
//                                                                           )
//                                                                         : "Chưa đăng"}
//                                                                 </span>
//                                                             </div>

//                                                             {job.expired_date && (
//                                                                 <div className="flex items-center">
//                                                                     <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
//                                                                     <span>
//                                                                         Hết hạn:{" "}
//                                                                         {new Date(
//                                                                             job.expired_date
//                                                                         ).toLocaleDateString(
//                                                                             "vi-VN"
//                                                                         )}
//                                                                     </span>
//                                                                 </div>
//                                                             )}

//                                                             <div className="flex items-center">
//                                                                 <Users className="h-4 w-4 mr-2 flex-shrink-0" />
//                                                                 <span>
//                                                                     {
//                                                                         job.applicants_count
//                                                                     }{" "}
//                                                                     ứng viên
//                                                                 </span>
//                                                             </div>

//                                                             <div className="flex items-center">
//                                                                 <Eye className="h-4 w-4 mr-2 flex-shrink-0" />
//                                                                 <span>
//                                                                     {
//                                                                         job.views_count
//                                                                     }{" "}
//                                                                     lượt xem
//                                                                 </span>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>

//                                                 <div className="bg-gray-50 flex flex-row lg:flex-col items-center justify-around p-4 gap-2">
//                                                     <Link
//                                                         href={`/recruiter/manage-job/${job.id}/edit`}
//                                                     >
//                                                         <Button
//                                                             variant="outline"
//                                                             size="sm"
//                                                         >
//                                                             <FileText className="h-4 w-4 mr-2" />
//                                                             Chỉnh sửa
//                                                         </Button>
//                                                     </Link>

//                                                     <Link
//                                                         href={`/recruiter/manage-job/${job.id}/applicants`}
//                                                     >
//                                                         <Button
//                                                             size="sm"
//                                                             className="bg-blue-600 hover:bg-blue-700"
//                                                         >
//                                                             <Users className="h-4 w-4 mr-2" />
//                                                             Xem ứng viên
//                                                         </Button>
//                                                     </Link>
//                                                 </div>
//                                             </div>
//                                         </CardContent>
//                                     </Card>
//                                 ))}
//                             </div>
//                         )}
//                     </TabsContent>
//                 </Tabs>
//             </div>
//         </CompanyGuard>
//     );
// }
