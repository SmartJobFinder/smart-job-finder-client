const fmt = s => {
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
};

export default function RecordAnswerCard({
  isRecording,
  recordingSeconds = 0,
  recordedSeconds = 0,
  onToggleRecording,
  disabled = false,
  loading = false,
}) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-5 border border-gray-100 flex flex-col gap-4">
      <h2 className="text-base font-semibold text-gray-900">
        Record your answer
      </h2>
      <p className="text-xs leading-relaxed text-gray-600">
        Click the button below and answer the question as you would in a real
        interview. When you finish, click stop so the AI can analyze and score
        your answer for this specific question.
      </p>

      <div className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
        <div className="flex items-center gap-2">
          <span
            className={`inline-block h-2 w-2 rounded-full ${
              isRecording ? "bg-red-500 animate-pulse" : "bg-gray-400"
            }`}
          />
          <span className="text-xs font-medium text-gray-800">
            {isRecording
              ? `Recording · ${fmt(recordingSeconds)}`
              : recordedSeconds > 0
                ? `Recorded · ${fmt(recordedSeconds)}`
                : "Not recording"}
          </span>
        </div>
        <span className="text-[11px] text-gray-500">Up to ~2 minutes</span>
      </div>

      <button
        type="button"
        onClick={onToggleRecording}
        disabled={disabled || loading}
        className={`w-full inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-md transition transform hover:scale-[1.01] ${
          isRecording
            ? "bg-red-500 hover:bg-red-600"
            : "bg-gradient-to-r from-emerald-600 via-green-600 to-lime-500 hover:from-emerald-500 hover:via-green-600 hover:to-lime-500"
        }`}
      >
        <span
          className={`mr-2 inline-flex items-center justify-center rounded-full border ${
            isRecording
              ? "border-white bg-white/10"
              : "border-white/60 bg-white/10"
          } p-[3px]`}
        >
          <span
            className={`block ${
              isRecording
                ? "h-2.5 w-2.5 rounded-[3px] bg-white"
                : "h-2.5 w-2.5 rounded-full bg-white"
            }`}
          />
        </span>
        {isRecording ? "Stop & submit" : "Start answering"}
      </button>

      {loading && (
        <div className="flex items-center gap-2 text-xs text-indigo-600 font-semibold">
          <span className="h-3 w-3 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <span>Analyzing your answer…</span>
        </div>
      )}
    </div>
  );
}
