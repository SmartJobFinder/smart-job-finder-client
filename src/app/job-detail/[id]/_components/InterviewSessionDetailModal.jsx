"use client";

import React from "react";
import {
  X,
  Calendar,
  MessageSquare,
  Activity,
  Mic,
  Heart,
  Brain,
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

export default function InterviewSessionDetailModal({ sessionId, onClose }) {
  const {
    data: session,
    isLoading,
    isError,
  } = useGetInterviewSessionDetailQuery(sessionId);

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const questions = session?.questions || [];

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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-blue-600 mb-1">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-xs font-medium">{t`Questions`}</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">
                    {session.questions_count || questions.length || 0}
                  </p>
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

              {/* Questions List */}
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-fuchsia-600" />
                {t`Questions & Answers`}
              </h3>

              <div className="space-y-4">
                {questions.map((q, index) => (
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
                          <p className="text-sm font-semibold text-gray-700 mb-1">
                            {t`Question`}
                          </p>
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
                            {t`Stress:`} {Number(q.stress_score).toFixed(4)}
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
