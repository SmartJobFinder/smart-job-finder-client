"use client";
import Link from "next/link";
import Image from "next/image";
import { Send, Heart } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetCombinedProfileQuery } from "@/services/profileService";
import {
    setNormalizedProfile,
    setCompletion,
    selectNormalizedProfile,
    selectProfileCompletion,
} from "@/features/profile/profileSlice";
import { calculateProfileCompletion } from "@/features/profile/profileCompletion";
import { normalizeProfileData } from "@/features/profile/normalizeProfileData";
import LoadingScreen from "@/components/ui/loadingScreen";
import { useGetApplicationsByUserQuery } from "@/services/applicationService";
import { useGetSavedJobsByUserQuery } from "@/services/savedJobService";

export default function CandidateDashboard() {
    const dispatch = useDispatch();
    const { data: combined, isSuccess } = useGetCombinedProfileQuery();
    const { data: applications } = useGetApplicationsByUserQuery({
        page: 0,
        size: 1,
    });
    const { data: savedJobs } = useGetSavedJobsByUserQuery();
    const normalizedProfile = useSelector(selectNormalizedProfile);
    const completion = useSelector(selectProfileCompletion);

    useEffect(() => {
        if (isSuccess && combined) {
            const normalized = normalizeProfileData(combined);
            dispatch(setNormalizedProfile(normalized));
            dispatch(setCompletion(calculateProfileCompletion(normalized)));
        }
    }, [isSuccess, combined, dispatch]);

    if (!normalizedProfile) {
        return <LoadingScreen message="Loading ..." />;
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Profile Section */}
            <div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-sm">
                <Image
                    src={
                        normalizedProfile.personalDetail.avatar ||
                        "/placeholder.svg?height=64&width=64"
                    }
                    alt="Avatar"
                    width={64}
                    height={64}
                    className="object-cover rounded-full"
                />
                <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-900">
                        {normalizedProfile.personalDetail.fullName}
                    </h2>
                    <p className="text-base font-semibold text-gray-600">
                        {normalizedProfile.personalDetail.email}
                    </p>
                    <Link
                        href="/profile"
                        className="inline-block mt-1 text-sm font-medium text-color-primary-main hover:text-blue-800 hover:font-semibold"
                    >
                        Update your profile &gt;
                    </Link>
                </div>
            </div>

            {/* Profile Completion */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="mb-4 text-base font-semibold text-gray-800">
                    Complete your profile
                </h3>
                <div className="flex flex-col items-center gap-6 sm:flex-row">
                    <div className="relative w-24 h-24">
                        <svg className="w-24 h-24">
                            <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="#e5e7eb"
                                strokeWidth="8"
                                fill="transparent"
                            />
                            <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="url(#gradient)"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={2 * Math.PI * 40}
                                strokeDashoffset={
                                    2 * Math.PI * 40 -
                                    (2 * Math.PI * 40 * completion.percent) /
                                        100
                                }
                                strokeLinecap="round"
                                className="transition-all duration-500"
                            />
                            <defs>
                                <linearGradient
                                    id="gradient"
                                    x1="0%"
                                    y1="0%"
                                    x2="100%"
                                    y2="0%"
                                >
                                    <stop offset="0%" stopColor="#2563eb" />
                                    <stop offset="100%" stopColor="#3b82f6" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm font-semibold text-gray-800">
                                {completion.percent}%
                            </span>
                        </div>
                    </div>

                    <div className="flex-1">
                        <p className="mb-1 text-sm text-gray-700">
                            Reach{" "}
                            <span className="font-bold text-color-primary-accent">
                                70%
                            </span>{" "}
                            of your profile to start generating your IT
                            professional CV.
                        </p>
                        <Link
                            href="/profile"
                            className="text-sm text-color-primary-main"
                        >
                            Complete your profile &gt;
                        </Link>
                    </div>
                </div>
            </div>

            {/* Activities */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="mb-4 text-base font-semibold text-gray-800">
                    Your Activities
                </h3>
                <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-2">
                    <div className="flex flex-col items-center p-4 text-blue-600 bg-blue-100 rounded">
                        <Send className="w-6 h-6 mb-1" />
                        <p className="text-sm">Applied Jobs</p>
                        <p className="text-2xl font-bold">
                            {applications?.totalElements ?? 0}
                        </p>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-orange-100 rounded text-color-primary-accent">
                        <Heart className="w-6 h-6 mb-1" />
                        <p className="text-sm">Saved Jobs</p>
                        <p className="text-2xl font-bold">
                            {savedJobs?.length ?? 0}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
// "use client";
// import { useState } from "react";
// import { Mail, User, Lock, Shield, Bell, ChevronRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import SetPasswordEmailSent from "./components/SetPasswordEmailSent";
// import { userPreferences } from "@/mock/data/userPreferences";
// import { Switch } from "@/components/ui/switch";

// export default function SettingsPage() {
//     const [showSetPwSent, setShowSetPwSent] = useState(false);
//     const [settings, setSettings] = useState(userPreferences);

//     const handleToggle = (section, key) => {
//         setSettings((prevSettings) => ({
//             ...prevSettings,
//             [section]: {
//                 ...prevSettings[section],
//                 [key]: !prevSettings[section][key],
//             },
//         }));
//     };

//     if (showSetPwSent) {
//         return (
//             <SetPasswordEmailSent
//                 email={"vo.nhat.hao@example.com"}
//                 onBack={() => setShowSetPwSent(false)}
//             />
//         );
//     }

//     return (
//         <div className="flex flex-col gap-6">
//             {/* Account Info */}
//             <section className="p-6 space-y-4 bg-white border rounded-lg shadow-sm">
//                 <h2 className="text-lg font-semibold">Account Information</h2>

//                 <div className="flex items-center justify-between">
//                     <div>
//                         <p className="text-sm text-gray-500">Email:</p>
//                         <p className="font-medium text-gray-800">
//                             vo.nhat.hao@example.com
//                         </p>
//                     </div>
//                     <Mail className="w-5 h-5 text-gray-400" />
//                 </div>

//                 <div className="flex items-center justify-between">
//                     <div>
//                         <p className="text-sm text-gray-500">Full name:</p>
//                         <p className="font-medium text-gray-800">
//                             Võ Nhật Hào
//                         </p>
//                         <p className="text-sm text-gray-500">
//                             Your account name is synchronized with profile
//                             information.
//                         </p>
//                     </div>
//                     <User className="w-5 h-5 text-gray-400" />
//                 </div>

//                 <a
//                     href="/profile"
//                     className="inline-flex items-center text-sm font-medium text-blue-500 hover:underline"
//                 >
//                     Update profile information
//                     <ChevronRight className="w-4 h-4 ml-1" />
//                 </a>
//             </section>

//             {/* Password */}
//             <section className="p-6 bg-white border rounded-lg shadow-sm">
//                 <h2 className="text-lg font-semibold">Password</h2>
//                 <div className="flex items-center justify-between mt-4">
//                     <div>
//                         <p className="font-medium text-gray-800">
//                             Set or change password
//                         </p>
//                         <p className="text-sm text-gray-500">
//                             You haven't set up a password yet. Setting a
//                             password allows you to log in without an email code.
//                         </p>
//                     </div>
//                     <Lock className="w-5 h-5 text-gray-400" />
//                 </div>
//                 <Button
//                     variant="outline"
//                     className="mt-4"
//                     onClick={() => setShowSetPwSent(true)}
//                 >
//                     Set password
//                 </Button>
//             </section>

//             {/* Notifications */}
//             <section className="p-6 bg-white border rounded-lg shadow-sm">
//                 <h2 className="text-lg font-semibold">Email Notifications</h2>
//                 <div className="mt-4 space-y-4 divide-y">
//                     <div className="flex items-center justify-between py-2">
//                         <div>
//                             <p className="font-medium text-gray-800">
//                                 Job Alerts
//                             </p>
//                             <p className="text-sm text-gray-500">
//                                 Receive notifications about new job postings
//                                 that match your profile
//                             </p>
//                         </div>
//                         <Switch
//                             checked={settings.subscriptions.jobAlerts.enabled}
//                             onCheckedChange={() =>
//                                 handleToggle("subscriptions", "jobAlerts")
//                             }
//                         />
//                     </div>

//                     <div className="flex items-center justify-between py-2">
//                         <div>
//                             <p className="font-medium text-gray-800">
//                                 Company Updates
//                             </p>
//                             <p className="text-sm text-gray-500">
//                                 Get notified when companies you follow post new
//                                 jobs or updates
//                             </p>
//                         </div>
//                         <Switch
//                             checked={
//                                 settings.subscriptions.companyUpdates.enabled
//                             }
//                             onCheckedChange={() =>
//                                 handleToggle("subscriptions", "companyUpdates")
//                             }
//                         />
//                     </div>

//                     <div className="flex items-center justify-between py-2">
//                         <div>
//                             <p className="font-medium text-gray-800">
//                                 Newsletter
//                             </p>
//                             <p className="text-sm text-gray-500">
//                                 Weekly digest of career tips and industry news
//                             </p>
//                         </div>
//                         <Switch
//                             checked={settings.subscriptions.newsletter.enabled}
//                             onCheckedChange={() =>
//                                 handleToggle("subscriptions", "newsletter")
//                             }
//                         />
//                     </div>
//                 </div>
//             </section>

//             {/* Security & Privacy */}
//             <section className="p-6 bg-white border rounded-lg shadow-sm">
//                 <div className="flex items-center">
//                     <Shield className="w-5 h-5 mr-2 text-blue-600" />
//                     <h2 className="text-lg font-semibold">
//                         Security & Privacy
//                     </h2>
//                 </div>
//                 <div className="mt-4 space-y-4">
//                     <div className="flex items-center justify-between">
//                         <div>
//                             <p className="font-medium text-gray-800">
//                                 Two-factor authentication
//                             </p>
//                             <p className="text-sm text-gray-500">
//                                 Add an extra layer of security to your account
//                             </p>
//                         </div>
//                         <Button variant="outline" size="sm">
//                             Setup
//                         </Button>
//                     </div>

//                     <div className="flex items-center justify-between pt-4 border-t">
//                         <div>
//                             <p className="font-medium text-gray-800">
//                                 Privacy Controls
//                             </p>
//                             <p className="text-sm text-gray-500">
//                                 Manage what information is visible to others
//                             </p>
//                         </div>
//                         <Button variant="outline" size="sm">
//                             Configure
//                         </Button>
//                     </div>
//                 </div>
//             </section>
//         </div>
//     );
// }
