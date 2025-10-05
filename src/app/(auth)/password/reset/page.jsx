"use client";

import React, {useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card";
import {AlertCircle, Clock, Loader2, Mail, RefreshCw, ShieldCheck} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import {useDispatch} from "react-redux";
import {forgotPasswordThunk} from "@/features/auth/authSlice";

const formatMMSS = (sec) => {
    const s = Math.max(0, Math.floor(sec));
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
};

export default function ResetPasswordPage() {
    const sp = useSearchParams();
    const router = useRouter();
    const token = sp.get("reset_token") || "";
    const email = sp.get("email") || "";

    const [tokenInvalid, setTokenInvalid] = useState(!token);

    useEffect(() => setTokenInvalid(!token), [token]);

    return (
        <div className="min-h-screen grid place-items-center px-4 py-12">
            <Card className="w-full max-w-md border border-blue-100 shadow-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-blue-700">Reset password</CardTitle>
                    <CardDescription className="text-blue-900/70">
                        Choose a new password for your account.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    {tokenInvalid ? (
                        <div className="space-y-4">
                            <div
                                className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                <AlertCircle className="mt-0.5 h-4 w-4"/>
                                <span>The reset link is invalid or expired. Request a new reset link below.</span>
                            </div>
                            <ResendResetLinkInline defaultEmail={email} fallbackCooldownSec={120}/>
                        </div>
                    ) : (
                        <>
                            <div
                                className="rounded-xl bg-blue-50/60 p-3 text-xs text-blue-900/80 flex items-start gap-2">
                                <ShieldCheck className="h-4 w-4 text-blue-500 mt-0.5"/>
                                <p>Create a strong password you don’t use elsewhere.</p>
                            </div>

                            <ResetPasswordForm
                                tokenOverride={token}
                                onInvalidToken={() => setTokenInvalid(true)}
                            />
                        </>
                    )}
                </CardContent>

                <CardFooter className="flex justify-center">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/login?view=login")}
                        className="rounded-xl border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                        Back to Login
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

function ResendResetLinkInline({defaultEmail = "", fallbackCooldownSec = 120}) {
    const dispatch = useDispatch();
    const [email, setEmail] = useState(defaultEmail);
    const [phase, setPhase] = useState("idle"); // idle | sending | cooldown
    const [cooldown, setCooldown] = useState(0);
    const [note, setNote] = useState("");

    const isEmailValid = /\S+@\S+\.\S+/.test(email);

    useEffect(() => {
        if (phase !== "cooldown" || cooldown <= 0) return;
        const id = setInterval(() => {
            setCooldown((s) => {
                const next = Math.max(0, s - 1);
                if (next === 0) setPhase("idle");
                return next;
            });
        }, 1000);
        return () => clearInterval(id);
    }, [phase, cooldown]);

    const resend = async () => {
        if (!isEmailValid || phase === "sending" || phase === "cooldown") return;
        setPhase("sending");
        setNote("");
        try {
            const res = await dispatch(forgotPasswordThunk(email)).unwrap();
            const nextCd =
                Number(res?.cooldownSec) > 0 ? Number(res.cooldownSec) : fallbackCooldownSec;
            setNote(
                res?.message ||
                "If the email is valid and registered, a new reset link has been sent.",
            );
            setCooldown(nextCd);
            setPhase("cooldown");
        } catch (err) {
            setNote(err?.message || "Failed to send the request. Please try again.");
            setPhase("idle");
        }
    };

    return (
        <div className="space-y-3">
            <div>
                <label htmlFor="reset-resend-email" className="text-blue-900/80 text-sm font-medium">
                    Email
                </label>
                <div className="mt-1 flex items-center gap-2">
                    <div className="relative flex-1">
                        <Mail
                            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-300"/>
                        <Input
                            id="reset-resend-email"
                            type="email"
                            placeholder="you@example.com"
                            className="pl-10 focus-visible:ring-2 focus-visible:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                        />
                    </div>

                    {phase === "sending" ? (
                        <Button
                            type="button"
                            disabled
                            variant="outline"
                            className="rounded-xl border-blue-200 text-blue-700 hover:bg-blue-50"
                        >
                            <Loader2 className="mr-2 h-4 w-4 animate-spin text-blue-600"/>
                            Sending…
                        </Button>
                    ) : phase === "cooldown" ? (
                        <Button
                            type="button"
                            disabled
                            variant="outline"
                            className="rounded-xl border-blue-200 text-blue-700 hover:bg-blue-50"
                        >
                            <Clock className="mr-2 h-4 w-4"/>
                            {formatMMSS(cooldown)}
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            onClick={resend}
                            disabled={!isEmailValid}
                            className="rounded-xl bg-blue-600 hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
                        >
                            <RefreshCw className="mr-2 h-4 w-4"/>
                            Resend reset link
                        </Button>
                    )}
                </div>
            </div>

            {note && <p className="text-sm text-gray-600">{note}</p>}
        </div>
    );
}
