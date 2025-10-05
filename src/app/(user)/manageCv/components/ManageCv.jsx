"use client";

import { useDispatch, useSelector } from "react-redux";
import { setSelectedTemplateId } from "@/features/templateCv/cvTemplateSlice";
import { useGetAllTemplatesQuery } from "@/services/cvTemplateService";
import PreviewCv from "./PreviewCv";
import { useEffect } from "react";
import LoadingScreen from "@/components/ui/loadingScreen";
import { selectNormalizedProfile, selectProfileCompletion, setCompletion, setNormalizedProfile } from "@/features/profile/profileSlice";
import { calculateProfileCompletion } from "@/features/profile/profileCompletion";
import { normalizeProfileData } from "@/features/profile/normalizeProfileData";
import { useGetCombinedProfileQuery } from "@/services/profileService";
import { CircleAlert, CircleCheckBig } from "lucide-react";

export default function ManageCv() {
    const dispatch = useDispatch();
    const { data: combined, isSuccess } = useGetCombinedProfileQuery();
    const { data: templates = [], isLoading } = useGetAllTemplatesQuery();

    const selectedTemplateId = useSelector(
        (state) => state.cvTemplate.selectedTemplateId
    );

    const completion = useSelector(selectProfileCompletion);
    const selectedTemplate = templates.find(
        (tpl) => tpl.id === selectedTemplateId
    );

    // choose template default  
    useEffect(() => {
        if (!isLoading && templates.length > 0 && !selectedTemplateId) {
            dispatch(setSelectedTemplateId(templates[0].id));
        }
    }, [isLoading, templates, selectedTemplateId, dispatch]);

    // normalize profile
    useEffect(() => {
        if (isSuccess && combined) {
            const normalized = normalizeProfileData(combined);
            dispatch(setNormalizedProfile(normalized));
            dispatch(setCompletion(calculateProfileCompletion(normalized)));
        }
    }, [isSuccess, combined, dispatch]);

    if (isLoading) return <LoadingScreen message="Loading ..." />;

    return (
        <div className="space-y-6">
            <div>
                <div className="px-6 py-4 mb-4 border-b border-gray-100 bg-gradient-to-r from-blue-200 to-indigo-50 rounded-xl">
                    <div className="flex justify-between max-w-6xl mx-auto">
                        <h1 className="pl-4 text-2xl font-bold text-gray-900 border-l-4 border-blue-800">
                            Cv Templates
                        </h1>
                        <h1 className="flex items-center gap-2 pl-4 text-2xl font-bold text-gray-900">
                            {completion.percent < 100 ? (
                                <>
                                    {completion.percent}%{" Profile state"}
                                    {completion.percent < 70 ? (
                                        <>
                                            <span className="text-gray-600">
                                                complete your profile
                                            </span>
                                            <CircleAlert className="w-6 h-6 text-yellow-500" />
                                        </>
                                    ) : null}
                                </>
                            ) : (
                                <>
                                    100%
                                    <CircleCheckBig className="w-6 h-6 text-blue-800" />
                                </>
                            )}
                        </h1>
                    </div>
                </div>
                <div className="flex flex-wrap gap-4">
                    {templates.map((tpl) => {
                        const isSelected = tpl.id === selectedTemplateId;
                        return (
                            <div
                                key={tpl.id}
                                onClick={() =>
                                    dispatch(setSelectedTemplateId(tpl.id))
                                }
                                className={`cursor-pointer w-40 p-3 rounded-xl border transition-all duration-300 shadow-sm hover:shadow-md
                                    ${
                                        isSelected
                                            ? "border-blue-600 bg-blue-50"
                                            : "border-gray-200 bg-white hover:border-blue-300"
                                    }`}
                            >
                                <div className="relative w-full h-40 p-2 overflow-hidden rounded-md">
                                    <img
                                        src={tpl.previewImageUrl}
                                        alt={tpl.name}
                                        className="object-contain w-full h-full"
                                    />
                                    <div className="absolute inset-0 transition-all hover:bg-black/20" />
                                </div>

                                <p
                                    className={`mt-2 text-sm font-medium text-center truncate ${
                                        isSelected
                                            ? "text-blue-700"
                                            : "text-gray-700"
                                    }`}
                                >
                                    {tpl.name}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {selectedTemplate && (
                <div className="p-6 bg-white border border-gray-100 shadow-md rounded-xl">
                    <PreviewCv
                        templateId={selectedTemplate.id}
                        templateName={selectedTemplate.name}
                        completionPercent={completion.percent}
                    />
                </div>
            )}
        </div>
    );
}
