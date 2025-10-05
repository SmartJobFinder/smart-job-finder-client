"use client";
import React from "react";
import { Edit, Trash2 } from "lucide-react";

const AwardsSection = ({ data, onEdit, onDelete }) => {
    if (!data || data.length === 0) {
        return (
            <p className="text-sm text-gray-800">
                Share your awards and achievements
            </p>
        );
    }

    return (
        <div className="space-y-3">
            {data.map((item, index) => (
                <div
                    key={item.id}
                    className="flex items-start justify-between py-3 my-2 border-t-3 border-blue-600"
                >
                    <div className="flex-1">
                        <h4 className="text-xl font-medium text-gray-900">
                            {item.name || "Unnamed"}
                        </h4>
                        <p className="text-sm text-gray-600">
                            {item.issuer || "No issuer"}
                        </p>
                        <p className="text-xs text-gray-500">
                            {item.date
                                ? new Date(item.date).toLocaleDateString()
                                : "N/A"}
                        </p>
                        {item.description && (
                            <p className="mt-1 text-sm text-gray-700">
                                {item.description}
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
};

export default AwardsSection;
