import { t } from "@/i18n/i18n";

export default function NextQuestionBar({
  feedbackReady,
  isLastQuestion,
  onNext,
}) {
  return (
    <div className="bg-white shadow-sm rounded-lg p-4 border border-gray-100 flex items-center justify-between">
      <div className="text-xs text-gray-600">
        {feedbackReady
          ? t`You've received feedback for this question. You can move on to the next one.`
          : t`Please answer and receive feedback before moving to the next question.`}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={!feedbackReady}
        className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLastQuestion ? t`Finish interview` : t`Next question`}
      </button>
    </div>
  );
}
