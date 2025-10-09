// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//     Mail,
//     Phone,
//     ShieldCheck,
//     UserCircle2,
//     BadgeCheck,
// } from "lucide-react";
// import { getCurrentUser } from "@/services/userService";
// import Link from "next/link";

// export default function RecruiterProfilePage() {
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [user, setUser] = useState(null);

//     useEffect(() => {
//         let mounted = true;
//         const load = async () => {
//             try {
//                 setLoading(true);
//                 const data = await getCurrentUser();
//                 if (mounted) setUser(data);
//             } catch (e) {
//                 if (mounted) setError(e.message || "Error");
//             } finally {
//                 if (mounted) setLoading(false);
//             }
//         };
//         load();
//         return () => {
//             mounted = false;
//         };
//     }, []);

//     const statusBadge = useMemo(() => {
//         const active = user?.isActive || user?.status === "ACTIVE";
//         const text = active ? "Active" : "Inactive";
//         const cls = active
//             ? "bg-green-50 text-green-700 border-green-300"
//             : "bg-gray-100 text-gray-600 border-gray-300";
//         return (
//             <span className={`px-2.5 py-1 rounded-full text-xs border ${cls}`}>
//                 {text}
//             </span>
//         );
//     }, [user]);

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center min-h-[60vh]">
//                 <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="flex items-center justify-center min-h-[60vh]">
//                 <div className="px-6 py-4 rounded-lg border bg-red-50 text-red-600">
//                     {error}
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="p-6">
//             {/* Header */}
//             <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow">
//                 <div className="flex items-center gap-5">
//                     <img
//                         src={`https://i.pravatar.cc/96?u=${user?.id}`}
//                         className="w-20 h-20 rounded-full ring-2 ring-white/30"
//                         alt="avatar"
//                     />
//                     <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-3 flex-wrap">
//                             <h1 className="text-2xl font-semibold truncate">
//                                 {user?.fullName || user?.email}
//                             </h1>
//                             {statusBadge}
//                         </div>
//                         <p className="text-white/80 mt-1 flex items-center gap-2">
//                             <ShieldCheck size={16} />
//                             <span className="uppercase text-xs tracking-wide">
//                                 {user?.roleName || "RECRUITER"}
//                             </span>
//                         </p>
//                     </div>
//                     <div className="flex gap-2">
//                         <Button
//                             variant="secondary"
//                             className="bg-white/10 hover:bg-white/20 text-white border border-white/30"
//                         >
//                             Edit Profile
//                         </Button>
//                         <Button
//                             variant="secondary"
//                             className="bg-white/10 hover:bg-white/20 text-white border border-white/30"
//                         >
//                             Change Password
//                         </Button>
//                     </div>
//                 </div>
//             </div>

//             {/* Body */}
//             <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 <div className="lg:col-span-2 space-y-6">
//                     <div className="rounded-xl border p-6 bg-white">
//                         <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                             <UserCircle2 size={18} /> General Information
//                         </h2>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                             <div>
//                                 <div className="text-gray-500 text-xs uppercase mb-1">
//                                     Full Name
//                                 </div>
//                                 <div className="font-medium">
//                                     {user?.fullName || "—"}
//                                 </div>
//                             </div>
//                             {/* <div>
//                                 <div className="text-gray-500 text-xs uppercase mb-1">
//                                     Role
//                                 </div>
//                                 <div className="font-medium">
//                                     {user?.roleName || "RECRUITER"}
//                                 </div>
//                             </div> */}
//                             <div>
//                                 <div className="text-gray-500 text-xs uppercase mb-1">
//                                     Status
//                                 </div>
//                                 <div className="font-medium">
//                                     {user?.status ||
//                                         (user?.isActive
//                                             ? "ACTIVE"
//                                             : "INACTIVE")}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="rounded-xl border p-6 bg-white">
//                         <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                             <BadgeCheck size={18} /> Contact
//                         </h2>
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                             <div className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50">
//                                 <Mail size={18} className="text-blue-600" />
//                                 <div className="truncate">{user?.email}</div>
//                             </div>
//                             <div className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50">
//                                 <Phone size={18} className="text-blue-600" />
//                                 <div>{user?.phone || "—"}</div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="space-y-6">
//                     <div className="rounded-xl border p-6 bg-white">
//                         <h2 className="text-lg font-semibold mb-4">Actions</h2>
//                         <div className="flex flex-col gap-3">
//                             <Button className="bg-blue-600 hover:bg-blue-700">
//                                 Upgrade to Pro
//                             </Button>
//                             <Link href="/recruiter/company" className="w-full">
//                                 <Button variant="outline" className="w-full">View Company</Button>
//                             </Link>
//                             <Link href="/recruiter/manage-job" className="w-full">
//                                 <Button variant="outline" className="w-full">Manage Jobs</Button>
//                             </Link>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Mail,
    Phone,
    ShieldCheck,
    UserCircle2,
    BadgeCheck,
    Clock,
    Calendar,
    Building,
    Edit,
    Save,
    X,
} from "lucide-react";
import { getCurrentUser, updateUserProfile } from "@/services/userService";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";

