"use client";

import { t } from "@/i18n/i18n";

export default function CvPreviewModal({ open, onClose, template, cv }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b">
                    <div className="font-semibold text-gray-900">
                        {t`CV Preview`} • <span className="text-sm text-gray-600">{template}</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-3 py-1 text-sm font-semibold rounded-lg border hover:bg-gray-50"
                    >
                        {t`Close`}
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 overflow-auto max-h-[calc(90vh-56px)] bg-gray-100">
                    <div className="mx-auto bg-white shadow rounded-xl p-6">
                        <CvTemplatePreview template={template} cv={cv} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function CvTemplatePreview({ template, cv }) {
    switch (template) {
        case "two-columns":
            return <TwoColumnsPreview cv={cv} />;
        case "right-sidebar":
            return <RightSidebarPreview cv={cv} />;
        case "basic":
        default:
            return <BasicPreview cv={cv} />;
    }
}


function BasicPreview({ cv }) {
    const info = cv?.information || {};
    return (
        <div className="space-y-6">
            <HeaderBlock info={info} />

            <TwoTextBlock leftTitle={t`Professional Summary`} left={cv?.introduce}
                rightTitle={t`Career Objective`} right={cv?.objective} />

            <Section title={t`Education`}>
                {(cv?.edu || []).length ? (
                    <div className="space-y-3">
                        {cv.edu.map((e) => (
                            <div key={e.id} className="border rounded-lg p-3">
                                <div className="flex justify-between gap-3">
                                    <div className="font-semibold">{e.schoolName || "-"}</div>
                                    <div className="text-sm text-gray-600">{e.duration || ""}</div>
                                </div>
                                {e.majors ? <div className="text-sm">{e.majors}</div> : null}
                                {e.degree ? <div className="text-xs text-gray-600 mt-1">{e.degree}</div> : null}
                            </div>
                        ))}
                    </div>
                ) : (
                    <Empty />
                )}
            </Section>

            <Section title={t`Work Experience`}>
                {(cv?.experience || []).length ? (
                    <div className="space-y-3">
                        {cv.experience.map((x) => (
                            <div key={x.id} className="border rounded-lg p-3">
                                <div className="flex justify-between gap-3">
                                    <div className="font-semibold">{x.position || "-"}</div>
                                    <div className="text-sm text-gray-600">{x.duration || ""}</div>
                                </div>
                                {x.companyName ? <div className="text-sm">{x.companyName}</div> : null}
                                {x.description ? (
                                    <div className="text-sm text-gray-700 mt-2 whitespace-pre-line">
                                        {x.description}
                                    </div>
                                ) : null}
                            </div>
                        ))}
                    </div>
                ) : (
                    <Empty />
                )}
            </Section>

            <Section title={t`Skills`}>
                {(cv?.skills || []).length ? (
                    <div className="flex flex-wrap gap-2">
                        {cv.skills.map((s, idx) => (
                            <span key={idx} className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border">
                                {s}
                            </span>
                        ))}
                    </div>
                ) : (
                    <Empty />
                )}
            </Section>
        </div>
    );
}

function TwoColumnsPreview({ cv }) {
    const info = cv?.information || {};
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4 space-y-4">
                <HeaderBlock info={info} compact />
                <Section title={t`Skills`}>
                    {(cv?.skills || []).length ? (
                        <div className="flex flex-wrap gap-2">
                            {cv.skills.map((s, idx) => (
                                <span key={idx} className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-700 border">
                                    {s}
                                </span>
                            ))}
                        </div>
                    ) : <Empty />}
                </Section>

                <Section title={t`Education`}>
                    {(cv?.edu || []).length ? (
                        <div className="space-y-2">
                            {cv.edu.map((e) => (
                                <div key={e.id} className="border rounded-lg p-3">
                                    <div className="font-semibold">{e.schoolName || "-"}</div>
                                    <div className="text-xs text-gray-600">{e.duration || ""}</div>
                                    {e.majors ? <div className="text-sm mt-1">{e.majors}</div> : null}
                                </div>
                            ))}
                        </div>
                    ) : <Empty />}
                </Section>
            </div>

            <div className="md:col-span-8 space-y-4">
                <TwoTextBlock
                    leftTitle={t`Professional Summary`}
                    left={cv?.introduce}
                    rightTitle={t`Career Objective`}
                    right={cv?.objective}
                />
                <Section title={t`Work Experience`}>
                    {(cv?.experience || []).length ? (
                        <div className="space-y-3">
                            {cv.experience.map((x) => (
                                <div key={x.id} className="border rounded-lg p-3">
                                    <div className="flex justify-between gap-3">
                                        <div className="font-semibold">{x.position || "-"}</div>
                                        <div className="text-xs text-gray-600">{x.duration || ""}</div>
                                    </div>
                                    {x.companyName ? <div className="text-sm">{x.companyName}</div> : null}
                                    {x.description ? <div className="text-sm mt-2 whitespace-pre-line">{x.description}</div> : null}
                                </div>
                            ))}
                        </div>
                    ) : <Empty />}
                </Section>
            </div>
        </div>
    );
}

