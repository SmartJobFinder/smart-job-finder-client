"use client";

import { useEffect, useMemo, useState } from "react";
import { t } from "@/i18n/i18n";
import jsPDF from "jspdf";
import { pdfRenderers } from "@/utils/pdfRenderers";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

import { generateCvWithAI } from "@/services/cvBuilderService";
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
    skills: Array.isArray(apiRes?.suitableSkills) ? apiRes.suitableSkills : [],
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

  const [selectedTemplate, setSelectedTemplate] = useState("basic");
  const [language, setLanguage] = useState("en");

  const [cv, setCv] = useState(emptyCv);
  const info = cv.information;

  const [hasGenerated, setHasGenerated] = useState(false);
  const [loading, setLoading] = useState(false);

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
    const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
    const renderFunction = pdfRenderers[selectedTemplate] || pdfRenderers.basic;
    renderFunction(doc, cv);
    doc.save(`cv-${info.fullName || "export"}-${selectedTemplate}.pdf`);
  };

  const handleSaveDraft = () => toast.info("Save draft (coming soon) ✨");

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
                <option value="en">EN</option>
                <option value="vi">VI</option>
              </select>

              <button
                onClick={handleGenerateAI}
                disabled={!canGenerate || loading}
                className={`px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-md ${!canGenerate || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
              >
                {t`Generate CV with AI`}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <FeatureCard title={t`Smart Summary`} desc={t`Generate a strong professional summary matched to the job.`} />
            <FeatureCard title={t`Targeted Skills`} desc={t`Suggest skills you should highlight for this position.`} />
            <FeatureCard title={t`Export PDF`} desc={t`Export clean PDF templates after reviewing and editing.`} />
          </div>
        </div>
      ) : (
        <>
          {/* ===== TOOLBAR ===== */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 bg-white p-4 rounded-xl shadow mb-4">
            <div className="flex items-center gap-2">
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg"
                disabled={loading}
              >
                <option value="basic">{t`Mẫu Cơ Bản`}</option>
                <option value="two-columns">{t`Mẫu Hai Cột`}</option>
                <option value="right-sidebar">{t`Mẫu 3`}</option>
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
                onClick={handleSaveDraft}
                className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
              >
                {t`Save draft`}
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

          {/* ===== CV VIEW ===== */}
          <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
            <CvHeader info={info} />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <CvSection title={t`Professional Summary`}>
                <EditableTextBlock
                  value={cv.introduce}
                  onSave={(newText) =>
                    setCv((prev) => ({ ...prev, introduce: newText }))
                  }
                  placeholder="-"
                  minRows={7}
                />
              </CvSection>


              <CvSection title={t`Career Objective`}>
                <EditableTextBlock
                  value={cv.objective}
                  onSave={(newText) =>
                    setCv((prev) => ({ ...prev, objective: newText }))
                  }
                  placeholder="-"
                  minRows={7}
                />
              </CvSection>

            </div>

            <CvSection title={t`Education`}>
              <div className="space-y-3">
                {(cv.edu || []).length ? (
                  cv.edu.map((e) => <EducationItem key={e.id} item={e} />)
                ) : (
                  <p className="text-sm text-gray-500">-</p>
                )}
              </div>
            </CvSection>

            <CvSection title={t`Work Experience`}>
              <div className="space-y-4">
                {(cv.experience || []).length ? (
                  cv.experience.map((exp) => <ExperienceItem key={exp.id} item={exp} />)
                ) : (
                  <p className="text-sm text-gray-500">-</p>
                )}
              </div>
            </CvSection>

            <CvSection title={t`Skills`}>
              <SkillsSection skills={cv.skills} />
            </CvSection>
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

function FeatureCard({ title, desc }) {
  return (
    <div className="border rounded-xl p-4 bg-white">
      <div className="font-semibold text-gray-900">{title}</div>
      <div className="text-sm text-gray-600 mt-1">{desc}</div>
    </div>
  );
}
