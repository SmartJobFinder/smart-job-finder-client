"use client";

import React, { useMemo } from "react";
import {
  X,
  Calendar,
  MessageSquare,
  Star,
  Activity,
  Mic,
  Heart,
  Brain,
  Info,
} from "lucide-react";
import { useGetInterviewSessionDetailQuery } from "@/services/aiInterviewService";
import { t } from "@/i18n/i18n";

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

/**
 * Calculate interview answer score based on available metrics.
 * Score is out of 10, calculated from:
 * - Fluency level (40%): excellent=10, good=8, normal=6.5, fair=5, poor=3
 * - Speaking speed WPM (30%): ideal range 120-160 WPM = 10
 * - Stress level (30%): stress_score 0=10 (calm), 1=0 (highly stressed)
 */
function calculateScore(wpm, fluencyLevel, stressScore) {
  let totalScore = 0;
  let normalizer = 0;

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

export default function InterviewSessionDetailModal({ sessionId, onClose }) {
  const {
    data: session,
    isLoading,
    isError,
  } = useGetInterviewSessionDetailQuery(sessionId);

  // Calculate scores for questions (use backend score if available, otherwise calculate)
  const questionsWithScores = useMemo(() => {
    if (!session?.questions) return [];
    return session.questions.map(q => ({
      ...q,
      calculatedScore:
        q.score ?? calculateScore(q.wpm, q.fluency_level, q.stress_score),
    }));
  }, [session?.questions]);

  // Calculate average score
  const averageScore = useMemo(() => {
    // Use backend average if available
    if (session?.average_score != null) return session.average_score;

    // Otherwise calculate from questions
    const scores = questionsWithScores
      .map(q => q.calculatedScore)
      .filter(s => s != null);
    if (scores.length === 0) return null;
    return (
      Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
    );
  }, [session?.average_score, questionsWithScores]);

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col mx-4">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">{t`Interview Session Details`}</h2>
            {session && (
              <p className="text-sm text-fuchsia-100 mt-0.5">
                {formatDate(session.started_at)}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-fuchsia-200 border-t-fuchsia-600 rounded-full animate-spin" />
            </div>
          )}

          {isError && (
            <div className="text-center py-12 text-red-500">
              <p>{t`Failed to load session details`}</p>
            </div>
          )}

          {session && (
            <>
              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-blue-600 mb-1">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-xs font-medium">{t`Questions`}</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">
                    {session.questions_count || questionsWithScores.length || 0}
                  </p>
                </div>

                <div className={`rounded-xl p-4 ${getScoreBg(averageScore)}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Star
                      className={`w-4 h-4 ${getScoreColor(averageScore)}`}
                    />
                    <span
                      className={`text-xs font-medium ${getScoreColor(averageScore)}`}
                    >{t`Avg Score`}</span>
                  </div>
                  <p
                    className={`text-2xl font-bold ${getScoreColor(averageScore)}`}
                  >
                    {formatScore(averageScore)}/10
                  </p>
                  {averageScore != null && (
                    <p
                      className={`text-xs font-medium ${getScoreColor(averageScore)}`}
                    >
                      {getScoreLabel(averageScore)}
                    </p>
                  )}
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-green-600 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-medium">{t`Started`}</span>
                  </div>
                  <p className="text-sm font-semibold text-green-700">
                    {formatDate(session.started_at)}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-purple-600 mb-1">
                    <Activity className="w-4 h-4" />
                    <span className="text-xs font-medium">{t`Ended`}</span>
                  </div>
                  <p className="text-sm font-semibold text-purple-700">
                    {formatDate(session.ended_at)}
                  </p>
                </div>
              </div>

              {/* Score Scale Legend */}
              <div className="bg-gray-50 rounded-lg p-3 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-gray-500" />
                  <span className="text-xs font-medium text-gray-600">{t`Score Scale`}</span>
                </div>
                <div className="flex gap-1">
                  <div
                    className="flex-1 h-2 rounded-l bg-red-400"
                    title="0-4: Needs Improvement"
                  />
                  <div
                    className="flex-1 h-2 bg-orange-400"
                    title="4-5: Below Average"
                  />
                  <div
                    className="flex-1 h-2 bg-yellow-400"
                    title="5-6: Average"
                  />
                  <div className="flex-1 h-2 bg-lime-400" title="6-7: Fair" />
                  <div className="flex-1 h-2 bg-green-400" title="7-8: Good" />
                  <div
                    className="flex-1 h-2 rounded-r bg-emerald-500"
                    title="8-10: Excellent"
                  />
                </div>
                <div className="flex justify-between text-[9px] text-gray-400 mt-1">
                  <span>0</span>
                  <span>4</span>
                  <span>6</span>
                  <span>8</span>
                  <span>10</span>
                </div>
                <p className="text-[10px] text-gray-500 mt-2">
                  {t`Score is calculated from: Fluency Level (40%) • Speaking Speed (30%) • Stress Level (30%)`}
                </p>
              </div>

              {/* Questions List */}
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-fuchsia-600" />
                {t`Questions & Answers`}
              </h3>

              <div className="space-y-4">
                {questionsWithScores.map((q, index) => (
                  <div
                    key={q.id || index}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-100"
                  >
                    {/* Question */}
                    <div className="mb-3">
                      <div className="flex items-start gap-2">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-fuchsia-600 text-white text-xs font-bold flex items-center justify-center">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-gray-700 mb-1">
                              {t`Question`}
                            </p>
                            {/* Question Score Badge */}
                            {q.calculatedScore != null && (
                              <div
                                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getScoreBg(q.calculatedScore)} ${getScoreColor(q.calculatedScore)}`}
                              >
                                <Star className="w-3.5 h-3.5" />
                                {formatScore(q.calculatedScore)}/10
                              </div>
                            )}
                          </div>
                          <p className="text-gray-800">{q.question_text}</p>
                        </div>
                      </div>
                    </div>

                    {/* Answer */}
                    {q.answer_text && (
                      <div className="ml-8 mb-3 p-3 bg-white rounded-lg border border-gray-200">
                        <p className="text-sm font-semibold text-gray-500 mb-1">
                          {t`Your Answer`}
                        </p>
                        <p className="text-gray-700 text-sm">{q.answer_text}</p>
                      </div>
                    )}

                    {/* Metrics */}
                    {q.answer_text && (
                      <div className="ml-8 flex flex-wrap gap-3">
                        {q.wpm !== null && q.wpm !== undefined && (
                          <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-600">
                            <Mic className="w-3.5 h-3.5" />
                            {Math.round(q.wpm)} WPM
                          </div>
                        )}

                        {q.fluency_level && (
                          <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-600">
                            <Brain className="w-3.5 h-3.5" />
                            {q.fluency_level}
                          </div>
                        )}

                        {q.dominant_emotion && (
                          <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-pink-100 text-pink-600">
                            <Heart className="w-3.5 h-3.5" />
                            {q.dominant_emotion}
                          </div>
                        )}

                        {q.stress_score != null && (
                          <div
                            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                              q.stress_score <= 0.3
                                ? "bg-green-100 text-green-600"
                                : q.stress_score <= 0.6
                                  ? "bg-yellow-100 text-yellow-600"
                                  : "bg-red-100 text-red-600"
                            }`}
                          >
                            <Activity className="w-3.5 h-3.5" />
                            {t`Stress:`} {(q.stress_score * 100).toFixed(0)}%
                          </div>
                        )}
                      </div>
                    )}

                    {/* Evaluation */}
                    {q.evaluation && (
                      <div className="ml-8 mt-3 p-3 bg-gradient-to-r from-fuchsia-50 to-purple-50 rounded-lg border border-fuchsia-100">
                        <p className="text-sm font-semibold text-fuchsia-700 mb-1">
                          {t`AI Feedback`}
                        </p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {typeof q.evaluation === "string"
                            ? q.evaluation
                            : JSON.stringify(q.evaluation, null, 2)}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-semibold rounded-xl transition-colors"
          >
            {t`Close`}
          </button>
        </div>
      </div>
    </div>
  );
}
