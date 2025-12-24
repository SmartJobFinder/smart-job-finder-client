"use client";

import { useEffect, useMemo, useState } from "react";
import { t } from "@/i18n/i18n";
import jsPDF from "jspdf";
import { pdfRenderers } from "@/utils/pdfRenderers";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

import { generateCvWithAI } from "@/services/cvBuilderService";
import {
    createSavedCv,
    updateSavedCv,
    getSavedCvDetail,
} from "@/services/cvSaveService";
import { getJobDetail } from "@/services/jobDetailService";

import JobPreviewCard from "../components/JobPreviewCard";
import CvHeader from "./CvHeader";
import CvSection from "./CvSection";
import EducationItem from "./EducationItem";
import ExperienceItem from "./ExperienceItem";
import SkillsSection from "./SkillsSection";
import CvPreviewModal from "./CvPreviewModal";
import EditableTextBlock from "./EditableTextBlock";

const emptyCv = {
    introduce: "",
    objective: "",
    edu: [],
    information: {
        fullName: "",
        title: "",
        gender: "",
        location: "",
        age: null,
        phone: "",
        email: "",
    },
    experience: [],
    skills: [],
};

function mapApiToCv(apiRes) {
    return {
        introduce: apiRes?.intro ?? "",
        objective: apiRes?.objective ?? "",
        skills: Array.isArray(apiRes?.suitableSkills)
            ? apiRes.suitableSkills
            : [],
        information: {
            fullName: apiRes?.fullName ?? "",
            title: apiRes?.title ?? "",
            gender: "",
            location: "",
            age: null,
            phone: apiRes?.phone ?? "",
            email: apiRes?.email ?? "",
        },
        edu: (apiRes?.educations ?? []).map((e, idx) => ({
            id: idx + 1,
            schoolName: e?.school ?? "",
            degree: e?.description ?? "",
            duration: `${e?.start ?? ""}${e?.end ? " - " + e.end : ""}`.trim(),
            majors: e?.majors ?? "",
        })),
        experience: (apiRes?.workExperiences ?? []).map((w, idx) => ({
            id: idx + 1,
            description: w?.description ?? "",
            companyName: w?.company ?? "",
            position: w?.role ?? "",
            duration: `${w?.start ?? ""}${w?.end ? " - " + w.end : ""}`.trim(),
        })),
    };
}

