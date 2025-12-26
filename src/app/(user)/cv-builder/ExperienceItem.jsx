"use client";

export default function ExperienceItem({ item }) {
  const position = item?.position || "-";
  const company = item?.companyName || "";
  const duration = item?.duration || "";
  const description = item?.description || "";

  return (
    <div className="pb-3 border-b border-gray-100 last:border-none last:pb-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {position}
          </p>
          {company ? <p className="text-sm text-gray-700">{company}</p> : null}
        </div>
        {duration ? <p className="text-xs text-gray-500">{duration}</p> : null}
      </div>
      {description ? (
        <p className="mt-1 text-sm text-gray-700 whitespace-pre-line">
          {description}
        </p>
      ) : null}
    </div>
  );
}
