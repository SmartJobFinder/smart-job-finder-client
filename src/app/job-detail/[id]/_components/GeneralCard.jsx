"use client";
import { Calendar, DollarSign } from "lucide-react";
import { formatDateDMY } from "../_utils/formatters";
import { t } from "@/i18n/i18n";

export default function GeneralCard({ salary, postDate, expiredDate }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
                {t`General`}
            </h2>

            <div className="space-y-4">
                {/* Salary */}
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                        <DollarSign className="text-green-600" size={20} />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">{t`Salary:`}</p>
                        <p className="text-base font-semibold text-gray-900">
                            {salary || t`N/A`}
                        </p>
                    </div>
                </div>

                {/* Post Date */}
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                        <Calendar className="text-blue-600" size={20} />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">{t`Post Date:`}</p>
                        <p className="text-base font-semibold text-gray-900">
                            {formatDateDMY(postDate)}
                        </p>
                    </div>
                </div>

                {/* Expired Date */}
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                        <Calendar className="text-red-600" size={20} />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">{t`Expired Date:`}</p>
                        <p className="text-base font-semibold text-gray-900">
                            {formatDateDMY(expiredDate)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
