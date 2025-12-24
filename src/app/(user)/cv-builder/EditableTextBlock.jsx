"use client";

import { useEffect, useState } from "react";
import { t } from "@/i18n/i18n";

export default function EditableTextBlock({
  value = "",
  onSave,
  placeholder = "-",
  minRows = 6,
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value || "");

  useEffect(() => {
    if (!editing) setDraft(value || "");
  }, [value, editing]);

  const handleCancel = () => {
    setDraft(value || "");
    setEditing(false);
  };

  const handleSave = () => {
    onSave?.(draft);
    setEditing(false);
  };

  if (!editing) {
    return (
      <div className="space-y-2">
        <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
          {value?.trim() ? value : placeholder}
        </p>

        <button
          type="button"
          onClick={() => setEditing(true)}
          className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
        >
          {t`Edit`}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <textarea
        value={draft}
        onChange={e => setDraft(e.target.value)}
        rows={minRows}
        className="w-full text-sm leading-relaxed text-gray-800 border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-200"
        placeholder={t`Write here...`}
      />

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleSave}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
        >
          {t`Save`}
        </button>

        <button
          type="button"
          onClick={handleCancel}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
        >
          {t`Cancel`}
        </button>
      </div>
    </div>
  );
}
