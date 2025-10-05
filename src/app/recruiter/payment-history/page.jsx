"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import CompanyGuard from "@/components/recruiter/CompanyGuard";
import { getMyCompany } from "@/services/companyService";
import { Button } from "@/components/ui/button";
import { Loader2, Search, Filter, RefreshCcw } from "lucide-react";

const NEXT_PUBLIC_API_BASE = `${process.env.NEXT_PUBLIC_API_PROXY_TARGET}${process.env.NEXT_PUBLIC_API_BASE_URL}/`;
const API_BASE_URL = (NEXT_PUBLIC_API_BASE || "").replace(/\/+$/, "");

const VND = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
});

function formatVNDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function StatusPill({ status }) {
    const base = "px-2.5 py-1 rounded-full text-xs border ";
    switch (status) {
        case "PAID":
            return (
                <span
                    className={
                        base +
                        "text-emerald-700 border-emerald-300 bg-emerald-50"
                    }
                >
                    PAID
                </span>
            );
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
        case "FAILED":
            return (
                <span
                    className={base + "text-red-700 border-red-300 bg-red-50"}
                >
                    FAILED
                </span>
            );
        case "REFUNDED":
            return (
                <span
                    className={
                        base + "text-gray-700 border-gray-300 bg-gray-50"
                    }
                >
                    REFUNDED
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

function PaymentsTable({
    data,
    loading,
    page,
    totalPages,
    onPageChange,
    pageSize,
    onPageSizeChange,
    localQuery,
    onLocalQueryChange,
    localStatus,
    onLocalStatusChange,
    onRefresh,
}) {
    const headerCell = "px-6 py-4 text-left align-middle";
    const cell = "px-6 py-4 align-middle";

    const filteredContent = useMemo(() => {
        let items = data?.content || [];
        if (localQuery?.trim()) {
            const q = localQuery.trim().toLowerCase();
            items = items.filter(
                (it) =>
                    (it.txnRef || "").toLowerCase().includes(q) ||
                    (it.providerTxn || "").toLowerCase().includes(q)
            );
        }
        if (localStatus && localStatus !== "ALL") {
            items = items.filter((it) => it.status === localStatus);
        }
        return items;
    }, [data, localQuery, localStatus]);

    return (
        <div className="bg-white border rounded-xl">
            {/* Toolbar */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-4 py-3 border-b">
                <h3 className="text-lg font-semibold">
                    Payment History:{" "}
                    <span className="text-gray-600">
                        {data?.totalElements ?? 0}
                    </span>
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2" />
                        <input
                            value={localQuery}
                            onChange={(e) => onLocalQueryChange(e.target.value)}
                            className="w-64 pl-8 pr-3 py-2 border rounded-md"
                            placeholder="Search txnRef / providerTxn"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-500" />
                        <select
                            value={localStatus}
                            onChange={(e) =>
                                onLocalStatusChange(e.target.value)
                            }
                            className="px-2 py-2 border rounded-md"
                            title="Filter status"
                        >
                            <option value="ALL">All</option>
                            <option value="PAID">PAID</option>
                            <option value="PENDING">PENDING</option>
                            <option value="FAILED">FAILED</option>
                            <option value="REFUNDED">REFUNDED</option>
                        </select>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onRefresh}
                        title="Refresh"
                    >
                        <RefreshCcw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className={headerCell}>Reference code</th>
                            <th className={headerCell}>Transaction code</th>
                            <th className={headerCell}>Provider</th>
                            <th className={headerCell}>Status</th>
                            <th className={headerCell}>Amount</th>
                            <th className={headerCell}>Currency</th>
                            <th className={headerCell}>Bought At</th>
                            <th className={headerCell}>Paid At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="px-6 py-8 text-center text-gray-500"
                                >
                                    <div className="inline-flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />{" "}
                                        Loading...
                                    </div>
                                </td>
                            </tr>
                        ) : filteredContent.length > 0 ? (
                            filteredContent.map((it) => (
                                <tr
                                    key={it.id}
                                    className="border-t hover:bg-gray-50"
                                >
                                    <td className={cell}>
                                        <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                                            {it.txnRef || "—"}
                                        </code>
                                    </td>
                                    <td className={cell}>
                                        {it.providerTxn ? (
                                            <code className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                                                {it.providerTxn}
                                            </code>
                                        ) : (
                                            <span className="text-gray-400">
                                                —
                                            </span>
                                        )}
                                    </td>
                                    <td className={cell}>
                                        {it.provider || "—"}
                                    </td>
                                    <td className={cell}>
                                        <StatusPill status={it.status} />
                                    </td>
                                    <td className={cell}>
                                        {typeof it.amountVnd === "number"
                                            ? VND.format(it.amountVnd)
                                            : "—"}
                                    </td>
                                    <td className={cell}>
                                        {it.currency || "VND"}
                                    </td>
                                    <td className={cell + " whitespace-nowrap"}>
                                        {formatVNDate(it.createdAt)}
                                    </td>
                                    <td className={cell + " whitespace-nowrap"}>
                                        {it.paidAt
                                            ? formatVNDate(it.paidAt)
                                            : "—"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="px-6 py-8 text-center text-gray-500"
                                >
                                    No payments found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer / Pagination */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-4 py-3 border-t">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span>
                        View{" "}
                        <span className="ml-1 mr-1 font-medium">
                            {data?.size ?? pageSize}
                        </span>{" "}
                        per page
                    </span>
                    <select
                        className="px-2 py-1 border rounded-md"
                        value={pageSize}
                        onChange={(e) =>
                            onPageSizeChange(parseInt(e.target.value, 10))
                        }
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page <= 0 || loading}
                        onClick={() => onPageChange(page - 1)}
                    >
                        {"<"}
                    </Button>
                    <div className="flex items-center justify-center text-white bg-blue-600 rounded-md w-9 h-9">
                        {(page ?? 0) + 1}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page + 1 >= (totalPages ?? 1) || loading}
                        onClick={() => onPageChange(page + 1)}
                    >
                        {">"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function PaymentHistoryPage() {
    const user = useSelector((s) => s.auth?.user);
    const userCompanyId =
        user?.companyId || user?.company?.id || user?.company_id || null;

    const [resolvedCompanyId, setResolvedCompanyId] = useState(
        userCompanyId || null
    );
    const [resolvingCompany, setResolvingCompany] = useState(false);

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const [localQuery, setLocalQuery] = useState("");
    const [localStatus, setLocalStatus] = useState("ALL");

    useEffect(() => {
        let mounted = true;
        const ensureCompanyId = async () => {
            if (userCompanyId) {
                setResolvedCompanyId(userCompanyId);
                return;
            }
            try {
                setResolvingCompany(true);
                const res = await getMyCompany();
                const cid =
                    res?.company_id ||
                    res?.id ||
                    res?.companyId ||
                    res?.company?.id;
                if (mounted) setResolvedCompanyId(cid ?? null);
            } catch {
                if (mounted) setResolvedCompanyId(null);
            } finally {
                if (mounted) setResolvingCompany(false);
            }
        };
        ensureCompanyId();
        return () => {
            mounted = false;
        };
    }, [userCompanyId]);

    const fetchPage = useCallback(
        async (_page = page, _size = pageSize) => {
            if (!resolvedCompanyId) return;
            setLoading(true);
            setErr(null);
            try {
                const url = `${API_BASE_URL}/payments/vnpay/companies/${resolvedCompanyId}?page=${_page}&size=${_size}`;
                const res = await fetch(url, {
                    credentials: "include",
                    headers: { Accept: "application/json" },
                });
                if (!res.ok) throw new Error(`Fetch failed (${res.status})`);
                const json = await res.json();
                setData(json);
            } catch (e) {
                setErr(e?.message || "Failed to load payments");
                setData(null);
            } finally {
                setLoading(false);
            }
        },
        [resolvedCompanyId, page, pageSize]
    );

    useEffect(() => {
        if (resolvedCompanyId != null) {
            fetchPage();
        }
    }, [resolvedCompanyId, page, pageSize]);

    const totalPages = data?.totalPages ?? 1;

    return (
        <CompanyGuard>
            <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Payment History</h1>
                    {(resolvingCompany || !resolvedCompanyId) && (
                        <div className="text-sm text-gray-600 inline-flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Resolving your company...
                        </div>
                    )}
                </div>

                {err && (
                    <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded">
                        {err}
                    </div>
                )}

                <PaymentsTable
                    data={data}
                    loading={loading || resolvingCompany || !resolvedCompanyId}
                    page={page}
                    totalPages={totalPages}
                    onPageChange={(p) =>
                        setPage(Math.max(0, Math.min(p, totalPages - 1)))
                    }
                    pageSize={pageSize}
                    onPageSizeChange={(s) => {
                        setPageSize(s);
                        setPage(0);
                    }}
                    localQuery={localQuery}
                    onLocalQueryChange={setLocalQuery}
                    localStatus={localStatus}
                    onLocalStatusChange={setLocalStatus}
                    onRefresh={() => fetchPage(0, pageSize)}
                />
            </div>
        </CompanyGuard>
    );
}
