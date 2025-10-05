"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import AppInitializer from "@/components/AppInitializer";
import { Suspense } from "react";
import { usePathname, useRouter } from "next/navigation"; // Thêm để check route
import ClientLayout from "@/layout/ClientLayout";
import {
    selectAuthHydrated,
    selectAuthRole,
} from "@/features/auth/authSelectors";
import LoadingScreen from "./ui/loadingScreen";

export default function PageWrapper({ children }) {
    const isAuthHydrated = useSelector(selectAuthHydrated);
    const role = useSelector(selectAuthRole);
    const pathname = usePathname();
    const router = useRouter();

    const isRecruiterRoute = pathname?.startsWith("/recruiter");

    // tạm thời ko render để tránh nháy header candidate khi log = recruiter
    useEffect(() => {
        if (isAuthHydrated && role === "RECRUITER" && pathname === "/") {
            router.replace("/recruiter/dashboard");
        }
    }, [isAuthHydrated, role, pathname, router]);

    if (isAuthHydrated && role === "RECRUITER" && pathname === "/") {
        return null;
    }

    return (
        <Suspense fallback={<LoadingScreen message="Loading" />}>
            <AppInitializer />
            {!isAuthHydrated ? (
                <div className="flex items-center justify-center w-full h-screen bg-gray-50">
                    <LoadingScreen message="Loading" />
                </div>
            ) : (
                <>
                    {isRecruiterRoute ? (
                        children
                    ) : (
                        <ClientLayout>{children}</ClientLayout>
                    )}
                </>
            )}
        </Suspense>
    );
}
