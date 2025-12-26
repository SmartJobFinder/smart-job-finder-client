"use client";

import { useMemo, useState } from "react";
import { t } from "@/i18n/i18n";

function stripHtml(html) {
  if (!html) return "";
  return String(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(text, n = 220) {
  if (!text) return "";
  return text.length > n ? text.slice(0, n) + "…" : text;
}

// ✅ parse benefits nếu là JSON string / array
function parseBenefits(raw) {
  if (!raw) return null;

  if (Array.isArray(raw)) return raw;

  if (typeof raw === "string") {
    const s = raw.trim();
    if (!s) return null;
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      // not JSON
    }
  }
  return null;
}

function iconToEmoji(icon) {
  const k = String(icon || "").toLowerCase();
  if (k.includes("heart")) return "❤️";
  if (k.includes("plane") || k.includes("vacation")) return "✈️";
  if (k.includes("graduation") || k.includes("learn")) return "🎓";
  if (k.includes("money") || k.includes("salary") || k.includes("bonus"))
    return "💰";
  if (k.includes("gift")) return "🎁";
  if (k.includes("home") || k.includes("remote")) return "🏠";
  if (k.includes("clock") || k.includes("time")) return "⏰";
  if (k.includes("shield") || k.includes("insurance")) return "🛡️";
  return "🎁";
}

export default function JobPreviewCard({ job, loading }) {
  const [open, setOpen] = useState(false);

  const benefitList = useMemo(
    () => parseBenefits(job?.benefits),
    [job?.benefits]
  );

  const desc = useMemo(
    () => truncate(stripHtml(job?.description), 260),
    [job?.description]
  );

  const reqs = useMemo(
    () => truncate(stripHtml(job?.requirements), 260),
    [job?.requirements]
  );

  const bens = useMemo(() => {
    // collapsed view: nếu benefits là JSON thì show list title
    if (benefitList?.length) {
      const titles = benefitList
        .map(b => (b?.title ? `• ${String(b.title).trim()}` : null))
        .filter(Boolean)
        .slice(0, 6); // tránh quá dài
      return titles.length ? titles.join("\n") : "-";
    }
    return truncate(stripHtml(job?.benefits), 260);
  }, [job?.benefits, benefitList]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow p-5 border">
        <div className="h-5 w-2/3 bg-gray-200 rounded mb-3 animate-pulse" />
        <div className="h-4 w-1/2 bg-gray-200 rounded mb-2 animate-pulse" />
        <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="bg-white rounded-2xl shadow p-5 border">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-lg font-semibold text-gray-900 truncate">
            {job.title || "-"}
          </div>
          <div className="mt-1 text-sm text-gray-600 flex flex-wrap gap-x-3 gap-y-1">
            {job.companyName ? <span>{job.companyName}</span> : null}
            {job.location ? <span>• {job.location}</span> : null}
            {job.salaryDisplay ? <span>• {job.salaryDisplay}</span> : null}
          </div>
        </div>

        <button
          onClick={() => setOpen(v => !v)}
          className="shrink-0 text-sm font-semibold text-blue-700 hover:text-blue-900"
        >
          {open ? t`Hide` : t`View more`}
        </button>
      </div>

      {open ? (
        <div className="mt-4 space-y-4 text-sm text-gray-700">
          <div>
            <div className="font-semibold text-gray-900 mb-1">
              {t`Job Description`}
            </div>
            <div className="whitespace-pre-line">
              {stripHtml(job.description) || "-"}
            </div>
          </div>

          <div>
            <div className="font-semibold text-gray-900 mb-1">
              {t`Requirements`}
            </div>
            <div className="whitespace-pre-line">
              {stripHtml(job.requirements) || "-"}
            </div>
          </div>

          <div>
            <div className="font-semibold text-gray-900 mb-2">{t`Benefits`}</div>

            {/* ✅ nếu benefits là JSON list thì render đẹp */}
            {benefitList?.length ? (
              <ul className="space-y-3">
                {benefitList.map((b, idx) => (
                  <li
                    key={idx}
                    className="flex gap-3 p-3 border rounded-xl bg-gray-50"
                  >
                    <div className="text-lg leading-none mt-0.5">
                      {iconToEmoji(b?.icon)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900">
                        {b?.title || "-"}
                      </div>
                      <div className="text-sm text-gray-700 whitespace-pre-line">
                        {b?.description || ""}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="whitespace-pre-line">
                {stripHtml(job.benefits) || "-"}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-700">
          <MiniBlock title={t`Job Description`} text={desc || "-"} />
          <MiniBlock title={t`Requirements`} text={reqs || "-"} />
          <MiniBlock title={t`Benefits`} text={bens || "-"} />
        </div>
      )}
    </div>
  );
}

function MiniBlock({ title, text }) {
  return (
    <div className="bg-gray-50 border rounded-xl p-3">
      <div className="text-xs font-semibold text-gray-900 mb-1">{title}</div>
      <div className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
        {text}
      </div>
    </div>
  );
}
