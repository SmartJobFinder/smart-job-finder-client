"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import recruiterImg from "@/assets/images/cta-recruiter.jpg";
import candidateImg from "@/assets/images/cta-candidate.jpg";
import Image from "next/image";
import { t } from "@/i18n/i18n";

const CallToActionSection = () => {
    return (
        <section className="py-8 sm:py-12 lg:py-16">
            <div className="container px-2 mx-auto sm:px-4">
                <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-2">
                    <div className="flex items-center p-4 bg-gray-100 rounded-lg sm:p-6 lg:p-8 bg-gradient-to-bl from-blue-400 to-indigo-50">
                        <div className="flex-1">
                            <h3 className="mb-3 text-lg font-bold text-gray-900 sm:mb-4 sm:text-xl lg:text-2xl">
                                {t`Become a Candidate`}
                            </h3>
                            <p className="mb-4 text-xs text-gray-600 sm:mb-6 sm:text-sm lg:text-base">
                                {t`Join thousands of job seekers building their careers. Discover the right opportunities, apply with ease, and grow your future.`}
                            </p>
                            <Link href="/register">
                                <Button className="text-sm text-white bg-blue-600 sm:text-base hover:bg-blue-700">
                                    {t`Register Now`}{" "}
                                    <ArrowRight className="w-3 h-3 ml-2 sm:w-4 sm:h-4" />
                                </Button>
                            </Link>
                        </div>
                        <div className="flex-shrink-0 ml-4 sm:ml-6 lg:ml-8">
                            <Image
                                src={candidateImg}
                                alt="Become a Candidate"
                                className="object-cover w-24 h-24 rounded-lg sm:w-32 sm:h-32 lg:w-48 lg:h-48"
                            />
                        </div>
                    </div>
                    <div className="flex items-center p-4 text-white bg-blue-600 rounded-lg sm:p-6 lg:p-8">
                        <div className="flex-1">
                            <h3 className="mb-3 text-lg font-bold sm:mb-4 sm:text-xl lg:text-2xl">
                                {t`Become a Recruiter`}
                            </h3>
                            <p className="mb-4 text-xs text-blue-100 sm:mb-6 sm:text-sm lg:text-base">
                                {t`Find the talent that drives your business forward. Post jobs, manage applications, and connect with the right candidates faster.`}
                            </p>
                            <Link href="/register">
                                <Button className="text-sm text-blue-600 bg-white sm:text-base hover:bg-gray-100">
                                    {t`Register Now`}{" "}
                                    <ArrowRight className="w-3 h-3 ml-2 sm:w-4 sm:h-4" />
                                </Button>
                            </Link>
                        </div>
                        <div className="flex-shrink-0 ml-4 sm:ml-6 lg:ml-8">
                            <Image
                                src={recruiterImg}
                                alt="Become a Recruiter"
                                className="object-cover w-24 h-24 rounded-lg sm:w-32 sm:h-32 lg:w-48 lg:h-48"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CallToActionSection;