export default function CVPage() {
    const searchParams = useSearchParams();
    const jobId = Number(searchParams.get("jobId"));
    const savedId = searchParams.get("savedId");

    const [selectedTemplate, setSelectedTemplate] = useState("basic");
    const [language, setLanguage] = useState("en");

    const [cv, setCv] = useState(emptyCv);
    const info = cv.information;

    const [hasGenerated, setHasGenerated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const canGenerate = useMemo(() => Boolean(jobId), [jobId]);

    const [previewOpen, setPreviewOpen] = useState(false);

    const [job, setJob] = useState(null);
    const [jobLoading, setJobLoading] = useState(false);

    useEffect(() => {
        if (!jobId) return;
        let alive = true;

        (async () => {
            setJobLoading(true);
            try {
                const data = await getJobDetail(jobId);
                if (alive) setJob(data);
            } catch (e) {
                console.error(e);
            } finally {
                if (alive) setJobLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, [jobId]);

    // Load saved CV detail if editing
    useEffect(() => {
        if (!savedId) return;
        let alive = true;
        (async () => {
            setLoading(true);
            try {
                const detail = await getSavedCvDetail(savedId);
                const parsed = detail?.content
                    ? JSON.parse(detail.content)
                    : emptyCv;
                if (!alive) return;
                setCv(parsed);
                setSelectedTemplate(detail?.template || "basic");
                setHasGenerated(true);
            } catch (e) {
                console.error(e);
                toast.error("Failed to load saved CV");
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => {
            alive = false;
        };
    }, [savedId]);

    const handleGenerateAI = async () => {
        if (!canGenerate) {
            toast.error("Missing jobId");
            return;
        }

        setLoading(true);
        try {
            const apiRes = await generateCvWithAI(jobId, language);
            setCv(mapApiToCv(apiRes));
            setHasGenerated(true);
            toast.success(t`Generated CV successfully`);
        } catch (err) {
            console.error(err);
            toast.error("Generate CV failed. Please login again or retry.");
        } finally {
            setLoading(false);
        }
    };

    const handleExportPdf = () => {
        const doc = new jsPDF({
            unit: "mm",
            format: "a4",
            orientation: "portrait",
        });
        const renderFunction =
            pdfRenderers[selectedTemplate] || pdfRenderers.basic;
        renderFunction(doc, cv);
        doc.save(`cv-${info.fullName || "export"}-${selectedTemplate}.pdf`);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const payload = {
                title: info.fullName || job?.title || "Untitled CV",
                content: JSON.stringify(cv),
                template: selectedTemplate,
            };
            if (savedId) {
                await updateSavedCv(savedId, payload);
                toast.success(t`CV updated successfully`);
            } else {
                await createSavedCv(payload);
                toast.success(t`CV saved successfully`);
            }
            setHasGenerated(true);
        } catch (e) {
            console.error(e);
            toast.error(t`Save CV failed. Please try again.`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto my-8 px-4">
            {loading && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-[340px] text-center">
                        <div className="text-lg font-semibold mb-2">{t`Generating CV...`}</div>
                        <div className="text-sm text-gray-600">{t`Please wait a moment`}</div>
                    </div>
                </div>
            )}

            {!hasGenerated ? (
                <div className="bg-white rounded-2xl shadow p-8 space-y-5">
                    <div className="space-y-2">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            {t`Build CV with AI`}
                        </h1>
                        <p className="text-gray-600 leading-relaxed">
                            {t`This feature will automatically generate a tailored CV based on your profile and the job description. After generating, you can review and edit before exporting as PDF.`}
                        </p>
                    </div>

                    <JobPreviewCard job={job} loading={jobLoading} />

                    <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between bg-gray-50 border rounded-xl p-4">
                        <div className="text-xs text-gray-500">
                            {t`Tip: Log in first so the system can use your saved profile.`}
                        </div>

                        <div className="flex items-center gap-2">
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                disabled={loading}
                            >
                                <option value="en">{t`English`}</option>
                                <option value="vi">{t`Vietnamese`}</option>
                            </select>

                            <button
                                onClick={handleGenerateAI}
                                disabled={!canGenerate || loading}
                                className={`px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-md ${
                                    !canGenerate || loading
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-emerald-600 hover:bg-emerald-700"
                                }`}
                            >
                                {t`Generate CV with AI`}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                        <FeatureCard
                            title={t`Smart Summary`}
                            desc={t`Generate a strong professional summary matched to the job.`}
                        />
                        <FeatureCard
                            title={t`Targeted Skills`}
                            desc={t`Suggest skills you should highlight for this position.`}
                        />
                        <FeatureCard
                            title={t`Export PDF`}
                            desc={t`Export clean PDF templates after reviewing and editing.`}
                        />
                    </div>
                </div>
            ) : (
                <>
                    {/* ===== TOOLBAR ===== */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 bg-white p-4 rounded-xl shadow mb-4">
                        <div className="flex items-center gap-2">
                            <select
                                value={selectedTemplate}
                                onChange={(e) =>
                                    setSelectedTemplate(e.target.value)
                                }
                                className="px-3 py-2 text-sm border border-gray-300 rounded-lg"
                                disabled={loading}
                            >
                                <option value="basic">{t`Basic Template`}</option>
                                <option value="two-columns">{t`Two Columns Template`}</option>
                                <option value="right-sidebar">{t`Template 3`}</option>
                            </select>

                            <button
                                onClick={() => setPreviewOpen(true)}
                                className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
                            >
                                {t`Preview`}
                            </button>

                            <button
                                onClick={handleExportPdf}
                                className="px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-md bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:via-blue-600 hover:to-cyan-500"
                            >
                                {t`Export as PDF`}
                            </button>

                            <button
                                onClick={handleSave}
                                disabled={loading || saving}
                                className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                {saving ? t`Saving...` : t`Save`}
                            </button>
                        </div>

                        <button
                            onClick={handleGenerateAI}
                            disabled={loading}
                            className="px-4 py-2 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100"
                            title={t`Generate again`}
                        >
                            {t`Regenerate`}
                        </button>
                    </div>

                    {/* ===== CV VIEW - Render theo template ===== */}
                    <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
                        {/* CvHeader chỉ render cho basic và two-columns, không render cho right-sidebar */}
                        {selectedTemplate !== "right-sidebar" && (
                            <CvHeader info={info} />
                        )}

                        {/* Render khác nhau tùy theo template */}
                        {selectedTemplate === "basic" && (
                            <BasicEditableView cv={cv} setCv={setCv} />
                        )}

                        {selectedTemplate === "two-columns" && (
                            <TwoColumnsEditableView cv={cv} setCv={setCv} />
                        )}

                        {selectedTemplate === "right-sidebar" && (
                            <RightSidebarEditableView cv={cv} setCv={setCv} />
                        )}
                    </div>
                </>
            )}
            <CvPreviewModal
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
                template={selectedTemplate}
                cv={cv}
            />
        </div>
    );
}

// ===== BASIC TEMPLATE EDITABLE VIEW (1 CỘT VERTICAL) =====
function BasicEditableView({ cv, setCv }) {
    return (
        <>
            <CvSection title={t`Professional Summary`}>
                <EditableTextBlock
                    value={cv.introduce}
                    onSave={(newText) =>
                        setCv((prev) => ({
                            ...prev,
                            introduce: newText,
                        }))
                    }
                    placeholder="-"
                    minRows={5}
                />
            </CvSection>

            <CvSection title={t`Career Objective`}>
                <EditableTextBlock
                    value={cv.objective}
                    onSave={(newText) =>
                        setCv((prev) => ({
                            ...prev,
                            objective: newText,
                        }))
                    }
                    placeholder="-"
                    minRows={5}
                />
            </CvSection>

            <CvSection title={t`Education`}>
                {(cv.edu || []).length ? (
                    <div className="space-y-3">
                        {cv.edu.map((e) => (
                            <div
                                key={e.id}
                                className="border border-black rounded-lg p-3"
                            >
                                <div className="flex justify-between gap-3">
                                    <div className="font-semibold text-black">
                                        {e.schoolName || "-"}
                                    </div>
                                    <div className="text-sm text-black">
                                        {e.duration || ""}
                                    </div>
                                </div>
                                {e.majors && (
                                    <div className="text-sm text-black">
                                        {e.majors}
                                    </div>
                                )}
                                {e.degree && (
                                    <div className="text-xs text-black mt-1">
                                        {e.degree}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-black">-</p>
                )}
            </CvSection>

            <CvSection title={t`Work Experience`}>
                {(cv.experience || []).length ? (
                    <div className="space-y-3">
                        {cv.experience.map((exp) => (
                            <div
                                key={exp.id}
                                className="border border-black rounded-lg p-3"
                            >
                                <div className="flex justify-between gap-3">
                                    <div className="font-semibold text-black">
                                        {exp.position || "-"}
                                    </div>
                                    <div className="text-sm text-black">
                                        {exp.duration || ""}
                                    </div>
                                </div>
                                {exp.companyName && (
                                    <div className="text-sm text-black">
                                        {exp.companyName}
                                    </div>
                                )}
                                {exp.description && (
                                    <div className="text-sm text-black mt-2 whitespace-pre-line">
                                        {exp.description}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-black">-</p>
                )}
            </CvSection>

            <CvSection title={t`Skills`}>
                {(cv.skills || []).length ? (
                    <div className="flex flex-wrap gap-2">
                        {cv.skills.map((s, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-1 text-xs rounded-full border border-black text-black"
                            >
                                {s}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-black">-</p>
                )}
            </CvSection>
        </>
    );
}

// ===== TWO COLUMNS TEMPLATE EDITABLE VIEW =====
function TwoColumnsEditableView({ cv, setCv }) {
    const info = cv.information || {};

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column - Sidebar */}
            <div className="md:col-span-1 space-y-4">
                {/* Header Block - Compact */}
                <div className="border border-black rounded-xl p-4">
                    <div className="text-xl font-bold text-black">
                        {info.fullName || "-"}
                    </div>
                    <div className="text-sm font-semibold text-black">
                        {info.title || "-"}
                    </div>
                    <div className="mt-2 text-xs text-black space-y-1">
                        {info.email && <div>{info.email}</div>}
                        {info.phone && <div>{info.phone}</div>}
                    </div>
                </div>

                <CvSection title={t`Skills`}>
                    {(cv.skills || []).length ? (
                        <div className="flex flex-wrap gap-2">
                            {cv.skills.map((s, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 text-xs rounded-full border border-black text-black"
                                >
                                    {s}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-black">-</p>
                    )}
                </CvSection>

                <CvSection title={t`Education`}>
                    {(cv.edu || []).length ? (
                        <div className="space-y-2">
                            {cv.edu.map((e) => (
                                <div
                                    key={e.id}
                                    className="border border-black rounded-lg p-3"
                                >
                                    <div className="font-semibold text-black">
                                        {e.schoolName || "-"}
                                    </div>
                                    <div className="text-xs text-black">
                                        {e.duration || ""}
                                    </div>
                                    {e.majors && (
                                        <div className="text-sm mt-1 text-black">
                                            {e.majors}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-black">-</p>
                    )}
                </CvSection>
            </div>

            {/* Right Column - Main Content */}
            <div className="md:col-span-2 space-y-4">
                <CvSection title={t`Professional Summary`}>
                    <EditableTextBlock
                        value={cv.introduce}
                        onSave={(newText) =>
                            setCv((prev) => ({
                                ...prev,
                                introduce: newText,
                            }))
                        }
                        placeholder="-"
                        minRows={5}
                    />
                </CvSection>

                <CvSection title={t`Career Objective`}>
                    <EditableTextBlock
                        value={cv.objective}
                        onSave={(newText) =>
                            setCv((prev) => ({
                                ...prev,
                                objective: newText,
                            }))
                        }
                        placeholder="-"
                        minRows={5}
                    />
                </CvSection>

                <CvSection title={t`Work Experience`}>
                    {(cv.experience || []).length ? (
                        <div className="space-y-3">
                            {cv.experience.map((exp) => (
                                <div
                                    key={exp.id}
                                    className="border border-black rounded-lg p-3"
                                >
                                    <div className="flex justify-between gap-3">
                                        <div className="font-semibold text-black">
                                            {exp.position || "-"}
                                        </div>
                                        <div className="text-xs text-black">
                                            {exp.duration || ""}
                                        </div>
                                    </div>
                                    {exp.companyName && (
                                        <div className="text-sm text-black">
                                            {exp.companyName}
                                        </div>
                                    )}
                                    {exp.description && (
                                        <div className="text-sm text-black mt-2 whitespace-pre-line">
                                            {exp.description}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-black">-</p>
                    )}
                </CvSection>
            </div>
        </div>
    );
}

// ===== RIGHT SIDEBAR TEMPLATE EDITABLE VIEW =====
function RightSidebarEditableView({ cv, setCv }) {
    return (
        <div className="space-y-6">
            {/* Header Section - chỉ đen trắng */}
            <div className="text-center space-y-3 pb-4 border-b-2 border-black">
                <div className="text-3xl font-bold text-black">
                    {cv.information.fullName || "-"}
                </div>
                <div className="text-lg font-semibold text-black">
                    {cv.information.title || "Students"}
                </div>
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-black">
                    {cv.information.phone && (
                        <span>{cv.information.phone}</span>
                    )}
                    {cv.information.email && (
                        <span>{cv.information.email}</span>
                    )}
                    {cv.information.location && (
                        <span>{cv.information.location}</span>
                    )}
                </div>
            </div>

            <CvSection title={t`Professional Summary`}>
                <EditableTextBlock
                    value={cv.introduce}
                    onSave={(newText) =>
                        setCv((prev) => ({
                            ...prev,
                            introduce: newText,
                        }))
                    }
                    placeholder="-"
                    minRows={5}
                />
            </CvSection>

            <CvSection title={t`Career Objective`}>
                <EditableTextBlock
                    value={cv.objective}
                    onSave={(newText) =>
                        setCv((prev) => ({
                            ...prev,
                            objective: newText,
                        }))
                    }
                    placeholder="-"
                    minRows={5}
                />
            </CvSection>

            <CvSection title={t`Education`}>
                <div className="space-y-4">
                    {(cv.edu || []).length ? (
                        cv.edu.map((e) => (
                            <div key={e.id} className="space-y-1">
                                <div className="flex items-center justify-between text-sm font-semibold text-gray-900">
                                    <span>{e.schoolName || "-"}</span>
                                    <span className="text-xs text-gray-600">
                                        {e.duration || ""}
                                    </span>
                                </div>
                                {e.majors && (
                                    <div className="text-sm text-gray-700">
                                        {e.majors}
                                    </div>
                                )}
                                {e.degree && (
                                    <div className="text-xs text-gray-600">
                                        {e.degree}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">-</p>
                    )}
                </div>
            </CvSection>

            <CvSection title={t`Work Experience / Projects`}>
                <div className="space-y-4">
                    {(cv.experience || []).length ? (
                        cv.experience.map((exp) => (
                            <div key={exp.id} className="space-y-1">
                                <div className="flex items-center justify-between text-sm font-semibold text-gray-900">
                                    <span>{exp.position || "-"}</span>
                                    <span className="text-xs text-gray-600">
                                        {exp.duration || ""}
                                    </span>
                                </div>
                                {exp.companyName && (
                                    <div className="text-sm text-gray-700">
                                        {exp.companyName}
                                    </div>
                                )}
                                {exp.description && (
                                    <div className="text-sm text-gray-800 whitespace-pre-line">
                                        {exp.description}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">-</p>
                    )}
                </div>
            </CvSection>

            <CvSection title={t`Skills`}>
                {(cv.skills || []).length ? (
                    <div className="flex flex-wrap gap-2">
                        {cv.skills.map((s, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-1 text-xs rounded-full border border-gray-300 text-gray-800"
                            >
                                {s}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">-</p>
                )}
            </CvSection>
        </div>
    );
}

function FeatureCard({ title, desc }) {
    return (
        <div className="border rounded-xl p-4 bg-white">
            <div className="font-semibold text-gray-900">{title}</div>
            <div className="text-sm text-gray-600 mt-1">{desc}</div>
        </div>
    );
}
