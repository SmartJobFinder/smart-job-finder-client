import AppliedPage from "./applied/page";

export default function JobsPage() {
  return <AppliedPage />;
}
// "use client";

// import React from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import Image from "next/image";
// import {
//     Briefcase,
//     MapPin,
//     Clock,
//     Building2,
//     DollarSign,
//     Heart,
//     Send,
//     BookmarkPlus,
//     Eye,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { applications } from "@/mock/data/applications";
// import { jobsInsights } from "@/mock/data/jobsInsights";
// import { jobs } from "@/mock/data/jobs";
// import ApplicationBadge from "@/components/ui/ApplicationBadge";

// export default function JobsPage() {
//     const router = useRouter();

//     // Lấy dữ liệu từ mock
//     const recentApplications = applications.slice(0, 2);
//     const savedJobs = jobs
//         .filter((job) =>
//             jobsInsights.savedJobsStats.savedJobIds?.includes(job.id)
//         )
//         .slice(0, 2);
//     const recommendedJobs = jobsInsights.recommendedJobs;

//     // Format lương để hiển thị
//     const formatSalary = (min, max, currency) => {
//         return `${min} - ${max} ${currency}`;
//     };

//     return (
//         <div className="space-y-6">
//             {/* Header section */}
//             <div className="pb-4 border-b border-gray-200">
//                 <h1 className="text-2xl font-bold text-gray-800">
//                     Quản lý công việc
//                 </h1>
//                 <p className="text-gray-600">
//                     Quản lý các công việc đã ứng tuyển và đã lưu của bạn
//                 </p>
//             </div>

//             {/* Overview cards */}
//             <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//                 <div className="p-6 bg-blue-50 border border-blue-100 rounded-lg">
//                     <div className="flex items-center gap-3">
//                         <div className="p-3 bg-blue-100 rounded-lg">
//                             <Send className="w-5 h-5 text-blue-600" />
//                         </div>
//                         <div>
//                             <h3 className="text-lg font-semibold">
//                                 Đã ứng tuyển
//                             </h3>
//                             <p className="text-2xl font-bold text-blue-700">
//                                 {jobsInsights.applicationStats.total}
//                             </p>
//                         </div>
//                     </div>
//                     <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
//                         <div className="p-2 bg-white rounded">
//                             <span className="text-gray-600">Đang xem xét:</span>
//                             <span className="font-medium text-blue-600">
//                                 {" "}
//                                 {jobsInsights.applicationStats.reviewing}
//                             </span>
//                         </div>
//                         <div className="p-2 bg-white rounded">
//                             <span className="text-gray-600">Đã chấp nhận:</span>
//                             <span className="font-medium text-green-600">
//                                 {" "}
//                                 {jobsInsights.applicationStats.accepted}
//                             </span>
//                         </div>
//                     </div>
//                     <Button
//                         className="w-full mt-4"
//                         variant="outline"
//                         onClick={() => router.push("/jobs/applied")}
//                     >
//                         Xem tất cả
//                     </Button>
//                 </div>

//                 <div className="p-6 bg-amber-50 border border-amber-100 rounded-lg">
//                     <div className="flex items-center gap-3">
//                         <div className="p-3 bg-amber-100 rounded-lg">
//                             <Heart className="w-5 h-5 text-amber-600" />
//                         </div>
//                         <div>
//                             <h3 className="text-lg font-semibold">Đã lưu</h3>
//                             <p className="text-2xl font-bold text-amber-700">
//                                 {jobsInsights.savedJobsStats.total}
//                             </p>
//                         </div>
//                     </div>
//                     <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
//                         <div className="p-2 bg-white rounded">
//                             <span className="text-gray-600">Mới phù hợp:</span>
//                             <span className="font-medium text-amber-600">
//                                 {" "}
//                                 {jobsInsights.savedJobsStats.newMatchingSince}
//                             </span>
//                         </div>
//                         <div className="p-2 bg-white rounded">
//                             <span className="text-gray-600">Sắp hết hạn:</span>
//                             <span className="font-medium text-red-600">
//                                 {" "}
//                                 {
//                                     jobsInsights.savedJobsStats
//                                         .expiringWithin7Days
//                                 }
//                             </span>
//                         </div>
//                     </div>
//                     <Button
//                         className="w-full mt-4"
//                         variant="outline"
//                         onClick={() => router.push("/jobs/saved")}
//                     >
//                         Xem tất cả
//                     </Button>
//                 </div>

