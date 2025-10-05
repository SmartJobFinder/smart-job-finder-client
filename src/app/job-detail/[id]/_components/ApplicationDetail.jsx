"use client";
import { useGetApplicationDetailByJobQuery } from "@/services/applicationService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, Mail, Phone, User, FileImage } from "lucide-react";
import ApplicationBadge from "@/components/ui/ApplicationBadge";

export default function ApplicationDetail({ jobId }) {
    const { data, isLoading, error } = useGetApplicationDetailByJobQuery(jobId);

    if (isLoading) {
        return (
            <Card className="mt-4">
                <CardContent className="p-4">
                    <p className="text-center text-gray-500">
                        Loading application details...
                    </p>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="mt-4">
                <CardContent className="p-4">
                    <p className="text-center text-red-500">
                        Failed to load application details.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="mt-4 border-blue-500 border-dashed border-3">
            <CardHeader>
                <CardTitle className="text-lg text-blue-700">
                    Your Application Details
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-2 text-gray-700">
                        <User className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Full Name:</span>
                        <span>{data?.candidateName || "Not available"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700">
                        <Mail className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Email:</span>
                        <span>{data?.email || "Not available"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700">
                        <Phone className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Phone:</span>
                        <span>{data?.phoneNumber || "Not available"}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Applied At:</span>
                        <span>
                            {data?.createdAt
                                ? new Date(data.createdAt).toLocaleString()
                                : "Unknown"}
                        </span>
                    </div>
                </div>

                {/* Application Status */}
                {data?.status && (
                    <div className="p-3 rounded-lg bg-gray-50">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-700">
                                Status:
                            </span>
                            <ApplicationBadge status={data.status} />
                        </div>
                    </div>
                )}

                {/* CV & Cover Letter */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-700">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">CV:</span>
                        {data?.cv ? (
                            <a
                                href={data.cv}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline hover:text-blue-800"
                            >
                                View submitted CV
                            </a>
                        ) : (
                            <span className="text-gray-500">Not available</span>
                        )}
                    </div>

                    {data?.description && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-gray-700">
                                <FileImage className="w-4 h-4 text-blue-600" />
                                <span className="font-medium">
                                    Cover Letter:
                                </span>
                            </div>
                            <div className="p-3 rounded-lg bg-gray-50">
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                    {data.description}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Reapply Info */}
                {data?.nextReapplyAt &&
                    new Date(data.nextReapplyAt) > new Date() && (
                        <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
                            <p className="text-sm text-blue-700">
                                <strong>Note:</strong> You can reapply after:{" "}
                                <span className="font-medium">
                                    {new Date(
                                        data.nextReapplyAt
                                    ).toLocaleString()}
                                </span>
                            </p>
                        </div>
                    )}
            </CardContent>
        </Card>
    );
}
