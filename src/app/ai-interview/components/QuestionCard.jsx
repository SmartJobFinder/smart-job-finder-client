export default function QuestionCard({
  currentQuestion,
  showQuestionScript,
  onToggleScript,
  onPlay,
  aiQuestionAudioUrl,
  questionAudioRef,
  isPlaying,
  isManualPlay = false,
}) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-5 border border-gray-100">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Interview Question
          </h2>

          <div className="mt-2 flex items-center gap-2">
            {isPlaying ? (
              <span className="inline-flex items-center gap-2 text-xs font-semibold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                AI is speaking…
                <MiniWave />
              </span>
            ) : (
              <span className="text-[11px] uppercase tracking-wide text-gray-400">
                Ready
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onPlay}
          disabled={!aiQuestionAudioUrl}
          className={`px-3 py-2 rounded-lg text-xs font-semibold border transition
            ${
              isPlaying && isManualPlay
                ? "bg-gray-100 text-gray-600 border-gray-200 cursor-not-allowed"
                : "bg-white text-gray-900 border-gray-200 hover:bg-gray-50"
            }`}
        >
          {/* Chỉ hiển thị "Playing..." khi user bấm play (manual play) */}
          {isManualPlay && isPlaying ? "Playing…" : "Play"}
        </button>
      </div>

      {aiQuestionAudioUrl && (
        <audio ref={questionAudioRef} src={aiQuestionAudioUrl} preload="auto" />
      )}

      {/* question text */}
      <div className="mt-3">
        {showQuestionScript ? (
          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
            {currentQuestion}
          </p>
        ) : (
          <p className="text-sm text-gray-400 italic">Question hidden</p>
        )}

        <button
          type="button"
          onClick={onToggleScript}
          className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
        >
          {showQuestionScript ? "Hide script" : "Show script"}
        </button>
      </div>
    </div>
  );
}

function MiniWave() {
  return (
    <span className="flex items-end gap-[2px] ml-1">
      <span className="w-[3px] h-[6px] bg-emerald-500 rounded-sm animate-[wave_1s_infinite]" />
      <span className="w-[3px] h-[10px] bg-emerald-500 rounded-sm animate-[wave_1s_.15s_infinite]" />
      <span className="w-[3px] h-[7px] bg-emerald-500 rounded-sm animate-[wave_1s_.3s_infinite]" />
      <span className="w-[3px] h-[12px] bg-emerald-500 rounded-sm animate-[wave_1s_.45s_infinite]" />
      <style jsx>{`
        @keyframes wave {
          0%,
          100% {
            transform: scaleY(0.5);
            opacity: 0.6;
          }
          50% {
            transform: scaleY(1.2);
            opacity: 1;
          }
        }
      `}</style>
    </span>
  );
}