//                 <div className="p-6 bg-green-50 border border-green-100 rounded-lg">
//                     <div className="flex items-center gap-3">
//                         <div className="p-3 bg-green-100 rounded-lg">
//                             <Briefcase className="w-5 h-5 text-green-600" />
//                         </div>
//                         <div>
//                             <h3 className="text-lg font-semibold">
//                                 Việc làm phù hợp
//                             </h3>
//                             <p className="text-2xl font-bold text-green-700">
//                                 {recommendedJobs.length}
//                             </p>
//                         </div>
//                     </div>
//                     <div className="mt-4 text-sm">
//                         <div className="p-3 bg-white rounded">
//                             <p className="font-medium text-green-700">
//                                 Các công việc phù hợp với kỹ năng của bạn
//                             </p>
//                             <p className="text-gray-600">
//                                 Dựa trên hồ sơ và lịch sử tìm kiếm của bạn
//                             </p>
//                         </div>
//                     </div>
//                     <Button
//                         className="w-full mt-4"
//                         variant="outline"
//                         onClick={() => router.push("/search")}
//                     >
//                         Tìm việc làm mới
//                     </Button>
//                 </div>
//             </div>

//             {/* Recent applications section */}
//             <div className="mt-8">
//                 <div className="flex items-center justify-between mb-4">
//                     <h2 className="text-xl font-semibold">
//                         Đơn ứng tuyển gần đây
//                     </h2>
//                     <Link href="/jobs/applied">
//                         <Button
//                             variant="ghost"
//                             size="sm"
//                             className="text-blue-600"
//                         >
//                             Xem tất cả
//                         </Button>
//                     </Link>
//                 </div>

//                 <div className="space-y-4">
//                     {recentApplications.map((application) => {
//                         const job = application.job;
//                         return (
//                             <div
//                                 key={application.id}
//                                 className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-all"
//                             >
//                                 <div className="flex gap-4">
//                                     <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
//                                         <Image
//                                             src={
//                                                 job.company.avatar ||
//                                                 "https://tinyurl.com/48kdftcx"
//                                             }
//                                             alt={job.company.company_name}
//                                             width={48}
//                                             height={48}
//                                             className="object-cover"
//                                         />
//                                     </div>

//                                     <div className="flex-1">
//                                         <div className="flex justify-between">
//                                             <div>
//                                                 <h3
//                                                     className="font-medium text-blue-700 hover:underline cursor-pointer"
//                                                     onClick={() =>
//                                                         router.push(
//                                                             `/job-detail/${job.id}`
//                                                         )
//                                                     }
//                                                 >
//                                                     {job.title}
//                                                 </h3>
//                                                 <div className="flex items-center text-sm text-gray-600">
//                                                     <Building2 className="w-4 h-4 mr-1" />
//                                                     <span>
//                                                         {
//                                                             job.company
//                                                                 .company_name
//                                                         }
//                                                     </span>
//                                                 </div>
//                                             </div>

//                                             <ApplicationBadge
//                                                 status={application.status}
//                                             />
//                                         </div>

