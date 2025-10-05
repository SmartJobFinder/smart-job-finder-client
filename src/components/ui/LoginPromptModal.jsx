"use client";
import { Button } from "@/components/ui/button";
import { t } from "@/i18n/i18n";

export default function LoginPromptModal({ open, onClose, onLogin }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-sm">
                <h2 className="mb-4 text-lg font-semibold text-gray-800">
                    {t`You need to log in`}
                </h2>
                <p className="mb-6 text-sm text-gray-600">
                    {t`Please log in to continue.`}
                </p>
                <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={onClose}>
                        {t`Close`}
                    </Button>
                    <Button className={`bg-blue-800`} onClick={onLogin}>
                        {t`Login`}
                    </Button>
                </div>
            </div>
        </div>
    );
}
