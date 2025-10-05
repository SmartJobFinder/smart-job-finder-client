"use client";

import React, { useEffect } from "react";
import useMyCompanyStore from "./store/myCompanyStore";
import MyCompanyBanner from "./components/MyCompanyBanner";
import MyCompanyDescription from "./components/MyCompanyDescription";
import MyCompanyContactInfo from "./components/MyCompanyContactInfo";
import NoCompanyMessage from "./components/NoCompanyMessage";

export default function MyCompanyPage() {
    const { 
        hasCompany, 
        company, 
        isLoading, 
        error, 
        checkUserHasCompany 
    } = useMyCompanyStore();

    useEffect(() => {
        checkUserHasCompany();
    }, [checkUserHasCompany]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="p-8 text-center text-red-500 rounded-lg bg-red-50">
                    <h2 className="mb-2 text-xl font-bold">Error</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!hasCompany) {
        return <NoCompanyMessage />;
    }

    if (!company) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="p-8 text-center text-gray-500 rounded-lg bg-gray-50">
                    <h2 className="mb-2 text-xl font-bold">
                        Company Not Found
                    </h2>
                    <p>Your company information could not be loaded</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="min-w-full px-4 space-y-6 font-sans">
                <MyCompanyBanner />

                <div className="flex justify-center mt-10">
                    <div className="flex flex-col w-full gap-6 lg:flex-row max-w-7xl">
                        <div className="space-y-6 lg:basis-2/3">
                            <MyCompanyDescription />
                        </div>

                        <div className="space-y-6 lg:basis-1/3">
                            <MyCompanyContactInfo />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}