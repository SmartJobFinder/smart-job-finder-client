import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { t } from "@/i18n/i18n";

export const Footer = () => {
    const role = useSelector((state) => state.auth.user?.role);

    const handleRecruiterClick = (e) => {
        if (role === "CANDIDATE") {
            e.preventDefault();
            toast.error("You are not recruiter");
        }
    };

    return (
        <footer className="w-full py-12 text-white bg-gray-900">
            <div className="container px-4 mx-auto">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    {/* Company Info */}
                    <div>
                        <h3 className="mb-4 text-xl font-bold">JobHuntly</h3>
                        <p className="mb-4 text-gray-400">
                            {t`Call now`}:{" "}
                            <span className="text-white">(012) 345-6789</span>
                        </p>
                        <p className="text-sm text-gray-400">
                            475A Dien Bien Phu Street, Ward 25, Binh Thanh District, Ho Chi Minh City, Vietnam
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="mb-4 font-semibold">{t`Quick Link`}</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>
                                <Link href="#hero" className="hover:text-white">
                                    {t`Home`}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#aboutUs"
                                    className="hover:text-white"
                                >
                                    {t`About Us`}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#stats"
                                    className="hover:text-white"
                                >
                                    {t`Statistics`}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#categories"
                                    className="hover:text-white"
                                >
                                    {t`Categories`}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Candidate */}
                    <div>
                        <h4 className="mb-4 font-semibold">{t`Candidate`}</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>
                                <Link
                                    href="/company/company-search"
                                    className="hover:text-white"
                                >
                                    {t`Browse Companies`}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/search"
                                    className="hover:text-white"
                                >
                                    {t`Browse Jobs`}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/dashboard"
                                    className="hover:text-white"
                                >
                                    {t`Candidate Dashboard`}
                                </Link>
                            </li>
                            <li>
                                <Link href="/jobs" className="hover:text-white">
                                    {t`Saved Jobs`}
                                </Link>
                            </li>
                        </ul>
                    </div>
                    {/* Recruiter */}
                    <div>
                        <h4 className="mb-4 font-semibold">{t`Recruiter`}</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li>
                                <Link
                                    href="/recruiter/create-job"
                                    className="hover:text-white"
                                    onClick={handleRecruiterClick}
                                >
                                    {t`Post a Job`}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/recruiter/dashboard"
                                    className="hover:text-white"
                                    onClick={handleRecruiterClick}
                                >
                                    {t`Recruiter Dashboard`}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/recruiter/applicants/all"
                                    className="hover:text-white"
                                    onClick={handleRecruiterClick}
                                >
                                    {t`Applications`}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/recruiter/company"
                                    className="hover:text-white"
                                    onClick={handleRecruiterClick}
                                >
                                    {t`Company Profile`}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-between pt-8 mt-8 border-t border-gray-800 md:flex-row">
                    <p className="text-sm text-gray-400">
                        © {t`2025 JobHuntly. All rights Reserved`}
                    </p>

                    <div className="flex mt-4 space-x-4 md:mt-0">
                        <Link
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://www.facebook.com/profile.php?id=61581031504719"
                            className="text-gray-400 hover:text-white"
                        >
                            <Facebook className="w-5 h-5" />
                        </Link>
                        <Link
                            href="#"
                            className="text-gray-400 hover:text-white"
                        >
                            <Twitter className="w-5 h-5" />
                        </Link>
                        <Link
                            href="#"
                            className="text-gray-400 hover:text-white"
                        >
                            <Instagram className="w-5 h-5" />
                        </Link>
                        <Link
                            href="#"
                            className="text-gray-400 hover:text-white"
                        >
                            <Linkedin className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
