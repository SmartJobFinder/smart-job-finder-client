"use client";

import React, { useState } from "react";
import { History, Calendar, MessageSquare, Star, ChevronDown, ChevronUp, Eye } from "lucide-react";
import { useGetInterviewHistoryQuery } from "@/services/aiInterviewService";
import { t } from "@/i18n/i18n";
import InterviewSessionDetailModal from "./InterviewSessionDetailModal";

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

export default function InterviewHistoryCard({ jobId, isLoggedIn }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  const { data: history, isLoading, isError } = useGetInterviewHistoryQuery(
    { jobId, limit: 5 },
    { skip: !isLoggedIn || !jobId }
  );

  if (!isLoggedIn) return null;

  const sessions = history || [];
  const hasHistory = sessions.length > 0;

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center gap-2 text-gray-500">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">{t`Loading interview history...`}</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return null;
  }

  if (!hasHistory) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 text-gray-500">
          <History className="w-5 h-5" />
          <span className="text-sm font-medium">{t`No interview history yet`}</span>
        </div>
        <p className="text-xs text-gray-400 mt-1 ml-7">
          {t`Start an AI Interview to see your history here`}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-3 flex items-center justify-between bg-gradient-to-r from-fuchsia-50 to-purple-50 hover:from-fuchsia-100 hover:to-purple-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-fuchsia-600" />
            <span className="font-semibold text-gray-800">{t`Interview History`}</span>
            <span className="text-xs font-bold bg-fuchsia-100 text-fuchsia-700 px-2 py-0.5 rounded-full">
              {sessions.length}
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>

        {/* Session List */}
        {isExpanded && (
          <div className="divide-y divide-gray-100">
            {sessions.map((session, index) => (
              <div
                key={session.session_id || index}
                className="px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{formatDate(session.started_at)}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <div className="flex items-center gap-1 text-gray-500">
                        <MessageSquare className="w-4 h-4" />
                        <span>{session.questions_count || 0} {t`questions`}</span>
                      </div>
                      
                      {session.average_score !== null && session.average_score !== undefined && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-semibold text-yellow-600">
                            {formatScore(session.average_score)}/10
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedSessionId(session.session_id)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-fuchsia-600 bg-fuchsia-50 hover:bg-fuchsia-100 rounded-lg transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {t`Details`}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedSessionId && (
        <InterviewSessionDetailModal
          sessionId={selectedSessionId}
          onClose={() => setSelectedSessionId(null)}
        />
      )}
    </>
  );
}
