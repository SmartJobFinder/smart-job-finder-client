"use client";

import { useEffect, useMemo, useState } from "react";
import {
    getCurrentLanguage,
    setLanguage,
    subscribeToLanguageChange,
} from "@/i18n/i18n";

const LANGS = [
    { code: "en", name: "English", flag: "fi-us" },
    { code: "vi", name: "Tiếng Việt", flag: "fi-vn" },
    { code: "ko", name: "한국어", flag: "fi-kr" },
];

export default function LanguageSelector({ isRecruiter = false }) {
    const [isOpen, setOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    const [lang, setLang] = useState(getCurrentLanguage());

    useEffect(() => {
        const unsub = subscribeToLanguageChange(() =>
            setLang(getCurrentLanguage())
        );
        return () => unsub?.();
    }, []);

    const current = useMemo(
        () => LANGS.find((l) => l.code === lang) || LANGS[0],
        [lang]
    );

    const onChange = async (code) => {
        if (code === lang) return setOpen(false);
        setBusy(true);
        try {
            await setLanguage(code);
        } finally {
            setBusy(false);
            setOpen(false);
        }
    };

    const btnBase =
        "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-all disabled:opacity-50 active:scale-95";
    const btnRecruiter =
        "w-full bg-white text-gray-700 px-0 hover:bg-gray-50";
    const btnDefault =
        "text-white bg-blue-500 border border-blue-300 hover:bg-blue-600";

    const menuBase = "absolute z-50 bg-white rounded-lg shadow-lg p-1";
    const menuRecruiter = "left-0 right-0 bottom-full mb-1 w-full";
    const menuDefault = "right-0 top-full mt-1 min-w-[160px]";

    return (
        <div className="relative">
            <button
                type="button"
                className={`${btnBase} ${
                    isRecruiter ? btnRecruiter + " justify-between" : btnDefault
                }`}
                onClick={() => setOpen(!isOpen)}
                disabled={busy}
                aria-expanded={isOpen}
                aria-label={`Current language: ${current.name}`}
            >
                <div className="flex items-center min-w-0 gap-2">
                    <span className={`fi ${current.flag} w-5 h-5 rounded-sm`} />
                    <span className="truncate sm:inline">
                        {current.name}
                    </span>
                </div>

                <svg
                    className={`w-4 h-4 transition-transform ${
                        isOpen ? "rotate-180" : ""
                    } ${isRecruiter ? "ml-2 shrink-0" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {isOpen && (
                <div
                    className={`${menuBase} ${
                        isRecruiter ? menuRecruiter : menuDefault
                    }`}
                >
                    {LANGS.map((l) => {
                        const active = l.code === lang;
                        return (
                            <button
                                key={l.code}
                                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-50 ${
                                    active ? "bg-blue-50 text-blue-600" : ""
                                }`}
                                onClick={() => onChange(l.code)}
                                disabled={busy}
                            >
                                <span
                                    className={`fi ${l.flag} w-5 h-5 rounded-sm`}
                                />
                                <span>{l.name}</span>
                            </button>
                        );
                    })}
                </div>
            )}

            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[1px]"
                    onClick={() => setOpen(false)}
                />
            )}
        </div>
    );
}
