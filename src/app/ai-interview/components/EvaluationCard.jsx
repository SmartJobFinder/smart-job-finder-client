import { t } from "@/i18n/i18n";
import { Star } from "lucide-react";

/**
 * Calculate interview answer score based on available metrics.
 * Score is out of 10, calculated from:
 * - Fluency level (40%): excellent=10, good=8, normal=6.5, fair=5, poor=3
 * - Speaking speed WPM (30%): ideal range 120-160 WPM = 10, deviation reduces score
 * - Stress level (30%): stress_score 0=10 (calm), 1=0 (highly stressed)
 */
function calculateScore(wpm, fluencyLevel, stressScore) {
  let totalScore = 0;
  let normalizer = 0;

  // Fluency score (40% weight)
  if (fluencyLevel) {
    const fluencyScores = {
      excellent: 10,
      good: 8,
      normal: 6.5,
      fair: 5,
      poor: 3,
    };
    const fluencyScore = fluencyScores[fluencyLevel.toLowerCase()] ?? 6;
    totalScore += fluencyScore * 0.4;
    normalizer += 0.4;
  }

  // WPM score (30% weight) - ideal range 120-160 WPM
  if (wpm != null && wpm > 0) {
    let wpmScore;
    if (wpm >= 120 && wpm <= 160) {
      wpmScore = 10; // ideal range
    } else if (wpm >= 100 && wpm < 120) {
      wpmScore = 8; // slightly slow
    } else if (wpm > 160 && wpm <= 180) {
      wpmScore = 8; // slightly fast
    } else if (wpm >= 80 && wpm < 100) {
      wpmScore = 6; // slow
    } else if (wpm > 180 && wpm <= 200) {
      wpmScore = 6; // fast
    } else {
      wpmScore = 4; // too slow or too fast
    }
    totalScore += wpmScore * 0.3;
    normalizer += 0.3;
  }

  // Stress score (30% weight) - lower stress is better
  if (stressScore != null) {
    const stressNormalized = Math.max(0, Math.min(1, stressScore));
    const calmScore = (1 - stressNormalized) * 10;
    totalScore += calmScore * 0.3;
    normalizer += 0.3;
  }

  if (normalizer === 0) return null;

  return Math.round((totalScore / normalizer) * 10) / 10;
}

function getScoreColor(score) {
  if (score === null || score === undefined) return "text-gray-500";
  if (score >= 8) return "text-green-600";
  if (score >= 6) return "text-yellow-600";
  if (score >= 4) return "text-orange-500";
  return "text-red-500";
}

function getScoreBg(score) {
  if (score === null || score === undefined) return "bg-gray-100";
  if (score >= 8) return "bg-gradient-to-br from-green-50 to-emerald-100";
  if (score >= 6) return "bg-gradient-to-br from-yellow-50 to-amber-100";
  if (score >= 4) return "bg-gradient-to-br from-orange-50 to-orange-100";
  return "bg-gradient-to-br from-red-50 to-red-100";
}

function getScoreLabel(score) {
  if (score === null || score === undefined) return "—";
  if (score >= 9) return t`Excellent`;
  if (score >= 8) return t`Very Good`;
  if (score >= 7) return t`Good`;
  if (score >= 6) return t`Fair`;
  if (score >= 5) return t`Average`;
  if (score >= 4) return t`Below Average`;
  return t`Needs Improvement`;
}

