"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
    Calendar,
    MapPin,
    DollarSign,
    Building2,
    Tags,
    Layers,
    Briefcase,
    Clock,
} from "lucide-react";
import api from "@/lib/api";
import ParseInfoJob from "@/components/common/ParseInfoJob";
import { t } from "@/i18n/i18n";

export default function JobDetailModal({ open, onOpenChange, job, jobId }) {
    const [fullJob, setFullJob] = useState(job || null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            if (!open) return;
            try {
                setLoading(true);
                const { data } = await api.get(`/job/${jobId}`);
                setFullJob(data);
            } catch {
                // fallback giữ dữ liệu cũ
            } finally {
                setLoading(false);
            }
        };
        if (jobId) load();
    }, [open, jobId]);

    const j = fullJob || job;
    if (!j) return null;
    const status = String(j.status || "").toLowerCase();
    const statusColor =
        status === "active"
            ? "bg-green-100 text-green-700"
            : status === "draft"
            ? "bg-gray-100 text-gray-700"
            : status === "inactive"
            ? "bg-red-100 text-red-700"
            : "bg-yellow-100 text-yellow-700";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!w-[85vw] !max-w-[1400px] max-h-[90vh] overflow-y-auto">
                <DialogHeader className="pb-4 border-b">
                    <DialogTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {j.title}
                            </h2>
                            <Badge
                                className={`${statusColor} capitalize px-3 py-1 text-sm font-medium`}
                            >
                                {status}
                            </Badge>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                {/* Header Info - Horizontal Layout */}
                <div className="p-6 mb-6 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="flex items-center gap-2 text-gray-700">
                            <Building2 className="w-5 h-5 text-blue-600" />
                            <span className="font-medium">
                                {j.company?.company_name ||
                                    j.company?.companyName}
                            </span>
                        </div>
                        {j.location && (
                            <div className="flex items-center gap-2 text-gray-700">
                                <MapPin className="w-5 h-5 text-green-600" />
                                <span>{j.location}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2 text-gray-700">
                            <DollarSign className="w-5 h-5 text-yellow-600" />
                            <span className="font-semibold">
                                {j.salaryDisplay}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                            <Clock className="w-5 h-5 text-purple-600" />
                            <span className="text-sm">
                                Posted: {j.date_post}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Content - Horizontal Layout */}
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                    {/* Left Column - Job Details */}
                    <div className="lg:col-span-3">
                        <ParseInfoJob
                            description={j.description}
                            requirements={j.requirements}
                            benefits={j.benefits}
                        />
                    </div>

                    {/* Right Column - Tags and Info */}
                    <div className="space-y-6">
                        {/* Job Info Card */}
                        <div className="p-6 bg-white border border-gray-200 rounded-lg">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                Job Information
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <span>Posted: {j.date_post}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <span>Expires: {j.expired_date}</span>
                                </div>
                            </div>
                        </div>

                        {/* Categories */}
                        {Array.isArray(j.category_names) &&
                            j.category_names.length > 0 && (
                                <div className="p-6 bg-white border border-gray-200 rounded-lg">
                                    <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900">
                                        <Briefcase className="w-5 h-5 text-blue-600" />
                                        Categories
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {j.category_names.map((s, i) => (
                                            <Badge
                                                key={i}
                                                variant="outline"
                                                className="px-3 py-1 text-sm"
                                            >
                                                {s}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                        {/* Skills */}
                        {Array.isArray(j.skill_names) &&
                            j.skill_names.length > 0 && (
                                <div className="p-6 bg-white border border-gray-200 rounded-lg">
                                    <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900">
                                        <Tags className="w-5 h-5 text-purple-600" />
                                        Skills
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {j.skill_names.map((s, i) => (
                                            <Badge
                                                key={i}
                                                className="px-3 py-1 text-sm text-purple-800 bg-purple-100 hover:bg-purple-200"
                                            >
                                                {s}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                        {/* Levels */}
                        {Array.isArray(j.level_names) &&
                            j.level_names.length > 0 && (
                                <div className="p-6 bg-white border border-gray-200 rounded-lg">
                                    <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900">
                                        <Layers className="w-5 h-5 text-orange-600" />
                                        Experience Levels
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {j.level_names.map((s, i) => (
                                            <Badge
                                                key={i}
                                                variant="secondary"
                                                className="px-3 py-1 text-sm text-orange-800 bg-orange-100"
                                            >
                                                {s}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                        {/* Work Types */}
                        {Array.isArray(j.work_type_names) &&
                            j.work_type_names.length > 0 && (
                                <div className="p-6 bg-white border border-gray-200 rounded-lg">
                                    <h3 className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-900">
                                        <Briefcase className="w-5 h-5 text-green-600" />
                                        {t`Work Types`}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {j.work_type_names.map((s, i) => (
                                            <Badge
                                                key={i}
                                                variant="outline"
                                                className="px-3 py-1 text-sm text-green-800 border-green-200"
                                            >
                                                {s}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                    </div>
                </div>

                {loading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="flex items-center gap-2 text-gray-500">
                            <div className="w-4 h-4 border-b-2 border-blue-600 rounded-full animate-spin"></div>
                            <span>Loading...</span>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
