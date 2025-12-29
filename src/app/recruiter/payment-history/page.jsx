"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import CompanyGuard from "@/components/recruiter/CompanyGuard";
import { getMyCompany } from "@/services/companyService";
import { Button } from "@/components/ui/button";
import { Loader2, Search, Filter, RefreshCcw } from "lucide-react";
import { t } from "@/i18n/i18n";

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
          className={base + "text-emerald-700 border-emerald-300 bg-emerald-50"}
        >
          PAID
        </span>
      );
    case "PENDING":
      return (
        <span className={base + "text-amber-700 border-amber-300 bg-amber-50"}>
          PENDING
        </span>
      );
    case "FAILED":
      return (
        <span className={base + "text-red-700 border-red-300 bg-red-50"}>
          FAILED
        </span>
      );
    case "REFUNDED":
      return (
        <span className={base + "text-gray-700 border-gray-300 bg-gray-50"}>
          REFUNDED
        </span>
      );
    default:
      return (
        <span className={base + "text-gray-700 border-gray-300 bg-gray-50"}>
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
        it =>
          (it.txnRef || "").toLowerCase().includes(q) ||
          (it.providerTxn || "").toLowerCase().includes(q)
      );
    }
    if (localStatus && localStatus !== "ALL") {
      items = items.filter(it => it.status === localStatus);
    }
    return items;
  }, [data, localQuery, localStatus]);

  return (
    <div className="bg-white border rounded-xl">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-4 py-3 border-b">
        <h3 className="text-lg font-semibold">
          {t`Payment History`}:{" "}
          <span className="text-gray-600">{data?.totalElements ?? 0}</span>
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-2 top-1/2 -translate-y-1/2" />
            <input
              value={localQuery}
              onChange={e => onLocalQueryChange(e.target.value)}
              className="w-64 pl-8 pr-3 py-2 border rounded-md"
              placeholder={t`Search txnRef / providerTxn`}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={localStatus}
              onChange={e => onLocalStatusChange(e.target.value)}
              className="px-2 py-2 border rounded-md"
              title={t`Filter status`}
            >
              <option value="ALL">{t`All`}</option>
              <option value="PAID">{t`PAID`}</option>
              <option value="PENDING">{t`PENDING`}</option>
              <option value="FAILED">{t`FAILED`}</option>
              <option value="REFUNDED">{t`REFUNDED`}</option>
            </select>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            title={t`Refresh`}
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            {t`Refresh`}
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className={headerCell}>{t`Reference code`}</th>
              <th className={headerCell}>{t`Transaction code`}</th>
              <th className={headerCell}>{t`Provider`}</th>
              <th className={headerCell}>{t`Status`}</th>
              <th className={headerCell}>{t`Amount`}</th>
              <th className={headerCell}>{t`Currency`}</th>
              <th className={headerCell}>{t`Bought At`}</th>
              <th className={headerCell}>{t`Paid At`}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                  <div className="inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> {t`Loading...`}
                  </div>
                </td>
              </tr>
            ) : filteredContent.length > 0 ? (
              filteredContent.map(it => (
                <tr key={it.id} className="border-t hover:bg-gray-50">
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
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className={cell}>{it.provider || "—"}</td>
                  <td className={cell}>
                    <StatusPill status={it.status} />
                  </td>
                  <td className={cell}>
                    {typeof it.amountVnd === "number"
                      ? VND.format(it.amountVnd)
                      : "—"}
                  </td>
                  <td className={cell}>{it.currency || "VND"}</td>
                  <td className={cell + " whitespace-nowrap"}>
                    {formatVNDate(it.createdAt)}
                  </td>
                  <td className={cell + " whitespace-nowrap"}>
                    {it.paidAt ? formatVNDate(it.paidAt) : "—"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                  {t`No payments found`}
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
            {t`View`}{" "}
            <span className="ml-1 mr-1 font-medium">
              {data?.size ?? pageSize}
            </span>{" "}
            {t`per page`}
          </span>
          <select
            className="px-2 py-1 border rounded-md"
            value={pageSize}
            onChange={e => onPageSizeChange(parseInt(e.target.value, 10))}
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
  const user = useSelector(s => s.auth?.user);
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
          res?.company_id || res?.id || res?.companyId || res?.company?.id;
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
          <h1 className="text-xl font-semibold">{t`Payment History`}</h1>
          {(resolvingCompany || !resolvedCompanyId) && (
            <div className="text-sm text-gray-600 inline-flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              {t`Resolving your company...`}
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
          onPageChange={p => setPage(Math.max(0, Math.min(p, totalPages - 1)))}
          pageSize={pageSize}
          onPageSizeChange={s => {
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

// "use client";

// import React, { useState, useEffect } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import {
//     CreditCard,
//     Calendar,
//     CheckCircle,
//     XCircle,
//     Clock,
//     Download,
//     ChevronDown,
//     ChevronUp,
//     Filter,
// } from "lucide-react";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
// import CompanyGuard from "@/components/recruiter/CompanyGuard";
// import {
//     getPaymentHistory,
//     getActiveSubscription,
// } from "@/mock/data/recruiterPayments";

// export default function PaymentHistoryPage() {
//     const [payments, setPayments] = useState([]);
//     const [activeSubscription, setActiveSubscription] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [filterStatus, setFilterStatus] = useState("all");
//     const [sortDirection, setSortDirection] = useState("desc");

//     useEffect(() => {
//         // Simulate API call with delay
//         const timer = setTimeout(() => {
//             const history = getPaymentHistory();
//             const subscription = getActiveSubscription();

//             setPayments(history);
//             setActiveSubscription(subscription);
//             setLoading(false);
//         }, 800);

//         return () => clearTimeout(timer);
//     }, []);

//     // Filter payments by status
//     const filteredPayments = payments.filter((payment) => {
//         if (filterStatus === "all") return true;
//         return payment.status.toLowerCase() === filterStatus.toLowerCase();
//     });

//     // Sort payments by date
//     const sortedPayments = [...filteredPayments].sort((a, b) => {
//         const dateA = new Date(a.paymentDate);
//         const dateB = new Date(b.paymentDate);
//         return sortDirection === "desc" ? dateB - dateA : dateA - dateB;
//     });

//     const getStatusBadge = (status) => {
//         switch (status.toUpperCase()) {
//             case "SUCCESS":
//                 return (
//                     <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
//                         <CheckCircle className="w-3 h-3" />
//                         Success
//                     </span>
//                 );
//             case "FAILED":
//                 return (
//                     <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
//                         <XCircle className="w-3 h-3" />
//                         Failed
//                     </span>
//                 );
//             case "PENDING":
//                 return (
//                     <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full">
//                         <Clock className="w-3 h-3" />
//                         Pending
//                     </span>
//                 );
//             default:
//                 return (
//                     <span className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
//                         {status}
//                     </span>
//                 );
//         }
//     };

//     const formatCurrency = (amount, currency) => {
//         if (currency === "VND") {
//             return new Intl.NumberFormat("vi-VN", {
//                 style: "currency",
//                 currency: "VND",
//                 maximumFractionDigits: 0,
//             }).format(amount);
//         }
//         return `${amount} ${currency}`;
//     };

//     return (
//         <CompanyGuard>
//             <div className="space-y-6">
//                 <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
//                     <div>
//                         <h1 className="text-2xl font-bold text-gray-900">
//                             Payment History
//                         </h1>
//                         <p className="text-gray-500">
//                             View and manage your payment transactions
//                         </p>
//                     </div>

//                     {activeSubscription && (
//                         <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
//                             <CardContent className="p-4 flex gap-2 items-center">
//                                 <div className="p-2 bg-blue-100 rounded-full">
//                                     <CheckCircle className="w-4 h-4 text-blue-600" />
//                                 </div>
//                                 <div>
//                                     <p className="text-sm font-medium">
//                                         Active Subscription
//                                     </p>
//                                     <p className="text-xs text-gray-600">
//                                         {activeSubscription.packageName}{" "}
//                                         (Expires:{" "}
//                                         {new Date(
//                                             activeSubscription.expiryDate
//                                         ).toLocaleDateString()}
//                                         )
//                                     </p>
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     )}
//                 </div>

//                 {/* Filters */}
//                 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//                     <div className="flex items-center gap-2">
//                         <Filter className="w-4 h-4 text-gray-500" />
//                         <span className="text-sm text-gray-600">
//                             Filter by:
//                         </span>
//                         <Select
//                             value={filterStatus}
//                             onValueChange={setFilterStatus}
//                         >
//                             <SelectTrigger className="w-32 h-8">
//                                 <SelectValue placeholder="Status" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectItem value="all">All</SelectItem>
//                                 <SelectItem value="success">Success</SelectItem>
//                                 <SelectItem value="pending">Pending</SelectItem>
//                                 <SelectItem value="failed">Failed</SelectItem>
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     <Button
//                         variant="outline"
//                         size="sm"
//                         className="flex items-center gap-2"
//                         onClick={() =>
//                             setSortDirection(
//                                 sortDirection === "desc" ? "asc" : "desc"
//                             )
//                         }
//                     >
//                         <Calendar className="w-4 h-4" />
//                         Sort by Date
//                         {sortDirection === "desc" ? (
//                             <ChevronDown className="w-4 h-4" />
//                         ) : (
//                             <ChevronUp className="w-4 h-4" />
//                         )}
//                     </Button>
//                 </div>

//                 {loading ? (
//                     <div className="flex justify-center py-12">
//                         <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//                     </div>
//                 ) : sortedPayments.length === 0 ? (
//                     <div className="text-center py-12">
//                         <CreditCard className="w-12 h-12 mx-auto text-gray-400 mb-4" />
//                         <h3 className="text-lg font-medium text-gray-900 mb-2">
//                             No payment records found
//                         </h3>
//                         <p className="text-gray-500 mb-6">
//                             {filterStatus !== "all"
//                                 ? `No ${filterStatus} payments found. Try a different filter.`
//                                 : "You haven't made any payments yet."}
//                         </p>
//                         {filterStatus !== "all" && (
//                             <Button
//                                 variant="outline"
//                                 onClick={() => setFilterStatus("all")}
//                             >
//                                 Show all payments
//                             </Button>
//                         )}
//                     </div>
//                 ) : (
//                     <div className="space-y-4">
//                         {sortedPayments.map((payment) => (
//                             <Card key={payment.id} className="overflow-hidden">
//                                 <CardContent className="p-0">
//                                     <div className="flex flex-col md:flex-row">
//                                         <div className="flex-1 p-6">
//                                             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
//                                                 <div>
//                                                     <h3 className="text-lg font-semibold">
//                                                         {payment.packageName}
//                                                     </h3>
//                                                     <div className="flex items-center gap-2 mt-1">
//                                                         {getStatusBadge(
//                                                             payment.status
//                                                         )}
//                                                         <span className="text-sm text-gray-600">
//                                                             Transaction ID:{" "}
//                                                             {
//                                                                 payment.transactionId
//                                                             }
//                                                         </span>
//                                                     </div>
//                                                 </div>
//                                                 <div className="text-xl font-bold text-blue-600">
//                                                     {formatCurrency(
//                                                         payment.amount,
//                                                         payment.currency
//                                                     )}
//                                                 </div>
//                                             </div>

//                                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
//                                                 <div className="space-y-2">
//                                                     <div className="flex items-center">
//                                                         <Calendar className="w-4 h-4 mr-2 text-gray-500" />
//                                                         <span className="text-gray-700">
//                                                             Payment Date:
//                                                         </span>
//                                                         <span className="ml-2">
//                                                             {new Date(
//                                                                 payment.paymentDate
//                                                             ).toLocaleString()}
//                                                         </span>
//                                                     </div>

//                                                     {payment.expiryDate && (
//                                                         <div className="flex items-center">
//                                                             <Calendar className="w-4 h-4 mr-2 text-gray-500" />
//                                                             <span className="text-gray-700">
//                                                                 Expiry Date:
//                                                             </span>
//                                                             <span className="ml-2">
//                                                                 {new Date(
//                                                                     payment.expiryDate
//                                                                 ).toLocaleDateString()}
//                                                             </span>
//                                                         </div>
//                                                     )}
//                                                 </div>

//                                                 <div className="space-y-2">
//                                                     <div className="flex items-center">
//                                                         <CreditCard className="w-4 h-4 mr-2 text-gray-500" />
//                                                         <span className="text-gray-700">
//                                                             Payment Method:
//                                                         </span>
//                                                         <span className="ml-2">
//                                                             {
//                                                                 payment.paymentMethod
//                                                             }
//                                                         </span>
//                                                     </div>

//                                                     {payment.errorMessage && (
//                                                         <div className="flex items-start">
//                                                             <XCircle className="w-4 h-4 mr-2 text-red-500 mt-0.5" />
//                                                             <span className="text-red-600">
//                                                                 {
//                                                                     payment.errorMessage
//                                                                 }
//                                                             </span>
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         <div className="bg-gray-50 p-6 flex flex-row md:flex-col items-center justify-around gap-3 border-t md:border-t-0 md:border-l border-gray-200">
//                                             <Button
//                                                 variant="outline"
//                                                 size="sm"
//                                                 className="w-full"
//                                                 disabled={
//                                                     payment.status !== "SUCCESS"
//                                                 }
//                                             >
//                                                 <Download className="w-4 h-4 mr-2" />
//                                                 Invoice
//                                             </Button>

//                                             {payment.status === "PENDING" && (
//                                                 <Button
//                                                     size="sm"
//                                                     className="w-full bg-blue-600 hover:bg-blue-700"
//                                                 >
//                                                     Retry
//                                                 </Button>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </CardContent>
//                             </Card>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </CompanyGuard>
//     );
// }
