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
