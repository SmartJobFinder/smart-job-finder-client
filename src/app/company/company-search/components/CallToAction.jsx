"use client";

import React from "react";
import Link from "next/link";

const CallToAction = () => {
    return (
        <section className="bg-[#0A66C2] text-white rounded-2xl overflow-hidden">
            <div className="relative z-10 px-8 py-12 md:py-16 md:px-12">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                        Are you a recruiter?
                    </h2>
                    <p className="mb-8 text-xl text-blue-100">
                        Register for free to advertise your company and reach
                        thousands of potential candidates!
                    </p>
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <Link
                            href="/src/app/recruiter/create-job"
                            className="px-8 py-3 bg-white text-[#0A66C2] hover:bg-blue-50 font-medium rounded-lg transition-colors"
                        >
                            Post a job
                        </Link>
                        <Link
                            href="/recruiter/paymoney"
                            className="px-8 py-3 bg-[#085aab] text-white hover:bg-[#064884] font-medium rounded-lg transition-colors border border-blue-500"
                        >
                            View service packages
                        </Link>
                    </div>
                </div>
            </div>

            {/* Pattern decorations */}
            <div className="absolute left-0 w-40 h-40 -translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-full top-24 opacity-20"></div>
            <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full w-60 h-60 opacity-20 translate-x-1/3 translate-y-1/3"></div>
        </section>
    );
};

export default CallToAction;
