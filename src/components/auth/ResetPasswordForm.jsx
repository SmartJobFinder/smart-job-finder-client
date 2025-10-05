"use client";

import React, {useEffect, useMemo, useState} from "react";
import {useDispatch} from "react-redux";
import {useRouter, useSearchParams} from "next/navigation";
import {resetPasswordThunk} from "@/features/auth/authSlice";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, Lock} from "lucide-react";
import {toast} from "react-toastify";

const REDIRECT_SEC = 3;

export default function ResetPasswordForm({tokenOverride = "", onSuccess, onInvalidToken}) {
    const dispatch = useDispatch();
    const sp = useSearchParams();
    const router = useRouter();

    const token = tokenOverride || sp.get("reset_token") || "";

    const [pw, setPw] = useState("");
    const [cpw, setCpw] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [showCpw, setShowCpw] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [success, setSuccess] = useState(false);
    const [redirectIn, setRedirectIn] = useState(REDIRECT_SEC);

    useEffect(() => {
        if (!token) {
            toast.error("Invalid reset link. Please request a new one.");
            onInvalidToken?.();
        }
    }, [token, onInvalidToken]);

    useEffect(() => {
        if (!success || redirectIn <= 0) return;
        const id = setInterval(() => setRedirectIn((s) => Math.max(0, s - 1)), 1000);
        return () => clearInterval(id);
    }, [success, redirectIn]);

    useEffect(() => {
        if (success && redirectIn <= 0) {
            router.replace("/login");
            onSuccess?.();
        }
    }, [success, redirectIn, router, onSuccess]);

    const rules = useMemo(() => {
        const len = pw.length >= 8;
        const upper = /[A-Z]/.test(pw);
        const lower = /[a-z]/.test(pw);
        const digit = /\d/.test(pw);
        const special = /[^A-Za-z0-9]/.test(pw);
        const score = [len, upper, lower, digit, special].filter(Boolean).length;
        return {len, upper, lower, digit, special, score};
    }, [pw]);

    const meetsAllRules = rules.len && rules.upper && rules.lower && rules.digit && rules.special;
    const passwordsMatch = pw && cpw && pw === cpw;

    const disabled = !token || !meetsAllRules || !passwordsMatch || submitting;

    const onSubmit = async (e) => {
        e.preventDefault();
        if (disabled) return;

        setSubmitting(true);
        try {
            await dispatch(resetPasswordThunk({token, newPassword: pw})).unwrap();
            setSuccess(true);
            setRedirectIn(REDIRECT_SEC);
            toast.success("Password updated. Redirecting to login...", {
                autoClose: REDIRECT_SEC * 1000,
            });
        } catch (err) {
            const st = err?.status;
            toast.error(err?.message || "Failed to reset password. Please try again.");
            if (st === 410 || st === 422 || st === 400) {
                onInvalidToken?.();
            }
        } finally {
            setSubmitting(false);
        }
    };

    const strengthPct = (rules.score / 5) * 100;
    const strengthLabelMap = ["Very weak", "Weak", "Fair", "Good", "Strong"];
    const strengthLabel = pw.length ? strengthLabelMap[Math.max(0, rules.score - 1)] : "";

    return (
        <form onSubmit={onSubmit} className="space-y-5 max-w-md">
            {!token && (
                <div
                    className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    <AlertCircle className="mt-0.5 h-4 w-4"/>
                    <span>
            Reset token is missing or invalid. Please request a new link on the Forgot Password page.
          </span>
                </div>
            )}

            {success && (
                <div
                    className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                    <CheckCircle2 className="h-4 w-4"/>
                    <span>
            Password updated. Redirecting to login in <b>{redirectIn}s</b>…
          </span>
                </div>
            )}

            <div>
                <Label htmlFor="new-password" className="text-blue-900/80 font-medium">
                    New password
                </Label>
                <div className="relative mt-1">
                    <Lock
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-300"/>
                    <Input
                        id="new-password"
                        type={showPw ? "text" : "password"}
                        placeholder="Enter new password"
                        className="pl-10 pr-10 focus-visible:ring-2 focus-visible:ring-blue-500"
                        value={pw}
                        onChange={(e) => setPw(e.target.value)}
                        required
                        autoComplete="new-password"
                    />
                    <button
                        type="button"
                        aria-label={showPw ? "Hide password" : "Show password"}
                        onClick={() => setShowPw((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 transition hover:text-blue-600"
                    >
                        {showPw ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                    </button>
                </div>

                <div className="mt-2">
                    <div className="h-1.5 w-full rounded bg-blue-100 overflow-hidden" role="progressbar"
                         aria-valuemin={0} aria-valuemax={5} aria-valuenow={rules.score}>
                        <div className="h-full bg-blue-600 transition-all" style={{width: `${strengthPct}%`}}/>
                    </div>
                    {pw.length > 0 && (
                        <div className="mt-1 text-[11px] font-medium text-blue-700">Strength: {strengthLabel}</div>
                    )}
                    <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                        <Rule ok={rules.len} label="At least 8 characters"/>
                        <Rule ok={rules.digit} label="Contains a number"/>
                        <Rule ok={rules.upper} label="Uppercase letter"/>
                        <Rule ok={rules.lower} label="Lowercase letter"/>
                        <Rule ok={rules.special} label="Special character"/>
                    </ul>
                </div>
            </div>

            <div>
                <Label htmlFor="confirm-password" className="text-blue-900/80 font-medium">
                    Confirm new password
                </Label>
                <div className="relative mt-1">
                    <Lock
                        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-300"/>
                    <Input
                        id="confirm-password"
                        type={showCpw ? "text" : "password"}
                        placeholder="Please confirm the new password"
                        className="pl-10 pr-10 focus-visible:ring-2 focus-visible:ring-blue-500"
                        value={cpw}
                        onChange={(e) => setCpw(e.target.value)}
                        required
                        autoComplete="new-password"
                    />
                    <button
                        type="button"
                        aria-label={showCpw ? "Hide confirm password" : "Show confirm password"}
                        onClick={() => setShowCpw((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 transition hover:text-blue-600"
                    >
                        {showCpw ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                    </button>
                </div>
                {pw && cpw && pw !== cpw && (
                    <p className="mt-1 text-sm text-red-500">Passwords do not match.</p>
                )}
            </div>

            <Button
                type="submit"
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={disabled}
            >
                {submitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                        Updating...
                    </>
                ) : (
                    "Update password"
                )}
            </Button>
        </form>
    );
}

function Rule({ok, label}) {
    return (
        <li className={`flex items-center gap-2 ${ok ? "text-green-600" : "text-gray-500"}`}>
            <CheckCircle2 className={`h-3.5 w-3.5 ${ok ? "" : "opacity-40"}`}/>
            <span>{label}</span>
        </li>
    );
}
