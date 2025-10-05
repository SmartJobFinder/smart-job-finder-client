"use client";
import { Edit, Trash2 } from "lucide-react";

export default function LanguageSection({ data, onEdit, onDelete }) {
    if (!data || data.length === 0) {
        return (
            <p className="text-sm text-gray-800 ">
                {data?.description || "No description provided"}
            </p>
        );
    }

    return (
        <div className="space-y-3">
            {data.map((item, index) => (
                <div
                    key={index}
                    className="flex items-start justify-between py-3 my-2 transition-colors duration-200 border-t-4 border-blue-600"
                >
                    <div className="flex-1">
                        <h4 className="text-lg font-medium text-gray-900 ">
                            {item.name}
                        </h4>
                        <p className="mt-1 text-sm text-gray-700">
                            Level: {item.level}
                        </p>
                    </div>
                    <div className="flex gap-2 ml-3">
                        {onEdit && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit(index);
                                }}
                                className="text-blue-500 hover:text-blue-700"
                            >
                                <Edit size={20} />
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(index);
                                }}
                                className="text-red-500 hover:text-red-700"
                            >
                                <Trash2 size={20} />
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
