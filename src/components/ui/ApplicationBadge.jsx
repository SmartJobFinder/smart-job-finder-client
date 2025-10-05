"use client";

import { Badge } from "@/components/ui/badge";

function getStatusColor(status) {
    switch (status) {
        case "APPLIED":
        case "Applied":
            return "bg-blue-100 text-blue-700 border border-blue-300";
        case "REVIEWED":
        case "Reviewed":
            return "bg-green-100 text-green-700 border border-green-300";
        case "REJECTED":
        case "Rejected":
            return "bg-red-100 text-red-700 border border-red-300";
        case "HIRED":
        case "Hired":
            return "bg-purple-100 text-purple-700 border border-purple-300";
        default:
            return "bg-gray-100 text-gray-700 border border-gray-300";
    }
}

export default function ApplicationBadge({ status, className = "" }) {
    if (!status) return null; 

    return (
        <Badge
            className={`${getStatusColor(
                status
            )} px-3 py-1 rounded-full font-medium text-xs ${className}`}
        >
            {status}
        </Badge>
    );
}
