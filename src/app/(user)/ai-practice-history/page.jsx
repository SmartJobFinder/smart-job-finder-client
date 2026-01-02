"use client";

import { useState, useMemo } from "react";
import { t } from "@/i18n/i18n";
import {
  useGetInterviewHistoryQuery,
} from "@/services/aiInterviewService";
import InterviewSessionDetailModal from "@/app/job-detail/[id]/_components/InterviewSessionDetailModal";
import LoadingScreen from "@/components/ui/loadingScreen";
import {
  Mic,
  Calendar,
  MessageSquare,
  Star,
  ChevronRight,
  Info,
} from "lucide-react";

/**
 * Calculate score from metrics (for legacy data without backend score)
 */
function calculateScore(wpm, fluencyLevel, stressScore) {
  let totalScore = 0;
  let normalizer = 0;

  if (fluencyLevel) {
    const fluencyScores = { excellent: 10, good: 8, normal: 6.5, fair: 5, poor: 3 };
    const fluencyScore = fluencyScores[fluencyLevel.toLowerCase()] ?? 6;
    totalScore += fluencyScore * 0.4;
    normalizer += 0.4;
  }

  if (wpm != null && wpm > 0) {
    let wpmScore;
    if (wpm >= 120 && wpm <= 160) wpmScore = 10;
    else if (wpm >= 100 && wpm < 120) wpmScore = 8;
    else if (wpm > 160 && wpm <= 180) wpmScore = 8;
    else if (wpm >= 80 && wpm < 100) wpmScore = 6;
    else if (wpm > 180 && wpm <= 200) wpmScore = 6;
    else wpmScore = 4;
    totalScore += wpmScore * 0.3;
    normalizer += 0.3;
  }

  if (stressScore != null) {
    const stressNormalized = Math.max(0, Math.min(1, stressScore));
    const calmScore = (1 - stressNormalized) * 10;
    totalScore += calmScore * 0.3;
    normalizer += 0.3;
  }

  if (normalizer === 0) return null;
  return Math.round((totalScore / normalizer) * 10) / 10;
}

function formatDate(isoString) {
  if (!isoString) return "—";
  const date = new Date(isoString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatScore(score) {
  if (score === null || score === undefined) return "—";
  return score.toFixed(1);
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
  if (score >= 8) return "bg-green-100";
  if (score >= 6) return "bg-yellow-100";
  if (score >= 4) return "bg-orange-100";
  return "bg-red-100";
}

function getScoreLabel(score) {
  if (score === null || score === undefined) return "";
  if (score >= 9) return t`Excellent`;
  if (score >= 8) return t`Very Good`;
  if (score >= 7) return t`Good`;
  if (score >= 6) return t`Fair`;
  if (score >= 5) return t`Average`;
  if (score >= 4) return t`Below Average`;
  return t`Needs Improvement`;
}

export default function AIPracticeHistoryPage() {
  const { data: history, isLoading, isError } = useGetInterviewHistoryQuery({ limit: 50 });
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  const sessions = useMemo(() => {
    if (!history) return [];
    return history.map(session => ({
      ...session,
      // Backend now calculates average_score for all sessions (including legacy)
      calculatedScore: session.average_score,
    }));
  }, [history]);

  if (isLoading) return <LoadingScreen message={t`Loading AI practice history...`} />;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-fuchsia-100 via-purple-100 to-indigo-100 rounded-xl border border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-lg">
                <Mic className="w-6 h-6 text-white" />
              </div>
              {t`AI Practice History`}
            </h1>
            <p className="text-gray-600 mt-1">
              {t`Review your AI interview practice sessions and track your progress`}
            </p>
          </div>
        </div>
      </div>

      {/* Score Scale Legend */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">{t`Score Scale`}</span>
        </div>
        <div className="flex gap-1 mb-2">
          <div className="flex-1 h-2.5 rounded-l bg-red-400" title="0-4: Needs Improvement" />
          <div className="flex-1 h-2.5 bg-orange-400" title="4-5: Below Average" />
          <div className="flex-1 h-2.5 bg-yellow-400" title="5-6: Average" />
          <div className="flex-1 h-2.5 bg-lime-400" title="6-7: Fair" />
          <div className="flex-1 h-2.5 bg-green-400" title="7-8: Good" />
          <div className="flex-1 h-2.5 rounded-r bg-emerald-500" title="8-10: Excellent" />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>0</span>
          <span>4</span>
          <span>6</span>
          <span>8</span>
          <span>10</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {t`Score is calculated from: Fluency Level (40%) • Speaking Speed (30%) • Stress Level (30%)`}
        </p>
      </div>

      {/* Error State */}
      {isError && (
        <div className="text-center py-12 text-red-500">
          <p>{t`Failed to load practice history`}</p>
        </div>
      )}

      {/* Empty State */}
      {!isError && sessions.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Mic className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {t`No practice sessions yet`}
          </h3>
          <p className="text-gray-500 mb-4">
            {t`Start practicing with AI Interview Coach to improve your interview skills`}
          </p>
          <p className="text-sm text-purple-600">
            {t`Go to a job detail page and click "AI Interview Coach" button to start`}
          </p>
        </div>
      )}

      {/* Sessions List */}
      {sessions.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-800">
            {t`All Sessions`} ({sessions.length})
          </h2>

          {sessions.map((session) => (
            <div
              key={session.session_id}
              onClick={() => setSelectedSessionId(session.session_id)}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-purple-300 transition cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {/* Job Title */}
                  <h3 className="font-semibold text-gray-900 group-hover:text-purple-700 transition">
                    {session.job_title || t`Practice Session`}
                  </h3>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(session.started_at)}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {session.questions_count || 0} {t`questions`}
                    </div>
                  </div>
                </div>

                {/* Score Badge */}
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-2 rounded-lg ${getScoreBg(session.calculatedScore)}`}>
                    <div className="flex items-center gap-2">
                      <Star className={`w-5 h-5 ${getScoreColor(session.calculatedScore)}`} />
                      <div>
                        <p className={`text-lg font-bold ${getScoreColor(session.calculatedScore)}`}>
                          {formatScore(session.calculatedScore)}/10
                        </p>
                        {session.calculatedScore != null && (
                          <p className={`text-xs ${getScoreColor(session.calculatedScore)}`}>
                            {getScoreLabel(session.calculatedScore)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedSessionId && (
        <InterviewSessionDetailModal
          sessionId={selectedSessionId}
          onClose={() => setSelectedSessionId(null)}
        />
      )}
    </div>
  );
}
