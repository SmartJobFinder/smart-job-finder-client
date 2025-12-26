"use client";

import React, { useState, useEffect } from "react";
import { getMyCompany } from "@/services/companyService";
import { Building2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import JobPostingForm from "@/app/recruiter/create-job/components/JobPosting";

export default function JobCreatePage() {
  const [hasCompany, setHasCompany] = useState(false);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkCompany = async () => {
      try {
        setLoading(true);
        setError(null);
        const companyData = await getMyCompany();

        if (companyData && companyData.id) {
          setHasCompany(true);
          setCompany(companyData);
        } else {
          setHasCompany(false);
        }
      } catch (error) {
        console.error("Error checking company:", error);
        setHasCompany(false);
        setError(error.message || "Failed to load company data");
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
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading company information...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Connection Error
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <Button onClick={() => window.location.reload()} className="w-full">
              Try Again
            </Button>
            <p className="text-sm text-gray-500">
              Make sure Spring Boot backend is running on port 8082
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show no company message
  if (!hasCompany) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Company Found
          </h2>
          <p className="text-gray-600 mb-6">
            You need to create a company profile before posting jobs.
          </p>
          <Link href="/recruiter/create-company">
            <Button className="w-full">Create Company Profile</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Show job creation form if company exists
  return (
    <div className="min-h-screen bg-gray-50">
      <JobPostingForm />
    </div>
  );
}
