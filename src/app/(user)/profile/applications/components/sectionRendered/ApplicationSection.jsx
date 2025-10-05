"use client";
import { Edit } from "lucide-react";

export default function ApplicationSection({ data, onEdit }) {
    if (!data || data.length === 0) {
        return (
            <p className="text-sm text-gray-600">
                No application available. Add your application to get started.
            </p>
        );
    }

    // Lặp qua tất cả ứng dụng
    return (
        <div className="space-y-4">
            {data.map((application) => (
                <div
                    key={application.id}
                    className="p-4 bg-white border border-gray-200 rounded-lg shadow-md"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">
                            {application.fullname}
                        </h4>
                        {onEdit && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(application.id);
                                }}
                                className="text-blue-600 transition-colors hover:text-blue-800"
                                aria-label="Edit application"
                            >
                                <Edit size={20} />
                            </button>
                        )}
                    </div>
                    <p className="text-sm text-gray-600">
                        Email: {application.email}
                    </p>
                    <p className="text-sm text-gray-600">
                        Phone: {application.phoneNumber}
                    </p>
                    <p className="text-sm text-gray-600">
                        Status: {application.status ? "Active" : "Inactive"}
                    </p>
                </div>
            ))}
        </div>
    );
}
