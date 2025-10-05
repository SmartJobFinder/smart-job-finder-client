"use client";

import React, { useState, useEffect } from "react";
import { getMyCompany } from "@/services/companyService";
import { Building2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CompanyGuard({ children }) {
    const [hasCompany, setHasCompany] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkCompany = async () => {
            try {
                setLoading(true);
                const companyData = await getMyCompany();
                if (companyData && companyData.id) {
                    setHasCompany(true);
                } else {
                    setHasCompany(false);
                }
            } catch (error) {
                console.error("Error checking company:", error);
                setHasCompany(false);
            } finally {
                setLoading(false);
            }
        };

        checkCompany();
    }, []);

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Checking company status...</p>
                </div>
            </div>
        );
    }

    // Show no company message
    if (!hasCompany) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-md mx-auto text-center px-4">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <Building2 className="w-10 h-10 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">No Company Found</h2>
                    <p className="text-gray-600 mb-6">
                        You don't have any company yet. Would you like to create a new one?
                    </p>
                    <div className="space-y-3">
                        <Link href="/recruiter/create-company">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                Create New Company
                            </Button>
                        </Link>
                        <Link href="/recruiter/profile">
                            <Button variant="outline" className="w-full">
                                Back to Profile
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Show children if company exists
    return <>{children}</>;
} 