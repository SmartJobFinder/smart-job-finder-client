"use client";

import React, { useEffect, useMemo, useState } from "react";
import { getMyCompany } from "@/services/companyService";
import {
    useGetInterviewsByCompanyQuery,
    useUpdateInterviewStatusMutation,
} from "@/services/interviewService";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import InterviewApplicationModal from "./components/InterviewApplicationModal";
import { useRouter } from "next/navigation";

function formatDT(s) {
    if (!s) return "—";
    const d = new Date(s);
    return d.toLocaleString();
}
function StatusPill({ status }) {
    const base = "px-2.5 py-1 rounded-full text-xs border ";
    switch (status) {
        case "PENDING":
            return (
                <span
                    className={
                        base + "text-amber-700 border-amber-300 bg-amber-50"
                    }
                >
                    PENDING
                </span>
            );
        case "ACCEPTED":
            return (
                <span
                    className={
                        base + "text-blue-700 border-blue-300 bg-blue-50"
                    }
                >
                    ACCEPTED
                </span>
            );
        case "DECLINED":
            return (
                <span
                    className={
                        base + "text-gray-700 border-gray-300 bg-gray-50"
                    }
                >
                    DECLINED
                </span>
            );
        case "COMPLETED":
            return (
                <span
                    className={
                        base +
                        "text-emerald-700 border-emerald-300 bg-emerald-50"
                    }
                >
                    COMPLETED
                </span>
            );
        case "CANCELLED":
            return (
                <span
                    className={base + "text-red-700 border-red-300 bg-red-50"}
                >
                    CANCELLED
                </span>
            );
        default:
            return (
                <span
                    className={
                        base + "text-gray-700 border-gray-300 bg-gray-50"
                    }
                >
                    {status || "—"}
                </span>
            );
    }
}

