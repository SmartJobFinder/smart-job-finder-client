// "use client";
// import { useState, useMemo } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// import {
//     useGetInterviewsForCandidateQuery,
//     useUpdateInterviewStatusMutation,
// } from "@/services/interviewService";
// import { useGetApplicationDetailByJobQuery } from "@/services/applicationService";

// import LoadingScreen from "@/components/ui/loadingScreen";
// import {
//     CalendarDays,
//     Clock,
//     Video,
//     FileText,
//     CheckCircle2,
//     XCircle,
//     Building2,
// } from "lucide-react";

// function StatusBadge({ status }) {
//     const map = {
//         PENDING: "bg-amber-100 text-amber-800 border-amber-200",
//         ACCEPTED: "bg-emerald-100 text-emerald-800 border-emerald-200",
//         DECLINED: "bg-rose-100 text-rose-800 border-rose-200",
//         COMPLETED: "bg-gray-100 text-gray-700 border-gray-200",
//         CANCELLED: "bg-gray-100 text-gray-500 border-gray-200",
//     };
//     return (
//         <span
//             className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold border rounded ${
//                 map[status] || "bg-gray-100 text-gray-700 border-gray-200"
//             }`}
//         >
//             {status}
//         </span>
//     );
// }

// function formatDateTime(dt) {
//     if (!dt) return "";
//     const d = new Date(dt);
//     return d.toLocaleString("en-US", {
//         year: "numeric",
//         month: "2-digit",
//         day: "2-digit",
//         hour: "2-digit",
//         minute: "2-digit",
//     });
// }

// function ApplicationMini({ jobId }) {
//     const { data, isFetching, isError } =
//         useGetApplicationDetailByJobQuery(jobId);

//     if (isFetching)
//         return <p className="text-sm text-gray-500">Loading application…</p>;
//     if (isError)
//         return (
//             <p className="text-sm text-rose-600">
//                 Failed to load application details.
//             </p>
//         );
//     if (!data)
//         return <p className="text-sm text-gray-500">No application found.</p>;

//     return (
//         <div className="space-y-2 text-sm">
//             <div>
//                 <strong>Status:</strong> {data.status}
//             </div>
//             {data.cv && (
//                 <div className="flex items-center gap-2">
//                     <FileText className="w-4 h-4 text-red-500" />
//                     <Link
//                         href={data.cv}
//                         target="_blank"
//                         className="text-blue-600 hover:underline"
//                     >
//                         View CV (PDF)
//                     </Link>
//                 </div>
//             )}
//             {data.description && (
//                 <div>
//                     <strong>Note:</strong> {data.description}
//                 </div>
//             )}
//             {data.createdAt && (
//                 <div>
//                     <strong>Applied:</strong> {formatDateTime(data.createdAt)}
//                 </div>
//             )}
//         </div>
//     );
// }

// export default function CandidateInterviewsPage() {
//     const router = useRouter();
//     const { data, isLoading, isError, refetch } =
//         useGetInterviewsForCandidateQuery({
//             page: 0,
//             size: 20,
//             sort: "scheduledAt,desc",
//         });

//     const [openAppJobId, setOpenAppJobId] = useState(null);
//     const [updateStatus, { isLoading: updating }] =
//         useUpdateInterviewStatusMutation();

//     const list = useMemo(() => data?.content || [], [data]);

//     async function onChangeStatus(interviewId, next) {
//         try {
//             await updateStatus({ interviewId, status: next }).unwrap();
//             refetch();
//         } catch (e) {
//             console.error(e);
//             alert("Failed to update status.");
//         }
//     }

//     if (isLoading) return <LoadingScreen message="Loading interviews..." />;
//     if (isError)
//         return <p className="text-rose-600">Failed to load interview list.</p>;

//     return (
//         <div className="max-w-5xl mx-auto space-y-4">
//             <div className="px-6 py-4 mb-4 border-b border-gray-100 bg-gradient-to-r from-blue-200 to-indigo-50 rounded-xl">
//                 <div className="max-w-6xl mx-auto">
//                     <h1 className="pl-4 text-2xl font-bold text-gray-900 border-l-4 border-blue-800">
//                         My interview schedule
//                     </h1>
//                 </div>
//             </div>

//             {list.length === 0 && (
//                 <p className="text-center text-gray-600">
//                     There is no interview scheduled yet. Start applying now.
//                 </p>
//             )}

