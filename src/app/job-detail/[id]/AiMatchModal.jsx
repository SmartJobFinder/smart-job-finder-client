"use client";
import React, { useState, useRef } from "react";
import { Dialog } from "@headlessui/react";
import { X, FileText, Trash2 } from "lucide-react";
import { uploadAndGetMatchScore } from "@/services/aiService";

const AiMatchModal = ({ onClose, jobId }) => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const fileRef = useRef(null);

    const validatePdf = (f) => {
        if (!f) return "Please select a PDF file.";
        if (f.type !== "application/pdf") return "Please select a PDF file.";
        if (f.size > 5 * 1024 * 1024) return "Maximum file size is 5MB.";
        return null;
    };

    const applyFile = (f) => {
        setResult(null);
        const err = validatePdf(f);
        if (err) {
            setError(err);
            setFile(null);
            return;
        }
        setError("");
        setFile(f);
    };

    const onFileChange = (e) => {
        const f = e.target.files?.[0] || null;
        if (!f) return;
        applyFile(f);
    };

    const onDrop = (e) => {
        e.preventDefault();
        if (loading) return;
        const f = e.dataTransfer.files?.[0];
        if (!f) return;
        applyFile(f);
    };

    const onDragOver = (e) => {
        e.preventDefault();
    };

    const removeFile = () => {
        setFile(null);
        setResult(null);
        setError("");
        if (fileRef.current) fileRef.current.value = "";
    };

    const formatSize = (bytes) => {
        if (!bytes && bytes !== 0) return "";
        const units = ["B", "KB", "MB", "GB"];
        let i = 0;
        let b = bytes;
        while (b >= 1024 && i < units.length - 1) {
            b /= 1024;
            i++;
        }
        return `${b.toFixed(1)} ${units[i]}`;
    };

    const onEvaluate = async () => {
        if (!file) {
            setError("Please select a PDF file.");
            return;
        }
        try {
            setLoading(true);
            setError("");
            const data = await uploadAndGetMatchScore({
                jobId,
                file,
                useFileApi: false,
            });
            setResult(data);
        } catch (e) {
            setError("Cannot evaluate. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const onCloseModal = () => {
        setFile(null);
        setResult(null);
        setError("");
        if (fileRef.current) fileRef.current.value = "";
        onClose?.();
    };

    return (
        <Dialog open={true} onClose={onCloseModal} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl space-y-5 max-h-[85vh] overflow-y-auto">
                    <div className="flex items-center justify-between">
                        <Dialog.Title className="text-lg font-semibold text-blue-600">
                            CV suitability assessment
                        </Dialog.Title>
                        <button
                            onClick={onCloseModal}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-3">
                        {/* Hidden native input */}
                        <input
                            ref={fileRef}
                            type="file"
                            accept="application/pdf"
                            onChange={onFileChange}
                            disabled={loading}
                            className="hidden"
                        />

                        {/* Dropzone / Picker */}
                        <div
                            onClick={() => !loading && fileRef.current?.click()}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            className={`w-full border-2 border-dashed rounded-lg p-4 cursor-pointer transition bg-gray-50 hover:bg-gray-100 ${
                                loading ? "opacity-60 cursor-not-allowed" : ""
                            }`}
                        >
                            {!file ? (
                                <div className="flex items-center gap-3 text-gray-600">
                                    <FileText className="w-6 h-6 text-blue-600" />
                                    <div>
                                        <div className="font-medium">
                                            Drop or click to upload PDF
                                        </div>
                                        <div className="text-sm">
                                            Max size 5MB
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-6 h-6 text-blue-600" />
                                        <div>
                                            <div className="font-medium break-all">
                                                {file.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {formatSize(file.size)}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={removeFile}
                                        disabled={loading}
                                        className="inline-flex items-center gap-1 px-2 py-1 text-sm text-gray-600 border rounded hover:bg-gray-100"
                                    >
                                        <Trash2 className="w-4 h-4" /> Remove
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
                                onClick={onEvaluate}
                                disabled={loading || !file}
                            >
                                {loading ? "Evaluating..." : "Evaluate this CV"}
                            </button>
                            {loading && (
                                <div className="flex-1 h-1 bg-gray-200 rounded overflow-hidden">
                                    <div className="h-1 w-1/2 bg-blue-600 animate-pulse" />
                                </div>
                            )}
                        </div>

                        {error && (
                            <p className="text-red-600 text-sm">{error}</p>
                        )}
                    </div>

                    {result && (
                        <div className="mt-2">
                            <div className="text-3xl font-bold">
                                {result.score}%
                            </div>
                            {Array.isArray(result.reasons) &&
                                result.reasons.length > 0 && (
                                    <div className="max-h-64 md:max-h-80 overflow-y-auto pr-2 mt-2">
                                        <ul className="list-disc ml-5 text-sm text-gray-700">
                                            {result.reasons.map((r, i) => (
                                                <li key={i}>{r}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                        </div>
                    )}
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default AiMatchModal;
