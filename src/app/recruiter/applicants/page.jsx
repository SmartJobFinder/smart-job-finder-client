"use client";

import { redirect } from "next/navigation";

export default function ApplicantsIndex() {
    redirect("/recruiter/applicants/all");
    return null;
}

// "use client";

// import React, { useState, useEffect } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//     Search,
//     Users,
//     Calendar,
//     Mail,
//     Phone,
//     Download,
//     Eye,
//     Clock,
//     CheckCircle,
//     XCircle,
//     AlertCircle,
// } from "lucide-react";
// import Link from "next/link";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import CompanyGuard from "@/components/recruiter/CompanyGuard";
// import {
//     getApplicantsByStatus,
//     getNewApplicants,
//     getReviewingApplicants,
//     getInterviewScheduledApplicants,
//     getAcceptedApplicants,
//     getRejectedApplicants,
// } from "@/mock/data/recruiterApplicants";

// export default function ApplicantsPage() {
//     const [activeTab, setActiveTab] = useState("all");
//     const [searchTerm, setSearchTerm] = useState("");
//     const [applicants, setApplicants] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         // Simulate API call with delay
//         const timer = setTimeout(() => {
//             let fetchedApplicants;

//             switch (activeTab) {
//                 case "NEW":
//                     fetchedApplicants = getNewApplicants();
//                     break;
//                 case "REVIEWING":
//                     fetchedApplicants = getReviewingApplicants();
//                     break;
//                 case "INTERVIEW_SCHEDULED":
//                     fetchedApplicants = getInterviewScheduledApplicants();
//                     break;
//                 case "ACCEPTED":
//                     fetchedApplicants = getAcceptedApplicants();
//                     break;
//                 case "REJECTED":
//                     fetchedApplicants = getRejectedApplicants();
//                     break;
//                 default:
//                     fetchedApplicants = getApplicantsByStatus();
//             }

//             // Filter by search term if needed
//             const filteredApplicants = searchTerm
//                 ? fetchedApplicants.filter(
//                       (app) =>
//                           app.applicant_name
//                               .toLowerCase()
//                               .includes(searchTerm.toLowerCase()) ||
//                           app.job_title
//                               .toLowerCase()
//                               .includes(searchTerm.toLowerCase())
//                   )
//                 : fetchedApplicants;

//             setApplicants(filteredApplicants);
//             setLoading(false);
//         }, 500);

//         return () => clearTimeout(timer);
//     }, [activeTab, searchTerm]);

//     const getStatusBadge = (status) => {
//         switch (status) {
//             case "NEW":
//                 return (
//                     <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
//                         <AlertCircle className="h-3 w-3" />
//                         Mới
//                     </span>
//                 );
//             case "REVIEWING":
//                 return (
//                     <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
//                         <Eye className="h-3 w-3" />
//                         Đang xem xét
//                     </span>
//                 );
//             case "INTERVIEW_SCHEDULED":
//                 return (
//                     <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
//                         <Calendar className="h-3 w-3" />
//                         Phỏng vấn
//                     </span>
//                 );
//             case "ACCEPTED":
//                 return (
//                     <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
//                         <CheckCircle className="h-3 w-3" />
//                         Đã chấp nhận
//                     </span>
//                 );
//             case "REJECTED":
//                 return (
//                     <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
//                         <XCircle className="h-3 w-3" />
//                         Từ chối
//                     </span>
//                 );
//             default:
//                 return (
//                     <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
//                         {status}
//                     </span>
//                 );
//         }
//     };

//     const getInitials = (name) => {
//         return name
//             .split(" ")
//             .map((n) => n[0])
//             .join("")
//             .toUpperCase()
//             .substring(0, 2);
//     };

//     return (
//         <CompanyGuard>
//             <div className="space-y-6">
//                 <div>
//                     <h1 className="text-2xl font-bold text-gray-900">
//                         Quản lý ứng viên
//                     </h1>
//                     <p className="text-gray-500">
//                         Xem và quản lý tất cả ứng viên đã ứng tuyển vào công ty
//                         của bạn
//                     </p>
//                 </div>

//                 <div className="relative">
//                     <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
//                     <Input
//                         placeholder="Tìm kiếm ứng viên hoặc vị trí..."
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
//                     <TabsList className="grid grid-cols-6">
//                         <TabsTrigger value="all">Tất cả</TabsTrigger>
//                         <TabsTrigger value="NEW">Mới</TabsTrigger>
//                         <TabsTrigger value="REVIEWING">
//                             Đang xem xét
//                         </TabsTrigger>
//                         <TabsTrigger value="INTERVIEW_SCHEDULED">
//                             Phỏng vấn
//                         </TabsTrigger>
//                         <TabsTrigger value="ACCEPTED">Đã chấp nhận</TabsTrigger>
//                         <TabsTrigger value="REJECTED">Từ chối</TabsTrigger>
//                     </TabsList>

