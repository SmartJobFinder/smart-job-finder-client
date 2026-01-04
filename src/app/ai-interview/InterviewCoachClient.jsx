"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import JobHeaderCard from "./components/JobHeaderCard";
import QuestionCard from "./components/QuestionCard";
import RecordAnswerCard from "./components/RecordAnswerCard";
import TranscriptCard from "./components/TranscriptCard";
import EvaluationCard from "./components/EvaluationCard";
import NextQuestionBar from "./components/NextQuestionBar";

// RTK Query
import { useGetJobByIdQuery } from "@/services/jobService";
import {
  useStartInterviewMutation,
  useAnswerInterviewMutation,
} from "@/services/aiInterviewService";
import { useInterviewResultPolling } from "@/hooks/useInterviewResultPolling";
import { t } from "@/i18n/i18n";

export default function InterviewCoachClient() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");

  // ========= JOB DATA =========
  const {
    data: jobRes,
    isLoading: jobLoading,
    isError: jobIsError,
    error: jobError,
  } = useGetJobByIdQuery(jobId, { skip: !jobId });

  const job = useMemo(() => {
    const j = jobRes || {};
    return {
      title: j.title || j.jobTitle || "—",
      company: j.company?.company_name || j.companyName || "—",
      location: j.location || "—",
      level: Array.isArray(j.level_names)
        ? j.level_names.join(", ")
        : j.level || "—",
      description: j.description || "",
      requirements: j.requirements || "",
    };
  }, [jobRes]);

  // ========= INTERVIEW SESSION =========
  const [sessionId, setSessionId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [aiQuestionAudioUrl, setAiQuestionAudioUrl] = useState(null);

  // ========= UI STATE =========
  const [showQuestionScript, setShowQuestionScript] = useState(false); // Mặc định ẩn script
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [isQuestionPlaying, setIsQuestionPlaying] = useState(false);
  const [isManualPlay, setIsManualPlay] = useState(false); // Track xem có phải user bấm play không
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedSeconds, setRecordedSeconds] = useState(0);

  // ========= POLLING STATE =========
  const [aiJobId, setAiJobId] = useState(null); // From answer response
  const [pollingEnabled, setPollingEnabled] = useState(false);

  const questionAudioRef = useRef(null);

  // ========= MEDIA RECORDER =========
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const recordingTimerRef = useRef(null);

  // ========= RTK MUTATIONS =========
  const [startInterview, { isLoading: starting }] = useStartInterviewMutation();
  const [answerInterview, { isLoading: submitting }] =
    useAnswerInterviewMutation();

  // ========= POLLING HOOK =========
  const {
    result,
    error: pollingError,
    isPolling,
  } = useInterviewResultPolling({
    jobId: jobId ? Number(jobId) : null,
    sessionId,
    aiJobId,
    enabled: pollingEnabled,
  });

  // ========= HELPERS =========
  const handleToggleQuestionScript = () => setShowQuestionScript(p => !p);

  const safePlay = useCallback(url => {
    if (!url) return;
    if (!questionAudioRef.current) return;

    // Auto-play - không phải manual play
    setIsManualPlay(false);
    // set src in QuestionCard already, but ensure play works
    setTimeout(() => {
      const a = questionAudioRef.current;
      if (!a) return;
      a.currentTime = 0;
      a.play().catch(() => {});
    }, 50);
  }, []);

  const handlePlayQuestion = () => {
    if (questionAudioRef.current && aiQuestionAudioUrl) {
      // Manual play - user bấm nút Play
      setIsManualPlay(true);
      questionAudioRef.current.currentTime = 0;
      questionAudioRef.current.play().catch(() => {});
    }
  };

  // ========= START INTERVIEW =========
  const handleStart = useCallback(async () => {
    if (!jobId) return;

    // reset UI
    setTranscript("");
    setFeedback(null);
    setShowQuestionScript(false); // Mặc định ẩn script
    setIsManualPlay(false); // Reset manual play flag
    setRecordedSeconds(0);

    // reset session
    setSessionId(null);
    setCurrentQuestion("");
    setAiQuestionAudioUrl(null);

    try {
      const data = await startInterview(jobId).unwrap();

      const sid = data.sessionId ?? data.session_id;
      const qText = data.questionText ?? data.question_text;
      const aUrl = data.audioUrl ?? data.audio_url;

      setSessionId(sid);
      setCurrentQuestion(qText || "");
      setAiQuestionAudioUrl(aUrl || null);

      safePlay(aUrl);
    } catch (e) {
      console.error(e);
      alert(t`Start interview failed. Check Network/Backend logs.`);
    }
  }, [jobId, startInterview, safePlay]);

  // ========= HANDLE POLLING RESULT =========
  useEffect(() => {
    if (!result) return;

    console.log("Polling result received:", result);

    // Stop polling
    setPollingEnabled(false);

    // Extract data (handle both snake_case and camelCase from backend)
    const ansText = result.answer_text ?? result.answerText ?? "";

    const evalObj = {
      evaluation: result.evaluation ?? "",
      wpm: result.wpm ?? null,
      emotion_summary: result.emotion_summary ?? result.emotionSummary ?? "",
      dominant_emotion: result.dominant_emotion ?? result.dominantEmotion ?? "",
      stress_score: result.stress_score ?? result.stressScore ?? null,
      fluency_summary: result.fluency_summary ?? result.fluencySummary ?? "",
      fluency_level: result.fluency_level ?? result.fluencyLevel ?? "",
    };

    setTranscript(ansText);
    setFeedback(evalObj);

    // Next question
    const nextQ = result.next_question_text ?? result.nextQuestionText ?? "";
    const nextAudio =
      result.next_question_audio_url ?? result.nextQuestionAudioUrl ?? null;

    setCurrentQuestion(nextQ || "");
    setAiQuestionAudioUrl(nextAudio || null);
    setShowQuestionScript(false);
    safePlay(nextAudio);

    // Reset for next answer
    setAiJobId(null);
  }, [result, safePlay]);

  // ========= STOP ALL MIC =========
  const stopMic = useCallback(() => {
    try {
      streamRef.current?.getTracks()?.forEach(t => t.stop());
    } catch {}
    streamRef.current = null;
  }, []);

  // ========= START RECORDING =========
  const startRecording = useCallback(async () => {
    try {
      // clear previous
      chunksRef.current = [];
      setRecordingSeconds(0);
      setRecordedSeconds(0);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      streamRef.current = stream;

      // choose best mime
      let mimeType = "";
      if (window.MediaRecorder?.isTypeSupported?.("audio/webm;codecs=opus")) {
        mimeType = "audio/webm;codecs=opus";
      } else if (window.MediaRecorder?.isTypeSupported?.("audio/webm")) {
        mimeType = "audio/webm";
      } else if (window.MediaRecorder?.isTypeSupported?.("audio/mp4")) {
        mimeType = "audio/mp4";
      }

      const recorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined
      );
      recorderRef.current = recorder;

      recorder.ondataavailable = e => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.start();
      setIsRecording(true);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(s => s + 1);
      }, 1000);

      // reset output for new answer
      setTranscript("");
      setFeedback(null);
    } catch (e) {
      console.error(e);
      alert("Không mở được mic. Bạn kiểm tra quyền microphone nha.");
    }
  }, []);

  // ========= STOP RECORDING + SUBMIT =========
  const stopRecordingAndSubmit = useCallback(async () => {
    const recorder = recorderRef.current;
    if (!recorder) return;

    setIsRecording(false);
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);

    // Capture elapsed time immediately so UI can show even while submitting
    const spentSeconds = recordingSeconds || recordedSeconds || 0;
    setRecordedSeconds(spentSeconds);
    setRecordingSeconds(0);

    const blob = await new Promise(resolve => {
      recorder.onstop = () => {
        // ✅ FIX: Force audio/webm type for Blob (not video/webm)
        const mimeType = recorder.mimeType?.includes("mp4")
          ? "audio/mp4"
          : "audio/webm";
        const b = new Blob(chunksRef.current, {
          type: mimeType,
        });
        resolve(b);
      };
      recorder.stop();
    });

    recorderRef.current = null;
    stopMic();

    try {
      if (!jobId || !sessionId || !currentQuestion) {
        throw new Error(
          t`Missing jobId/sessionId/question. Please click Start again.`
        );
      }

      const fd = new FormData();
      fd.append("jobId", String(jobId));
      fd.append("session_id", sessionId);
      fd.append("question_text", currentQuestion);
      fd.append("language", "en");

      // file name + ext
      const ext = blob.type.includes("mp4") ? "mp4" : "webm";
      const file = new File([blob], `answer.${ext}`, {
        type: blob.type, // Blob already has correct audio/* type
      });
      fd.append("file", file);

      const data = await answerInterview(fd).unwrap();

      console.log("Full answer response:", data);
      console.log("Response keys:", Object.keys(data || {}));

      const receivedAiJobId = data.jobId || data.job_id || data.id;
      const status = data.status;

      console.log("Answer enqueued:", { receivedAiJobId, status, data });

      if (!receivedAiJobId) {
        console.warn("No jobId received from backend! Polling won't work.");
        alert("Server returned but no jobId. Check console for details.");
        return;
      }

      // ✅ Start polling
      setAiJobId(receivedAiJobId);
      setPollingEnabled(true);

      // Clear previous result
      setTranscript("");
      setFeedback(null);
    } catch (e) {
      console.error(e);
      alert(
        `Submit answer failed: ${e?.data || e?.message || "unknown error"}`
      );
    }
  }, [
    answerInterview,
    currentQuestion,
    jobId,
    sessionId,
    safePlay,
    stopMic,
    recordingSeconds,
    recordedSeconds,
  ]);

  // ========= TOGGLE RECORD =========
  const handleToggleRecording = useCallback(async () => {
    if (!sessionId) {
      alert("Bấm Start interview trước đã bro.");
      return;
    }

    // ✅ Disable if polling
    if (submitting || isPolling) return;

    if (!isRecording) {
      await startRecording();
    } else {
      await stopRecordingAndSubmit();
    }
  }, [
    isRecording,
    sessionId,
    startRecording,
    stopRecordingAndSubmit,
    submitting,
    isPolling,
  ]);

  // ========= PLAY QUESTION AUDIO EVENTS =========
  useEffect(() => {
    const a = questionAudioRef.current;
    if (!a) return;

    const onPlay = () => setIsQuestionPlaying(true);
    const onPause = () => {
      setIsQuestionPlaying(false);
      setIsManualPlay(false); // Reset manual play flag khi pause
    };
    const onEnded = () => {
      setIsQuestionPlaying(false);
      setIsManualPlay(false); // Reset manual play flag khi ended
    };

    a.addEventListener("play", onPlay);
    a.addEventListener("playing", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onEnded);

    return () => {
      a.removeEventListener("play", onPlay);
      a.removeEventListener("playing", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onEnded);
    };
  }, [aiQuestionAudioUrl]); // đổi url thì re-bind

  // ========= NEXT BUTTON =========
  // Với AI flow: “Next” không cần tăng index; next question sẽ có sau khi submit answer.
  const handleNextQuestion = () => {
    handlePlayQuestion();
  };

  // cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        recorderRef.current?.stop?.();
      } catch {}
      stopMic();
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [stopMic]);

  // ========= RENDER =========
  return (
    <div className="max-w-5xl mx-auto my-6 space-y-6">
      {/* Job header */}
      {jobLoading ? (
        <div className="text-sm text-gray-500">{t`Loading job...`}</div>
      ) : jobIsError ? (
        <div className="text-sm text-red-600">
          {t`Load job failed`}:{" "}
          {String(jobError?.data || jobError?.message || jobError)}
        </div>
      ) : (
        <JobHeaderCard job={job} isRecording={isRecording} />
      )}

      {/* BEFORE START: only show Start panel */}
      {!sessionId && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col items-center gap-4">
          <p className="text-sm text-gray-600 text-center max-w-xl">
            {t`Click Start interview to have AI generate the first question for this job. Then record your answer, and AI will score it, provide feedback, and give you the next question.`}
          </p>

          <button
            type="button"
            onClick={handleStart}
            disabled={!jobId || jobLoading || starting}
            className="px-6 py-3 rounded-lg text-sm font-semibold text-white
                       bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500
                       hover:from-indigo-500 hover:via-blue-600 hover:to-cyan-500
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition transform hover:scale-[1.02]"
          >
            {starting ? t`Starting interview...` : t`Start interview`}
          </button>

          {starting && (
            <div className="flex items-center gap-2 text-xs text-indigo-600 font-semibold">
              <span className="h-3 w-3 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
              <span>{t`Preparing your interview…`}</span>
            </div>
          )}
        </div>
      )}

      {/* AFTER START: show interview UI */}
      {sessionId && (
        <>
          {/* ✅ MOVED: Loading indicator at TOP for visibility */}
          {(submitting || isPolling) && (
            <div className="sticky top-0 z-50 mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-5 shadow-lg animate-pulse">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-md">
                    <div className="h-7 w-7 rounded-full border-3 border-white border-t-transparent animate-spin" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-400 rounded-full border-2 border-white animate-ping" />
                </div>
                <div className="flex-1">
                  <p className="text-lg font-bold text-blue-900 mb-2">
                    {submitting
                      ? t`Uploading your answer...`
                      : t`AI is analyzing your answer...`}
                  </p>

                  {/* Progress Steps */}
                  <div className="space-y-2 bg-white/50 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-4 w-4 rounded-full flex items-center justify-center ${submitting ? "bg-blue-500" : "bg-green-500"}`}
                      >
                        {!submitting && (
                          <span className="text-white text-xs">✓</span>
                        )}
                        {submitting && (
                          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                        )}
                      </div>
                      <span
                        className={`text-sm ${submitting ? "text-blue-700 font-bold" : "text-green-700"}`}
                      >
                        {submitting
                          ? t`Uploading audio...`
                          : t`Audio uploaded ✓`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-4 w-4 rounded-full flex items-center justify-center ${isPolling ? "bg-blue-500" : "bg-gray-300"}`}
                      >
                        {isPolling && (
                          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                        )}
                      </div>
                      <span
                        className={`text-sm ${isPolling ? "text-blue-700 font-bold" : "text-gray-400"}`}
                      >
                        {t`Speech-to-text & Emotion analysis`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-4 w-4 rounded-full flex items-center justify-center ${isPolling ? "bg-indigo-500" : "bg-gray-300"}`}
                      >
                        {isPolling && (
                          <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                        )}
                      </div>
                      <span
                        className={`text-sm ${isPolling ? "text-indigo-700 font-bold" : "text-gray-400"}`}
                      >
                        {t`AI evaluation & feedback generation`}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-blue-600 mt-3 flex items-center gap-2 font-medium">
                    <svg
                      className="w-5 h-5 animate-spin"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {t`Please wait 15-45 seconds...`}
                  </p>
                </div>
              </div>
            </div>
          )}

          <QuestionCard
            currentQuestion={currentQuestion || t`Loading question...`}
            showQuestionScript={showQuestionScript}
            onToggleScript={handleToggleQuestionScript}
            onPlay={handlePlayQuestion}
            aiQuestionAudioUrl={aiQuestionAudioUrl}
            questionAudioRef={questionAudioRef}
            isPlaying={isQuestionPlaying}
            isManualPlay={isManualPlay}
            status={
              submitting ? "submitting" : isPolling ? "analyzing" : "ready"
            }
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <RecordAnswerCard
                isRecording={isRecording}
                recordingSeconds={recordingSeconds}
                recordedSeconds={recordedSeconds}
                onToggleRecording={handleToggleRecording}
                disabled={submitting || isPolling}
                loading={submitting || isPolling}
              />

              {/* ✅ NEW: Error indicator */}
              {pollingError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-red-900">{t`Processing failed`}</p>
                  <p className="text-xs text-red-600 mt-1">
                    {pollingError?.data?.message ||
                      pollingError?.message ||
                      t`Unknown error`}
                  </p>
                </div>
              )}
              <TranscriptCard
                transcript={transcript}
                wpm={feedback?.wpm}
                fluencyLevel={feedback?.fluency_level}
              />
            </div>

            <div className="space-y-4">
              <EvaluationCard feedback={feedback} />
              <NextQuestionBar
                feedbackReady={!!feedback}
                isLastQuestion={false}
                onNext={handleNextQuestion}
                nextLabel="Replay question"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
