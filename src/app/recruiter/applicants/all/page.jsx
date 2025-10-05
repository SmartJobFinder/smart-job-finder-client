"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useGetApplicationsByCompanyQuery } from "@/services/applicationService";
import { getMyCompany } from "@/services/companyService";
import ApplicantsTable from "./components/ApplicantsTable";
import ApplicationDetailModal from "./components/ApplicationDetailModal";
import { useGetJobByIdQuery } from "@/services/jobService";
import CreateInterviewModal from "@/components/ui/CreateInterviewModal";

export default function RecruiterApplicantsPage() {
    const [companyId, setCompanyId] = useState(null);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [createPayload, setCreatePayload] = useState(null);

    useEffect(() => {
        let mounted = true;
        const fetchCompany = async () => {
            try {
                const res = await getMyCompany();
                const cid = res?.id || res?.company_id || res?.companyId || res?.company?.id;
                if (mounted) setCompanyId(cid || null);
            } catch (_) {
                if (mounted) setCompanyId(null);
            }
        };
        fetchCompany();
        return () => { mounted = false; };
    }, []);

    const canQuery = useMemo(() => !!companyId, [companyId]);
    const { data, isLoading } = useGetApplicationsByCompanyQuery(
        { companyId, page, size },
        { skip: !canQuery }
    );

    // Map jobId -> jobName (lazy fetch từng jobId xuất hiện)
    const [jobNameMap, setJobNameMap] = useState({});
    const jobIds = useMemo(() => Array.from(new Set((data?.content || []).map(i => i.jobId))), [data]);

    // Với mỗi jobId mới chưa có trong map, dùng useGetJobByIdQuery qua component con tạm hoặc fetch batch nhẹ bằng effect và api trực tiếp
    useEffect(() => {
        let isMounted = true;
        const fetchJobNames = async () => {
            const missing = jobIds.filter(id => !(id in jobNameMap));
            if (missing.length === 0) return;
            // Dùng fetch trực tiếp qua API client chung
            const base = process.env.NEXT_PUBLIC_API_PROXY_TARGET + process.env.NEXT_PUBLIC_API_BASE_URL;
            try {
                const results = await Promise.all(missing.map(id => fetch(`${base}/job/${id}`, { cache: "no-store" }).then(r => r.json()).catch(() => null)));
                if (!isMounted) return;
                const m = { ...jobNameMap };
                results.forEach((j, idx) => {
                    const jid = missing[idx];
                    if (j && (j.title || j.name)) m[jid] = j.title || j.name;
                });
                setJobNameMap(m);
            } catch {}
        };
        fetchJobNames();
        return () => { isMounted = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jobIds.join("|")]);

    // Modal chi tiết
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedApp, setSelectedApp] = useState(null);

    return (
        <div className="p-6">
            <ApplicantsTable
                data={data}
                loading={isLoading || !canQuery}
                jobNameMap={jobNameMap}
                page={page}
                totalPages={data?.totalPages ?? 1}
                onPageChange={(p) => setPage(p)}
                pageSize={size}
                onPageSizeChange={(s) => {
                    setSize(s);
                    setPage(0);
                }}
                onSeeApplication={(item) => {
                    if (item?.cv) {
                        window.open(item.cv, "_blank");
                    } else if (item?.cvDownload) {
                        window.open(item.cvDownload, "_blank");
                    }
                }}
                onDetails={(item) => {
                    setSelectedApp(item);
                    setDetailOpen(true);
                }}
                companyId={companyId}
                onCreateInterviewClick={(payload) => setCreatePayload(payload)}
            />

            <ApplicationDetailModal
                open={detailOpen}
                onOpenChange={setDetailOpen}
                application={selectedApp}
                jobName={
                    selectedApp ? jobNameMap?.[selectedApp.jobId] : undefined
                }
            />

            <CreateInterviewModal
                open={!!createPayload}
                onOpenChange={(v) => !v && setCreatePayload(null)}
                defaultCompanyId={createPayload?.companyId}
                defaultJobId={createPayload?.jobId}
                candidateId={createPayload?.candidateId}
                jobTitle={
                    createPayload?.jobTitle ??
                    jobNameMap?.[createPayload?.jobId] ??
                    (createPayload?.jobId ? `Job #${createPayload.jobId}` : "")
                }
                candidateName={createPayload?.candidateName}
                candidateEmail={createPayload?.candidateEmail}
            />
        </div>
    );
}