export default function RecruiterInterviewsPage() {
    const router = useRouter();
    const [companyId, setCompanyId] = useState(null);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(20);

    // fetch companyId
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await getMyCompany();
                const cid =
                    res?.id ||
                    res?.company_id ||
                    res?.companyId ||
                    res?.company?.id;
                if (mounted) setCompanyId(cid || null);
            } catch {
                if (mounted) setCompanyId(null);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    const canQuery = useMemo(() => !!companyId, [companyId]);
    const { data, isLoading, refetch } = useGetInterviewsByCompanyQuery(
        { companyId, page, size, sort: "scheduledAt,desc" },
        { skip: !canQuery }
    );

    const [updateStatus, { isLoading: updating }] =
        useUpdateInterviewStatusMutation();

    // Application modal
    const [appModal, setAppModal] = useState(null); // { jobId, userId, jobTitle, candidateName, candidateEmail }

    const onChangeStatus = async (row, newStatus) => {
        try {
            await updateStatus({
                interviewId: row.interviewId,
                status: newStatus,
            }).unwrap();
            toast.success(`Interview marked ${newStatus}`);
            refetch();
        } catch (e) {
            toast.error(e?.data?.message || "Failed to update status");
        }
    };

    return (
        <div className="p-6">
            <div className="mb-4">
                <h1 className="text-xl font-semibold">My Interviews</h1>
            </div>

            <div className="bg-white border rounded-xl">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <h3 className="text-lg font-semibold">
                        Total: {data?.totalElements ?? 0}
                    </h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left">
                                    Scheduled
                                </th>
                                <th className="px-6 py-3 text-left">Job</th>
                                <th className="px-6 py-3 text-left">
                                    Candidate
                                </th>
                                <th className="px-6 py-3 text-left">Email</th>
                                <th className="px-6 py-3 text-left">
                                    Duration
                                </th>
                                <th className="px-6 py-3 text-left">Status</th>
                                <th className="px-6 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading || !canQuery ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-6 text-center text-gray-500"
                                    >
                                        Loading...
                                    </td>
                                </tr>
                            ) : (
                                (data?.content || []).map((row) => (
                                    <tr
                                        key={row.interviewId}
                                        className="border-t hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-3">
                                            {formatDT(row.scheduledAt)}
                                        </td>
                                        <td className="px-6 py-3">
                                            {row.jobTitle ||
                                                `Job #${row.jobId}`}
                                        </td>
                                        <td className="px-6 py-3">
                                            {row.candidateName ||
                                                `User #${row.candidateId}`}
                                        </td>
                                        <td className="px-6 py-3 break-all">
                                            {row.candidateEmail || "—"}
                                        </td>
                                        <td className="px-6 py-3">
                                            {row.durationMinutes} min
                                        </td>
                                        <td className="px-6 py-3">
                                            <StatusPill status={row.status} />
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex flex-wrap gap-2">
                                                {row.meetingUrl && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            router.push(
                                                                `/recruiter/applicants/interviews/${row.interviewId}/join`
                                                            )
                                                        }
                                                    >
                                                        Open meeting
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        setAppModal({
                                                            jobId: row.jobId,
                                                            userId: row.candidateId,
                                                            jobTitle:
                                                                row.jobTitle,
                                                            candidateName:
                                                                row.candidateName,
                                                            candidateEmail:
                                                                row.candidateEmail,
                                                        })
                                                    }
                                                >
                                                    Application
                                                </Button>

                                                {/* Recruiter can only set COMPLETED or CANCELLED (the BE enforces this) */}
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    disabled={
                                                        updating ||
                                                        row.status ===
                                                            "COMPLETED"
                                                    }
                                                    onClick={() =>
                                                        onChangeStatus(
                                                            row,
                                                            "COMPLETED"
                                                        )
                                                    }
                                                >
                                                    Mark completed
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    disabled={
                                                        updating ||
                                                        row.status ===
                                                            "CANCELLED"
                                                    }
                                                    onClick={() =>
                                                        onChangeStatus(
                                                            row,
                                                            "CANCELLED"
                                                        )
                                                    }
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}

                            {!isLoading &&
                                (data?.content?.length ?? 0) === 0 && (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-6 py-6 text-center text-gray-500"
                                        >
                                            No interviews
                                        </td>
                                    </tr>
                                )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between px-4 py-3 border-t">
                    <span className="text-sm text-gray-600">
                        Page size:
                        <select
                            className="px-2 py-1 ml-2 border rounded-md"
                            value={size}
                            onChange={(e) => {
                                setSize(parseInt(e.target.value, 10));
                                setPage(0);
                            }}
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </span>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page <= 0}
                            onClick={() => setPage(page - 1)}
                        >
                            {"<"}
                        </Button>
                        <div className="flex items-center justify-center text-white bg-blue-600 rounded-md w-9 h-9">
                            {(page ?? 0) + 1}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page + 1 >= (data?.totalPages ?? 1)}
                            onClick={() => setPage(page + 1)}
                        >
                            {">"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Application detail modal (resolved from jobId + userId) */}
            <InterviewApplicationModal
                open={!!appModal}
                onOpenChange={(v) => !v && setAppModal(null)}
                ctx={appModal}
            />
        </div>
    );
}

// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import { getMyCompany } from "@/services/companyService";
// import {
//     useGetInterviewsByCompanyQuery,
//     useUpdateInterviewStatusMutation,
// } from "@/services/interviewService";
// import { Button } from "@/components/ui/button";
// import { toast } from "react-toastify";
// import InterviewApplicationModal from "./components/InterviewApplicationModal";
// import { useRouter } from "next/navigation";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import {
//     Search,
//     Calendar,
//     Clock,
//     Video,
//     MapPin,
//     Download,
//     Mail,
//     Phone,
//     Eye,
// } from "lucide-react";
// import Link from "next/link";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import CompanyGuard from "@/components/recruiter/CompanyGuard";
// import { getInterviews } from "@/mock/data/recruiterApplicants";

