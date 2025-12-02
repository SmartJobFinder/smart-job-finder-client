"use client";

import React, { useState } from "react";
import useMyCompanyStore from "../store/myCompanyStore";
import Image from "next/image";
import {
    MapPin,
    Mail,
    Phone,
    Globe,
    Facebook,
    Linkedin,
    Twitter,
    Copy,
    Check,
    Map,
    Edit,
    Share2,
} from "lucide-react";
import { t } from "@/i18n/i18n";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import Link from "next/link";

const MyCompanyContactInfo = () => {
    const { company } = useMyCompanyStore();
    const [copied, setCopied] = useState(false);

    if (!company) return null;

    const wardText =
        Array.isArray(company.wardNames) && company.wardNames.length > 0
            ? company.wardNames.join(", ")
            : company.wardName || "";

    const fullAddress = [
        company.address,
        wardText,
        company.locationCity,
        company.locationCountry,
    ]
        .filter((part) => part && String(part).trim().length > 0)
        .join(", ");

    // ✅ ĐỊNH NGHĨA companyUrl Ở ĐÂY (ngoài các hàm)
    const companyUrl =
        typeof window !== "undefined"
            ? `${window.location.origin}/company/company-detail/${company.id}`
            : "";

    const handleCopyLink = () => {
        navigator.clipboard.writeText(companyUrl);
        setCopied(true);
        toast.success("Company link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShareFacebook = () => {
        const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            companyUrl
        )}`;
        window.open(facebookShareUrl, "_blank", "width=600,height=400");
    };

    const handleShareTwitter = () => {
        const text = `Check out ${company.companyName} on JobFind!`;
        const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            text
        )}&url=${encodeURIComponent(companyUrl)}`;
        window.open(twitterShareUrl, "_blank", "width=600,height=400");
    };

    const handleShareLinkedIn = () => {
        const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            companyUrl
        )}`;
        window.open(linkedInShareUrl, "_blank", "width=600,height=400");
    };

    return (
        <div className="space-y-6">
            {/* Contact Information Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 bg-[#0A66C2]">
                    <h2 className="text-lg font-semibold text-white">
                        {t`Contact Information`}
                    </h2>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Address */}
                    <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-[#0A66C2] flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-gray-900 mb-1">
                                Address:
                            </p>
                            <p className="text-sm text-gray-700">
                                {fullAddress}
                            </p>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-[#0A66C2] flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-gray-900 mb-1">
                                Email:
                            </p>
                            <a
                                href={`mailto:${company.email}`}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                {company.email}
                            </a>
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-[#0A66C2] flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-gray-900 mb-1">
                                Phone:
                            </p>
                            <a
                                href={`tel:${company.phoneNumber}`}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                {company.phoneNumber}
                            </a>
                        </div>
                    </div>

                    {/* Website */}
                    <div className="flex items-start gap-3">
                        <Globe className="w-5 h-5 text-[#0A66C2] flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-gray-900 mb-1">
                                Website:
                            </p>
                            <a
                                href={company.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline break-all"
                            >
                                {company.website}
                            </a>
                        </div>
                    </div>

                    {/* Social Media Links */}
                    {(company.facebookUrl ||
                        company.twitterUrl ||
                        company.linkedinUrl) && (
                        <div className="pt-4 border-t border-gray-200">
                            <p className="text-sm font-semibold text-gray-900 mb-3">
                                Social Media:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {company.facebookUrl && (
                                    <a
                                        href={company.facebookUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                    >
                                        <Facebook className="w-4 h-4" />
                                        Facebook
                                    </a>
                                )}
                                {company.twitterUrl && (
                                    <a
                                        href={company.twitterUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-400 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                    >
                                        <Twitter className="w-4 h-4" />
                                        Twitter
                                    </a>
                                )}
                                {company.linkedinUrl && (
                                    <a
                                        href={company.linkedinUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                    >
                                        <Linkedin className="w-4 h-4" />
                                        LinkedIn
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Google Maps Section */}
                    <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <Map className="w-5 h-5 text-[#0A66C2]" />
                                View map
                            </p>
                            {!company.mapEmbedUrl && (
                                <Link href="/recruiter/company/edit">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                    >
                                        <Edit className="w-3.5 h-3.5 mr-1" />
                                        Add Map
                                    </Button>
                                </Link>
                            )}
                        </div>

                        {company.mapEmbedUrl ? (
                            <div className="overflow-hidden rounded-lg border border-gray-300">
                                <iframe
                                    src={company.mapEmbedUrl}
                                    width="100%"
                                    height="300"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Company Location Map"
                                />
                            </div>
                        ) : (
                            <div className="p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
                                <div className="flex flex-col items-center text-center space-y-3">
                                    <div className="p-3 bg-white rounded-full shadow-sm">
                                        <Map className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-700 mb-1">
                                            No map location added yet
                                        </p>
                                        <p className="text-xs text-gray-500 mb-4 max-w-xs">
                                            Add a Google Maps embed URL to show
                                            your company location to candidates
                                        </p>
                                    </div>
                                    <Link href="/recruiter/company/edit">
                                        <Button
                                            size="sm"
                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                            <Edit className="w-4 h-4 mr-2" />
                                            Add Map Location
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Share Company Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 bg-[#0A66C2]">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Share2 className="w-5 h-5" />
                        Share Company with Candidates
                    </h3>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Copy Link Section */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Copy company profile link
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={companyUrl}
                                readOnly
                                className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Button
                                onClick={handleCopyLink}
                                className={`px-6 ${
                                    copied
                                        ? "bg-green-600 hover:bg-green-700"
                                        : "bg-blue-600 hover:bg-blue-700"
                                } text-white transition-colors`}
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4 mr-2" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-4 h-4 mr-2" />
                                        Copy
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Social Share Buttons */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-3">
                            {t`Share on social media`}
                        </label>
                        <div className="flex gap-3">
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                                    companyUrl
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-80 transition-opacity"
                            >
                                <Image
                                    src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/normal-company/share/facebook.png"
                                    alt="Facebook"
                                    width={40}
                                    height={40}
                                />
                            </a>
                            <a
                                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                                    companyUrl
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-80 transition-opacity"
                            >
                                <Image
                                    src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/normal-company/share/twitter.png"
                                    alt="Twitter"
                                    width={40}
                                    height={40}
                                />
                            </a>
                            <a
                                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                                    companyUrl
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:opacity-80 transition-opacity"
                            >
                                <Image
                                    src="https://cdn-new.topcv.vn/unsafe/https://static.topcv.vn/v4/image/normal-company/share/linked.png"
                                    alt="LinkedIn"
                                    width={40}
                                    height={40}
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyCompanyContactInfo;
