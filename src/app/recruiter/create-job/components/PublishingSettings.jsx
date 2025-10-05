"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Loader2 } from "lucide-react";

const PublishingSettings = ({
    datePost,
    expiredDate,
    onDatePostChange,
    onExpiredDateChange,
    datePostError,
    expiredDateError,
}) => {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="datePost" className="text-sm font-medium">
                    Date Posted
                </Label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        id="datePost"
                        type="date"
                        value={datePost || ""}
                        onChange={onDatePostChange}
                        className={`pl-10 ${
                            datePostError ? "border-red-500" : ""
                        }`}
                        min={new Date().toISOString().split("T")[0]}
                    />
                </div>
                {datePostError && (
                    <p className="text-red-500 text-sm mt-1">{datePostError}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="expiredDate" className="text-sm font-medium">
                    Expired Date
                </Label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        id="expiredDate"
                        type="date"
                        value={expiredDate || ""}
                        onChange={onExpiredDateChange}
                        className={`pl-10 ${
                            expiredDateError ? "border-red-500" : ""
                        }`}
                        min={datePost || new Date().toISOString().split("T")[0]}
                    />
                </div>
                {expiredDateError && (
                    <p className="text-red-500 text-sm mt-1">
                        {expiredDateError}
                    </p>
                )}
            </div>

            <div className="pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600 space-y-1">
                    <p>• Job will be approved within 24 hours</p>
                    <p>• You can edit the information after posting</p>
                    <p>• Job will automatically expire on the selected date</p>
                </div>
            </div>
        </div>
    );
};

export default PublishingSettings;
