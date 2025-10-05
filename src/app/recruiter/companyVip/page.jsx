"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { getMyCompany } from "@/services/companyService";
import { Check, ArrowRight, Briefcase, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";

const NEXT_PUBLIC_API_BASE = `${process.env.NEXT_PUBLIC_API_PROXY_TARGET}${process.env.NEXT_PUBLIC_API_BASE_URL}/`;
const API_BASE_URL = (NEXT_PUBLIC_API_BASE || "").replace(/\/+$/, "");
const VND = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
});

function extractRedirectUrl(data) {
    if (!data || typeof data !== "object") return null;
    return (
        data.payUrl ||
        data.paymentUrl ||
        data.redirectUrl ||
        data.checkoutUrl ||
        data.url ||
        null
    );
}

const UI_PLANS = [
    {
        key: "BASIC",
        targetPackageId: 1,
        displayName: "VIP 1 month",
        features: [
            "Tag VIP Company",
            "Your company will be recommended by JobHuntly",
            "Your job will stand out more on search page",
            "Get more jobs posted than normal companies every month",
            "24/7 Support",
        ],
    },
    {
        key: "STANDARD",
        targetPackageId: 2,
        displayName: "VIP 3 months",
        popular: true,
        features: [
            "Tag VIP Company",
            "Your company will be recommended by JobHuntly",
            "Your job will stand out more on search page",
            "Get more jobs posted than normal companies every month",
            "24/7 Support",
        ],
    },
    {
        key: "PREMIUM",
        targetPackageId: 3,
        displayName: "VIP 6 months",
        features: [
            "Tag VIP Company",
            "Your company will be recommended by JobHuntly",
            "Your job will stand out more on search page",
            "Get more jobs posted than normal companies every month",
            "24/7 Support",
        ],
    },
];

