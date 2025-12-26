"use client";

import { AlertTriangle, X, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { t } from "@/i18n/i18n";

export default function JobValidationDialog({
  validationResult,
  onClose,
  onProceed,
}) {
  const { score, status, issues, suggestions, aiDetails } = validationResult;

  const getStatusColor = () => {
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusText = () => {
    if (score >= 80) return t`Safe to Post`;
    if (score >= 50) return t`Review Recommended`;
    return t`High Risk - Not Recommended`;
  };

  const getBgColor = () => {
    if (score >= 80) return "bg-green-50";
    if (score >= 50) return "bg-yellow-50";
    return "bg-red-50";
  };

  const getBorderColor = () => {
    if (score >= 80) return "border-green-200";
    if (score >= 50) return "border-yellow-200";
    return "border-red-200";
  };

  // Loading state
  if (status === "loading") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full shadow-xl p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            <h3 className="text-lg font-semibold text-gray-900">
              {t`Validating Job Posting...`}
            </h3>
            <p className="text-sm text-gray-600 text-center">
              {t`AI is analyzing your job posting for potential issues`}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            {t`Job Validation Assessment`}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Score Display */}
          <div
            className={`${getBgColor()} ${getBorderColor()} border-2 rounded-lg p-6 mb-4`}
          >
            <div className="flex items-center justify-center mb-2">
              <AlertTriangle className={`w-12 h-12 ${getStatusColor()}`} />
            </div>
            <div className="text-center">
              <div className={`text-5xl font-bold ${getStatusColor()} mb-1`}>
                {score}%
              </div>
              <div className={`text-sm font-medium ${getStatusColor()}`}>
                {getStatusText()}
              </div>
            </div>
          </div>

          {/* AI Confidence Details */}
          {aiDetails && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                {t`AI Analysis Results`}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">{t`Classification`}:</span>
                  <span
                    className={`font-semibold ${
                      aiDetails.label === "legit"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {aiDetails.label === "legit" ? t`Legitimate` : t`Scam`}
                  </span>
                </div>

                <div className="pt-2 border-t border-blue-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-700">
                      {t`Legitimate Probability`}:
                    </span>
                    <span className="font-semibold text-green-600">
                      {(aiDetails.legitProbability * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${aiDetails.legitProbability * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-700">
                      {t`Scam Probability`}:
                    </span>
                    <span className="font-semibold text-red-600">
                      {(aiDetails.scamProbability * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${aiDetails.scamProbability * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Issues Found */}
          {issues && issues.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <XCircle className="w-4 h-4 mr-2 text-red-500" />
                {t`Issues Detected`}:
              </h3>
              <ul className="space-y-1 text-sm text-gray-700">
                {issues.map((issue, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggestions */}
          {suggestions && suggestions.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-blue-500" />
                Recommendations:
              </h3>
              <ul className="space-y-1 text-sm text-gray-700">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-4 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose} className="flex-1">
            {t`Review Job Post`}
          </Button>
          <Button
            onClick={onProceed}
            className={`flex-1 ${
              score < 50
                ? "bg-red-600 hover:bg-red-700"
                : score < 80
                  ? "bg-yellow-600 hover:bg-yellow-700"
                  : "bg-green-600 hover:bg-green-700"
            } text-white`}
          >
            {score < 50 ? t`Post Anyway` : t`Proceed to Post`}
          </Button>
        </div>
      </div>
    </div>
  );
}
