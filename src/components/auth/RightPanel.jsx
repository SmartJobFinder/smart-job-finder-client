"use client";

import Image from "next/image";
import {Card, CardContent} from "@/components/ui/card";
import logoTitle from "@/assets/images/logo-title.png";
import banner from "@/assets/images/login-banner.png";
import recruiterBanner from "@/assets/images/recruiter-banner.jpg";
import {t} from "@/i18n/i18n";

export default function RightPanel({activeTab}) {
    const tab = String(activeTab).toUpperCase();
    const isCandidate = tab === "CANDIDATE";
    const jobHuntlyColorClass = isCandidate
        ? "text-blue-600"
        : "text-blue-600";

    return (
        <div className="w-full lg:w-1/2">
            <Card className="shadow-md">
                <CardContent className="p-6">
                    <h3 className="mb-4 text-lg font-semibold">
                        {t`Welcome to`}{" "}
                        <strong className={jobHuntlyColorClass}>
                            Job Huntly
                        </strong>
                    </h3>
                    {isCandidate ? (
                        <div>
                            <div className="flex items-center mb-6">
                                <Image
                                    src={logoTitle}
                                    alt="Job Huntly"
                                    width={120}
                                    height={32}
                                    className="mr-2"
                                />
                                <span className="text-gray-600">
                                    | From First Job to Big Future
                                </span>
                            </div>
                            <div className="flex justify-center mb-8">
                                <Image
                                    src={banner}
                                    alt="Developer"
                                    width={400}
                                    height={300}
                                />
                            </div>
                            <div className="mb-6">
                                <h4 className="mb-2 font-semibold">
                                    Log in now to get the most out of Job
                                    Huntly&apos;s tools and increase your
                                    chances of finding the hottest jobs.
                                </h4>
                                <ul className="mt-4 space-y-2">
                                    {[
                                        "Create an ATS-friendly CV",
                                        "Apply faster with a saved profile",
                                        "Manage applications and track application status updates",
                                        "See salary ranges for each position",
                                        "Save favorite jobs to apply later",
                                    ].map((benefit, index) => (
                                        <li
                                            key={index}
                                            className="flex items-start"
                                        >
                                            <div className="mr-2 text-blue-500">
                                                •
                                            </div>
                                            <span>{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center mb-6">
                                <Image
                                    src={logoTitle}
                                    alt="Job Huntly"
                                    width={120}
                                    height={32}
                                    className="mr-2"
                                />
                                <span className="text-gray-600">
                                    | Recruiting Made Simple.
                                </span>
                            </div>
                            <div className="flex justify-center mb-8">
                                <Image
                                    src={recruiterBanner}
                                    alt="Recruiter"
                                    width={400}
                                    height={300}
                                />
                            </div>
                            <div className="mb-6">
                                <h4 className="mb-2 font-semibold">
                                    Log in to access powerful recruiting tools
                                </h4>
                                <ul className="mt-4 space-y-2">
                                    {[
                                        "Post job ads for free",
                                        "Find suitable candidates",
                                        "Manage application profiles",
                                    ].map((benefit, index) => (
                                        <li
                                            key={index}
                                            className="flex items-start"
                                        >
                                            <div className="mr-2 text-orange-500">
                                                •
                                            </div>
                                            <span>{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                    <p className="text-sm text-gray-500">
                        {t`If you have trouble logging in or creating an account, please contact Job Huntly via`}{" "}
                        <a
                            href={`mailto:${"help.jobhuntly@gmail.com"}`}
                            className="text-blue-500 underline"
                        >
                            help.jobhuntly@gmail.com
                        </a>
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
