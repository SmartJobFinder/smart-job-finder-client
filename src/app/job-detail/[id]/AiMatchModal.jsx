"use client";
import React, { useState, useEffect } from "react";
import {
  X,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetCombinedProfileQuery } from "@/services/profileService";
import { convertJobToText } from "@/utils/jobToText";
import { convertProfileToText } from "@/utils/profileToText";
import { calculateProfileCompletion } from "@/features/profile/profileCompletion";
import { checkCVMatching } from "@/services/cvMatchingService";
import { toast } from "react-toastify";
import { normalizeProfileData } from "@/features/profile/normalizeProfileData";
import { useRouter } from "next/navigation";
import { t } from "@/i18n/i18n";

const AiMatchModal = ({ onClose, job }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [profileCompletion, setProfileCompletion] = useState(null);

  // Get combined profile
  const { data: combinedProfile, isLoading: isLoadingProfile } =
    useGetCombinedProfileQuery();

  useEffect(() => {
    const evaluate = async () => {
      if (isLoadingProfile) return;

      console.log("Combined Profile from API:", combinedProfile);

      if (!combinedProfile) {
        setError(t`Unable to load your profile. Please try again.`);
        setLoading(false);
        return;
      }

      // Normalize profile data
      const normalizedProfile = normalizeProfileData(combinedProfile);
      console.log("Normalized Profile:", normalizedProfile);

      // Check profile completion
      const completion = calculateProfileCompletion(normalizedProfile);
      console.log("Profile completion:", completion);
      setProfileCompletion(completion);

      if (completion.percent < 70) {
        setError(
          t`Your profile is only ${completion.percent}% complete. Please complete at least 70% of your profile before using CV matching.`
        );
        setLoading(false);
        toast.error(
          t`Profile completion: ${completion.percent}%. Need 70% to use AI matching.`
        );
        return;
      }

      try {
        setLoading(true);

        // Convert job and profile to text
        const jdText = convertJobToText(job);
        const cvText = convertProfileToText(combinedProfile);

        console.log("JD Text:", jdText);
        console.log("CV Text:", cvText);

        if (!jdText || !cvText) {
          throw new Error(t`Failed to convert job or profile data`);
        }

        // Call CV Matching API
        const matchResult = await checkCVMatching(jdText, cvText);
        console.log("Match Result:", matchResult);

        // Convert score to percentage (0-1 -> 0-100)
        const scorePercent = Math.round(matchResult.similarityScore * 100);

        setResult({
          score: scorePercent,
          matchLevel: matchResult.matchLevel,
          profileCompletion: completion.percent,
          similarityScore: matchResult.similarityScore,
        });

        setLoading(false);
      } catch (err) {
        console.error("CV Matching Error:", err);
        setError(err.message || t`Failed to check CV matching`);
        setLoading(false);
        toast.error(t`Failed to check CV matching`);
      }
    };

    evaluate();
  }, [job, combinedProfile, isLoadingProfile]);

  const onCloseModal = () => {
    onClose?.();
  };

  const handleGoToProfile = () => {
    onCloseModal();
    router.push("/profile");
  };

  const handleProceedToApply = () => {
    toast.success(t`Ready to apply!`);
    onCloseModal();
    // Scroll to apply button
    setTimeout(() => {
      const applyButton = document.querySelector("[data-apply-button]");
      if (applyButton) {
        applyButton.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        applyButton.click();
      }
    }, 300);
  };

  // Helper functions
  const getStatusColor = () => {
    if (!result) return "text-gray-600";
    if (result.score >= 70) return "text-green-600";
    if (result.score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusText = () => {
    if (!result) return t`Analyzing...`;
    if (result.score >= 70) return t`Excellent Match`;
    if (result.score >= 40) return t`Partial Match`;
    return t`Low Match`;
  };

  const getBgColor = () => {
    if (!result) return "bg-gray-50";
    if (result.score >= 70) return "bg-green-50";
    if (result.score >= 40) return "bg-yellow-50";
    return "bg-red-50";
  };

  const getBorderColor = () => {
    if (!result) return "border-gray-200";
    if (result.score >= 70) return "border-green-200";
    if (result.score >= 40) return "border-yellow-200";
    return "border-red-200";
  };

  const getStatusIcon = () => {
    if (!result) return AlertTriangle;
    if (result.score >= 70) return CheckCircle;
    if (result.score >= 40) return AlertTriangle;
    return XCircle;
  };

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full shadow-xl p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            <h3 className="text-lg font-semibold text-gray-900">
              {t`Analyzing Your Profile...`}
            </h3>
            <p className="text-sm text-gray-600 text-center">
              {t`AI is comparing your skills and experience with job requirements`}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state (Profile incomplete)
  if (error) {
    const StatusIcon = XCircle;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              {t`Profile Incomplete`}
            </h2>
            <button
              onClick={onCloseModal}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Error Display */}
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-4">
              <div className="flex items-center justify-center mb-2">
                <StatusIcon className="w-12 h-12 text-red-600" />
              </div>
              <div className="text-center">
                <div className="text-red-600 text-sm font-medium mb-2">
                  {t`Unable to Analyze CV Match`}
                </div>
                <p className="text-sm text-gray-700">{error}</p>
              </div>
            </div>

            {/* Profile Completion Progress */}
            {profileCompletion && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {t`Profile Completion Status`}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-700">{t`Completion`}:</span>
                    <span
                      className={`font-semibold ${
                        profileCompletion.percent >= 80
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {profileCompletion.percent}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        profileCompletion.percent >= 80
                          ? "bg-green-600"
                          : "bg-red-600"
                      }`}
                      style={{
                        width: `${profileCompletion.percent}%`,
                      }}
                    />
                  </div>
                  {profileCompletion.percent < 80 && (
                    <p className="text-xs text-gray-600 mt-2">
                      {t`Need ${
                        80 - profileCompletion.percent
                      }% more to use AI matching`}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Missing Sections */}
            {profileCompletion &&
              profileCompletion.missingSections.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <XCircle className="w-4 h-4 mr-2 text-orange-500" />
                    {t`Missing Sections`}:
                  </h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {profileCompletion.missingSections.map((section, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-orange-500 mr-2">•</span>
                        <span className="capitalize">
                          {section.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Suggestions */}
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-blue-500" />
                {t`Next Steps`}:
              </h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>{t`Complete your profile to at least 80%`}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>{t`Add missing sections listed above`}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>
                    {t`Ensure all information is accurate and up-to-date`}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 p-4 border-t bg-gray-50">
            <Button variant="outline" onClick={onCloseModal} className="flex-1">
              {t`Close`}
            </Button>
            <Button
              onClick={handleGoToProfile}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <span>{t`Complete Profile`}</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Success state (Match result)
  const StatusIcon = getStatusIcon();
  const score = result?.score || 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            {t`AI CV Match Assessment`}
          </h2>
          <button
            onClick={onCloseModal}
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
              <StatusIcon className={`w-12 h-12 ${getStatusColor()}`} />
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

          {/* AI Analysis Details */}
          {result && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                {t`AI Analysis Results`}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">{t`Match Level`}:</span>
                  <span className={`font-semibold ${getStatusColor()}`}>
                    {result.matchLevel}
                  </span>
                </div>

                <div className="pt-2 border-t border-blue-200">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-700">
                      {t`Similarity Score`}:
                    </span>
                    <span className="font-semibold text-purple-600">
                      {(result.similarityScore * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${result.similarityScore * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">
                      {t`Profile Completion`}:
                    </span>
                    <span className="font-semibold text-green-600">
                      {result.profileCompletion}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recommendations based on score */}
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-blue-500" />
              {t`Recommendations`}:
            </h3>
            <ul className="space-y-1 text-sm text-gray-700">
              {score >= 70 ? (
                <>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>
                      {t`Your profile is an excellent match for this position`}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>{t`Proceed with confidence to apply`}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>
                      {t`Highlight matching skills in your cover letter`}
                    </span>
                  </li>
                </>
              ) : score >= 40 ? (
                <>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    <span>
                      {t`Your profile partially matches the requirements`}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    <span>
                      {t`Consider updating your skills and experience`}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-500 mr-2">•</span>
                    <span>{t`Add relevant projects or certifications`}</span>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span>
                      {t`Your profile has limited match with this position`}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span>{t`Consider exploring other opportunities`}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span>
                      {t`Update your profile to improve future matches`}
                    </span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-4 border-t bg-gray-50">
          <Button variant="outline" onClick={onCloseModal} className="flex-1">
            {t`Close`}
          </Button>
          <Button
            onClick={score >= 70 ? handleProceedToApply : handleGoToProfile}
            className={`flex-1 ${
              score >= 70
                ? "bg-green-600 hover:bg-green-700"
                : score >= 40
                  ? "bg-yellow-600 hover:bg-yellow-700"
                  : "bg-red-600 hover:bg-red-700"
            } text-white`}
          >
            {score >= 70
              ? t`Proceed to Apply`
              : score >= 40
                ? t`Improve Profile`
                : t`Update Profile`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AiMatchModal;