export default function RecruiterProfilePage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            try {
                setLoading(true);
                const data = await getCurrentUser();
                if (mounted) {
                    setUser(data);
                    setFormData({
                        fullName: data.fullName || "",
                        phone: data.phone || "",
                    });
                }
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const updated = await updateUserProfile(formData);
            setUser(updated);
            setIsEditing(false);
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error("Failed to update profile");
            console.error("Error updating profile:", error);
        } finally {
            setSaving(false);
        }
    };

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
                        src={
                            user?.avatar ||
                            `https://i.pravatar.cc/96?u=${user?.id}`
                        }
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
                        {user?.company && (
                            <p className="text-white/80 mt-1 flex items-center gap-2">
                                <Building size={16} />
                                <span>{user.company.name}</span>
                            </p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {!isEditing ? (
                            <Button
                                variant="secondary"
                                className="bg-white/10 hover:bg-white/20 text-white border border-white/30"
                                onClick={() => setIsEditing(true)}
                            >
                                <Edit className="w-4 h-4 mr-2" /> Edit Profile
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button
                                    variant="secondary"
                                    className="bg-white/10 hover:bg-white/20 text-white border border-white/30"
                                    onClick={handleSave}
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Saving
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />{" "}
                                            Save
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="bg-red-500/20 hover:bg-red-500/30 text-white border border-white/30"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormData({
                                            fullName: user?.fullName || "",
                                            phone: user?.phone || "",
                                        });
                                    }}
                                    disabled={saving}
                                >
                                    <X className="w-4 h-4 mr-2" /> Cancel
                                </Button>
                            </div>
                        )}
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
                        {isEditing ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-gray-500 text-xs uppercase mb-1 block">
                                        Full Name
                                    </label>
                                    <Input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        placeholder="Enter your full name"
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="text-gray-500 text-xs uppercase mb-1 block">
                                        Status
                                    </label>
                                    <div className="font-medium">
                                        {user?.status ||
                                            (user?.isActive
                                                ? "ACTIVE"
                                                : "INACTIVE")}
                                    </div>
                                </div>
                                {user?.jobTitle && (
                                    <div>
                                        <label className="text-gray-500 text-xs uppercase mb-1 block">
                                            Job Title
                                        </label>
                                        <div className="font-medium">
                                            {user.jobTitle}
                                        </div>
                                    </div>
                                )}
                                {user?.company && (
                                    <div>
                                        <label className="text-gray-500 text-xs uppercase mb-1 block">
                                            Company
                                        </label>
                                        <div className="font-medium">
                                            {user.company.name}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <div className="text-gray-500 text-xs uppercase mb-1">
                                        Full Name
                                    </div>
                                    <div className="font-medium">
                                        {user?.fullName || "—"}
                                    </div>
                                </div>
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
                                {user?.jobTitle && (
                                    <div>
                                        <div className="text-gray-500 text-xs uppercase mb-1">
                                            Job Title
                                        </div>
                                        <div className="font-medium">
                                            {user.jobTitle}
                                        </div>
                                    </div>
                                )}
                                {user?.company && (
                                    <div>
                                        <div className="text-gray-500 text-xs uppercase mb-1">
                                            Company
                                        </div>
                                        <div className="font-medium">
                                            {user.company.name}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="rounded-xl border p-6 bg-white">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <BadgeCheck size={18} /> Contact
                        </h2>
                        {isEditing ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-gray-500 text-xs uppercase mb-1 block">
                                        Email
                                    </label>
                                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50">
                                        <Mail
                                            size={18}
                                            className="text-blue-600"
                                        />
                                        <div className="truncate">
                                            {user?.email}
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Email cannot be changed
                                    </p>
                                </div>
                                <div>
                                    <label className="text-gray-500 text-xs uppercase mb-1 block">
                                        Phone
                                    </label>
                                    <Input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="Enter your phone number"
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50">
                                    <Mail size={18} className="text-blue-600" />
                                    <div className="truncate">
                                        {user?.email}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50">
                                    <Phone
                                        size={18}
                                        className="text-blue-600"
                                    />
                                    <div>{user?.phone || "—"}</div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="rounded-xl border p-6 bg-white">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Clock size={18} /> Account Information
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <div className="text-gray-500 text-xs uppercase mb-1">
                                    Account Created
                                </div>
                                <div className="font-medium">
                                    {user?.createdAt
                                        ? new Date(
                                              user.createdAt
                                          ).toLocaleDateString()
                                        : "—"}
                                </div>
                            </div>
                            <div>
                                <div className="text-gray-500 text-xs uppercase mb-1">
                                    Last Login
                                </div>
                                <div className="font-medium">
                                    {user?.lastLogin
                                        ? new Date(
                                              user.lastLogin
                                          ).toLocaleDateString()
                                        : "—"}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-xl border p-6 bg-white">
                        <h2 className="text-lg font-semibold mb-4">Actions</h2>
                        <div className="flex flex-col gap-3">
                            <Link
                                href="/recruiter/companyVip"
                                className="w-full"
                            >
                                <Button className="bg-blue-600 hover:bg-blue-700 w-full">
                                    Upgrade to VIP
                                </Button>
                            </Link>
                            <Link href="/recruiter/company" className="w-full">
                                <Button variant="outline" className="w-full">
                                    <Building className="w-4 h-4 mr-2" /> View
                                    Company
                                </Button>
                            </Link>
                            <Link
                                href="/recruiter/manage-job"
                                className="w-full"
                            >
                                <Button variant="outline" className="w-full">
                                    <Calendar className="w-4 h-4 mr-2" /> Manage
                                    Jobs
                                </Button>
                            </Link>
                            <Link href="/recruiter/settings" className="w-full">
                                <Button variant="outline" className="w-full">
                                    Change Password
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