// function formatDT(s) {
//     if (!s) return "—";
//     const d = new Date(s);
//     return d.toLocaleString();
// }
// function StatusPill({ status }) {
//     const base = "px-2.5 py-1 rounded-full text-xs border ";
//     switch (status) {
//         case "PENDING":
//             return (
//                 <span
//                     className={
//                         base + "text-amber-700 border-amber-300 bg-amber-50"
//                     }
//                 >
//                     PENDING
//                 </span>
//             );
//         case "ACCEPTED":
//             return (
//                 <span
//                     className={
//                         base + "text-blue-700 border-blue-300 bg-blue-50"
//                     }
//                 >
//                     ACCEPTED
//                 </span>
//             );
//         case "DECLINED":
//             return (
//                 <span
//                     className={
//                         base + "text-gray-700 border-gray-300 bg-gray-50"
//                     }
//                 >
//                     DECLINED
//                 </span>
//             );
//         case "COMPLETED":
//             return (
//                 <span
//                     className={
//                         base +
//                         "text-emerald-700 border-emerald-300 bg-emerald-50"
//                     }
//                 >
//                     COMPLETED
//                 </span>
//             );
//         case "CANCELLED":
//             return (
//                 <span
//                     className={base + "text-red-700 border-red-300 bg-red-50"}
//                 >
//                     CANCELLED
//                 </span>
//             );
//         default:
//             return (
//                 <span
//                     className={
//                         base + "text-gray-700 border-gray-300 bg-gray-50"
//                     }
//                 >
//                     {status || "—"}
//                 </span>
//             );
//     }
// }

// export default function RecruiterInterviewsPage() {
//     const router = useRouter();
//     const [companyId, setCompanyId] = useState(null);
//     const [page, setPage] = useState(0);
//     const [size, setSize] = useState(20);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [interviews, setInterviews] = useState([]);
//     const [loading, setLoading] = useState(true);

//     // fetch companyId
//     useEffect(() => {
//         let mounted = true;
//         (async () => {
//             try {
//                 const res = await getMyCompany();
//                 const cid =
//                     res?.id ||
//                     res?.company_id ||
//                     res?.companyId ||
//                     res?.company?.id;
//                 if (mounted) setCompanyId(cid || null);
//             } catch {
//                 if (mounted) setCompanyId(null);
//             }
//         })();
//         return () => {
//             mounted = false;
//         };
//     }, []);

//     const canQuery = useMemo(() => !!companyId, [companyId]);
//     const { data, isLoading, refetch } = useGetInterviewsByCompanyQuery(
//         { companyId, page, size, sort: "scheduledAt,desc" },
//         { skip: !canQuery }
//     );

//     const [updateStatus, { isLoading: updating }] =
//         useUpdateInterviewStatusMutation();

//     // Application modal
//     const [appModal, setAppModal] = useState(null); // { jobId, userId, jobTitle, candidateName, candidateEmail }

//     const onChangeStatus = async (row, newStatus) => {
//         try {
//             await updateStatus({
//                 interviewId: row.interviewId,
//                 status: newStatus,
//             }).unwrap();
//             toast.success(`Interview marked ${newStatus}`);
//             refetch();
//         } catch (e) {
//             toast.error(e?.data?.message || "Failed to update status");
//         }
//     };

//     useEffect(() => {
//         // Simulate API call with delay
//         const timer = setTimeout(() => {
//             const fetchedInterviews = getInterviews();

//             // Filter by search term if needed
//             const filteredInterviews = searchTerm
//                 ? fetchedInterviews.filter(
//                       (interview) =>
//                           interview.applicant_name
//                               .toLowerCase()
//                               .includes(searchTerm.toLowerCase()) ||
//                           interview.job_title
//                               .toLowerCase()
//                               .includes(searchTerm.toLowerCase())
//                   )
//                 : fetchedInterviews;

//             setInterviews(filteredInterviews);
//             setLoading(false);
//         }, 500);

//         return () => clearTimeout(timer);
//     }, [searchTerm]);

//     const getInitials = (name) => {
//         return name
//             .split(" ")
//             .map((n) => n[0])
//             .join("")
//             .toUpperCase()
//             .substring(0, 2);
//     };

//     // Group interviews by date
//     const groupedInterviews = interviews.reduce((groups, interview) => {
//         const date = new Date(interview.interview_date).toLocaleDateString(
//             "vi-VN"
//         );
//         if (!groups[date]) {
//             groups[date] = [];
//         }
//         groups[date].push(interview);
//         return groups;
//     }, {});

//     return (
//         <div className="p-6">
//             <div className="mb-4">
//                 <h1 className="text-xl font-semibold">My Interviews</h1>
//             </div>

//             <div className="bg-white border rounded-xl">
//                 <div className="flex items-center justify-between px-4 py-3 border-b">
//                     <h3 className="text-lg font-semibold">
//                         Total: {data?.totalElements ?? 0}
//                     </h3>
//                 </div>

