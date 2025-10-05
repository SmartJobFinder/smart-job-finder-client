"use client";

import React, {useEffect, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {sendSetPasswordLinkThunk} from "@/features/auth/authSlice";
import {toast} from "react-toastify";
import {CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {ArrowLeft, Clock, Loader2, Mail, RefreshCw} from "lucide-react";

const COOLDOWN_SEC = 120;

const formatMMSS = (sec) => {
    const s = Math.max(0, Math.floor(sec));
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
};

export default function SetPasswordEmailSent({email, onBack}) {
    const dispatch = useDispatch();
    const [phase, setPhase] = useState("sending"); // 'sending' | 'cooldown' | 'ready'
    const [cooldown, setCooldown] = useState(0);
    const sentOnce = useRef(false);

    // Khôi phục cooldown nếu đã gửi trước đó (theo email)
    useEffect(() => {
        if (!email) return;
        try {
            const key = `setPasswordLinkAt:${email}`;
            const last = Number(localStorage.getItem(key)) || 0;
            if (last > 0) {
                const elapsed = Math.floor((Date.now() - last) / 1000);
                const remain = Math.max(0, COOLDOWN_SEC - elapsed);
                if (remain > 0) {
                    setCooldown(remain);
                    setPhase("cooldown");
                    sentOnce.current = true; // Đừng gửi lại nữa nếu vẫn trong cooldown
                }
            }
        } catch {
        }
    }, [email]);

    // Auto-send nếu chưa gửi và không trong cooldown
    useEffect(() => {
        if (!email || sentOnce.current || phase === "cooldown") return;
        sentOnce.current = true;

        (async () => {
            setPhase("sending");
            try {
                await dispatch(sendSetPasswordLinkThunk(email)).unwrap();
                toast.success("A set-password link has been sent to your email.", {autoClose: 3000});
                setCooldown(COOLDOWN_SEC);
                setPhase("cooldown");
                try {
                    localStorage.setItem(`setPasswordLinkAt:${email}`, String(Date.now()));
                } catch {
                }
            } catch (err) {
                toast.error(err?.message || "Failed to send the email. Please try again.");
                setPhase("ready");
            }
        })();
    }, [email, dispatch, phase]);

    // Tick đếm ngược
    useEffect(() => {
        if (phase !== "cooldown" || cooldown <= 0) return;
        const id = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
        return () => clearInterval(id);
    }, [phase, cooldown]);

    useEffect(() => {
        if (phase === "cooldown" && cooldown === 0) setPhase("ready");
    }, [phase, cooldown]);

    const resend = async () => {
        if (!email || phase !== "ready") return;
        setPhase("sending");
        try {
            await dispatch(sendSetPasswordLinkThunk(email)).unwrap();
            toast.success("A set-password link has been sent to your email.", {autoClose: 3000});
            setCooldown(COOLDOWN_SEC);
            setPhase("cooldown");
            try {
                localStorage.setItem(`setPasswordLinkAt:${email}`, String(Date.now()));
            } catch {
            }
        } catch (err) {
            toast.error(err?.message || "Failed to send the email. Please try again.");
            setPhase("ready");
        }
    };

    return (
        <CardContent className="space-y-4">
            {/* Email chip */}
            <div
                className="mx-auto flex w-fit items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-sm text-blue-800">
                <Mail className="h-4 w-4"/>
                <span className="font-medium">{email}</span>
            </div>

            <p className="text-sm text-blue-900/80 text-center">
                Click the link in your inbox to set a password. You can still keep using Google Sign-In.
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3">
                {typeof onBack === "function" && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onBack}
                        className="rounded-xl border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4"/>
                        Back
                    </Button>
                )}

                {phase === "sending" && (
                    <Button type="button" disabled className="rounded-xl border border-blue-200">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                        Sending…
                    </Button>
                )}

                {phase === "cooldown" && (
                    <Button type="button" disabled variant="outline" className="rounded-xl">
                        <Clock className="mr-2 h-4 w-4"/>
                        Resend in {formatMMSS(cooldown)}
                    </Button>
                )}

                {phase === "ready" && (
                    <Button
                        type="button"
                        onClick={resend}
                        className="rounded-xl bg-blue-600 hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                        <RefreshCw className="mr-2 h-4 w-4"/>
                        Resend email
                    </Button>
                )}
            </div>

            {/* Quick links */}
            <div className="text-center">
                <a
                    href="https://mail.google.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline underline-offset-2"
                >
                    Open Gmail
                </a>
            </div>

            <p className="text-xs text-gray-500 text-center">
                Tip: If you can’t find the email, check Spam or search for “JobHuntly”.
            </p>
        </CardContent>
    );
}
