"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { MessageSquareWarning } from "lucide-react";

import useCompanyDetailStore from "../store/companyDetailStore";
import { getImageUrl } from "@/lib/utils";
import { toast } from "react-toastify";
import { selectIsLoggedIn } from "@/features/auth/authSelectors";
import { showLoginPrompt } from "@/features/auth/loginPromptSlice";
import { t } from "@/i18n/i18n";

import {
    useGetFollowStatusQuery,
    useGetFollowCountQuery,
    useFollowCompanyMutation,
    useUnfollowCompanyMutation,
} from "@/services/followCompanyService";

import ReportModal from "@/components/ui/report";

const CompanyBanner = () => {
    const { company } = useCompanyDetailStore();
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const dispatch = useDispatch();

    const [openReport, setOpenReport] = useState(false);

    if (!company) return null;

    // Query follow status + count
    const { data: followStatus, isLoading: isFollowStatusLoading } =
        useGetFollowStatusQuery(company.id, {
            skip: !isLoggedIn,
        });
    const { data: followCount } = useGetFollowCountQuery(company.id);

    const [followCompany] = useFollowCompanyMutation();
    const [unfollowCompany] = useUnfollowCompanyMutation();

    // Guard login
    const guardOr = useCallback(
        (action) => {
            if (!isLoggedIn) {
                dispatch(showLoginPrompt());
                setOpenReport(false);
                return;
            }
            action?.();
        },
        [isLoggedIn, dispatch]
    );

    // Handle follow/unfollow
    const handleFollowToggle = useCallback(() => {
        guardOr(async () => {
            try {
                if (followStatus?.followed) {
                    await unfollowCompany(company.id).unwrap();
                    toast.success("You unfollowed this company");
                } else {
                    await followCompany(company.id).unwrap();
                    toast.success("You followed this company");
                }
            } catch (err) {
                toast.error("Something went wrong, please try again");
            }
        });
    }, [guardOr, followStatus, followCompany, unfollowCompany, company.id]);

    // Handle report
    const handleReport = useCallback(
        () => guardOr(() => setOpenReport(true)),
        [guardOr]
    );

    return (
        <div
            className="relative h-64 mx-auto overflow-hidden bg-center bg-cover rounded-lg shadow max-w-7xl"
            style={{
                backgroundImage: `url(${
                    getImageUrl(company.avatarCover) ||
                    "https://static.topcv.vn/company_covers/default-cover.jpg"
                })`,
            }}
        >
            <div className="absolute bottom-0 left-0 flex items-center justify-between w-full px-4 py-4 border rounded-b-lg bg-white/20 backdrop-blur-sm border-white/30">
                <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 p-1 bg-white border border-gray-300 rounded">
                        <Image
                            src={getImageUrl(company.avatar)}
                            alt={company.companyName}
                            width={64}
                            height={64}
                            className="object-contain w-full h-full"
                        />
                    </div>
                    <div className="">
                        <h1 className="text-xl font-bold text-gray-900 px-2 py-0.5 rounded bg-white w-auto">
                            {company.companyName}
                        </h1>
                        <div className="mt-2 text-sm text-white-600">
                            {company.proCompany && (
                                <span className="px-2 py-0.5 mr-2 text-yellow-800 bg-yellow-100 rounded">
                                    Pro Company
                                </span>
                            )}
                            <a
                                href={company.website}
                                className="underline hover:text-blue-600 px-2 py-0.5 rounded bg-white mr-2"
                            >
                                {company.website?.replace("https://", "")}
                            </a>
                            <span className="px-2 py-0.5 rounded bg-white mr-2">
                                {company.quantityEmployee}+ employees
                            </span>
                            <span className="px-2 py-0.5 rounded bg-white">
                                {followCount?.totalFollowers ?? 0} followers
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleFollowToggle}
                        disabled={isFollowStatusLoading}
                        className={`px-4 py-2 text-lg font-semibold text-white transition rounded ${
                            isLoggedIn && followStatus?.followed
                                ? "bg-gray-600"
                                : "bg-blue-700"
                        } ${
                            isFollowStatusLoading
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                        }`}
                    >
                        {isFollowStatusLoading
                            ? "Loading..."
                            : isLoggedIn && followStatus?.followed
                            ? t`Unfollow`
                            : t`Follow Company`}
                    </button>

                    <button
                        onClick={handleReport}
                        className="p-2 text-red-600 transition bg-white border rounded hover:bg-red-50"
                        title="Report Company"
                    >
                        <MessageSquareWarning className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <ReportModal
                open={openReport}
                onClose={() => setOpenReport(false)}
                type={2} 
                contentId={company.id}
            />
        </div>
    );
};

export default CompanyBanner;