//                     <TabsContent value={activeTab}>
//                         {loading ? (
//                             <div className="flex justify-center py-8">
//                                 <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//                             </div>
//                         ) : applicants.length === 0 ? (
//                             <div className="text-center py-8">
//                                 <Users className="h-12 w-12 mx-auto text-gray-400 mb-3" />
//                                 <h3 className="text-lg font-medium text-gray-900">
//                                     Không có ứng viên
//                                 </h3>
//                                 <p className="text-gray-500 mt-1">
//                                     {searchTerm
//                                         ? `Không tìm thấy ứng viên phù hợp với "${searchTerm}"`
//                                         : `Chưa có ứng viên ${
//                                               activeTab === "all"
//                                                   ? ""
//                                                   : activeTab === "NEW"
//                                                   ? "mới"
//                                                   : activeTab === "REVIEWING"
//                                                   ? "đang xem xét"
//                                                   : activeTab ===
//                                                     "INTERVIEW_SCHEDULED"
//                                                   ? "được lên lịch phỏng vấn"
//                                                   : activeTab === "ACCEPTED"
//                                                   ? "đã chấp nhận"
//                                                   : "bị từ chối"
//                                           }`}
//                                 </p>
//                             </div>
//                         ) : (
//                             <div className="space-y-4 mt-6">
//                                 {applicants.map((applicant) => (
//                                     <Card
//                                         key={applicant.id}
//                                         className="overflow-hidden transition-shadow hover:shadow-md"
//                                     >
//                                         <CardContent className="p-0">
//                                             <div className="flex flex-col sm:flex-row">
//                                                 <div className="flex-1 p-6">
//                                                     <div className="flex gap-4">
//                                                         <Avatar className="h-12 w-12">
//                                                             <AvatarImage
//                                                                 src={
//                                                                     applicant.avatar
//                                                                 }
//                                                             />
//                                                             <AvatarFallback>
//                                                                 {getInitials(
//                                                                     applicant.applicant_name
//                                                                 )}
//                                                             </AvatarFallback>
//                                                         </Avatar>
//                                                         <div>
//                                                             <h3 className="text-lg font-semibold text-gray-900">
//                                                                 {
//                                                                     applicant.applicant_name
//                                                                 }
//                                                             </h3>
//                                                             <div className="flex flex-wrap items-center gap-2 mt-1">
//                                                                 {getStatusBadge(
//                                                                     applicant.status
//                                                                 )}
//                                                                 <span className="text-sm text-gray-600">
//                                                                     Ứng tuyển
//                                                                     vào{" "}
//                                                                     {
//                                                                         applicant.job_title
//                                                                     }
//                                                                 </span>
//                                                             </div>

//                                                             <div className="mt-3 space-y-1 text-sm text-gray-600">
//                                                                 <div className="flex items-center">
//                                                                     <Mail className="h-4 w-4 mr-2" />
//                                                                     <span>
//                                                                         {
//                                                                             applicant.applicant_email
//                                                                         }
//                                                                     </span>
//                                                                 </div>
//                                                                 <div className="flex items-center">
//                                                                     <Phone className="h-4 w-4 mr-2" />
//                                                                     <span>
//                                                                         {
//                                                                             applicant.applicant_phone
//                                                                         }
//                                                                     </span>
//                                                                 </div>
//                                                                 <div className="flex items-center">
//                                                                     <Calendar className="h-4 w-4 mr-2" />
//                                                                     <span>
//                                                                         Ngày ứng
//                                                                         tuyển:{" "}
//                                                                         {new Date(
//                                                                             applicant.applied_date
//                                                                         ).toLocaleDateString(
//                                                                             "vi-VN"
//                                                                         )}
//                                                                     </span>
//                                                                 </div>
//                                                                 {applicant.interview_date && (
//                                                                     <div className="flex items-center">
//                                                                         <Clock className="h-4 w-4 mr-2" />
//                                                                         <span>
//                                                                             Phỏng
//                                                                             vấn:{" "}
//                                                                             {new Date(
//                                                                                 applicant.interview_date
//                                                                             ).toLocaleString(
//                                                                                 "vi-VN"
//                                                                             )}
//                                                                         </span>
//                                                                     </div>
//                                                                 )}
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>

//                                                 <div className="bg-gray-50 flex flex-row sm:flex-col items-center justify-around p-4 gap-2">
//                                                     <Button
//                                                         variant="outline"
//                                                         size="sm"
//                                                         asChild
//                                                     >
//                                                         <a
//                                                             href={
//                                                                 applicant.cv_url
//                                                             }
//                                                             target="_blank"
//                                                             rel="noopener noreferrer"
//                                                         >
//                                                             <Download className="h-4 w-4 mr-2" />
//                                                             Tải CV
//                                                         </a>
//                                                     </Button>

//                                                     <Link
//                                                         href={`/recruiter/applicants/${applicant.id}`}
//                                                     >
//                                                         <Button
//                                                             size="sm"
//                                                             className="bg-blue-600 hover:bg-blue-700"
//                                                         >
//                                                             <Eye className="h-4 w-4 mr-2" />
//                                                             Chi tiết
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