//                 <div className="overflow-x-auto">
//                     <table className="min-w-full text-sm">
//                         <thead className="bg-gray-50">
//                             <tr>
//                                 <th className="px-6 py-3 text-left">
//                                     Scheduled
//                                 </th>
//                                 <th className="px-6 py-3 text-left">Job</th>
//                                 <th className="px-6 py-3 text-left">
//                                     Candidate
//                                 </th>
//                                 <th className="px-6 py-3 text-left">Email</th>
//                                 <th className="px-6 py-3 text-left">
//                                     Duration
//                                 </th>
//                                 <th className="px-6 py-3 text-left">Status</th>
//                                 <th className="px-6 py-3 text-left">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {isLoading || !canQuery ? (
//                                 <tr>
//                                     <td
//                                         colSpan={7}
//                                         className="px-6 py-6 text-center text-gray-500"
//                                     >
//                                         Loading...
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 (data?.content || []).map((row) => (
//                                     <tr
//                                         key={row.interviewId}
//                                         className="border-t hover:bg-gray-50"
//                                     >
//                                         <td className="px-6 py-3">
//                                             {formatDT(row.scheduledAt)}
//                                         </td>
//                                         <td className="px-6 py-3">
//                                             {row.jobTitle ||
//                                                 `Job #${row.jobId}`}
//                                         </td>
//                                         <td className="px-6 py-3">
//                                             {row.candidateName ||
//                                                 `User #${row.candidateId}`}
//                                         </td>
//                                         <td className="px-6 py-3 break-all">
//                                             {row.candidateEmail || "—"}
//                                         </td>
//                                         <td className="px-6 py-3">
//                                             {row.durationMinutes} min
//                                         </td>
//                                         <td className="px-6 py-3">
//                                             <StatusPill status={row.status} />
//                                         </td>
//                                         <td className="px-6 py-3">
//                                             <div className="flex flex-wrap gap-2">
//                                                 {row.meetingUrl && (
//                                                     <Button
//                                                         variant="outline"
//                                                         size="sm"
//                                                         onClick={() =>
//                                                             router.push(
//                                                                 `/recruiter/applicants/interviews/${row.interviewId}/join`
//                                                             )
//                                                         }
//                                                     >
//                                                         Open meeting
//                                                     </Button>
//                                                 )}
//                                                 <Button
//                                                     variant="outline"
//                                                     size="sm"
//                                                     onClick={() =>
//                                                         setAppModal({
//                                                             jobId: row.jobId,
//                                                             userId: row.candidateId,
//                                                             jobTitle:
//                                                                 row.jobTitle,
//                                                             candidateName:
//                                                                 row.candidateName,
//                                                             candidateEmail:
//                                                                 row.candidateEmail,
//                                                         })
//                                                     }
//                                                 >
//                                                     Application
//                                                 </Button>

//                                                 {/* Recruiter can only set COMPLETED or CANCELLED (the BE enforces this) */}
//                                                 <Button
//                                                     variant="secondary"
//                                                     size="sm"
//                                                     disabled={
//                                                         updating ||
//                                                         row.status ===
//                                                             "COMPLETED"
//                                                     }
//                                                     onClick={() =>
//                                                         onChangeStatus(
//                                                             row,
//                                                             "COMPLETED"
//                                                         )
//                                                     }
//                                                 >
//                                                     Mark completed
//                                                 </Button>
//                                                 <Button
//                                                     variant="destructive"
//                                                     size="sm"
//                                                     disabled={
//                                                         updating ||
//                                                         row.status ===
//                                                             "CANCELLED"
//                                                     }
//                                                     onClick={() =>
//                                                         onChangeStatus(
//                                                             row,
//                                                             "CANCELLED"
//                                                         )
//                                                     }
//                                                 >
//                                                     Cancel
//                                                 </Button>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ))
//                             )}

//                             {!isLoading &&
//                                 (data?.content?.length ?? 0) === 0 && (
//                                     <tr>
//                                         <td
//                                             colSpan={7}
//                                             className="px-6 py-6 text-center text-gray-500"
//                                         >
//                                             No interviews
//                                         </td>
//                                     </tr>
//                                 )}
//                         </tbody>
//                     </table>
//                 </div>

//                 <div className="flex items-center justify-between px-4 py-3 border-t">
//                     <span className="text-sm text-gray-600">
//                         Page size:
//                         <select
//                             className="px-2 py-1 ml-2 border rounded-md"
//                             value={size}
//                             onChange={(e) => {
//                                 setSize(parseInt(e.target.value, 10));
//                                 setPage(0);
//                             }}
//                         >
//                             <option value={10}>10</option>
//                             <option value={20}>20</option>
//                             <option value={50}>50</option>
//                         </select>
//                     </span>
//                     <div className="flex items-center gap-2">
//                         <Button
//                             variant="outline"
//                             size="sm"
//                             disabled={page <= 0}
//                             onClick={() => setPage(page - 1)}
//                         >
//                             {"<"}
//                         </Button>
//                         <div className="flex items-center justify-center text-white bg-blue-600 rounded-md w-9 h-9">
//                             {(page ?? 0) + 1}
//                         </div>
//                         <Button
//                             variant="outline"
//                             size="sm"
//                             disabled={page + 1 >= (data?.totalPages ?? 1)}
//                             onClick={() => setPage(page + 1)}
//                         >
//                             {">"}
//                         </Button>
//                     </div>
//                 </div>
//             </div>

//             {/* Application detail modal (resolved from jobId + userId) */}
//             <InterviewApplicationModal
//                 open={!!appModal}
//                 onOpenChange={(v) => !v && setAppModal(null)}
//                 ctx={appModal}
//             />

//             <div className="space-y-6">
//                 <div>
//                     <h1 className="text-2xl font-bold text-gray-900">
//                         Lịch phỏng vấn
//                     </h1>
//                     <p className="text-gray-500">
//                         Quản lý lịch phỏng vấn các ứng viên
//                     </p>
//                 </div>

//                 <div className="relative">
//                     <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
//                     <Input
//                         placeholder="Tìm kiếm theo tên ứng viên hoặc vị trí..."
//                         className="pl-10"
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                 </div>

//                 {loading ? (
//                     <div className="flex justify-center py-8">
//                         <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//                     </div>
//                 ) : interviews.length === 0 ? (
//                     <div className="text-center py-8">
//                         <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-3" />
//                         <h3 className="text-lg font-medium text-gray-900">
//                             Không có lịch phỏng vấn
//                         </h3>
//                         <p className="text-gray-500 mt-1">
//                             {searchTerm
//                                 ? `Không tìm thấy lịch phỏng vấn phù hợp với "${searchTerm}"`
//                                 : "Chưa có lịch phỏng vấn nào được đặt"}
//                         </p>
//                     </div>
//                 ) : (
//                     <div className="space-y-6">
//                         {Object.entries(groupedInterviews)
//                             .sort((a, b) => {
//                                 return (
//                                     new Date(
//                                         a[0].split("/").reverse().join("-")
//                                     ) -
//                                     new Date(
//                                         b[0].split("/").reverse().join("-")
//                                     )
//                                 );
//                             })
//                             .map(([date, dateInterviews]) => (
//                                 <div key={date}>
//                                     <h2 className="text-lg font-semibold mb-3 flex items-center">
//                                         <Calendar className="mr-2 h-5 w-5 text-blue-600" />
//                                         {date}
//                                     </h2>
//                                     <div className="space-y-4">
//                                         {dateInterviews.map((interview) => (
//                                             <Card
//                                                 key={interview.id}
//                                                 className="overflow-hidden transition-shadow hover:shadow-md"
//                                             >
//                                                 <CardContent className="p-0">
//                                                     <div className="flex flex-col sm:flex-row">
//                                                         <div className="flex-1 p-6">
//                                                             <div className="flex gap-4">
//                                                                 <Avatar className="h-12 w-12">
//                                                                     <AvatarImage
//                                                                         src={
//                                                                             interview.avatar
//                                                                         }
//                                                                     />
//                                                                     <AvatarFallback>
//                                                                         {getInitials(
//                                                                             interview.applicant_name
//                                                                         )}
//                                                                     </AvatarFallback>
//                                                                 </Avatar>
//                                                                 <div>
//                                                                     <h3 className="text-lg font-semibold text-gray-900">
//                                                                         {
//                                                                             interview.applicant_name
//                                                                         }
//                                                                     </h3>
//                                                                     <div className="flex flex-wrap items-center gap-2 mt-1">
//                                                                         <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
//                                                                             {interview.status ===
//                                                                             "INTERVIEW_SCHEDULED"
//                                                                                 ? "Lịch phỏng vấn"
//                                                                                 : "Đã phỏng vấn"}
//                                                                         </span>
//                                                                         <span className="text-sm text-gray-600">
//                                                                             Vị
//                                                                             trí:{" "}
//                                                                             {
//                                                                                 interview.job_title
//                                                                             }
//                                                                         </span>
//                                                                     </div>

//                                                                     <div className="mt-3 space-y-1 text-sm text-gray-600">
//                                                                         <div className="flex items-center">
//                                                                             <Clock className="h-4 w-4 mr-2" />
//                                                                             <span>
//                                                                                 Thời
//                                                                                 gian:{" "}
//                                                                                 {new Date(
//                                                                                     interview.interview_date
//                                                                                 ).toLocaleTimeString(
//                                                                                     "vi-VN",
//                                                                                     {
//                                                                                         hour: "2-digit",
//                                                                                         minute: "2-digit",
//                                                                                     }
//                                                                                 )}
//                                                                             </span>
//                                                                         </div>
//                                                                         <div className="flex items-center">
//                                                                             {interview.interview_type ===
//                                                                             "ONLINE" ? (
//                                                                                 <>
//                                                                                     <Video className="h-4 w-4 mr-2" />
//                                                                                     <span>
//                                                                                         Phỏng
//                                                                                         vấn
//                                                                                         trực
//                                                                                         tuyến
//                                                                                     </span>
//                                                                                 </>
//                                                                             ) : (
//                                                                                 <>
//                                                                                     <MapPin className="h-4 w-4 mr-2" />
//                                                                                     <span>
//                                                                                         Địa
//                                                                                         điểm:{" "}
//                                                                                         {
//                                                                                             interview.interview_location
//                                                                                         }
//                                                                                     </span>
//                                                                                 </>
//                                                                             )}
//                                                                         </div>
//                                                                         <div className="flex items-center">
//                                                                             <Mail className="h-4 w-4 mr-2" />
//                                                                             <span>
//                                                                                 {
//                                                                                     interview.applicant_email
//                                                                                 }
//                                                                             </span>
//                                                                         </div>
//                                                                         <div className="flex items-center">
//                                                                             <Phone className="h-4 w-4 mr-2" />
//                                                                             <span>
//                                                                                 {
//                                                                                     interview.applicant_phone
//                                                                                 }
//                                                                             </span>
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>

//                                                         <div className="bg-gray-50 flex flex-row sm:flex-col items-center justify-around p-4 gap-2">
//                                                             {interview.interview_type ===
//                                                                 "ONLINE" && (
//                                                                 <Button
//                                                                     variant="outline"
//                                                                     size="sm"
//                                                                     asChild
//                                                                 >
//                                                                     <a
//                                                                         href={
//                                                                             interview.interview_link
//                                                                         }
//                                                                         target="_blank"
//                                                                         rel="noopener noreferrer"
//                                                                     >
//                                                                         <Video className="h-4 w-4 mr-2" />
//                                                                         Tham gia
//                                                                     </a>
//                                                                 </Button>
//                                                             )}

//                                                             <Button
//                                                                 variant="outline"
//                                                                 size="sm"
//                                                                 asChild
//                                                             >
//                                                                 <a
//                                                                     href={
//                                                                         interview.cv_url
//                                                                     }
//                                                                     target="_blank"
//                                                                     rel="noopener noreferrer"
//                                                                 >
//                                                                     <Download className="h-4 w-4 mr-2" />
//                                                                     Tải CV
//                                                                 </a>
//                                                             </Button>

//                                                             <Link
//                                                                 href={`/recruiter/applicants/${interview.id}`}
//                                                             >
//                                                                 <Button
//                                                                     size="sm"
//                                                                     className="bg-blue-600 hover:bg-blue-700"
//                                                                 >
//                                                                     <Eye className="h-4 w-4 mr-2" />
//                                                                     Chi tiết
//                                                                 </Button>
//                                                             </Link>
//                                                         </div>
//                                                     </div>
//                                                 </CardContent>
//                                             </Card>
//                                         ))}
//                                     </div>
//                                 </div>
//                             ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }
