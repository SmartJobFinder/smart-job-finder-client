"use client";
import { Calendar, DollarSign } from "lucide-react";
import { formatDateDMY } from "../_utils/formatters";

export default function GeneralCard({ salary, postDate, expiredDate }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">General</h2>
      <div className="space-y-3 text-gray-700">
        <p>
          <DollarSign className="inline mr-2" size={18} />
          <strong>Salary:</strong> {salary || "N/A"}
        </p>
        <p>
          <Calendar className="inline mr-2" size={18} />
          <strong>Post Date:</strong> {formatDateDMY(postDate)}
        </p>
        <p>
          <Calendar className="inline mr-2" size={18} />
          <strong>Expired Date:</strong> {formatDateDMY(expiredDate)}
        </p>
      </div>
    </div>
  );
}