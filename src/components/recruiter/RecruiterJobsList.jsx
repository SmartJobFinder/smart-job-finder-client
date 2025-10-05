"use client";

import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectAuthUser } from "@/features/auth/authSelectors";
import { searchJobsByCompany, buildDefaultFiltersFor } from "@/services/recruiterJobsService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getMyCompany } from "@/services/companyService";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Calendar, MapPin, Building2, DollarSign, AlertCircle } from "lucide-react";
import { useState } from "react";
import JobDetailModal from "@/components/recruiter/JobDetailModal";

export default function RecruiterJobsList({ tab = "all" }) {
    const [detailOpen, setDetailOpen] = useState(false);
    const [detailJob, setDetailJob] = useState(null);
    const [detailJobId, setDetailJobId] = useState(null);
    const user = useSelector((s) => s.auth.user);
    const userCompanyId = user?.companyId || user?.company?.id || user?.company_id;

    const [resolvedCompanyId, setResolvedCompanyId] = useState(userCompanyId || null);
    const [filters, setFilters] = useState(() => ({ keyword: "", ...buildDefaultFiltersFor(tab) }));
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [sort, setSort] = useState("id,desc");

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({ content: [], totalPages: 0, totalElements: 0 });

    // Resolve companyId từ user hoặc từ API /companies/my-company
    useEffect(() => {
        let mounted = true;
        const ensureCompanyId = async () => {
            if (userCompanyId) {
                setResolvedCompanyId(userCompanyId);
                return;
            }
            try {
                setLoading(true);
                const res = await getMyCompany();
                const cid = res?.company_id || res?.id || res?.companyId || res?.company?.id;
                if (mounted) setResolvedCompanyId(cid || null);
            } catch (e) {
                // Không hiển thị lỗi, chỉ set companyId = null
                if (mounted) setResolvedCompanyId(null);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        ensureCompanyId();
        return () => {
            mounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userCompanyId]);

    const canQuery = useMemo(() => !!resolvedCompanyId, [resolvedCompanyId]);

    const fetchData = async () => {
        if (!canQuery) return;
        setLoading(true);
        try {
            const res = await searchJobsByCompany({ companyId: resolvedCompanyId, filters, page, size, sort });
            setData({
                content: res?.content || [],
                totalPages: res?.totalPages ?? 1,
                totalElements: res?.totalElements ?? res?.content?.length ?? 0,
            });
        } catch (e) {
            // Không hiển thị lỗi gì cả, chỉ set data rỗng
            setData({ content: [], totalPages: 0, totalElements: 0 });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab]);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab, resolvedCompanyId, sort, size, page]);

    const onSearch = () => {
        setPage(0);
        fetchData();
    };

    const JobCard = ({ job }) => {
        const isExpired = (() => {
            if (!job.expired_date) return false;
            const [d, m, y] = String(job.expired_date).split("-").map(Number);
            const exp = new Date(y, m - 1, d);
            const today = new Date();
            exp.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);
            return exp < today;
        })();

        const rawStatus = String(job.status || "").toLowerCase();
        const computedStatus = isExpired ? "expired" : rawStatus || "unknown";
        const statusColor = computedStatus === "active"
            ? "bg-green-100 text-green-700"
            : computedStatus === "draft"
                ? "bg-gray-100 text-gray-700"
                : computedStatus === "expired" || computedStatus === "inactive"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700";
        return (
            <Card className="p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold truncate text-lg">{job.title}</h3>
                            <Badge className={statusColor + " capitalize"}>{computedStatus}</Badge>
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            <span className="truncate">{job.company?.company_name || job.company?.companyName}</span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4 text-muted-foreground" />
                                <span>{job.salaryDisplay || (job.salary_min && job.salary_max ? `${job.salary_min} - ${job.salary_max}` : "Negotiable")}</span>
                            </div>
                            {job.location && (
                                <div className="flex items-center gap-1 text-muted-foreground">
                                    <MapPin className="w-4 h-4" />
                                    <span className="truncate max-w-[260px]">{job.location}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="text-right shrink-0 text-xs text-muted-foreground space-y-1">
                        <div className="flex items-center gap-1 justify-end"><Calendar className="w-3 h-3" /> Posted: {job.date_post}</div>
                        <div className="flex items-center gap-1 justify-end"><Calendar className="w-3 h-3" /> Expired: {job.expired_date}</div>
                        <div className="pt-2">
                            <div className="flex items-center gap-2 justify-end">
                                <Button size="sm" variant="secondary" onClick={() => { setDetailJob(job); setDetailJobId(job.id); setDetailOpen(true); }}>View</Button>
                                <Link href={`/recruiter/manage-job/${job.id}/edit`}>
                                    <Button size="sm" variant="outline">Edit</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        );
    };

    const LoadingSkeleton = () => (
        <div className="space-y-2">
            {Array.from({ length: Math.max(3, size) }).map((_, i) => (
                <Card key={i} className="p-4 animate-pulse">
                    <div className="h-4 w-40 bg-muted rounded mb-2" />
                    <div className="h-3 w-24 bg-muted rounded mb-2" />
                    <div className="h-3 w-64 bg-muted rounded" />
                </Card>
            ))}
        </div>
    );

    const EmptyState = () => (
        <Card className="p-10 text-center">
            <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                    <div className="text-lg font-medium mb-2">No jobs found</div>
                    <div className="text-sm text-muted-foreground mb-4">
                        {tab === "all" 
                            ? "You haven't posted any jobs yet. Create your first job to attract candidates."
                            : `No ${tab} jobs found. Try creating a new job or check other tabs.`
                        }
                    </div>
                </div>
                <Link href="/recruiter/create-job">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        Create Your First Job
                    </Button>
                </Link>
            </div>
        </Card>
    );

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
                <Input
                    placeholder="Search by title..."
                    value={filters.keyword || ""}
                    onChange={(e) => setFilters((f) => ({ ...f, keyword: e.target.value }))}
                    className="w-64"
                />

                {tab === "all" && (
                    <Select
                        value={filters.status ?? "ALL"}
                        onValueChange={(v) =>
                            setFilters((f) => ({ ...f, status: v === "ALL" ? undefined : v }))
                        }
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All</SelectItem>
                            <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                            <SelectItem value="DRAFT">DRAFT</SelectItem>
                        </SelectContent>
                    </Select>
                )}

                <Select value={String(size)} onValueChange={(v) => setSize(Number(v))}>
                    <SelectTrigger className="w-28">
                        <SelectValue placeholder="Size" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">5 / page</SelectItem>
                        <SelectItem value="10">10 / page</SelectItem>
                        <SelectItem value="20">20 / page</SelectItem>
                        <SelectItem value="50">50 / page</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="id,desc">Newest</SelectItem>
                        <SelectItem value="expiredDate,asc">Expiring soon</SelectItem>
                        <SelectItem value="expiredDate,desc">Expired recently</SelectItem>
                    </SelectContent>
                </Select>

                <Button onClick={onSearch}>Apply</Button>
            </div>

            {loading && <LoadingSkeleton />}

            {!loading && data.content.length === 0 && <EmptyState />}

            <div className="space-y-2">
                {data.content.map((job) => (
                    <JobCard key={job.id} job={job} />
                ))}
            </div>

            {!loading && data.content.length > 0 && (
                <div className="flex items-center justify-between pt-2">
                    <div className="text-sm">Total: {data.totalElements}</div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" disabled={page <= 0} onClick={() => setPage((p) => p - 1)}>
                            Previous page
                        </Button>
                        <div className="text-sm">
                            {page + 1} / {Math.max(1, data.totalPages)}
                        </div>
                        <Button variant="outline" disabled={page + 1 >= data.totalPages} onClick={() => setPage((p) => p + 1)}>
                            Next page
                        </Button>
                    </div>
                </div>
            )}

            <JobDetailModal open={detailOpen} onOpenChange={setDetailOpen} job={detailJob} jobId={detailJobId} />
        </div>
    );
} 