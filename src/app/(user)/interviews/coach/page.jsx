"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { t } from "@/i18n/i18n";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mic,
  MicOff,
  Volume2,
  Loader2,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  FileText,
  Sparkles,
} from "lucide-react";
// Use real API for jobs
import { useGetJobsQuery } from "@/services/jobService";
// Use real API for skills
import { useGetAllSkillsQuery } from "@/services/filterService";
// Import mock data for AI Interview responses
import {
  mockQuestionsBySkill,
  mockQuestionsByJob,
  mockEvaluation,
  mockAudioAnalysis,
  mockTranscript,
  getQuestionForJob,
  mockAudioUrls,
} from "@/mock/data/aiInterviewCoach";
// AI Interview services (will use mock for now)
import {
  generateInterviewQuestion,
  transcribeAudio,
  analyzeAudio,
  evaluateAnswer,
  generateSpeech,
} from "@/services/aiInterviewCoachService";
import { toast } from "react-toastify";
import LoadingScreen from "@/components/ui/loadingScreen";

export default function AICoachPage() {
  // State management
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [mode, setMode] = useState("job"); // "job" or "skill"

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionAudioUrl, setQuestionAudioUrl] = useState(null);
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);

  const [transcript, setTranscript] = useState(null);
  const [audioAnalysis, setAudioAnalysis] = useState(null);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const [evaluation, setEvaluation] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedbackAudioUrl, setFeedbackAudioUrl] = useState(null);

  const [sessionHistory, setSessionHistory] = useState([]);
  const [useMockData] = useState(true); // Toggle này để bật/tắt mock data cho AI Interview

  // Refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioRef = useRef(null);
  const feedbackAudioRef = useRef(null);

  // Fetch jobs from real API
  const { data: jobsData, isLoading: isLoadingJobs } = useGetJobsQuery({
    page: 0,
    size: 10000, // Lấy tối đa 10000 jobs trong 1 lần
    sort: "id,asc",
  });
  const jobs = useMemo(() => {
    if (Array.isArray(jobsData)) return jobsData;
    if (Array.isArray(jobsData?.jobs)) return jobsData.jobs;
    if (Array.isArray(jobsData?.content)) return jobsData.content;
    return [];
  }, [jobsData]);

  // Normalize job data for display
  const normalizedJobs = useMemo(() => {
    return jobs.map(job => ({
      id: job.id,
      jobTitle: job.jobTitle || job.title || t`Untitled Job`,
      companyName:
        job.companyName || job.company?.company_name || t`Unknown Company`,
    }));
  }, [jobs]);

  // Fetch skills from real API
  const { data: skillsData, isLoading: isLoadingSkills } = useGetAllSkillsQuery(
    {
      page: 0,
      size: 10000,
      sort: "id,asc",
    }
  );
  const skills = useMemo(() => {
    if (!skillsData) return [];
    // Handle both array and paginated response
    if (Array.isArray(skillsData)) {
      return skillsData.map(skill => ({
        id: skill.id || skill.skillId,
        name: skill.name || skill.skillName || skill,
      }));
    }
    if (Array.isArray(skillsData?.content)) {
      return skillsData.content.map(skill => ({
        id: skill.id || skill.skillId,
        name: skill.name || skill.skillName || skill,
      }));
    }
    return [];
  }, [skillsData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current?.state !== "inactive") {
        mediaRecorderRef.current?.stop();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Generate question when job/skill is selected
  const handleGenerateQuestion = async () => {
    if (mode === "job" && !selectedJobId) {
      toast.error("Please select a job");
      return;
    }
    if (mode === "skill" && !selectedSkill) {
      toast.error("Please select a skill");
      return;
    }

    setIsGeneratingQuestion(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      let result;

      if (useMockData) {
        if (mode === "job") {
          const selectedJob = normalizedJobs.find(j => j.id === selectedJobId);
          const question = selectedJob
            ? getQuestionForJob(selectedJob.jobTitle)
            : mockQuestionsByJob.default;
          result = {
            question: question || mockQuestionsByJob.default,
            audioUrl: mockAudioUrls?.question || null,
          };
        } else {
          const question =
            mockQuestionsBySkill[selectedSkill] ||
            `Tell me about your experience with ${selectedSkill}. What challenges have you faced while working with this technology?`;
          result = {
            question: question || "Tell me about yourself.",
            audioUrl: mockAudioUrls?.question || null,
          };
        }
      } else {
        // Real API call (when available)
        result = await generateInterviewQuestion({
          jobId: mode === "job" ? selectedJobId : null,
          skill: mode === "skill" ? selectedSkill : null,
        });
      }

      if (!result || !result.question) {
        throw new Error("Failed to generate question: No result returned");
      }

      setCurrentQuestion(result.question);
      if (result.audioUrl) {
        setQuestionAudioUrl(result.audioUrl);
      }
      setEvaluation(null);
      setTranscript(null);
      setRecordedAudio(null);
      setAudioBlob(null);
      toast.success("Question generated successfully");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to generate question"
      );
      console.error("Generate question error:", error);
    } finally {
      setIsGeneratingQuestion(false);
    }
  };

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioUrl);
        setAudioBlob(audioBlob);

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      toast.success("Recording started");
    } catch (error) {
      toast.error("Failed to access microphone");
      console.error("Recording error:", error);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      toast.success("Recording stopped");
    }
  };

  // Process answer (transcribe + analyze + evaluate)
  const handleProcessAnswer = async () => {
    if (!audioBlob && !useMockData) {
      toast.error("No audio recorded");
      return;
    }

    setIsTranscribing(true);
    setIsEvaluating(true);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      let transcriptResult, audioAnalysisResult, evaluationResult;

      if (useMockData) {
        // Use mock data for AI Interview responses
        transcriptResult = {
          transcript: mockTranscript,
          normalizedTranscript: mockTranscript,
        };
        audioAnalysisResult = mockAudioAnalysis;
        evaluationResult = mockEvaluation;
        setFeedbackAudioUrl(mockAudioUrls.feedback); // Thêm mock audio URL cho feedback
      } else {
        // Real API calls (when available)
        // Step 1: Transcribe audio
        transcriptResult = await transcribeAudio(audioBlob);

        // Step 2: Analyze audio parameters
        audioAnalysisResult = await analyzeAudio(audioBlob);

        // Step 3: Evaluate answer with LLM
        evaluationResult = await evaluateAnswer({
          question: currentQuestion,
          answer:
            transcriptResult.normalizedTranscript ||
            transcriptResult.transcript,
          jobId: mode === "job" ? selectedJobId : null,
          skill: mode === "skill" ? selectedSkill : null,
        });
      }

      setTranscript(
        transcriptResult.normalizedTranscript || transcriptResult.transcript
      );
      setAudioAnalysis(audioAnalysisResult);
      setEvaluation(evaluationResult);

      // Step 4: Generate feedback audio (optional, skip for mock)
      if (!useMockData && evaluationResult.feedback) {
        try {
          const speechResult = await generateSpeech({
            text: evaluationResult.feedback,
            language: "en",
          });
          setFeedbackAudioUrl(speechResult.audioUrl);
        } catch (err) {
          console.warn("Failed to generate feedback audio:", err);
        }
      }

      // Add to session history
      setSessionHistory(prev => [
        ...prev,
        {
          question: currentQuestion,
          answer:
            transcriptResult.normalizedTranscript ||
            transcriptResult.transcript,
          evaluation: evaluationResult,
          audioAnalysis: audioAnalysisResult,
          timestamp: new Date().toISOString(),
        },
      ]);

      toast.success("Answer processed successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to process answer");
      console.error("Process answer error:", error);
    } finally {
      setIsTranscribing(false);
      setIsEvaluating(false);
    }
  };

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoadingJobs || isLoadingSkills) {
    return <LoadingScreen message="Loading..." />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            {t`AI Interview Coach`}
          </h1>
        </div>
        <p className="text-gray-600">
          {t`Practice your interview skills with AI-powered feedback`}
        </p>
      </div>

      {/* Selection Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t`Select Interview Context`}</CardTitle>
          <CardDescription>
            {t`Choose a job description or skill to practice with`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button
              variant={mode === "job" ? "default" : "outline"}
              onClick={() => {
                setMode("job");
                setSelectedSkill(null);
              }}
            >
              {t`By Job Description`}
            </Button>
            <Button
              variant={mode === "skill" ? "default" : "outline"}
              onClick={() => {
                setMode("skill");
                setSelectedJobId(null);
              }}
            >
              {t`By Skill`}
            </Button>
          </div>

          {mode === "job" ? (
            <Select
              value={selectedJobId?.toString() || ""}
              onValueChange={val => setSelectedJobId(Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a job" />
              </SelectTrigger>
              <SelectContent>
                {normalizedJobs.map(job => (
                  <SelectItem key={job.id} value={job.id.toString()}>
                    {job.jobTitle} - {job.companyName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Select
              value={selectedSkill || ""}
              onValueChange={setSelectedSkill}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a skill" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {skills.map(skill => (
                  <SelectItem key={skill.id || skill.name} value={skill.name}>
                    {skill.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Button
            onClick={handleGenerateQuestion}
            disabled={
              isGeneratingQuestion ||
              (mode === "job" && !selectedJobId) ||
              (mode === "skill" && !selectedSkill)
            }
            className="w-full"
          >
            {isGeneratingQuestion ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating Question...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Question
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Question Section */}
      {currentQuestion && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Interview Question
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-lg text-gray-800">{currentQuestion}</p>
            </div>

            {questionAudioUrl && (
              <div className="flex items-center gap-2">
                <audio
                  ref={audioRef}
                  src={questionAudioUrl}
                  controls
                  className="flex-1"
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recording Section */}
      {currentQuestion && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="w-5 h-5" />
              Record Your Answer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={isRecording ? stopRecording : startRecording}
                variant={isRecording ? "destructive" : "default"}
                size="lg"
                className="w-32"
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-5 h-5" />
                    Stop
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5" />
                    Record
                  </>
                )}
              </Button>

              {isRecording && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-lg font-mono">
                    {formatTime(recordingTime)}
                  </span>
                </div>
              )}
            </div>

            {recordedAudio && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Your recorded answer:</p>
                <audio src={recordedAudio} controls className="w-full" />
                <Button
                  onClick={handleProcessAnswer}
                  disabled={isTranscribing || isEvaluating}
                  className="w-full"
                >
                  {isTranscribing || isEvaluating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      Analyze Answer
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Mock mode: Show button to simulate without recording */}
            {useMockData && !recordedAudio && (
              <div className="pt-4 border-t">
                <Button
                  onClick={handleProcessAnswer}
                  disabled={isTranscribing || isEvaluating}
                  variant="outline"
                  className="w-full"
                >
                  {isTranscribing || isEvaluating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      Simulate Answer Analysis (Mock Mode)
                    </>
                  )}
                </Button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  In mock mode, you can simulate the analysis without recording
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Transcript Section */}
      {transcript && (
        <Card>
          <CardHeader>
            <CardTitle>Your Answer (Transcript)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-800">{transcript}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audio Analysis Section */}
      {audioAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle>Voice Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Pace</p>
                <p className="text-2xl font-bold">
                  {audioAnalysis.pace?.toFixed(1) || "N/A"}
                </p>
                <p className="text-xs text-gray-500">words/min</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Emotion</p>
                <p className="text-2xl font-bold capitalize">
                  {audioAnalysis.emotion || "N/A"}
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Confidence</p>
                <p className="text-2xl font-bold">
                  {(audioAnalysis.confidence * 100)?.toFixed(0) || "N/A"}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Evaluation Section */}
      {evaluation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              AI Evaluation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <span className="text-lg font-semibold">Overall Score</span>
              <span className="text-3xl font-bold text-blue-600">
                {evaluation.score}/10
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Detailed Feedback:</h4>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-800 whitespace-pre-wrap">
                  {evaluation.feedback}
                </p>
              </div>
            </div>

            {evaluation.suggestions && evaluation.suggestions.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold">
                  {t`Suggestions for Improvement:`}
                </h4>
                <ul className="space-y-2">
                  {evaluation.suggestions.map((suggestion, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 p-2 bg-yellow-50 rounded"
                    >
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-800">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {feedbackAudioUrl && (
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Volume2 className="w-5 h-5" />
                  {t`Listen to Feedback:`}
                </h4>
                <audio
                  ref={feedbackAudioRef}
                  src={feedbackAudioUrl}
                  controls
                  className="w-full"
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Session History */}
      {sessionHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Session History</CardTitle>
            <CardDescription>
              Review your previous questions and answers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sessionHistory.map((item, idx) => (
                <div key={idx} className="p-4 border rounded-lg space-y-2">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-sm text-gray-600">
                      Q: {item.question}
                    </p>
                    <span className="text-xs text-gray-500">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">A: {item.answer}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">Score:</span>
                    <span className="text-lg font-bold text-blue-600">
                      {item.evaluation.score}/10
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
