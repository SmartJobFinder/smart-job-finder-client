"use client";

import React, {useEffect, useMemo, useState} from "react";
import {useDispatch} from "react-redux";
import {useRouter, useSearchParams} from "next/navigation";
import {setPasswordThunk} from "@/features/auth/authSlice";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {CardContent} from "@/components/ui/card";
import {AlertCircle, CheckCircle2, Eye, EyeOff, Lock} from "lucide-react";
import {toast} from "react-toastify";

const REDIRECT_SEC = 3;

export default function SetPasswordForm({tokenOverride = "", onSuccess, onInvalidToken}) {
    const dispatch = useDispatch();
    const sp = useSearchParams();
    const router = useRouter();

    const token = tokenOverride || sp.get("setpw_token");

    const [pw, setPw] = useState("");
    const [cpw, setCpw] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [showCpw, setShowCpw] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!token) {
            toast.error("Invalid or missing token. Please click the email link again.");
            onInvalidToken?.();
        }
    }, [token, onInvalidToken]);

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
            await dispatch(setPasswordThunk({token, newPassword: pw})).unwrap();
            toast.success("Password set successfully. Redirecting to login...", {
                autoClose: REDIRECT_SEC * 1000,
            });
            setTimeout(() => {
                router.replace("/login");
                onSuccess?.();
            }, REDIRECT_SEC * 1000);
        } catch (err) {
            const st = err?.status;
            toast.error(err?.message || "Failed to set password. Please try again.");
            if (st === 410 || st === 422 || st === 400) {
                onInvalidToken?.();
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (

        <CardContent>
            {!token && (
                <div
                    className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    <AlertCircle className="mt-0.5 h-4 w-4"/>
                    <span>
              Invalid or missing link. Please open the set-password link from your email again.
            </span>
                </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
                {/* New password */}
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
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600 transition"
                        >
                            {showPw ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                        </button>
                    </div>

                    {/* Strength bar (theo số rule đạt) */}
                    <div className="mt-2">
                        <div className="h-1.5 w-full rounded bg-blue-100 overflow-hidden">
                            <div
                                className="h-full bg-blue-600 transition-all"
                                style={{width: `${(rules.score / 5) * 100}%`}}
                            />
                        </div>
                        <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                            <Rule ok={rules.len} label="At least 8 characters"/>
                            <Rule ok={rules.digit} label="Contains a number"/>
                            <Rule ok={rules.upper} label="Uppercase letter"/>
                            <Rule ok={rules.lower} label="Lowercase letter"/>
                            <Rule ok={rules.special} label="Special character"/>
                        </ul>
                    </div>
                </div>

                {/* Confirm password */}
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
                            placeholder="Re-enter your new password"
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
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600 transition"
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
                    {submitting ? "Setting..." : "Set password"}
                </Button>

                <p className="text-center text-xs text-gray-500">
                    You will still be able to sign in with Google after setting a password.
                </p>
            </form>
        </CardContent>
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
