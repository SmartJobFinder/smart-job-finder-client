"use client";

import { useState } from "react";
import { t } from "@/i18n/i18n";
import { useGetInterviewHistoryQuery } from "@/services/aiInterviewService";
import InterviewSessionDetailModal from "@/app/job-detail/[id]/_components/InterviewSessionDetailModal";
import LoadingScreen from "@/components/ui/loadingScreen";
import {
  Mic,
  Calendar,
  MessageSquare,
  ChevronRight,
} from "lucide-react";

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

export default function AIPracticeHistoryPage() {
  const {
    data: history,
    isLoading,
    isError,
  } = useGetInterviewHistoryQuery({ limit: 50 });
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  const sessions = history || [];

  if (isLoading)
    return <LoadingScreen message={t`Loading AI practice history...`} />;

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

                {/* Arrow */}
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition" />
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
