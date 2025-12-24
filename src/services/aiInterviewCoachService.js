// src/services/aiInterviewCoachService.js
import api from "@/lib/api";

/**
 * Generate interview questions based on job description or topic
 * @param {Object} params - { jobId?: number, topic?: string }
 * @returns {Promise<{question: string, audioUrl?: string}>}
 */
export async function generateInterviewQuestion({ jobId, topic }) {
  const { data } = await api.post("/ai/interview/generate-question", {
    jobId: jobId || null,
    topic: topic || null,
  });
  return data; // { question: string, audioUrl?: string }
}

/**
 * Transcribe audio using Whisper
 * @param {File|Blob} audioFile - Audio file to transcribe
 * @returns {Promise<{transcript: string, normalizedTranscript: string}>}
 */
export async function transcribeAudio(audioFile) {
  const formData = new FormData();
  formData.append("audio", audioFile);

  const { data } = await api.post("/ai/interview/transcribe", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data; // { transcript: string, normalizedTranscript: string }
}

/**
 * Analyze audio parameters (pace, emotion, confidence)
 * @param {File|Blob} audioFile - Audio file to analyze
 * @returns {Promise<{pace: number, emotion: string, confidence: number}>}
 */
export async function analyzeAudio(audioFile) {
  const formData = new FormData();
  formData.append("audio", audioFile);

  const { data } = await api.post("/ai/interview/analyze-audio", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data; // { pace: number, emotion: string, confidence: number }
}

/**
 * Evaluate answer using LLM (Vicuna Answer Analysis Layer)
 * @param {Object} params - { question: string, answer: string, jobId?: number }
 * @returns {Promise<{score: number, feedback: string, suggestions: string[]}>}
 */
export async function evaluateAnswer({ question, answer, jobId }) {
  const { data } = await api.post("/ai/interview/evaluate-answer", {
    question,
    answer,
    jobId: jobId || null,
  });
  return data; // { score: number, feedback: string, suggestions: string[] }
}

/**
 * Generate text-to-speech audio for feedback or question
 * @param {string} text - Text to convert to speech
 * @param {string} language - Language code (e.g., 'en', 'vi')
 * @returns {Promise<{audioUrl: string}>}
 */
export async function generateSpeech({ text, language = "en" }) {
  const { data } = await api.post("/ai/interview/text-to-speech", {
    text,
    language,
  });
  return data; // { audioUrl: string }
}

/**
 * Complete interview session analysis
 * @param {Object} params - { sessionId: string }
 * @returns {Promise<{overallScore: number, summary: string, recommendations: string[]}>}
 */
export async function getSessionAnalysis(sessionId) {
  const { data } = await api.get(`/ai/interview/session/${sessionId}/analysis`);
  return data;
}
