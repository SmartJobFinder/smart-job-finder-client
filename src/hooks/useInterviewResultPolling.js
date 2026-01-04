import { useState, useEffect, useRef } from "react";
import { useLazyGetAnswerResultQuery } from "@/services/aiInterviewService";

/**
 * Custom hook to poll for AI interview answer results
 * @param {Object} params
 * @param {number} params.jobId - Job posting ID
 * @param {string} params.sessionId - Interview session ID
 * @param {string} params.aiJobId - AI job ID from answer response
 * @param {boolean} params.enabled - Enable/disable polling
 * @returns {Object} { result, error, isPolling, isFetching }
 */
export function useInterviewResultPolling({
  jobId,
  sessionId,
  aiJobId,
  enabled = true,
}) {
  const [trigger, { data, error, isFetching }] =
    useLazyGetAnswerResultQuery();
  const [isPolling, setIsPolling] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Don't poll if not enabled or missing required params
    if (!enabled || !jobId || !sessionId || !aiJobId) {
      setIsPolling(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    setIsPolling(true);

    // Immediate first call
    trigger({ jobId, sessionId, aiJobId });

    // Then poll every 5 seconds
    intervalRef.current = setInterval(() => {
      trigger({ jobId, sessionId, aiJobId });
    }, 5000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsPolling(false);
    };
  }, [jobId, sessionId, aiJobId, enabled, trigger]);

  // Auto-stop when result received
  useEffect(() => {
    if (data && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsPolling(false);
    }
  }, [data]);

  return {
    result: data,
    error,
    isPolling, // ✅ FIX: Return actual polling state, not just during fetch
    isFetching,
  };
}
