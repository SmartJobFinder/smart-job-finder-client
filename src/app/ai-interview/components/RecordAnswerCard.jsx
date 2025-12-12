export default function RecordAnswerCard({ isRecording, onToggleRecording }) {
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
            {isRecording ? "Recording" : "Not recording"}
          </span>
        </div>
        <span className="text-[11px] text-gray-500">Up to ~2 minutes</span>
      </div>

      <button
        type="button"
        onClick={onToggleRecording}
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
        {isRecording ? "Stop recording" : "Start answering"}
      </button>
    </div>
  );
}
