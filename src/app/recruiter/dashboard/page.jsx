"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
    Briefcase,
    Users,
    FileText,
    TrendingUp,
    Calendar,
    Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CompanyGuard from "@/components/recruiter/CompanyGuard";
import { getMyCompany } from "@/services/companyService";
import {
    getRecruiterKpi,
    getRecruiterTrend,
} from "@/services/analyticsService";

const RecruiterDashboard = () => {
    const [companyId, setCompanyId] = useState(null);
    const [kpi, setKpi] = useState(null);
    const [trend, setTrend] = useState([]);
    const [loading, setLoading] = useState(true);
    const fmtDM = useMemo(
        () =>
            new Intl.DateTimeFormat("vi-VN", {
                day: "numeric",
                month: "numeric",
            }),
        []
    );

    const labelStep = useMemo(() => {
        const n = trend.length;
        if (n >= 28) return 3; // 30 ngày: hiện 1 nhãn mỗi 3 cột
        if (n >= 22) return 2; // 22–27 ngày: 1 nhãn mỗi 2 cột
        return 1; // ít ngày: hiện tất cả
    }, [trend]);

    useEffect(() => {
        let mounted = true;
        const run = async () => {
            try {
                const res = await getMyCompany();
                const cid =
                    res?.id ||
                    res?.company_id ||
                    res?.companyId ||
                    res?.company?.id;
                if (!cid) return;
                if (mounted) setCompanyId(cid);
                const k = await getRecruiterKpi(cid);
                if (mounted) setKpi(k);
                const to = new Date();
                const from = new Date();
                from.setDate(to.getDate() - 30);
                const points = await getRecruiterTrend(
                    cid,
                    from.toISOString().slice(0, 10),
                    to.toISOString().slice(0, 10)
                );
                if (mounted) setTrend(points || []);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        run();
        return () => {
            mounted = false;
        };
    }, []);
    // THÊM: tính ticks đẹp cho trục Y và niceMax dùng chung
    const yMeta = useMemo(() => {
        const max = Math.max(0, ...(trend || []).map((p) => p.count));
        const targetTicks = 5; // 0..max chia thành 5 mốc

        // bước thô: đủ lớn để phủ max với targetTicks-1 khoảng
        const roughStep = max > 0 ? Math.ceil(max / (targetTicks - 1)) : 1;
        // làm "nice" theo 1-2-5
        const pow10 = Math.pow(10, Math.floor(Math.log10(roughStep)));
        const candidates = [1, 2, 5, 10].map((m) => m * pow10);
        const step =
            candidates.find((c) => c >= roughStep) ||
            candidates[candidates.length - 1];

        // trần lên bội số của step
        const niceMax = Math.max(
            step * (targetTicks - 1),
            step * Math.ceil(max / step)
        );
        const ticks = Array.from(
            { length: Math.floor(niceMax / step) + 1 },
            (_, i) => i * step
        );
        return { niceMax, step, ticks };
    }, [trend]);

    const stats = useMemo(
        () => [
            {
                title: "Active Jobs",
                value: kpi?.activeJobs ?? "-",
                icon: Briefcase,
                color: "bg-blue-500",
                bgColor: "bg-blue-50",
                textColor: "text-blue-700",
            },
            {
                title: "Total Applicants",
                value: kpi?.totalApplicants ?? "-",
                icon: Users,
                color: "bg-green-500",
                bgColor: "bg-green-50",
                textColor: "text-green-700",
            },
            {
                title: "Applicants (30d)",
                value: kpi?.applicantsLast30Days ?? "-",
                icon: FileText,
                color: "bg-purple-500",
                bgColor: "bg-purple-50",
                textColor: "text-purple-700",
            },
        ],
        [kpi]
    );

    // Tính toán dữ liệu cho biểu đồ cột
    const chartData = useMemo(() => {
        if (!trend || trend.length === 0) return [];

        const maxValue = Math.max(...trend.map((p) => p.count));
        const base = yMeta.niceMax;

        const getHeight = (count) => {
            if (!base) return 0;
            const ratio = count / base;
            const minH = count > 0 ? 0.15 : 0; // tối thiểu 15% nếu có dữ liệu
            let h = Math.max(ratio * 100, minH);
            if (count === maxValue) h = Math.min(h + 10, 95); // nhấn nhẹ peak
            return h;
        };

        return trend.map((point, index) => ({
            ...point,
            height: getHeight(point.count),
            isToday: index === trend.length - 1,
            isWeekend: [0, 6].includes(new Date(point.date).getDay()),
            isPeak: point.count === maxValue,
        }));
    }, [trend, yMeta.niceMax]);

    // THÊM: màu cổ điển cho bar
    const barClass = (p) =>
        [
            "w-full rounded-t-sm transition-all duration-300 hover:opacity-90 shadow-sm",
            p.isWeekend ? "bg-gray-400" : "bg-blue-500", // weekdays/xám cho weekend
            p.isPeak && "bg-blue-700", // peak đậm hơn
            p.isToday && "ring-2 ring-blue-600", // today: viền xanh, giữ màu như weekdays
        ]
            .filter(Boolean)
            .join(" ");

    return (
        <CompanyGuard>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-blue-700">
                        Recruiter Dashboard
                    </h1>
                    <p className="text-gray-500">
                        Overview of your hiring activities
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {stats.map((stat, idx) => (
                        <Card
                            key={idx}
                            className="transition-all duration-200 border border-gray-200 shadow-sm hover:shadow-lg hover:scale-105"
                        >
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <div
                                    className={`p-3 rounded-full text-white ${stat.color} shadow-lg`}
                                >
                                    <stat.icon className="w-5 h-5" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div
                                    className={`text-3xl font-bold ${stat.textColor}`}
                                >
                                    {stat.value}
                                </div>
                                <div
                                    className={`text-xs mt-1 ${stat.textColor} opacity-70`}
                                >
                                    {stat.title === "Active Jobs" &&
                                        "Currently posted"}
                                    {stat.title === "Total Applicants" &&
                                        "All time"}
                                    {stat.title === "Applicants (30d)" &&
                                        "Last 30 days"}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Enhanced Charts */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Applications Trend Chart */}
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-blue-600" />
                                    Applications Trend (30 days)
                                </CardTitle>
                                <div className="text-sm text-gray-500">
                                    {trend.length > 0 &&
                                        `${trend.reduce(
                                            (sum, p) => sum + p.count,
                                            0
                                        )} total applications`}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] relative pb-6">
                                {/* Baseline đáy cho dễ canh mắt */}
                                <div className="absolute left-0 right-0 bottom-0 border-t border-gray-200 pointer-events-none" />

                                {/* Chart area (không còn Y axis) */}
                                <div className="h-full flex items-end justify-between gap-1">
                                    {chartData.map((point, i) => (
                                        <div
                                            key={i}
                                            className="flex flex-col items-center flex-1 group relative h-full"
                                        >
                                            <div className="w-full h-full flex items-end relative">
                                                <div
                                                    className={barClass(point)}
                                                    style={{
                                                        height: `${Math.max(
                                                            point.height,
                                                            point.count > 0
                                                                ? 15
                                                                : 0
                                                        )}%`,
                                                        minHeight:
                                                            point.count > 0
                                                                ? "20px"
                                                                : "0px",
                                                    }}
                                                    title={`${fmtDM.format(
                                                        new Date(point.date)
                                                    )}: ${
                                                        point.count
                                                    } applications`}
                                                >
                                                    <div className="w-full h-full rounded-t-lg bg-gradient-to-r from-transparent via-white to-transparent opacity-20" />
                                                </div>

                                                {/* Số trên đầu cột */}
                                                {point.count > 0 && (
                                                    <span
                                                        className="absolute left-1/2 -translate-x-1/2 -translate-y-1 text-[11px] font-semibold text-gray-700 bg-white/80 px-1 rounded"
                                                        style={{
                                                            bottom: `calc(${Math.min(
                                                                point.height,
                                                                95
                                                            )}% + 4px)`,
                                                        }}
                                                    >
                                                        {point.count}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Tooltip (hover) */}
                                            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-10">
                                                <div className="font-semibold">
                                                    {point.count}
                                                </div>
                                                <div className="text-xs opacity-75">
                                                    applications
                                                </div>
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                                            </div>

                                            {/* Nhãn ngày */}
                                            <div
                                                className={`mt-2 text-xs leading-none text-gray-500 text-center whitespace-nowrap ${
                                                    i % labelStep !== 0
                                                        ? "invisible"
                                                        : ""
                                                }`}
                                                /* invisible: giữ bố cục, không hiển thị */
                                            >
                                                {fmtDM.format(
                                                    new Date(point.date)
                                                )}{" "}
                                                {/* ví dụ 8/9 */}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Legend giữ nguyên */}
                                <div className="flex items-center gap-6 mt-6 text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-blue-500 rounded-lg shadow-sm"></div>
                                        <span className="font-medium">
                                            Weekdays
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-gray-400 rounded-lg shadow-sm"></div>
                                        <span className="font-medium">
                                            Weekends
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-blue-700 rounded-lg shadow-sm"></div>
                                        <span className="font-medium">
                                            Peak Day
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-blue-500 rounded-lg shadow-sm"></div>
                                        <span className="font-medium">
                                            Today
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activity & Insights */}
                    <Card className="border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-green-600" />
                                Recent Activity & Insights
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Activity Items */}
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                    <div className="p-2 bg-blue-100 rounded-full">
                                        <Users className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-blue-900">
                                            New Applications
                                        </p>
                                        <p className="text-xs text-blue-700">
                                            Check the Applicants page to review
                                            new applications
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                                    <div className="p-2 bg-green-100 rounded-full">
                                        <Briefcase className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-green-900">
                                            Job Posting
                                        </p>
                                        <p className="text-xs text-green-700">
                                            Create new job postings to attract
                                            more candidates
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                                    <div className="p-2 bg-purple-100 rounded-full">
                                        <Eye className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-purple-900">
                                            Analytics
                                        </p>
                                        <p className="text-xs text-purple-700">
                                            View detailed analytics in the
                                            Analytics page
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="pt-4 border-t border-gray-100">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                                    Quick Stats
                                </h4>
                                <div className="grid grid-cols-2 gap-3 text-center">
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <div className="text-lg font-bold text-gray-800">
                                            {trend.length > 0
                                                ? Math.round(
                                                      trend.reduce(
                                                          (sum, p) =>
                                                              sum + p.count,
                                                          0
                                                      ) / trend.length
                                                  )
                                                : 0}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            Avg daily
                                        </div>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <div className="text-lg font-bold text-gray-800">
                                            {trend.length > 0
                                                ? Math.max(
                                                      ...trend.map(
                                                          (p) => p.count
                                                      )
                                                  )
                                                : 0}
                                        </div>
                                        <div className="text-xs text-gray-600">
                                            Peak day
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </CompanyGuard>
    );
};

export default RecruiterDashboard;

// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import {
//     Briefcase,
//     Users,
//     FileText,
//     TrendingUp,
//     Calendar,
//     Eye,
//     ExternalLink,
//     ArrowRight,
//     Star,
//     AlertCircle,
// } from "lucide-react";
// import {
//     Card,
//     CardContent,
//     CardHeader,
//     CardTitle,
//     CardFooter,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import CompanyGuard from "@/components/recruiter/CompanyGuard";
// import Link from "next/link";
// import { recruiterKpi, recruiterTrend } from "@/mock/data/recruiterDashboard";

// const RecruiterDashboard = () => {
//     const [companyId, setCompanyId] = useState(null);
//     const [kpi, setKpi] = useState(null);
//     const [trend, setTrend] = useState([]);
//     const [recentApplicants, setRecentApplicants] = useState([]);
//     const [upcomingInterviews, setUpcomingInterviews] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const fmtDM = useMemo(
//         () =>
//             new Intl.DateTimeFormat("vi-VN", {
//                 day: "numeric",
//                 month: "numeric",
//             }),
//         []
//     );

//     const labelStep = useMemo(() => {
//         const n = trend.length;
//         if (n >= 28) return 3; // 30 ngày: hiện 1 nhãn mỗi 3 cột
//         if (n >= 22) return 2; // 22–27 ngày: 1 nhãn mỗi 2 cột
//         return 1; // ít ngày: hiện tất cả
//     }, [trend]);

//     useEffect(() => {
//         // Use mock data instead of API calls
//         setKpi(recruiterKpi);
//         setTrend(recruiterTrend);
//         setCompanyId(101); // Mock company ID

//         // Generate recent applicants mock data
//         setRecentApplicants([
//             {
//                 id: 1,
//                 name: "Nguyen Van A",
//                 email: "nguyenvana@example.com",
//                 jobTitle: "Senior Frontend Developer",
//                 appliedAt: "2023-10-22T10:30:00Z",
//                 avatar: "https://randomuser.me/api/portraits/men/32.jpg",
//             },
//             {
//                 id: 2,
//                 name: "Tran Thi B",
//                 email: "tranthib@example.com",
//                 jobTitle: "Backend Node.js Developer",
//                 appliedAt: "2023-10-21T15:45:00Z",
//                 avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//             },
//             {
//                 id: 3,
//                 name: "Le Van C",
//                 email: "levanc@example.com",
//                 jobTitle: "UI/UX Designer",
//                 appliedAt: "2023-10-21T09:15:00Z",
//                 avatar: "https://randomuser.me/api/portraits/men/22.jpg",
//             },
//         ]);

//         // Generate upcoming interviews mock data
//         setUpcomingInterviews([
//             {
//                 id: 1,
//                 candidateName: "Pham Thi D",
//                 jobTitle: "Product Designer",
//                 scheduleAt: "2023-10-25T14:00:00Z",
//                 type: "ONLINE",
//                 link: "https://meet.google.com/abc-defg-hij",
//             },
//             {
//                 id: 2,
//                 candidateName: "Hoang Van E",
//                 jobTitle: "DevOps Engineer",
//                 scheduleAt: "2023-10-26T10:30:00Z",
//                 type: "ONSITE",
//                 location: "Company Office, Floor 5",
//             },
//         ]);

//         setLoading(false);
//     }, []);

//     // THÊM: tính ticks đẹp cho trục Y và niceMax dùng chung
//     const yMeta = useMemo(() => {
//         const max = Math.max(0, ...(trend || []).map((p) => p.count));
//         const targetTicks = 5; // 0..max chia thành 5 mốc

//         // bước thô: đủ lớn để phủ max với targetTicks-1 khoảng
//         const roughStep = max > 0 ? Math.ceil(max / (targetTicks - 1)) : 1;
//         // làm "nice" theo 1-2-5
//         const pow10 = Math.pow(10, Math.floor(Math.log10(roughStep)));
//         const candidates = [1, 2, 5, 10].map((m) => m * pow10);
//         const step =
//             candidates.find((c) => c >= roughStep) ||
//             candidates[candidates.length - 1];

//         // trần lên bội số của step
//         const niceMax = Math.max(
//             step * (targetTicks - 1),
//             step * Math.ceil(max / step)
//         );
//         const ticks = Array.from(
//             { length: Math.floor(niceMax / step) + 1 },
//             (_, i) => i * step
//         );
//         return { niceMax, step, ticks };
//     }, [trend]);

//     const stats = useMemo(
//         () => [
//             {
//                 title: "Active Jobs",
//                 value: kpi?.activeJobs ?? "-",
//                 icon: Briefcase,
//                 color: "bg-blue-500",
//                 bgColor: "bg-blue-50",
//                 textColor: "text-blue-700",
//                 href: "/recruiter/manage-job/active",
//             },
//             {
//                 title: "Total Applicants",
//                 value: kpi?.totalApplicants ?? "-",
//                 icon: Users,
//                 color: "bg-green-500",
//                 bgColor: "bg-green-50",
//                 textColor: "text-green-700",
//                 href: "/recruiter/applicants/all",
//             },
//             {
//                 title: "Applicants (30d)",
//                 value: kpi?.applicantsLast30Days ?? "-",
//                 icon: FileText,
//                 color: "bg-purple-500",
//                 bgColor: "bg-purple-50",
//                 textColor: "text-purple-700",
//                 href: "/recruiter/applicants/all",
//             },
//             {
//                 title: "Total Hires",
//                 value: kpi?.totalHires ?? "-",
//                 icon: Star,
//                 color: "bg-amber-500",
//                 bgColor: "bg-amber-50",
//                 textColor: "text-amber-700",
//                 href: "/recruiter/applicants/accepted",
//             },
//         ],
//         [kpi]
//     );

//     // Tính toán dữ liệu cho biểu đồ cột
//     const chartData = useMemo(() => {
//         if (!trend || trend.length === 0) return [];

//         const maxValue = Math.max(...trend.map((p) => p.count));
//         const base = yMeta.niceMax;

//         const getHeight = (count) => {
//             if (!base) return 0;
//             const ratio = count / base;
//             const minH = count > 0 ? 0.15 : 0; // tối thiểu 15% nếu có dữ liệu
//             let h = Math.max(ratio * 100, minH);
//             if (count === maxValue) h = Math.min(h + 10, 95); // nhấn nhẹ peak
//             return h;
//         };

//         return trend.map((point, index) => ({
//             ...point,
//             height: getHeight(point.count),
//             isToday: index === trend.length - 1,
//             isWeekend: [0, 6].includes(new Date(point.date).getDay()),
//             isPeak: point.count === maxValue,
//         }));
//     }, [trend, yMeta.niceMax]);

//     // THÊM: màu cổ điển cho bar
//     const barClass = (p) =>
//         [
//             "w-full rounded-t-sm transition-all duration-300 hover:opacity-90 shadow-sm",
//             p.isWeekend ? "bg-gray-400" : "bg-blue-500", // weekdays/xám cho weekend
//             p.isPeak && "bg-blue-700", // peak đậm hơn
//             p.isToday && "ring-2 ring-blue-600", // today: viền xanh, giữ màu như weekdays
//         ]
//             .filter(Boolean)
//             .join(" ");

//     // Format date for interviews and applications
//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         return date.toLocaleString("en-US", {
//             month: "short",
//             day: "numeric",
//             hour: "2-digit",
//             minute: "2-digit",
//         });
//     };

//     return (
//         <CompanyGuard>
//             <div className="space-y-8">
//                 {/* Header */}
//                 <div>
//                     <h1 className="text-2xl font-bold text-blue-700">
//                         Recruiter Dashboard
//                     </h1>
//                     <p className="text-gray-500">
//                         Overview of your hiring activities
//                     </p>
//                 </div>

//                 {/* KPI Cards */}
//                 <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
//                     {stats.map((stat, i) => (
//                         <Card
//                             key={i}
//                             className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
//                         >
//                             <CardHeader className="flex flex-row items-center justify-between pb-2">
//                                 <CardTitle className="text-sm font-medium">
//                                     {stat.title}
//                                 </CardTitle>
//                                 <div
//                                     className={`p-3 rounded-full text-white ${stat.color} shadow-lg`}
//                                 >
//                                     <stat.icon className="w-5 h-5" />
//                                 </div>
//                             </CardHeader>
//                             <CardContent>
//                                 <div
//                                     className={`text-3xl font-bold ${stat.textColor}`}
//                                 >
//                                     {stat.value}
//                                 </div>
//                                 <div
//                                     className={`text-xs mt-1 ${stat.textColor} opacity-70`}
//                                 >
//                                     {stat.title === "Active Jobs" &&
//                                         "Currently posted"}
//                                     {stat.title === "Total Applicants" &&
//                                         "All time"}
//                                     {stat.title === "Applicants (30d)" &&
//                                         "Last 30 days"}
//                                     {stat.title === "Total Hires" &&
//                                         "Successfully hired"}
//                                 </div>
//                             </CardContent>
//                             <CardFooter className="pt-0">
//                                 <Link
//                                     href={stat.href}
//                                     className="text-sm text-blue-600 hover:underline inline-flex items-center"
//                                 >
//                                     View details{" "}
//                                     <ArrowRight className="ml-1 h-3 w-3" />
//                                 </Link>
//                             </CardFooter>
//                         </Card>
//                     ))}
//                 </div>

//                 {/* Main Content */}
//                 <div className="grid gap-6 lg:grid-cols-2">
//                     {/* Applications Trend Chart */}
//                     <Card className="border border-gray-200 shadow-sm">
//                         <CardHeader className="pb-4">
//                             <div className="flex items-center justify-between">
//                                 <CardTitle className="flex items-center gap-2">
//                                     <TrendingUp className="w-5 h-5 text-blue-600" />
//                                     Applications Trend (30 days)
//                                 </CardTitle>
//                                 <div className="text-sm text-gray-500">
//                                     {trend.length > 0 &&
//                                         `${trend.reduce(
//                                             (sum, p) => sum + p.count,
//                                             0
//                                         )} total applications`}
//                                 </div>
//                             </div>
//                         </CardHeader>
//                         <CardContent>
//                             {/* Add container with responsive width and overflow handling */}
//                             <div className="w-full overflow-x-auto">
//                                 <div className="h-[300px] relative pb-6 min-w-[600px]">
//                                     {/* Baseline đáy cho dễ canh mắt */}
//                                     <div className="absolute left-0 right-0 bottom-0 border-t border-gray-200 pointer-events-none" />

//                                     {/* Chart area (không còn Y axis) */}
//                                     <div className="h-full flex items-end justify-between gap-1">
//                                         {chartData.map((point, i) => (
//                                             <div
//                                                 key={i}
//                                                 className="flex flex-col items-center flex-1 group relative h-full"
//                                             >
//                                                 <div className="w-full h-full flex items-end relative">
//                                                     <div
//                                                         className={barClass(
//                                                             point
//                                                         )}
//                                                         style={{
//                                                             height: `${Math.max(
//                                                                 point.height,
//                                                                 point.count > 0
//                                                                     ? 15
//                                                                     : 0
//                                                             )}%`,
//                                                             minHeight:
//                                                                 point.count > 0
//                                                                     ? "20px"
//                                                                     : "0px",
//                                                         }}
//                                                         title={`${fmtDM.format(
//                                                             new Date(point.date)
//                                                         )}: ${
//                                                             point.count
//                                                         } applications`}
//                                                     >
//                                                         <div className="w-full h-full rounded-t-lg bg-gradient-to-r from-transparent via-white to-transparent opacity-20" />
//                                                     </div>

//                                                     {/* Số trên đầu cột */}
//                                                     {point.count > 0 && (
//                                                         <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1 text-[11px] font-semibold text-gray-700 bg-white/80 px-1 rounded">
//                                                             {point.count}
//                                                         </span>
//                                                     )}
//                                                 </div>

//                                                 {/* Nhãn ngày */}
//                                                 <div
//                                                     className={`mt-2 text-xs leading-none text-gray-500 text-center whitespace-nowrap ${
//                                                         i % labelStep !== 0
//                                                             ? "invisible"
//                                                             : ""
//                                                     }`}
//                                                 >
//                                                     {fmtDM.format(
//                                                         new Date(point.date)
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>

//                                     {/* Legend */}
//                                     <div className="flex items-center gap-6 mt-6 text-xs">
//                                         <div className="flex items-center gap-2">
//                                             <div className="w-4 h-4 bg-blue-500 rounded-lg shadow-sm"></div>
//                                             <span className="font-medium">
//                                                 Weekdays
//                                             </span>
//                                         </div>
//                                         <div className="flex items-center gap-2">
//                                             <div className="w-4 h-4 bg-gray-400 rounded-lg shadow-sm"></div>
//                                             <span className="font-medium">
//                                                 Weekends
//                                             </span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </CardContent>
//                     </Card>

//                     {/* Recent Applications */}
//                     <Card className="border border-gray-200 shadow-sm">
//                         <CardHeader>
//                             <div className="flex items-center justify-between">
//                                 <CardTitle className="flex items-center gap-2">
//                                     <Users className="w-5 h-5 text-blue-600" />
//                                     Recent Applications
//                                 </CardTitle>
//                                 <Link
//                                     href="/recruiter/applicants/all"
//                                     className="text-sm text-blue-600 hover:underline"
//                                 >
//                                     View all
//                                 </Link>
//                             </div>
//                         </CardHeader>
//                         <CardContent>
//                             {loading ? (
//                                 <div className="flex justify-center py-6">
//                                     <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//                                 </div>
//                             ) : recentApplicants.length === 0 ? (
//                                 <div className="text-center py-6 text-gray-500">
//                                     No recent applications
//                                 </div>
//                             ) : (
//                                 <div className="space-y-4">
//                                     {recentApplicants.map((applicant) => (
//                                         <div
//                                             key={applicant.id}
//                                             className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg hover:bg-gray-50"
//                                         >
//                                             <div className="relative w-10 h-10 rounded-full overflow-hidden">
//                                                 <img
//                                                     src={applicant.avatar}
//                                                     alt={applicant.name}
//                                                     className="object-cover w-full h-full"
//                                                 />
//                                             </div>
//                                             <div className="flex-1 min-w-0">
//                                                 <h4 className="font-medium text-gray-900 truncate">
//                                                     {applicant.name}
//                                                 </h4>
//                                                 <p className="text-sm text-gray-500 truncate">
//                                                     {applicant.jobTitle}
//                                                 </p>
//                                             </div>
//                                             <div className="text-xs text-gray-500">
//                                                 {formatDate(
//                                                     applicant.appliedAt
//                                                 )}
//                                             </div>
//                                             <Link
//                                                 href={`/recruiter/applicants/${applicant.id}`}
//                                                 className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
//                                             >
//                                                 <Eye className="w-4 h-4" />
//                                             </Link>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}
//                         </CardContent>
//                     </Card>
//                 </div>

//                 {/* Third Row */}
//                 <div className="grid gap-6 lg:grid-cols-2">
//                     {/* Upcoming Interviews */}
//                     <Card className="border border-gray-200 shadow-sm">
//                         <CardHeader>
//                             <div className="flex items-center justify-between">
//                                 <CardTitle className="flex items-center gap-2">
//                                     <Calendar className="w-5 h-5 text-blue-600" />
//                                     Upcoming Interviews
//                                 </CardTitle>
//                                 <Link
//                                     href="/recruiter/applicants/interviews"
//                                     className="text-sm text-blue-600 hover:underline"
//                                 >
//                                     View all
//                                 </Link>
//                             </div>
//                         </CardHeader>
//                         <CardContent>
//                             {loading ? (
//                                 <div className="flex justify-center py-6">
//                                     <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//                                 </div>
//                             ) : upcomingInterviews.length === 0 ? (
//                                 <div className="text-center py-6 text-gray-500">
//                                     No upcoming interviews scheduled
//                                 </div>
//                             ) : (
//                                 <div className="space-y-4">
//                                     {upcomingInterviews.map((interview) => (
//                                         <div
//                                             key={interview.id}
//                                             className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
//                                         >
//                                             <div className="flex items-center justify-between mb-2">
//                                                 <h4 className="font-medium text-gray-900">
//                                                     {interview.candidateName}
//                                                 </h4>
//                                                 <span
//                                                     className={`text-xs px-2 py-1 rounded-full ${
//                                                         interview.type ===
//                                                         "ONLINE"
//                                                             ? "bg-blue-100 text-blue-700"
//                                                             : "bg-green-100 text-green-700"
//                                                     }`}
//                                                 >
//                                                     {interview.type}
//                                                 </span>
//                                             </div>
//                                             <p className="text-sm text-gray-600 mb-3">
//                                                 {interview.jobTitle}
//                                             </p>
//                                             <div className="flex items-center justify-between">
//                                                 <div className="flex items-center text-sm text-gray-500">
//                                                     <Calendar className="w-4 h-4 mr-1" />
//                                                     {formatDate(
//                                                         interview.scheduleAt
//                                                     )}
//                                                 </div>
//                                                 {interview.type === "ONLINE" ? (
//                                                     <Button
//                                                         variant="outline"
//                                                         size="sm"
//                                                         className="text-xs h-8"
//                                                         asChild
//                                                     >
//                                                         <a
//                                                             href={
//                                                                 interview.link
//                                                             }
//                                                             target="_blank"
//                                                             rel="noopener noreferrer"
//                                                         >
//                                                             <ExternalLink className="w-3 h-3 mr-1" />
//                                                             Join
//                                                         </a>
//                                                     </Button>
//                                                 ) : (
//                                                     <div className="text-xs text-gray-500">
//                                                         {interview.location}
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}
//                         </CardContent>
//                     </Card>

//                     {/* Quick Actions */}
//                     <Card className="border border-gray-200 shadow-sm">
//                         <CardHeader>
//                             <CardTitle className="flex items-center gap-2">
//                                 <AlertCircle className="w-5 h-5 text-blue-600" />
//                                 Quick Actions
//                             </CardTitle>
//                         </CardHeader>
//                         <CardContent>
//                             <div className="grid gap-4 md:grid-cols-2">
//                                 <Link href="/recruiter/create-job">
//                                     <div className="p-4 border border-blue-100 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
//                                         <Briefcase className="w-8 h-8 text-blue-600 mb-2" />
//                                         <h3 className="font-medium text-gray-900">
//                                             Post a New Job
//                                         </h3>
//                                         <p className="text-sm text-gray-600 mt-1">
//                                             Create a new job posting to attract
//                                             candidates
//                                         </p>
//                                     </div>
//                                 </Link>

//                                 <Link href="/recruiter/applicants/all">
//                                     <div className="p-4 border border-purple-100 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors">
//                                         <Users className="w-8 h-8 text-purple-600 mb-2" />
//                                         <h3 className="font-medium text-gray-900">
//                                             Manage Applicants
//                                         </h3>
//                                         <p className="text-sm text-gray-600 mt-1">
//                                             Review and manage candidate
//                                             applications
//                                         </p>
//                                     </div>
//                                 </Link>

//                                 <Link href="/recruiter/applicants/interviews">
//                                     <div className="p-4 border border-green-100 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
//                                         <Calendar className="w-8 h-8 text-green-600 mb-2" />
//                                         <h3 className="font-medium text-gray-900">
//                                             Schedule Interviews
//                                         </h3>
//                                         <p className="text-sm text-gray-600 mt-1">
//                                             Set up interviews with potential
//                                             candidates
//                                         </p>
//                                     </div>
//                                 </Link>

//                                 <Link href="/recruiter/companyVip">
//                                     <div className="p-4 border border-amber-100 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors">
//                                         <Star className="w-8 h-8 text-amber-600 mb-2" />
//                                         <h3 className="font-medium text-gray-900">
//                                             Upgrade to VIP
//                                         </h3>
//                                         <p className="text-sm text-gray-600 mt-1">
//                                             Boost visibility and get premium
//                                             features
//                                         </p>
//                                     </div>
//                                 </Link>
//                             </div>
//                         </CardContent>
//                     </Card>
//                 </div>
//             </div>
//         </CompanyGuard>
//     );
// };

// export default RecruiterDashboard;
