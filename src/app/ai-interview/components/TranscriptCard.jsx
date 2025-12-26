import { t } from "@/i18n/i18n";

export default function TranscriptCard({ transcript, wpm, fluencyLevel }) {
  if (!transcript) return null;

  return (
    <div className="bg-gray-50 p-4 rounded border border-gray-200">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold text-sm text-gray-900">
          {t`Transcript of your answer`}
        </h3>

        {(wpm != null || fluencyLevel) && (
          <div className="text-[11px] text-gray-500 flex gap-2">
            {wpm != null && (
              <span>
                {t`WPM: `}
                {Number(wpm).toFixed(1)}
              </span>
            )}
            {fluencyLevel && (
              <span>
                • {t`Fluency: `}
                {fluencyLevel}
              </span>
            )}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-800 leading-relaxed whitespace-pre-wrap">
        {transcript}
      </p>
    </div>
  );
}
