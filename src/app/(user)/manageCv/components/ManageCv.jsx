"use client";

import { useEffect, useMemo, useState } from "react";
import { CircleAlert, CircleCheckBig, Eye, Pencil, Trash2 } from "lucide-react";
import LoadingScreen from "@/components/ui/loadingScreen";
import { calculateProfileCompletion } from "@/features/profile/profileCompletion";
import { normalizeProfileData } from "@/features/profile/normalizeProfileData";
import { useGetCombinedProfileQuery } from "@/services/profileService";
import { useSelector, useDispatch } from "react-redux";
import {
    selectNormalizedProfile,
    selectProfileCompletion,
    setCompletion,
    setNormalizedProfile,
} from "@/features/profile/profileSlice";
import CvPreviewModal from "../../cv-builder/CvPreviewModal";
import { listSavedCvs, deleteSavedCv } from "@/services/cvSaveService";
import { toast } from "react-toastify";

export default function ManageCv() {
    const dispatch = useDispatch();
    const { data: combined, isSuccess } = useGetCombinedProfileQuery();
    const completion = useSelector(selectProfileCompletion);
    const [savedCvs, setSavedCvs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [previewing, setPreviewing] = useState(null); // cv object
    const [previewTemplate, setPreviewTemplate] = useState("basic");

    // normalize profile
    useEffect(() => {
        if (isSuccess && combined) {
            const normalized = normalizeProfileData(combined);
            dispatch(setNormalizedProfile(normalized));
            dispatch(setCompletion(calculateProfileCompletion(normalized)));
        }
    }, [isSuccess, combined, dispatch]);

    useEffect(() => {
        let alive = true;
        (async () => {
            setLoading(true);
            try {
                const data = await listSavedCvs();
                if (alive) setSavedCvs(data || []);
            } catch (e) {
                console.error(e);
                if (alive) toast.error("Failed to load saved CVs");
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => {
            alive = false;
        };
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteSavedCv(id);
            setSavedCvs((prev) => prev.filter((cv) => cv.id !== id));
            toast.success("Deleted CV");
        } catch (e) {
            console.error(e);
            toast.error("Delete failed");
        }
    };

    const handlePreview = (cv) => {
        try {
            const parsed = cv.content ? JSON.parse(cv.content) : {};
            setPreviewing(parsed);
            setPreviewTemplate(cv.template || "basic");
        } catch (e) {
            toast.error("Cannot preview this CV");
        }
    };

    if (loading) return <LoadingScreen message="Loading ..." />;

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedCvs.map((cv) => (
                        <div
                            key={cv.id}
                            className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1">
                                    <div className="text-sm uppercase text-gray-500">
                                        {cv.template || "basic"}
                                    </div>
                                    <div className="text-lg font-semibold text-gray-900 line-clamp-2">
                                        {cv.title || "Untitled CV"}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePreview(cv)}
                                        className="p-2 rounded-lg border bg-gray-50 hover:bg-gray-100"
                                        title="Preview"
                                    >
                                        <Eye size={16} />
                                    </button>
                                    <a
                                        href={`/cv-builder?savedId=${cv.id}`}
                                        className="p-2 rounded-lg border bg-gray-50 hover:bg-gray-100"
                                        title="Edit"
                                    >
                                        <Pencil size={16} />
                                    </a>
                                    <button
                                        onClick={() => handleDelete(cv.id)}
                                        className="p-2 rounded-lg border bg-gray-50 hover:bg-gray-100 text-red-600"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {savedCvs.length === 0 && (
                        <div className="col-span-full text-center text-gray-500">
                            No saved CVs yet.
                        </div>
                    )}
                </div>
            </div>

            {previewing && (
                <CvPreviewModal
                    open={!!previewing}
                    onClose={() => setPreviewing(null)}
                    template={previewTemplate}
                    cv={previewing}
                />
            )}
        </div>
    );
}