//                                         <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-600">
//                                             <div className="flex items-center">
//                                                 <MapPin className="w-3 h-3 mr-1" />
//                                                 <span>{job.location}</span>
//                                             </div>
//                                             <div className="flex items-center">
//                                                 <Clock className="w-3 h-3 mr-1" />
//                                                 <span>
//                                                     Đã ứng tuyển:{" "}
//                                                     {new Date(
//                                                         application.createdAt
//                                                     ).toLocaleDateString()}
//                                                 </span>
//                                             </div>
//                                             <div className="flex items-center">
//                                                 <DollarSign className="w-3 h-3 mr-1" />
//                                                 <span>
//                                                     {formatSalary(
//                                                         job.salary_min,
//                                                         job.salary_max,
//                                                         job.currency
//                                                     )}
//                                                 </span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>

//             {/* Saved jobs section */}
//             <div className="mt-8">
//                 <div className="flex items-center justify-between mb-4">
//                     <h2 className="text-xl font-semibold">Công việc đã lưu</h2>
//                     <Link href="/jobs/saved">
//                         <Button
//                             variant="ghost"
//                             size="sm"
//                             className="text-blue-600"
//                         >
//                             Xem tất cả
//                         </Button>
//                     </Link>
//                 </div>

//                 <div className="space-y-4">
//                     {savedJobs.map((job) => (
//                         <div
//                             key={job.id}
//                             className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-all"
//                         >
//                             <div className="flex gap-4">
//                                 <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
//                                     <Image
//                                         src={
//                                             job.company.avatar ||
//                                             "https://tinyurl.com/48kdftcx"
//                                         }
//                                         alt={job.company.company_name}
//                                         width={48}
//                                         height={48}
//                                         className="object-cover"
//                                     />
//                                 </div>

//                                 <div className="flex-1">
//                                     <div className="flex justify-between">
//                                         <div>
//                                             <h3
//                                                 className="font-medium text-blue-700 hover:underline cursor-pointer"
//                                                 onClick={() =>
//                                                     router.push(
//                                                         `/job-detail/${job.id}`
//                                                     )
//                                                 }
//                                             >
//                                                 {job.title}
//                                             </h3>
//                                             <div className="flex items-center text-sm text-gray-600">
//                                                 <Building2 className="w-4 h-4 mr-1" />
//                                                 <span>
//                                                     {job.company.company_name}
//                                                 </span>
//                                             </div>
//                                         </div>

//                                         <span className="flex items-center text-amber-600">
//                                             <Heart className="w-4 h-4 mr-1 fill-amber-500" />
//                                             <span className="text-xs">
//                                                 Đã lưu
//                                             </span>
//                                         </span>
//                                     </div>

//                                     <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-600">
//                                         <div className="flex items-center">
//                                             <MapPin className="w-3 h-3 mr-1" />
//                                             <span>{job.location}</span>
//                                         </div>
//                                         <div className="flex items-center">
//                                             <DollarSign className="w-3 h-3 mr-1" />
//                                             <span>
//                                                 {formatSalary(
//                                                     job.salary_min,
//                                                     job.salary_max,
//                                                     job.currency
//                                                 )}
//                                             </span>
//                                         </div>
//                                     </div>

//                                     <div className="flex gap-2 mt-3">
//                                         <Button
//                                             size="sm"
//                                             variant="outline"
//                                             className="text-xs"
//                                             onClick={() =>
//                                                 router.push(
//                                                     `/job-detail/${job.id}`
//                                                 )
//                                             }
//                                         >
//                                             <Eye className="w-3 h-3 mr-1" />
//                                             Chi tiết
//                                         </Button>
//                                         <Button
//                                             size="sm"
//                                             className="text-xs bg-blue-600"
//                                             onClick={() =>
//                                                 router.push(
//                                                     `/job-detail/${job.id}/applicationJob`
//                                                 )
//                                             }
//                                         >
//                                             <Send className="w-3 h-3 mr-1" />
//                                             Ứng tuyển ngay
//                                         </Button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {/* Recommended jobs section */}
//             <div className="mt-8">
//                 <div className="flex items-center justify-between mb-4">
//                     <h2 className="text-xl font-semibold">
//                         Việc làm gợi ý cho bạn
//                     </h2>
//                     <Link href="/search">
//                         <Button
//                             variant="ghost"
//                             size="sm"
//                             className="text-blue-600"
//                         >
//                             Tìm thêm
//                         </Button>
//                     </Link>
//                 </div>

