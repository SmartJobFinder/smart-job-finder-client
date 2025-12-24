"use client";

export default function EducationItem({ item }) {
  const school = item?.schoolName || "-";
  const majors = item?.majors || "";
  const degree = item?.degree || "";
  const duration = item?.duration || "";

  return (
    <div className="pb-3 border-b border-gray-100 last:border-none last:pb-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {school}
          </p>
          {majors ? <p className="text-sm text-gray-700">{majors}</p> : null}
        </div>
        {duration ? <p className="text-xs text-gray-500">{duration}</p> : null}
      </div>
      {degree ? <p className="mt-1 text-xs text-gray-600">{degree}</p> : null}
    </div>
  );
}
