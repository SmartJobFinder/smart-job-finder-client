"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Mail,
    Phone,
    ShieldCheck,
    UserCircle2,
    BadgeCheck,
} from "lucide-react";
import { getCurrentUser } from "@/services/userService";
import Link from "next/link";

export default function RecruiterProfilePage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                setLoading(true);
                const data = await getCurrentUser();
                if (mounted) setUser(data);
            } catch (e) {
                if (mounted) setError(e.message || "Error");
            } finally {
                if (mounted) setLoading(false);
            }
        };
        load();
        return () => {
            mounted = false;
        };
    }, []);

    const statusBadge = useMemo(() => {
        const active = user?.isActive || user?.status === "ACTIVE";
        const text = active ? "Active" : "Inactive";
        const cls = active
            ? "bg-green-50 text-green-700 border-green-300"
            : "bg-gray-100 text-gray-600 border-gray-300";
        return (
            <span className={`px-2.5 py-1 rounded-full text-xs border ${cls}`}>
                {text}
            </span>
        );
    }, [user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="px-6 py-4 rounded-lg border bg-red-50 text-red-600">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow">
                <div className="flex items-center gap-5">
                    <img
                        src={`https://i.pravatar.cc/96?u=${user?.id}`}
                        className="w-20 h-20 rounded-full ring-2 ring-white/30"
                        alt="avatar"
                    />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-2xl font-semibold truncate">
                                {user?.fullName || user?.email}
                            </h1>
                            {statusBadge}
                        </div>
                        <p className="text-white/80 mt-1 flex items-center gap-2">
                            <ShieldCheck size={16} />
                            <span className="uppercase text-xs tracking-wide">
                                {user?.roleName || "RECRUITER"}
                            </span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            className="bg-white/10 hover:bg-white/20 text-white border border-white/30"
                        >
                            Edit Profile
                        </Button>
                        <Button
                            variant="secondary"
                            className="bg-white/10 hover:bg-white/20 text-white border border-white/30"
                        >
                            Change Password
                        </Button>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-xl border p-6 bg-white">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <UserCircle2 size={18} /> General Information
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <div className="text-gray-500 text-xs uppercase mb-1">
                                    Full Name
                                </div>
                                <div className="font-medium">
                                    {user?.fullName || "—"}
                                </div>
                            </div>
                            {/* <div>
                                <div className="text-gray-500 text-xs uppercase mb-1">
                                    Role
                                </div>
                                <div className="font-medium">
                                    {user?.roleName || "RECRUITER"}
                                </div>
                            </div> */}
                            <div>
                                <div className="text-gray-500 text-xs uppercase mb-1">
                                    Status
                                </div>
                                <div className="font-medium">
                                    {user?.status ||
                                        (user?.isActive
                                            ? "ACTIVE"
                                            : "INACTIVE")}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border p-6 bg-white">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <BadgeCheck size={18} /> Contact
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50">
                                <Mail size={18} className="text-blue-600" />
                                <div className="truncate">{user?.email}</div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50">
                                <Phone size={18} className="text-blue-600" />
                                <div>{user?.phone || "—"}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-xl border p-6 bg-white">
                        <h2 className="text-lg font-semibold mb-4">Actions</h2>
                        <div className="flex flex-col gap-3">
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                Upgrade to Pro
                            </Button>
                            <Link href="/recruiter/company" className="w-full">
                                <Button variant="outline" className="w-full">View Company</Button>
                            </Link>
                            <Link href="/recruiter/manage-job" className="w-full">
                                <Button variant="outline" className="w-full">Manage Jobs</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
