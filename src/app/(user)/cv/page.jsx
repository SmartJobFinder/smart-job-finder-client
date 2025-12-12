"use client";

import { t } from "@/i18n/i18n";
import jsPDF from "jspdf";
import { pdfRenderers } from "@/utils/pdfRenderers";
import { useState } from "react";

// TODO: sau này thay bằng data từ API
// const { data: cv } = useGetFullCVQuery(jobId);
const mockCV = {
    introduce:
        "A highly motivated and skilled Java Developer with a passion for creating efficient and scalable applications. I possess a strong understanding of object-oriented principles and design patterns. Eager to contribute my expertise to a dynamic team and deliver high-quality software solutions. Based in Tuyên Quang, I am seeking challenging opportunities to further enhance my skills and contribute to innovative projects.\n",
    objective:
        "As a Java Developer with two years of experience, I am seeking a challenging Java programming role in Hanoi where I can contribute to software development projects. I am eager to apply my skills and passion for Java to build innovative and efficient solutions. I am committed to continuous learning and contributing to a dynamic team environment.\n",
    edu: [
        {
            id: 1,
            schoolName: "Ton Duc Thang University",
            degree: "Bachelor",
            duration: "10/2022 - NOW",
            majors: "Software Engineering",
        },
    ],
    information: {
        fullName: "Vo Nhat Hao",
        title: "Java Developer",
        gender: "Male",
        location: "Tuyen Quang",
        age: 10,
        phone: "0123456789",
        email: "example@example.com",
    },
    experience: [
        {
            id: 1,
            description:
                "Web application development with Java Spring Boot, job in Agile team",
            companyName: "TEXPO SOLUTION",
            position: "Full-Stack Devloper",
            duration: "06/2025 - 08/2025",
        },
    ],
    skills: ["Java Programming", "JavaScript Development", "DevOps Engineering"],
};

export default function CVPage() {
    const cv = mockCV;
    const info = cv.information;

    const [selectedTemplate, setSelectedTemplate] = useState('basic');

    const handleExportPdf = () => {
        const doc = new jsPDF({
            unit: "mm",
            format: "a4",
            orientation: "portrait",
        });

        // Lấy hàm render tương ứng với mẫu đã chọn
        const renderFunction = pdfRenderers[selectedTemplate] || pdfRenderers.basic;

        // Gọi hàm render
        renderFunction(doc, cv);

        doc.save(`cv-${info.fullName || "export"}-${selectedTemplate}.pdf`);
    };

    return (
        <div className="max-w-4xl mx-auto my-6 space-y-4">
            {/* Nút Export PDF */}
            <div className="flex justify-between items-center">

                {/* Chọn Mẫu */}
                <div className="flex items-center space-x-2">
                    <label htmlFor="template-select" className="text-sm font-medium text-gray-700">
                        {t`Chọn Mẫu`}:
                    </label>
                    <select
                        id="template-select"
                        value={selectedTemplate}
                        onChange={(e) => setSelectedTemplate(e.target.value)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="basic">{t`Mẫu Cơ Bản`}</option>
                        <option value="two-columns">{t`Mẫu Hai Cột`}</option>
                        <option value="right-sidebar">{t`Mẫu 3`}</option>
                        {/* Thêm các mẫu khác ở đây */}
                    </select>
                </div>

                {/* Nút Export */}
                <button
                    onClick={handleExportPdf}
                    className="px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-md bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:via-blue-600 hover:to-cyan-500 transition transform hover:scale-[1.01]"
                >
                    {t`Export as PDF`}
                </button>
            </div>

            {/* Vùng hiển thị CV trên web (không liên quan PDF render) */}
            <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
                {/* Header */}
                <div className="pb-4 border-b border-gray-200">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {info.fullName}
                            </h1>
                            <p className="text-lg font-semibold text-gray-700">
                                {info.title}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                                {info.location}{" "}
                                {info.age && (
                                    <>
                                        • {info.age} {t`years old`}
                                    </>
                                )}
                            </p>
                        </div>
                        <div className="flex flex-col items-start gap-2 text-sm text-gray-600 sm:items-end">
                            <p>
                                <span className="font-semibold">
                                    {t`Gender`}:
                                </span>{" "}
                                {info.gender}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Introduce & Objective */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <h2 className="mb-2 text-base font-semibold text-gray-800">
                            {t`Professional Summary`}
                        </h2>
                        <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                            {cv.introduce}
                        </p>
                    </div>
                    <div>
                        <h2 className="mb-2 text-base font-semibold text-gray-800">
                            {t`Career Objective`}
                        </h2>
                        <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                            {cv.objective}
                        </p>
                    </div>
                </div>

                {/* Education */}
                <div>
                    <h2 className="mb-4 text-base font-semibold text-gray-800">
                        {t`Education`}
                    </h2>
                    <div className="space-y-3">
                        {cv.edu.map((e) => (
                            <div
                                key={e.id}
                                className="pb-3 border-b border-gray-100 last:border-none last:pb-0"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {e.schoolName}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            {e.majors}
                                        </p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {e.duration}
                                    </p>
                                </div>
                                <p className="mt-1 text-xs text-gray-600">
                                    {e.degree}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Experience */}
                <div>
                    <h2 className="mb-4 text-base font-semibold text-gray-800">
                        {t`Work Experience`}
                    </h2>
                    <div className="space-y-4">
                        {cv.experience.map((exp) => (
                            <div
                                key={exp.id}
                                className="pb-3 border-b border-gray-100 last:border-none last:pb-0"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {exp.position}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            {exp.companyName}
                                        </p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        {exp.duration}
                                    </p>
                                </div>
                                <p className="mt-1 text-sm text-gray-700">
                                    {exp.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Skills */}
                <div>
                    <h2 className="mb-4 text-base font-semibold text-gray-800">
                        {t`Skills`}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {cv.skills.map((skill, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