function RightSidebarPreview({ cv }) {
    const info = cv?.information || {};
    const edu = cv?.edu || [];
    const exp = cv?.experience || [];
    const skills = cv?.skills || [];

    return (
        <div className="space-y-6 bg-white p-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-gray-900">
                    {info.fullName || t`No Title`}
                </div>
                <div className="text-sm font-semibold text-gray-700">
                    {info.title || t`General`}
                </div>
                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-700">
                    {info.phone ? <span>📞 {info.phone}</span> : null}
                    {info.email ? <span>✉️ {info.email}</span> : null}
                    {info.github ? <span>🔗 {info.github}</span> : null}
                    {info.location ? <span>📍 {info.location}</span> : null}
                </div>
            </div>

            <Divider />

            {/* Objective */}
            <Section title={t`Professional Summary`}>
                <div className="text-sm leading-relaxed text-gray-800 whitespace-pre-line">
                    {cv?.introduce || t`No content`}
                </div>
            </Section>

            <Divider />

            {/* Education */}
            <Section title={t`Education`}>
                {edu.length ? (
                    <div className="space-y-4">
                        {edu.map((e) => (
                            <div key={e.id} className="space-y-1">
                                <div className="flex items-center justify-between text-sm font-semibold text-gray-900">
                                    <span>{e.schoolName || "-"}</span>
                                    <span className="text-xs text-gray-600">
                                        {e.duration || ""}
                                    </span>
                                </div>
                                {e.majors ? (
                                    <div className="text-sm text-gray-700">
                                        {e.majors}
                                    </div>
                                ) : null}
                                {e.degree ? (
                                    <div className="text-xs text-gray-600">
                                        {e.degree}
                                    </div>
                                ) : null}
                            </div>
                        ))}
                    </div>
                ) : (
                    <Empty />
                )}
            </Section>

            <Divider />

            {/* Experience / Projects */}
            <Section title={t`Projects`}>
                {exp.length ? (
                    <div className="space-y-4">
                        {exp.map((x) => (
                            <div key={x.id} className="space-y-1">
                                <div className="flex items-center justify-between text-sm font-semibold text-gray-900">
                                    <span>{x.position || "-"}</span>
                                    <span className="text-xs text-gray-600">
                                        {x.duration || ""}
                                    </span>
                                </div>
                                {x.companyName ? (
                                    <div className="text-sm text-gray-700">
                                        {x.companyName}
                                    </div>
                                ) : null}
                                {x.description ? (
                                    <div className="text-sm text-gray-800 whitespace-pre-line">
                                        {x.description}
                                    </div>
                                ) : null}
                            </div>
                        ))}
                    </div>
                ) : (
                    <Empty />
                )}
            </Section>

            <Divider />

            {/* Skills */}
            <Section title={t`Skills`}>
                {skills.length ? (
                    <div className="flex flex-wrap gap-2">
                        {skills.map((s, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-1 text-xs rounded-full border border-gray-300 text-gray-800"
                            >
                                {s}
                            </span>
                        ))}
                    </div>
                ) : (
                    <Empty />
                )}
            </Section>
        </div>
    );
}

function HeaderBlock({ info, compact }) {
    return (
        <div className={`border rounded-xl p-4 ${compact ? "" : "bg-gray-50"}`}>
            <div className="text-xl font-bold text-gray-900">{info?.fullName || "-"}</div>
            <div className="text-sm font-semibold text-gray-700">{info?.title || "-"}</div>
            <div className="mt-2 text-xs text-gray-600 space-y-1">
                {info?.email ? <div>{info.email}</div> : null}
                {info?.phone ? <div>{info.phone}</div> : null}
            </div>
        </div>
    );
}

function TwoTextBlock({ leftTitle, left, rightTitle, right }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Section title={leftTitle}>
                <div className="text-sm text-gray-700 whitespace-pre-line">{left || "-"}</div>
            </Section>
            <Section title={rightTitle}>
                <div className="text-sm text-gray-700 whitespace-pre-line">{right || "-"}</div>
            </Section>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div className="border rounded-xl p-4">
            <div className="font-semibold text-gray-900 mb-2">{title}</div>
            {children}
        </div>
    );
}

function Divider() {
    return <hr className="border-t border-gray-400" />;
}

function Empty() {
    return <div className="text-sm text-gray-500">-</div>;
}
