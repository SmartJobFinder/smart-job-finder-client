"use client";

import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { removeToast } from "@/store/slices/toastSlices";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export default function ToastProvider() {
    const toasts = useAppSelector((state) => state.toast.toasts);
    const dispatch = useAppDispatch();

    const getToastIcon = (variant) => {
        switch (variant) {
            case "success":
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case "destructive":
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const getToastStyles = (variant) => {
        switch (variant) {
            case "success":
                return "border-green-200 bg-green-50";
            case "destructive":
                return "border-red-200 bg-red-50";
            default:
                return "border-blue-200 bg-blue-50";
        }
    };

    useEffect(() => {
        toasts.forEach((toast) => {
            if (toast.duration && toast.duration > 0) {
                const timer = setTimeout(() => {
                    dispatch(removeToast(toast.id));
                }, toast.duration);

                return () => clearTimeout(timer);
            }
        });
    }, [toasts, dispatch]);

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`max-w-sm w-full border rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out ${getToastStyles(
                        toast.variant,
                    )}`}
                >
                    <div className="flex items-start gap-3">
                        {getToastIcon(toast.variant)}
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">
                                {toast.title}
                            </h4>
                            {toast.description && (
                                <p className="text-sm text-gray-600 mt-1">
                                    {toast.description}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => dispatch(removeToast(toast.id))}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
