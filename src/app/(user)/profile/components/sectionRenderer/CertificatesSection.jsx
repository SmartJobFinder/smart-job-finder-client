"use client";
import { Edit, Trash2 } from "lucide-react";

export default function CertificatesSection({ data, onEdit, onDelete }) {
    if (!data || data.length === 0) {
        return (
            <p className="text-sm text-gray-800 ">
                Provides evidence of your specific expertise and skills
            </p>
        );
    }

    return (
        <div className="space-y-3">
            {data.map((certificate, index) => (
                <div
                    key={index}
                    className="flex items-start justify-between py-3 my-2 border-blue-600 border-t-3"
                >
                    <div className="flex-1">
                        <h4 className="text-xl font-medium text-gray-900">
                            {certificate.cerName}
                        </h4>
                        <p className="text-sm text-gray-600">
                            {certificate.issuer}
                        </p>
                        <p className="text-xs text-gray-500">
                            {certificate.date
                                ? new Date(
                                      certificate.date
                                  ).toLocaleDateString()
                                : "N/A"}
                        </p>
                        {certificate.description && (
                            <p className="mt-1 text-sm text-gray-700">
                                {certificate.description}
                            </p>
                        )}
                    </div>
                    <div className="flex gap-2 ml-3">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit && onEdit(index);
                            }}
                            className="text-blue-500 hover:text-blue-700"
                        >
                            <Edit size={20} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete && onDelete(index);
                            }}
                            className="text-red-500 hover:text-red-700"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
