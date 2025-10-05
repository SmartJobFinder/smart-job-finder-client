"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
    useGetPreviewQuery,
    useDownloadTemplateMutation,
} from "@/services/cvTemplateService";
import { useSelector } from "react-redux";
import { getScaledHtml } from "@/hooks/getScaledHtml";
import { ZoomIn, ZoomOut, Expand, FileDown, FileUser } from "lucide-react";
import LoadingScreen from "@/components/ui/loadingScreen";

export default function PreviewCv({
    templateId,
    templateName,
    completionPercent,
}) {
    const { html } = useSelector((state) => state.cvTemplate);
    const { data, isFetching } = useGetPreviewQuery(templateId, {
        skip: !templateId,
        refetchOnMountOrArgChange: true,
    });
    const [downloadTemplate] = useDownloadTemplateMutation();
    const [zoom, setZoom] = useState(0.7);
    const [isDownloading, setIsDownloading] = useState(false);
    const iframeRef = useRef(null);

    const handleDownload = async () => {
        if (!templateId || isDownloading) return;
        try {
            const blob = await downloadTemplate(templateId).unwrap();
            console.log("Blob:", blob);
            const file =
                blob instanceof Blob
                    ? blob
                    : new Blob([blob], { type: "application/pdf" });
            const url = window.URL.createObjectURL(file);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `cv-${templateId}.pdf`);
            document.body.appendChild(link);
            link.click();

            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 100);
        } catch (err) {
            console.error("Download failed:", err);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 2.0));
    const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.3));
    const resetZoom = () => setZoom(1.0);

    const toggleFullscreen = () => {
        const iframe = iframeRef.current;
        if (!document.fullscreenElement && iframe) {
            iframe.requestFullscreen().catch((err) => {
                console.log("Fullscreen request failed:", err);
            });
        } else {
            document.exitFullscreen();
        }
    };

    const scaledHtml = useMemo(() => {
        return getScaledHtml(data, zoom, { templateType: templateName });
    }, [data, zoom, templateName]);

    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        const handleLoad = () => {
            try {
                const iframeDoc = iframe.contentDocument;
                if (iframeDoc) {
                    const viewport = iframeDoc.querySelector(
                        'meta[name="viewport"]'
                    );
                    if (viewport) {
                        viewport.setAttribute(
                            "content",
                            `width=device-width, initial-scale=1.0, maximum-scale=${zoom}, user-scalable=no`
                        );
                    }
                }
            } catch (e) {
                console.log("Cross-origin iframe access restricted");
            }
        };

        iframe.addEventListener("load", handleLoad);
        return () => iframe.removeEventListener("load", handleLoad);
    }, [zoom]);

    if (isFetching) {
        return <LoadingScreen message="Loading ..." />;
    }

    if (!templateId) {
        return (
            <div className="flex items-center justify-center h-full p-4 bg-gray-100 rounded-xl">
                <div className="text-center">
                    <div className="mb-4 text-6xl opacity-30">📄</div>
                    <p className="text-lg text-gray-500">
                        Choosee template to reviews
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full p-4 bg-gray-100 shadow-lg rounded-xl">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-800">
                    <FileUser />
                    CV Preview
                </h2>

                <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1 p-1 bg-white rounded-lg shadow-sm">
                        <button
                            onClick={handleZoomOut}
                            className="px-2 py-1 text-sm text-gray-600 transition-colors rounded hover:text-blue-800 hover:bg-gray-100"
                            aria-label="Zoom Out"
                            disabled={zoom <= 0.3}
                        >
                            <ZoomOut />
                        </button>

                        <span className="px-2 py-1 text-xs text-gray-600 min-w-[50px] text-center bg-gray-50 rounded">
                            {Math.round(zoom * 100)}%
                        </span>

                        <button
                            onClick={handleZoomIn}
                            className="px-2 py-1 text-sm text-gray-600 transition-colors rounded hover:text-blue-800 hover:bg-gray-100"
                            aria-label="Zoom In"
                            disabled={zoom >= 2.0}
                        >
                            <ZoomIn />
                        </button>
                    </div>

                    <button
                        onClick={resetZoom}
                        className="px-3 py-2 text-sm text-white transition-colors bg-gray-600 rounded-lg hover:bg-gray-700"
                    >
                        Reset
                    </button>

                    <button
                        onClick={toggleFullscreen}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-white transition-colors bg-gray-600 rounded-lg hover:bg-gray-700"
                        aria-label="Toggle Fullscreen"
                    >
                        <Expand size={18} />
                        Fullscreen
                    </button>

                    <button
                        onClick={handleDownload}
                        disabled={completionPercent < 70 || isDownloading}
                        className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors 
                            ${
                                completionPercent >= 70
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                        aria-label="Download CV as PDF"
                    >
                        <FileDown />
                        {completionPercent >= 70
                            ? "Download PDF"
                            : "Complete your profile"}
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden bg-gray-800 rounded-lg shadow-inner">
                <iframe
                    ref={iframeRef}
                    srcDoc={scaledHtml}
                    className="w-full min-h-[70vh] border-0 rounded-lg bg-gray-800"
                    title="CV Preview"
                    aria-label="Preview of the selected CV template"
                    sandbox="allow-scripts allow-same-origin"
                    loading="lazy"
                />
            </div>
        </div>
    );
}