export default function EvaluationCard({ feedback }) {
  const calculatedScore = feedback
    ? calculateScore(feedback.wpm, feedback.fluency_level, feedback.stress_score)
    : null;

  return (
    <div className="bg-white shadow-sm rounded-lg p-5 border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-gray-900">{t`AI Evaluation`}</h2>
        <span className="text-[11px] uppercase tracking-wide text-gray-400">
          {t`Speech & Content Analysis`}
        </span>
      </div>

      {!feedback && (
        <p className="text-xs text-gray-500">
          {t`Record your answer and stop recording so the AI can analyze your speech, fluency, emotion, and overall response quality.`}
        </p>
      )}

      {feedback && (
        <>
          {/* === OVERALL SCORE === */}
          <div className={`rounded-xl p-4 mb-4 ${getScoreBg(calculatedScore)}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-14 h-14 rounded-full bg-white shadow-sm`}>
                  <span className={`text-2xl font-bold ${getScoreColor(calculatedScore)}`}>
                    {calculatedScore != null ? calculatedScore.toFixed(1) : "—"}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {t`Overall Score`}
                  </p>
                  <p className={`text-lg font-bold ${getScoreColor(calculatedScore)}`}>
                    {getScoreLabel(calculatedScore)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Star className={`w-6 h-6 ${getScoreColor(calculatedScore)}`} />
                <p className="text-xs text-gray-500 mt-1">/10</p>
              </div>
            </div>
            
            {/* Score Scale Legend */}
            <div className="mt-3 pt-3 border-t border-gray-200/50">
              <p className="text-[10px] font-medium text-gray-500 mb-2">{t`Score Scale`}</p>
              <div className="flex gap-1">
                <div className="flex-1 h-2 rounded-l bg-red-400" title="0-4: Needs Improvement" />
                <div className="flex-1 h-2 bg-orange-400" title="4-5: Below Average" />
                <div className="flex-1 h-2 bg-yellow-400" title="5-6: Average" />
                <div className="flex-1 h-2 bg-lime-400" title="6-7: Fair" />
                <div className="flex-1 h-2 bg-green-400" title="7-8: Good" />
                <div className="flex-1 h-2 rounded-r bg-emerald-500" title="8-10: Excellent" />
              </div>
              <div className="flex justify-between text-[9px] text-gray-400 mt-1">
                <span>0</span>
                <span>4</span>
                <span>6</span>
                <span>8</span>
                <span>10</span>
              </div>
            </div>
          </div>

          {/* === METRICS === */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="rounded-lg bg-sky-50 px-3 py-2">
              <p className="text-[11px] font-medium text-sky-700 uppercase tracking-wide">
                {t`Speaking Speed`}
              </p>
              <p className="text-sm font-semibold text-sky-900">
                {feedback.wpm != null
                  ? `${Number(feedback.wpm).toFixed(1)} WPM`
                  : "—"}
              </p>
              <p className="text-[10px] text-sky-600 mt-0.5">
                {t`Ideal: 120-160 WPM`}
              </p>
            </div>

            <div className="rounded-lg bg-emerald-50 px-3 py-2">
              <p className="text-[11px] font-medium text-emerald-700 uppercase tracking-wide">
                {t`Fluency Level`}
              </p>
              <p className="text-sm font-semibold text-emerald-900">
                {feedback.fluency_level || "—"}
              </p>
              <p className="text-[10px] text-emerald-600 mt-0.5">
                {t`Target: Good/Excellent`}
              </p>
            </div>

            <div className="rounded-lg bg-amber-50 px-3 py-2">
              <p className="text-[11px] font-medium text-amber-700 uppercase tracking-wide">
                {t`Stress Score`}
              </p>
              <p className="text-sm font-semibold text-amber-900">
                {feedback.stress_score != null
                  ? Number(feedback.stress_score).toFixed(2)
                  : "—"}
              </p>
              <p className="text-[10px] text-amber-600 mt-0.5">
                {t`Lower is better (0-1)`}
              </p>
            </div>
          </div>

          {/* === TEXT FEEDBACK === */}
          <div className="rounded-md bg-gray-50 border border-gray-200 p-3 space-y-3">
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                {t`Overall Evaluation`}
              </p>
              <p className="leading-relaxed text-xs text-gray-800 whitespace-pre-wrap">
                {feedback.evaluation || "—"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded border border-gray-200 bg-white p-3">
                <p className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide">
                  {t`Fluency Summary`}
                </p>
                <p className="text-xs text-gray-800 mt-1 whitespace-pre-wrap">
                  {feedback.fluency_summary || "—"}
                </p>
              </div>

              <div className="rounded border border-gray-200 bg-white p-3">
                <p className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide">
                  {t`Emotion Analysis`}
                </p>
                <p className="text-xs text-gray-800 mt-1">
                  {t`Dominant emotion: `}
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
              {t`Tip: Aim for steady pacing (120–160 WPM), clear structure (STAR), and confident tone to improve fluency and reduce stress.`}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
