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

    const questionAudioRef = useRef(null);

    // ========= MEDIA RECORDER =========
    const streamRef = useRef(null);
    const recorderRef = useRef(null);
    const chunksRef = useRef([]);
    const recordingTimerRef = useRef(null);

    // ========= RTK MUTATIONS =========
    const [startInterview, { isLoading: starting }] =
        useStartInterviewMutation();
    const [answerInterview, { isLoading: submitting }] =
        useAnswerInterviewMutation();

    // ========= HELPERS =========
    const handleToggleQuestionScript = () => setShowQuestionScript((p) => !p);

    const safePlay = useCallback((url) => {
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
            alert("Start interview failed. Check Network/Backend logs.");
        }
    }, [jobId, startInterview, safePlay]);

    // ========= STOP ALL MIC =========
    const stopMic = useCallback(() => {
        try {
            streamRef.current?.getTracks()?.forEach((t) => t.stop());
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
            if (
                window.MediaRecorder?.isTypeSupported?.(
                    "audio/webm;codecs=opus"
                )
            ) {
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

            recorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
            };

            recorder.start();
            setIsRecording(true);
            if (recordingTimerRef.current)
                clearInterval(recordingTimerRef.current);
            recordingTimerRef.current = setInterval(() => {
                setRecordingSeconds((s) => s + 1);
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

        const blob = await new Promise((resolve) => {
            recorder.onstop = () => {
                const b = new Blob(chunksRef.current, {
                    type: recorder.mimeType || "audio/webm",
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
                    "Thiếu jobId/sessionId/question. Bấm Start lại giúp mình."
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
                type: blob.type || "audio/webm",
            });
            fd.append("file", file);

            const data = await answerInterview(fd).unwrap();

            const ansText = data.answer_text ?? data.answerText ?? "";

            const evalObj = data
                ? {
                      evaluation: data.evaluation ?? "",
                      wpm: data.wpm ?? null,
                      emotion_summary: data.emotion_summary ?? "",
                      dominant_emotion: data.dominant_emotion ?? "",
                      stress_score: data.stress_score ?? null,
                      fluency_summary: data.fluency_summary ?? "",
                      fluency_level: data.fluency_level ?? "",
                  }
                : null;

            setTranscript(ansText);
            setFeedback(evalObj);

            // next question
            const nextQ =
                data.next_question_text ?? data.nextQuestionText ?? "";
            const nextAudio =
                data.next_question_audio_url ??
                data.nextQuestionAudioUrl ??
                null;

            setCurrentQuestion(nextQ || "");
            setAiQuestionAudioUrl(nextAudio || null);
            setShowQuestionScript(false); // Mặc định ẩn script cho next question
            safePlay(nextAudio);
        } catch (e) {
            console.error(e);
            alert(
                `Submit answer failed: ${
                    e?.data || e?.message || "unknown error"
                }`
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

        if (submitting) return;

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
            if (recordingTimerRef.current)
                clearInterval(recordingTimerRef.current);
        };
    }, [stopMic]);

    // ========= RENDER =========
    return (
        <div className="max-w-5xl mx-auto my-6 space-y-6">
            {/* Job header */}
            {jobLoading ? (
                <div className="text-sm text-gray-500">Loading job...</div>
            ) : jobIsError ? (
                <div className="text-sm text-red-600">
                    Load job failed:{" "}
                    {String(jobError?.data || jobError?.message || jobError)}
                </div>
            ) : (
                <JobHeaderCard job={job} isRecording={isRecording} />
            )}

            {/* BEFORE START: only show Start panel */}
            {!sessionId && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col items-center gap-4">
                    <p className="text-sm text-gray-600 text-center max-w-xl">
                        Bấm <b>Start interview</b> để AI tạo câu hỏi đầu tiên
                        cho công việc này. Sau đó bạn thu âm câu trả lời, AI sẽ
                        chấm điểm + feedback và đưa câu hỏi tiếp theo.
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
                        {starting ? "Starting interview..." : "Start interview"}
                    </button>
                </div>
            )}

            {/* AFTER START: show interview UI */}
            {sessionId && (
                <>
                    <QuestionCard
                        currentQuestion={
                            currentQuestion || "Loading question..."
                        }
                        showQuestionScript={showQuestionScript}
                        onToggleScript={handleToggleQuestionScript}
                        onPlay={handlePlayQuestion}
                        aiQuestionAudioUrl={aiQuestionAudioUrl}
                        questionAudioRef={questionAudioRef}
                        isPlaying={isQuestionPlaying}
                        isManualPlay={isManualPlay}
                    />

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div className="space-y-4">
                            <RecordAnswerCard
                                isRecording={isRecording}
                                recordingSeconds={recordingSeconds}
                                recordedSeconds={recordedSeconds}
                                onToggleRecording={handleToggleRecording}
                                disabled={submitting}
                                loading={submitting}
                            />
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

