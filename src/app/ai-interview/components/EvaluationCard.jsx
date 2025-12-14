export default function EvaluationCard({ feedback }) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-5 border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-gray-900">
          AI Evaluation
        </h2>
        <span className="text-[11px] uppercase tracking-wide text-gray-400">
          Speech & Content Analysis
        </span>
      </div>

      {!feedback && (
        <p className="text-xs text-gray-500">
          Record your answer and stop recording so the AI can analyze your
          speech, fluency, emotion, and overall response quality.
        </p>
      )}

      {feedback && (
        <>
          {/* === METRICS === */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 mt-2">
            <div className="rounded-lg bg-sky-50 px-3 py-2">
              <p className="text-[11px] font-medium text-sky-700 uppercase tracking-wide">
                Speaking Speed
              </p>
              <p className="text-sm font-semibold text-sky-900">
                {feedback.wpm != null
                  ? `${Number(feedback.wpm).toFixed(1)} WPM`
                  : "—"}
              </p>
            </div>

            <div className="rounded-lg bg-emerald-50 px-3 py-2">
              <p className="text-[11px] font-medium text-emerald-700 uppercase tracking-wide">
                Fluency Level
              </p>
              <p className="text-sm font-semibold text-emerald-900">
                {feedback.fluency_level || "—"}
              </p>
            </div>

            <div className="rounded-lg bg-amber-50 px-3 py-2">
              <p className="text-[11px] font-medium text-amber-700 uppercase tracking-wide">
                Stress Score
              </p>
              <p className="text-sm font-semibold text-amber-900">
                {feedback.stress_score != null
                  ? Number(feedback.stress_score).toFixed(2)
                  : "—"}
              </p>
            </div>
          </div>

          {/* === TEXT FEEDBACK === */}
          <div className="rounded-md bg-gray-50 border border-gray-200 p-3 space-y-3">
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                Overall Evaluation
              </p>
              <p className="leading-relaxed text-xs text-gray-800 whitespace-pre-wrap">
                {feedback.evaluation || "—"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded border border-gray-200 bg-white p-3">
                <p className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide">
                  Fluency Summary
                </p>
                <p className="text-xs text-gray-800 mt-1 whitespace-pre-wrap">
                  {feedback.fluency_summary || "—"}
                </p>
              </div>

              <div className="rounded border border-gray-200 bg-white p-3">
                <p className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide">
                  Emotion Analysis
                </p>
                <p className="text-xs text-gray-800 mt-1">
                  Dominant emotion:{" "}
                  <span className="font-semibold">
                    {feedback.dominant_emotion || "—"}
                  </span>
                </p>
                <p className="text-xs text-gray-800 mt-1 whitespace-pre-wrap">
                  {feedback.emotion_summary || "—"}
                </p>
              </div>
            </div>

            <p className="text-[11px] text-gray-500">
              Tip: Aim for steady pacing (120–160 WPM), clear structure (STAR),
              and confident tone to improve fluency and reduce stress.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