//                 <div className="space-y-4">
//                     {recommendedJobs.map((recommendation) => {
//                         const job = jobs.find(
//                             (j) => j.id === recommendation.id
//                         );
//                         if (!job) return null;

//                         return (
//                             <div
//                                 key={job.id}
//                                 className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-all"
//                             >
//                                 <div className="flex gap-4">
//                                     <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
//                                         <Image
//                                             src={
//                                                 job.company.avatar ||
//                                                 "https://tinyurl.com/48kdftcx"
//                                             }
//                                             alt={job.company.company_name}
//                                             width={48}
//                                             height={48}
//                                             className="object-cover"
//                                         />
//                                     </div>

//                                     <div className="flex-1">
//                                         <div className="flex justify-between">
//                                             <h3
//                                                 className="font-medium text-blue-700 hover:underline cursor-pointer"
//                                                 onClick={() =>
//                                                     router.push(
//                                                         `/job-detail/${job.id}`
//                                                     )
//                                                 }
//                                             >
//                                                 {job.title}
//                                             </h3>
//                                             <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
//                                                 {recommendation.matchScore}% phù
//                                                 hợp
//                                             </span>
//                                         </div>

//                                         <div className="flex items-center text-sm text-gray-600">
//                                             <Building2 className="w-4 h-4 mr-1" />
//                                             <span>
//                                                 {job.company.company_name}
//                                             </span>
//                                         </div>

//                                         <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-600">
//                                             <div className="flex items-center">
//                                                 <MapPin className="w-3 h-3 mr-1" />
//                                                 <span>{job.location}</span>
//                                             </div>
//                                             <div className="flex items-center">
//                                                 <DollarSign className="w-3 h-3 mr-1" />
//                                                 <span>
//                                                     {formatSalary(
//                                                         job.salary_min,
//                                                         job.salary_max,
//                                                         job.currency
//                                                     )}
//                                                 </span>
//                                             </div>
//                                         </div>

//                                         <div className="mt-2">
//                                             <p className="text-xs text-gray-500 mb-1">
//                                                 Lý do gợi ý:
//                                             </p>
//                                             <div className="flex flex-wrap gap-1">
//                                                 {recommendation.reasons.map(
//                                                     (reason, idx) => (
//                                                         <span
//                                                             key={idx}
//                                                             className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
//                                                         >
//                                                             {reason}
//                                                         </span>
//                                                     )
//                                                 )}
//                                             </div>
//                                         </div>

//                                         <div className="flex gap-2 mt-3">
//                                             <Button
//                                                 size="sm"
//                                                 variant="outline"
//                                                 className="text-xs"
//                                                 onClick={() =>
//                                                     router.push(
//                                                         `/job-detail/${job.id}`
//                                                     )
//                                                 }
//                                             >
//                                                 <Eye className="w-3 h-3 mr-1" />
//                                                 Chi tiết
//                                             </Button>
//                                             <Button
//                                                 size="sm"
//                                                 className="text-xs bg-blue-600"
//                                                 onClick={() =>
//                                                     router.push(
//                                                         `/job-detail/${job.id}/applicationJob`
//                                                     )
//                                                 }
//                                             >
//                                                 <Send className="w-3 h-3 mr-1" />
//                                                 Ứng tuyển
//                                             </Button>
//                                             <Button
//                                                 size="sm"
//                                                 variant="outline"
//                                                 className="text-xs"
//                                             >
//                                                 <BookmarkPlus className="w-3 h-3 mr-1" />
//                                                 Lưu
//                                             </Button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>
//         </div>
//     );
// }
