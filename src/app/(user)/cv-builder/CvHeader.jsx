"use client";

import { t } from "@/i18n/i18n";

export default function CvHeader({ info }) {
  return (
    <div className="pb-4 border-b border-gray-200">
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {info?.fullName || "-"}
          </h1>
          <p className="text-lg font-semibold text-gray-700">
            {info?.title || "-"}
          </p>
        </div>

        <div className="flex flex-col items-start gap-1 text-sm text-gray-600 sm:items-end">
          {info?.email ? <p>{info.email}</p> : null}
          {info?.phone ? <p>{info.phone}</p> : null}
          {info?.gender ? (
            <p>
              <span className="font-semibold">{t`Gender`}:</span> {info.gender}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