//             {list.map((iv) => (
//                 <div key={iv.interviewId} className="space-y-2">
//                     <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md hover:border-blue-300">
//                         <div className="grid md:grid-cols-[1fr,200px]">
//                             <div className="p-4">
//                                 <div className="space-y-1">
//                                     <p
//                                         onClick={() =>
//                                             router.push(
//                                                 `/job-detail/${iv.jobId}`
//                                             )
//                                         }
//                                         className="text-lg font-semibold text-blue-800 cursor-pointer hover:text-blue-600"
//                                     >
//                                         {iv.jobTitle}
//                                     </p>
//                                     <div className="flex items-center gap-1 text-gray-600">
//                                         <Building2 className="w-4 h-4 text-gray-500" />
//                                         <span>{iv.companyName}</span>
//                                     </div>
//                                 </div>

//                                 <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-700">
//                                     <div className="flex items-center gap-2">
//                                         <CalendarDays className="w-4 h-4 text-blue-600" />
//                                         <span>
//                                             {formatDateTime(iv.scheduledAt)}
//                                         </span>
//                                     </div>
//                                     <div className="flex items-center gap-2">
//                                         <Clock className="w-4 h-4 text-gray-600" />
//                                         <span>
//                                             Duration: {iv.durationMinutes}{" "}
//                                             minutes
//                                         </span>
//                                     </div>
//                                 </div>

//                                 <div className="flex flex-wrap gap-2 mt-3">
//                                     {iv.meetingUrl ? (
//                                         <button
//                                             onClick={() =>
//                                                 router.push(
//                                                     `/interviews/${iv.interviewId}/join`
//                                                 )
//                                             }
//                                             className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-700 rounded-md hover:bg-blue-700"
//                                         >
//                                             <Video className="w-4 h-4" />
//                                             Open interview
//                                         </button>
//                                     ) : (
//                                         <span className="text-sm text-gray-500">
//                                             The meeting link is not available
//                                             yet.
//                                         </span>
//                                     )}

//                                     <button
//                                         type="button"
//                                         className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 border border-blue-400 rounded-md hover:bg-blue-50"
//                                         onClick={() =>
//                                             setOpenAppJobId(
//                                                 openAppJobId === iv.jobId
//                                                     ? null
//                                                     : iv.jobId
//                                             )
//                                         }
//                                     >
//                                         <FileText className="w-4 h-4" />
//                                         {openAppJobId === iv.jobId
//                                             ? "Hide Application"
//                                             : "Application"}
//                                     </button>
//                                 </div>
//                             </div>

//                             <div className="flex items-start justify-start p-4 border-t border-gray-100 md:border-t-0 md:border-l md:items-center md:justify-end">
//                                 {iv.status === "PENDING" && (
//                                     <div className="flex gap-2">
//                                         <button
//                                             disabled={updating}
//                                             onClick={() =>
//                                                 onChangeStatus(
//                                                     iv.interviewId,
//                                                     "ACCEPTED"
//                                                 )
//                                             }
//                                             className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-md border-emerald-300 text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"
//                                         >
//                                             <CheckCircle2 className="w-4 h-4" />
//                                             Accept
//                                         </button>
//                                         <button
//                                             disabled={updating}
//                                             onClick={() =>
//                                                 onChangeStatus(
//                                                     iv.interviewId,
//                                                     "DECLINED"
//                                                 )
//                                             }
//                                             className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-md border-rose-300 text-rose-700 hover:bg-rose-50 disabled:opacity-50"
//                                         >
//                                             <XCircle className="w-4 h-4" />
//                                             Decline
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>