export default function CompanyVip() {
    const user = useSelector((s) => s.auth?.user);
    const userCompanyId =
        user?.companyId || user?.company?.id || user?.company_id || null;

    const [resolvedCompanyId, setResolvedCompanyId] = useState(
        userCompanyId || null
    );
    const [resolvingCompany, setResolvingCompany] = useState(false);

    const [packages, setPackages] = useState(null);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);

    const [open, setOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [paying, setPaying] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const url = new URL(window.location.href);
        const payStatus = url.searchParams.get("pay_status"); // "success" | "fail"
        const payCode = url.searchParams.get("pay_code");
        const txnRef = url.searchParams.get("txnRef");

        if (payStatus) {
            if (payStatus === "success") {
                const msg =
                    payCode === "ALREADY_PAID"
                        ? "Gói VIP đã được thanh toán trước đó."
                        : "Payment successful. VIP package activated!";
                toast.success(
                    `${msg}${txnRef ? " (Code: " + txnRef + ")" : ""}`
                );
            } else {
                toast.error(
                    `Payment failed: ${payCode || "UNKNOWN"}${
                        txnRef ? " (Code: " + txnRef + ")" : ""
                    }`
                );
            }

            // Xóa query để tránh toast lại khi refresh
            url.searchParams.delete("pay_status");
            url.searchParams.delete("pay_code");
            url.searchParams.delete("txnRef");
            const clean =
                url.pathname + (url.search ? "?" + url.search : "") + url.hash;
            window.history.replaceState({}, "", clean);
        }
    }, []);

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

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                setLoading(true);
                setErr(null);
                const res = await fetch(`${API_BASE_URL}/packages`, {
                    credentials: "include",
                    headers: { Accept: "application/json" },
                });
                if (!res.ok)
                    throw new Error(`Failed to load packages (${res.status})`);
                const data = await res.json();
                if (mounted) setPackages(data);
            } catch (e) {
                if (mounted) setErr(e?.message || "Failed to load packages");
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    const packageMap = useMemo(() => {
        const m = new Map();
        (packages || []).forEach((p) => m.set(p.packageId, p));
        return m;
    }, [packages]);

    const displayPlans = useMemo(() => {
        return UI_PLANS.map((ui) => {
            const dto = packageMap.get(ui.targetPackageId);
            return {
                ...ui,
                package: dto || null,
                priceLabel: dto ? VND.format(dto.priceVnd) : "—",
                description: dto
                    ? `${ui.displayName} (${dto.durationDays} days)`
                    : ui.displayName,
            };
        });
    }, [packageMap]);

    const handleChoosePlan = useCallback((plan) => {
        setSelectedPlan(plan);
        setOpen(true);
    }, []);

    const handlePay = useCallback(async () => {
        if (!selectedPlan) return;
        const pkg = packageMap.get(selectedPlan.targetPackageId);
        if (!pkg) {
            setErr("Package not found.");
            return;
        }
        if (!resolvedCompanyId) {
            setErr("Company not found.");
            return;
        }

        try {
            setPaying(true);
            // gửi body kiểu form-urlencoded
            const params = new URLSearchParams({
                companyId: String(resolvedCompanyId),
                packageId: String(pkg.packageId),
                amountVnd: String(pkg.priceVnd),
                bankCode: "NCB", // mặc định
                locale: "vn",
            });

            const res = await fetch(`${API_BASE_URL}/payments/vnpay/checkout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: params.toString(),
                credentials: "include",
            });

            if (!res.ok) throw new Error(`Checkout failed (${res.status})`);

            const data = await res.json();
            const redirectUrl = extractRedirectUrl(data);
            if (!redirectUrl) throw new Error("No redirect URL");

            window.location.href = redirectUrl;
        } catch (e) {
            setErr(e?.message || "Checkout failed");
        } finally {
            setPaying(false);
        }
    }, [selectedPlan, packageMap, resolvedCompanyId]);

    const canCheckout = !!resolvedCompanyId;

    // return (
    //     <div className="w-full space-y-6">
    //         {/* Header Section */}
    //         <div className="p-6 bg-white border border-gray-200 rounded-lg">
    //             <div className="flex items-center gap-2 mb-4">
    //                 <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-md">
    //                     <Briefcase className="w-3 h-3" />
    //                     <span>VIP Packages</span>
    //                 </div>
    //             </div>
    //             <h1 className="mb-2 text-2xl font-semibold text-gray-900">
    //                 Upgrade to VIP Company
    //             </h1>
    //             <p className="text-sm leading-relaxed text-gray-600">
    //                 Unlock premium job posting with extended visibility &
    //                 priority support. Get your company featured and attract top
    //                 talent faster.
    //             </p>
    //         </div>

    //         {/* Status & Error */}
    //         {(err || resolvingCompany) && (
    //             <div className="p-4 bg-white border border-gray-200 rounded-lg">
    //                 <div className="flex items-center gap-2 text-sm">
    //                     {resolvingCompany ? (
    //                         <>
    //                             <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
    //                             <span className="text-gray-700">
    //                                 Resolving your company...
    //                             </span>
    //                         </>
    //                     ) : (
    //                         <span className="font-medium text-red-600">
    //                             {err}
    //                         </span>
    //                     )}
    //                 </div>
    //             </div>
    //         )}

    //         {/* Plans Section */}
    //         <div className="p-6 bg-white border border-gray-200 rounded-lg">
    //             <h2 className="mb-6 text-lg font-semibold text-center text-gray-900">
    //                 Choose Your VIP Package
    //             </h2>

    //             {/* 3 Column Grid - Responsive */}
    //             <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    //                 {displayPlans.map((plan, index) => (
    //                     <Card
    //                         key={plan.key}
    //                         className={cn(
    //                             "group relative overflow-hidden rounded-lg border transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 hover:border-gray-300",
    //                             plan.popular
    //                                 ? "border-blue-500 bg-blue-50/30 shadow-sm"
    //                                 : "border-gray-200"
    //                         )}
    //                     >
    //                         {plan.popular && (
    //                             <div
    //                                 className={cn(
    //                                     "absolute top-3 right-3 z-10 transition-transform duration-300 ease-out",
    //                                     "group-hover:scale-105 group-hover:rotate-3"
    //                                 )}
    //                             >
    //                                 <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-600 text-white shadow-sm">
    //                                     Most Popular
    //                                 </span>
    //                             </div>
    //                         )}

    //                         <div className="relative z-0">
    //                             {/* Gradient overlay on hover */}
    //                             <div
    //                                 className={cn(
    //                                     "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 ease-out rounded-lg",
    //                                     "group-hover:opacity-5",
    //                                     plan.popular
    //                                         ? "from-blue-500/20 to-purple-500/20"
    //                                         : "from-gray-100/50 to-gray-200/50"
    //                                 )}
    //                             />

    //                             <CardHeader className="relative z-10 pt-4 pb-3 text-center">
    //                                 <CardTitle
    //                                     className={cn(
    //                                         "text-base font-semibold mb-1 transition-all duration-300 ease-out",
    //                                         "group-hover:text-gray-900 group-hover:font-bold",
    //                                         plan.popular
    //                                             ? "text-blue-700"
    //                                             : "text-gray-900"
    //                                     )}
    //                                 >
    //                                     {plan.displayName}
    //                                 </CardTitle>
    //                                 <CardDescription className="mb-3 text-xs text-gray-500 transition-colors duration-300 group-hover:text-gray-600">
    //                                     {plan.description}
    //                                 </CardDescription>
    //                                 <div
    //                                     className={cn(
    //                                         "text-2xl font-bold mb-1 transition-all duration-300 ease-out",
    //                                         "group-hover:scale-105",
    //                                         plan.popular
    //                                             ? "text-blue-600"
    //                                             : "text-gray-900"
    //                                     )}
    //                                 >
    //                                     {plan.priceLabel}
    //                                 </div>
    //                                 <p className="text-xs text-gray-500 transition-colors duration-300 group-hover:text-gray-600">
    //                                     per package
    //                                 </p>
    //                             </CardHeader>

    //                             <CardContent className="relative z-10 px-3 pb-4 space-y-2">
    //                                 {plan.features.map((feature, i) => (
    //                                     <div
    //                                         key={i}
    //                                         className="flex items-start gap-2 text-sm transition-all duration-300 ease-out group-hover:text-gray-800"
    //                                     >
    //                                         <div
    //                                             className={cn(
    //                                                 "flex-shrink-0 mt-0.5 w-4 h-4 transition-transform duration-300 ease-out",
    //                                                 "group-hover:scale-110"
    //                                             )}
    //                                         >
    //                                             <Check className="w-full h-full text-green-500 group-hover:text-green-600" />
    //                                         </div>
    //                                         <span className="leading-relaxed text-gray-700 transition-colors duration-300 group-hover:text-gray-900">
    //                                             {feature}
    //                                         </span>
    //                                     </div>
    //                                 ))}
    //                             </CardContent>

    //                             <CardFooter className="relative z-10 px-3 pt-0 pb-4">
    //                                 <Button
    //                                     className={cn(
    //                                         "w-full h-10 rounded-md font-medium text-sm transition-all duration-300 ease-out transform",
    //                                         "group-hover:scale-[1.02] group-hover:shadow-md",
    //                                         plan.popular
    //                                             ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm group-hover:shadow-lg"
    //                                             : "bg-gray-900 hover:bg-gray-800 text-white"
    //                                     )}
    //                                     onClick={() => handleChoosePlan(plan)}
    //                                     disabled={!plan.package || !canCheckout}
    //                                 >
    //                                     {canCheckout
    //                                         ? "Choose Plan"
    //                                         : "Coming Soon"}
    //                                 </Button>
    //                             </CardFooter>
    //                         </div>
    //                     </Card>
    //                 ))}
    //             </div>
    //         </div>

    //         {/* Confirm Modal */}
    //         <Dialog open={open} onOpenChange={setOpen}>
    //             <DialogContent className="sm:max-w-md">
    //                 <DialogHeader className="space-y-2">
    //                     <DialogTitle className="text-lg font-semibold text-gray-900">
    //                         Confirm VIP Package
    //                     </DialogTitle>
    //                     <p className="text-sm text-gray-600">
    //                         Review your order before proceeding to payment
    //                     </p>
    //                 </DialogHeader>

    //                 <div className="space-y-4">
    //                     <Tabs defaultValue="vnpay" className="w-full">
    //                         <TabsList className="grid w-full grid-cols-1 p-1 border rounded-md bg-gray-50">
    //                             <TabsTrigger
    //                                 value="vnpay"
    //                                 className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md text-sm"
    //                             >
    //                                 VNPay
    //                             </TabsTrigger>
    //                         </TabsList>

    //                         <TabsContent value="vnpay" className="pt-2 mt-0">
    //                             <div className="space-y-3">
    //                                 {/* Order Summary */}
    //                                 <div className="p-4 border rounded-lg bg-gray-50">
    //                                     <h3 className="mb-3 text-sm font-semibold text-gray-900">
    //                                         Order Summary
    //                                     </h3>
    //                                     <div className="space-y-2 text-sm">
    //                                         <div className="flex justify-between py-1">
    //                                             <span className="text-gray-600">
    //                                                 Package:
    //                                             </span>
    //                                             <span className="font-medium text-gray-900">
    //                                                 {selectedPlan?.displayName}
    //                                             </span>
    //                                         </div>
    //                                         <div className="flex justify-between py-1">
    //                                             <span className="text-gray-600">
    //                                                 Duration:
    //                                             </span>
    //                                             <span className="text-gray-900">
    //                                                 {(() => {
    //                                                     const dto =
    //                                                         packageMap.get(
    //                                                             selectedPlan?.targetPackageId
    //                                                         );
    //                                                     return dto
    //                                                         ? `${dto.durationDays} days`
    //                                                         : "—";
    //                                                 })()}
    //                                             </span>
    //                                         </div>
    //                                         <div className="flex justify-between py-1">
    //                                             <span className="text-gray-600">
    //                                                 Payment Method:
    //                                             </span>
    //                                             <span className="font-medium text-blue-600">
    //                                                 VNPay
    //                                             </span>
    //                                         </div>
    //                                         <div className="flex justify-between py-1 pt-2 border-t border-gray-200">
    //                                             <span className="text-gray-600">
    //                                                 Company ID:
    //                                             </span>
    //                                             <span className="text-gray-900">
    //                                                 {resolvedCompanyId ?? "—"}
    //                                             </span>
    //                                         </div>
    //                                         <div className="flex justify-between pt-2 border-t border-gray-200">
    //                                             <span className="text-sm font-semibold text-gray-900">
    //                                                 Total:
    //                                             </span>
    //                                             <span className="text-lg font-bold text-gray-900">
    //                                                 {selectedPlan
    //                                                     ? (() => {
    //                                                           const dto =
    //                                                               packageMap.get(
    //                                                                   selectedPlan.targetPackageId
    //                                                               );
    //                                                           return dto
    //                                                               ? VND.format(
    //                                                                     dto.priceVnd
    //                                                                 )
    //                                                               : "—";
    //                                                       })()
    //                                                     : "—"}
    //                                             </span>
    //                                         </div>
    //                                     </div>
    //                                 </div>

    //                                 {/* Action Buttons */}
    //                                 <div className="flex gap-2">
    //                                     <Button
    //                                         variant="outline"
    //                                         className="flex-1 h-10 text-sm text-gray-700 border-gray-200 rounded-md hover:bg-gray-50"
    //                                         onClick={() => setOpen(false)}
    //                                         disabled={paying}
    //                                     >
    //                                         Cancel
    //                                     </Button>
    //                                     <Button
    //                                         className="flex-1 h-10 text-sm text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700"
    //                                         onClick={handlePay}
    //                                         disabled={
    //                                             !selectedPlan ||
    //                                             !canCheckout ||
    //                                             paying
    //                                         }
    //                                     >
    //                                         {paying ? (
    //                                             <>
    //                                                 <Loader2 className="w-3 h-3 mr-2 animate-spin" />
    //                                                 Processing...
    //                                             </>
    //                                         ) : (
    //                                             <>
    //                                                 Pay with VNPay
    //                                                 <ArrowRight className="w-3 h-3 ml-2" />
    //                                             </>
    //                                         )}
    //                                     </Button>
    //                                 </div>
    //                             </div>
    //                         </TabsContent>
    //                     </Tabs>
    //                 </div>
    //             </DialogContent>
    //         </Dialog>
    //     </div>
    // );
    return (
        <div className="w-full space-y-6">
            {/* Header Section */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded-md">
                        <Briefcase className="w-3 h-3" />
                        <span>VIP Packages</span>
                    </div>
                </div>
                <h1 className="mb-2 text-2xl font-semibold text-gray-900">
                    Upgrade to VIP Company
                </h1>
                <p className="text-sm leading-relaxed text-gray-600">
                    Unlock premium job posting with extended visibility &
                    priority support. Get your company featured and attract top
                    talent faster.
                </p>
            </div>

            {/* Status & Error */}
            {(err || resolvingCompany) && (
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                        {resolvingCompany ? (
                            <>
                                <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                                <span className="text-gray-700">
                                    Resolving your company...
                                </span>
                            </>
                        ) : (
                            <span className="font-medium text-red-600">
                                {err}
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Why Choose VIP Section */}
            <div className="p-6 border border-blue-100 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                <h2 className="mb-4 text-lg font-semibold text-center text-gray-900">
                    Why Choose VIP Company Package?
                </h2>
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                    <div className="flex items-start gap-3 p-4 bg-white border border-gray-100 rounded-lg">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mt-0.5">
                            <Check className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="mb-1 font-medium text-gray-900">
                                Maximum Visibility
                            </h3>
                            <p className="text-sm text-gray-600">
                                Your company profile and job posts appear at the
                                top of search results, ensuring maximum exposure
                                to qualified candidates.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-white border border-gray-100 rounded-lg">
                        <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mt-0.5">
                            <ArrowRight className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <h3 className="mb-1 font-medium text-gray-900">
                                Priority Support
                            </h3>
                            <p className="text-sm text-gray-600">
                                Get dedicated 24/7 support from our recruitment
                                experts to optimize your hiring strategy and get
                                faster results.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-white border border-gray-100 rounded-lg">
                        <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mt-0.5">
                            <Briefcase className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="mb-1 font-medium text-gray-900">
                                Premium Branding
                            </h3>
                            <p className="text-sm text-gray-600">
                                Showcase your company with VIP badge and
                                featured profile, building trust and attracting
                                premium candidates.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-white border border-gray-100 rounded-lg">
                        <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mt-0.5">
                            <Check className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <h3 className="mb-1 font-medium text-gray-900">
                                Advanced Analytics
                            </h3>
                            <p className="text-sm text-gray-600">
                                Track your job posting performance with detailed
                                analytics and insights to optimize your
                                recruitment strategy.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Plans Section */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg">
                <h2 className="mb-6 text-lg font-semibold text-center text-gray-900">
                    Choose Your VIP Package
                </h2>

                {/* 3 Column Grid - Responsive */}
                <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {displayPlans.map((plan, index) => (
                        <Card
                            key={plan.key}
                            className={cn(
                                "group relative overflow-hidden rounded-lg border transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 hover:border-gray-300",
                                plan.popular
                                    ? "border-blue-500 bg-blue-50/30 shadow-sm"
                                    : "border-gray-200"
                            )}
                        >
                            {plan.popular && (
                                <div
                                    className={cn(
                                        "absolute top-3 right-3 z-10 transition-transform duration-300 ease-out",
                                        "group-hover:scale-105 group-hover:rotate-3"
                                    )}
                                >
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-600 text-white shadow-sm">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="relative z-0">
                                {/* Gradient overlay on hover */}
                                <div
                                    className={cn(
                                        "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 ease-out rounded-lg",
                                        "group-hover:opacity-5",
                                        plan.popular
                                            ? "from-blue-500/20 to-purple-500/20"
                                            : "from-gray-100/50 to-gray-200/50"
                                    )}
                                />

                                <CardHeader className="relative z-10 pt-4 pb-3 text-center">
                                    <CardTitle
                                        className={cn(
                                            "text-base font-semibold mb-1 transition-all duration-300 ease-out",
                                            "group-hover:text-gray-900 group-hover:font-bold",
                                            plan.popular
                                                ? "text-blue-700"
                                                : "text-gray-900"
                                        )}
                                    >
                                        {plan.displayName}
                                    </CardTitle>
                                    <CardDescription className="mb-3 text-xs text-gray-500 transition-colors duration-300 group-hover:text-gray-600">
                                        {plan.description}
                                    </CardDescription>
                                    <div
                                        className={cn(
                                            "text-2xl font-bold mb-1 transition-all duration-300 ease-out",
                                            "group-hover:scale-105",
                                            plan.popular
                                                ? "text-blue-600"
                                                : "text-gray-900"
                                        )}
                                    >
                                        {plan.priceLabel}
                                    </div>
                                    <p className="text-xs text-gray-500 transition-colors duration-300 group-hover:text-gray-600">
                                        per package
                                    </p>
                                </CardHeader>

                                <CardContent className="relative z-10 px-3 pb-4 space-y-2">
                                    {plan.features.map((feature, i) => (
                                        <div
                                            key={i}
                                            className="flex items-start gap-2 text-sm transition-all duration-300 ease-out group-hover:text-gray-800"
                                        >
                                            <div
                                                className={cn(
                                                    "flex-shrink-0 mt-0.5 w-4 h-4 transition-transform duration-300 ease-out",
                                                    "group-hover:scale-110"
                                                )}
                                            >
                                                <Check className="w-full h-full text-green-500 group-hover:text-green-600" />
                                            </div>
                                            <span className="leading-relaxed text-gray-700 transition-colors duration-300 group-hover:text-gray-900">
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </CardContent>

                                <CardFooter className="relative z-10 px-3 pt-0 pb-4">
                                    <Button
                                        className={cn(
                                            "w-full h-10 rounded-md font-medium text-sm transition-all duration-300 ease-out transform",
                                            "group-hover:scale-[1.02] group-hover:shadow-md",
                                            plan.popular
                                                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm group-hover:shadow-lg"
                                                : "bg-gray-900 hover:bg-gray-800 text-white"
                                        )}
                                        onClick={() => handleChoosePlan(plan)}
                                        disabled={!plan.package || !canCheckout}
                                    >
                                        {canCheckout
                                            ? "Choose Plan"
                                            : "Coming Soon"}
                                    </Button>
                                </CardFooter>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Comparison Table Section */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg">
                <h2 className="mb-6 text-lg font-semibold text-center text-gray-900">
                    Compare VIP Packages
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="px-4 py-3 font-semibold text-left text-gray-900">
                                    Feature
                                </th>
                                <th className="px-4 py-3 font-semibold text-center text-gray-900 border-l border-gray-200">
                                    VIP 1 Month
                                </th>
                                <th className="px-4 py-3 font-semibold text-center text-gray-900 border-l border-gray-200">
                                    VIP 3 Months
                                </th>
                                <th className="px-4 py-3 font-semibold text-center text-gray-900 border-l border-gray-200">
                                    VIP 6 Months
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <tr className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-900">
                                    VIP Company Badge
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <Check className="w-4 h-4 mx-auto text-green-500" />
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <Check className="w-4 h-4 mx-auto text-green-500" />
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <Check className="w-4 h-4 mx-auto text-green-500" />
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-900">
                                    Top Search Ranking
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <Check className="w-4 h-4 mx-auto text-green-500" />
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <Check className="w-4 h-4 mx-auto text-green-500" />
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <Check className="w-4 h-4 mx-auto text-green-500" />
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-900">
                                    Job Post Priority
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <Check className="w-4 h-4 mx-auto text-green-500" />
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <Check className="w-4 h-4 mx-auto text-green-500" />
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <Check className="w-4 h-4 mx-auto text-green-500" />
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-900">
                                    24/7 Priority Support
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <Check className="w-4 h-4 mx-auto text-green-500" />
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <Check className="w-4 h-4 mx-auto text-green-500" />
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <Check className="w-4 h-4 mx-auto text-green-500" />
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-900">
                                    Advanced Analytics
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <Check className="w-4 h-4 mx-auto text-green-500" />
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <Check className="w-4 h-4 mx-auto text-green-500" />
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <Check className="w-4 h-4 mx-auto text-green-500" />
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-900">
                                    Featured Profile
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <Check className="w-4 h-4 mx-auto text-green-500" />
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <Check className="w-4 h-4 mx-auto text-green-500" />
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <Check className="w-4 h-4 mx-auto text-green-500" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Success Stories Section */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg">
                <h2 className="mb-6 text-lg font-semibold text-center text-gray-900">
                    Companies Trusting Our VIP Program
                </h2>
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                    <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                                <span className="text-sm font-semibold text-white">
                                    TK
                                </span>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">
                                    TechCorp
                                </h4>
                                <p className="text-xs text-gray-500">
                                    Software Company
                                </p>
                            </div>
                        </div>
                        <p className="mb-3 text-sm text-gray-600">
                            "VIP package helped us reduce hiring time by 40%. We
                            received 3x more qualified applications within the
                            first week!"
                        </p>
                        <div className="flex items-center gap-1 text-sm text-yellow-600">
                            <Check className="w-3 h-3 fill-current" />
                            <Check className="w-3 h-3 fill-current" />
                            <Check className="w-3 h-3 fill-current" />
                            <Check className="w-3 h-3 fill-current" />
                            <Check className="w-3 h-3 fill-current" />
                        </div>
                    </div>

                    <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-teal-600">
                                <span className="text-sm font-semibold text-white">
                                    FM
                                </span>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">
                                    FinMart
                                </h4>
                                <p className="text-xs text-gray-500">
                                    Financial Services
                                </p>
                            </div>
                        </div>
                        <p className="mb-3 text-sm text-gray-600">
                            "The priority support was invaluable. We filled 15
                            senior positions in just 3 weeks with top-tier
                            candidates."
                        </p>
                        <div className="flex items-center gap-1 text-sm text-yellow-600">
                            <Check className="w-3 h-3 fill-current" />
                            <Check className="w-3 h-3 fill-current" />
                            <Check className="w-3 h-3 fill-current" />
                            <Check className="w-3 h-3 fill-current" />
                            <Check className="w-3 h-3 fill-current" />
                        </div>
                    </div>

                    <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-pink-600">
                                <span className="text-sm font-semibold text-white">
                                    HR
                                </span>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">
                                    HealthRight
                                </h4>
                                <p className="text-xs text-gray-500">
                                    Healthcare
                                </p>
                            </div>
                        </div>
                        <p className="mb-3 text-sm text-gray-600">
                            "Our company profile got featured and we saw a 200%
                            increase in profile visits. Best investment for our
                            brand!"
                        </p>
                        <div className="flex items-center gap-1 text-sm text-yellow-600">
                            <Check className="w-3 h-3 fill-current" />
                            <Check className="w-3 h-3 fill-current" />
                            <Check className="w-3 h-3 fill-current" />
                            <Check className="w-3 h-3 fill-current" />
                            <Check className="w-3 h-3 fill-current" />
                        </div>
                    </div>

                    <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600">
                                <span className="text-sm font-semibold text-white">
                                    EC
                                </span>
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">
                                    EduConnect
                                </h4>
                                <p className="text-xs text-gray-500">
                                    Education Tech
                                </p>
                            </div>
                        </div>
                        <p className="mb-3 text-sm text-gray-600">
                            "The analytics dashboard helped us understand
                            candidate behavior and optimize our job descriptions
                            for better results."
                        </p>
                        <div className="flex items-center gap-1 text-sm text-yellow-600">
                            <Check className="w-3 h-3 fill-current" />
                            <Check className="w-3 h-3 fill-current" />
                            <Check className="w-3 h-3 fill-current" />
                            <Check className="w-3 h-3 fill-current" />
                            <Check className="w-3 h-3 fill-current" />
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg">
                <h2 className="mb-6 text-lg font-semibold text-center text-gray-900">
                    Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                    <div className="overflow-hidden border border-gray-200 rounded-lg">
                        <button className="w-full p-4 font-medium text-left text-gray-900 hover:bg-gray-50 focus:outline-none focus:bg-gray-50">
                            <div className="flex items-center justify-between">
                                <span>What is the VIP Company Package?</span>
                                <ChevronDown className="w-4 h-4 text-gray-400 transition-transform group-hover:rotate-180" />
                            </div>
                        </button>
                        <div className="px-4 pb-4 text-sm text-gray-600 bg-gray-50">
                            The VIP Company Package is our premium subscription
                            service that gives your company enhanced visibility,
                            priority job posting placement, and dedicated
                            support to attract top talent faster.
                        </div>
                    </div>

                    <div className="overflow-hidden border border-gray-200 rounded-lg">
                        <button className="w-full p-4 font-medium text-left text-gray-900 hover:bg-gray-50 focus:outline-none focus:bg-gray-50">
                            <div className="flex items-center justify-between">
                                <span>How long does each package last?</span>
                                <ChevronDown className="w-4 h-4 text-gray-400 transition-transform group-hover:rotate-180" />
                            </div>
                        </button>
                        <div className="px-4 pb-4 text-sm text-gray-600 bg-gray-50">
                            Our packages are available in 1-month, 3-month, and
                            6-month durations. All packages include the same
                            premium features, with longer packages offering
                            better value.
                        </div>
                    </div>

                    <div className="overflow-hidden border border-gray-200 rounded-lg">
                        <button className="w-full p-4 font-medium text-left text-gray-900 hover:bg-gray-50 focus:outline-none focus:bg-gray-50">
                            <div className="flex items-center justify-between">
                                <span>Can I cancel my VIP subscription?</span>
                                <ChevronDown className="w-4 h-4 text-gray-400 transition-transform group-hover:rotate-180" />
                            </div>
                        </button>
                        <div className="px-4 pb-4 text-sm text-gray-600 bg-gray-50">
                            VIP packages are one-time purchases for the selected
                            duration. You can purchase a new package anytime,
                            but there are no refunds or cancellations once
                            payment is completed.
                        </div>
                    </div>

                    <div className="overflow-hidden border border-gray-200 rounded-lg">
                        <button className="w-full p-4 font-medium text-left text-gray-900 hover:bg-gray-50 focus:outline-none focus:bg-gray-50">
                            <div className="flex items-center justify-between">
                                <span>What payment methods do you accept?</span>
                                <ChevronDown className="w-4 h-4 text-gray-400 transition-transform group-hover:rotate-180" />
                            </div>
                        </button>
                        <div className="px-4 pb-4 text-sm text-gray-600 bg-gray-50">
                            We currently accept VNPay as our primary payment
                            method. All transactions are secure and processed
                            through our trusted payment gateway with SSL
                            encryption.
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to Action Section */}
            <div className="p-6 text-white rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600">
                <div className="text-center">
                    <h2 className="mb-3 text-2xl font-bold">
                        Ready to Attract Top Talent?
                    </h2>
                    <p className="max-w-md mx-auto mb-6 text-blue-100">
                        Join thousands of successful companies that have
                        upgraded to VIP and transformed their recruitment
                        process.
                    </p>
                    <div className="flex flex-col justify-center gap-3 sm:flex-row">
                        <Button
                            size="lg"
                            className="w-full font-semibold text-blue-600 bg-white sm:w-auto hover:bg-gray-50"
                            onClick={() =>
                                displayPlans[1] &&
                                handleChoosePlan(displayPlans[1])
                            }
                            disabled={!displayPlans[1]?.package || !canCheckout}
                        >
                            Get Most Popular Plan
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="w-full text-white border-white sm:w-auto hover:bg-white/10"
                        >
                            Learn More
                        </Button>
                    </div>
                </div>
            </div>

            {/* Confirm Modal */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader className="space-y-2">
                        <DialogTitle className="text-lg font-semibold text-gray-900">
                            Confirm VIP Package
                        </DialogTitle>
                        <p className="text-sm text-gray-600">
                            Review your order before proceeding to payment
                        </p>
                    </DialogHeader>

                    <div className="space-y-4">
                        <Tabs defaultValue="vnpay" className="w-full">
                            <TabsList className="grid w-full grid-cols-1 p-1 border rounded-md bg-gray-50">
                                <TabsTrigger
                                    value="vnpay"
                                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md text-sm"
                                >
                                    VNPay
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="vnpay" className="pt-2 mt-0">
                                <div className="space-y-3">
                                    {/* Order Summary */}
                                    <div className="p-4 border rounded-lg bg-gray-50">
                                        <h3 className="mb-3 text-sm font-semibold text-gray-900">
                                            Order Summary
                                        </h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between py-1">
                                                <span className="text-gray-600">
                                                    Package:
                                                </span>
                                                <span className="font-medium text-gray-900">
                                                    {selectedPlan?.displayName}
                                                </span>
                                            </div>
                                            <div className="flex justify-between py-1">
                                                <span className="text-gray-600">
                                                    Duration:
                                                </span>
                                                <span className="text-gray-900">
                                                    {(() => {
                                                        const dto =
                                                            packageMap.get(
                                                                selectedPlan?.targetPackageId
                                                            );
                                                        return dto
                                                            ? `${dto.durationDays} days`
                                                            : "—";
                                                    })()}
                                                </span>
                                            </div>
                                            <div className="flex justify-between py-1">
                                                <span className="text-gray-600">
                                                    Payment Method:
                                                </span>
                                                <span className="font-medium text-blue-600">
                                                    VNPay
                                                </span>
                                            </div>
                                            <div className="flex justify-between py-1 pt-2 border-t border-gray-200">
                                                <span className="text-gray-600">
                                                    Company ID:
                                                </span>
                                                <span className="text-gray-900">
                                                    {resolvedCompanyId ?? "—"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between pt-2 border-t border-gray-200">
                                                <span className="text-sm font-semibold text-gray-900">
                                                    Total:
                                                </span>
                                                <span className="text-lg font-bold text-gray-900">
                                                    {selectedPlan
                                                        ? (() => {
                                                              const dto =
                                                                  packageMap.get(
                                                                      selectedPlan.targetPackageId
                                                                  );
                                                              return dto
                                                                  ? VND.format(
                                                                        dto.priceVnd
                                                                    )
                                                                  : "—";
                                                          })()
                                                        : "—"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            className="flex-1 h-10 text-sm text-gray-700 border-gray-200 rounded-md hover:bg-gray-50"
                                            onClick={() => setOpen(false)}
                                            disabled={paying}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            className="flex-1 h-10 text-sm text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700"
                                            onClick={handlePay}
                                            disabled={
                                                !selectedPlan ||
                                                !canCheckout ||
                                                paying
                                            }
                                        >
                                            {paying ? (
                                                <>
                                                    <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    Pay with VNPay
                                                    <ArrowRight className="w-3 h-3 ml-2" />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