//                             <div className="border-t border-gray-100 md:col-span-2 bg-gray-50">
//                                 <div className="flex items-center justify-end px-4 py-2">
//                                     <StatusBadge status={iv.status} />
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {openAppJobId === iv.jobId && (
//                         <div className="p-4 border border-blue-200 shadow-inner bg-gray-50 rounded-xl">
//                             <ApplicationMini jobId={iv.jobId} />
//                         </div>
//                     )}
//                 </div>
//             ))}
//         </div>
//     );
// }
"use client";
import { useState } from "react";
import {
    Calendar,
    Check,
    Clock,
    MapPin,
    User,
    Building,
    FileText,
} from "lucide-react";
import { interviewPrep } from "@/mock/data/interviewPrep";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function InterviewsPage() {
    const [activeTab, setActiveTab] = useState("upcoming");

    const { upcomingInterviews, pastInterviewFeedback, commonQuestions } =
        interviewPrep;

    return (
        <div className="p-6 space-y-6 bg-white rounded-lg shadow-sm">
            <div className="flex border-b">
                <button
                    className={`px-4 py-2 -mb-px font-medium ${
                        activeTab === "upcoming"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("upcoming")}
                >
                    Upcoming Interviews
                </button>
                <button
                    className={`px-4 py-2 -mb-px font-medium ${
                        activeTab === "past"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("past")}
                >
                    Past Interviews
                </button>
                <button
                    className={`px-4 py-2 -mb-px font-medium ${
                        activeTab === "preparation"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-500"
                    }`}
                    onClick={() => setActiveTab("preparation")}
                >
                    Interview Prep
                </button>
            </div>

            {activeTab === "upcoming" && (
                <div className="space-y-4">
                    {upcomingInterviews.length === 0 ? (
                        <p className="text-center text-gray-600 py-10">
                            No upcoming interviews scheduled.
                        </p>
                    ) : (
                        upcomingInterviews.map((interview) => (
                            <div
                                key={interview.interviewId}
                                className="border rounded-lg p-4 shadow-sm"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-lg">
                                            Frontend Developer Interview
                                        </h3>
                                        <div className="mt-2 space-y-2">
                                            <div className="flex items-center text-gray-600">
                                                <Building className="h-4 w-4 mr-2" />
                                                <span>TechVision</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                <span>October 25, 2023</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Clock className="h-4 w-4 mr-2" />
                                                <span>2:00 PM - 3:00 PM</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <MapPin className="h-4 w-4 mr-2" />
                                                <span>Online (Zoom)</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <User className="h-4 w-4 mr-2" />
                                                <span>
                                                    John Smith, Senior Developer
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                                        Scheduled
                                    </Badge>
                                </div>
                                <div className="mt-4 flex space-x-2">
                                    <Button
                                        variant="outline"
                                        className="text-sm"
                                    >
                                        View Details
                                    </Button>
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-sm">
                                        Prepare
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === "past" && (
                <div className="space-y-4">
                    {pastInterviewFeedback.length === 0 ? (
                        <p className="text-center text-gray-600 py-10">
                            No past interviews found.
                        </p>
                    ) : (
                        pastInterviewFeedback.map((interview) => (
                            <div
                                key={interview.interviewId}
                                className="border rounded-lg p-4 shadow-sm"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-lg">
                                            UX Designer Interview
                                        </h3>
                                        <div className="mt-2 space-y-2">
                                            <div className="flex items-center text-gray-600">
                                                <Building className="h-4 w-4 mr-2" />
                                                <span>DesignHub</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Calendar className="h-4 w-4 mr-2" />
                                                <span>October 10, 2023</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Badge
                                        className={
                                            interview.outcome === "POSITIVE"
                                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                        }
                                    >
                                        {interview.outcome === "POSITIVE"
                                            ? "Successful"
                                            : "Feedback Received"}
                                    </Badge>
                                </div>

                                <div className="mt-4 border-t pt-3">
                                    <h4 className="font-medium text-sm mb-2">
                                        Feedback:
                                    </h4>
                                    <p className="text-gray-700 text-sm">
                                        {interview.feedback}
                                    </p>

                                    {interview.improvements && (
                                        <div className="mt-3">
                                            <h4 className="font-medium text-sm mb-1">
                                                Areas for Improvement:
                                            </h4>
                                            <p className="text-gray-700 text-sm">
                                                {interview.improvements}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === "preparation" && (
                <div className="space-y-6">
                    <div className="border rounded-lg p-4 bg-blue-50">
                        <h3 className="font-semibold text-lg mb-3">
                            Common Interview Questions
                        </h3>
                        <ul className="space-y-2">
                            {commonQuestions.map((question, idx) => (
                                <li key={idx} className="flex items-start">
                                    <Check className="h-4 w-4 text-green-600 mr-2 mt-1" />
                                    <span className="text-gray-800">
                                        {question}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="border rounded-lg p-4">
                        <h3 className="font-semibold text-lg mb-3">
                            Recommended Resources
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {upcomingInterviews[0]?.preparationMaterials.map(
                                (material, idx) => (
                                    <div
                                        key={idx}
                                        className="border p-3 rounded-md hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                <FileText className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-sm">
                                                    {material.title}
                                                </h4>
                                                <a
                                                    href={material.url}
                                                    className="text-blue-600 text-xs hover:underline"
                                                >
                                                    View Resource
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
