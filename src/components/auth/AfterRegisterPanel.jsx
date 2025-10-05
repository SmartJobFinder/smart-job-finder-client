"use client";

import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {Button} from "@/components/ui/button";
import {resendActivationThunk} from "@/features/auth/authSlice";
import {ArrowLeft} from "lucide-react";

const formatMMSS = (sec) => {
    const s = Math.max(0, Math.floor(sec));
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
};

export default function AfterRegisterPanel({
                                               email,
                                               color = "blue",
                                               ttlSec = 300,
                                               fallbackCooldownSec = 120,
                                               onBack
                                           }) {
    const dispatch = useDispatch();
    const [cooldown, setCooldown] = useState(0);
    const [sending, setSending] = useState(false);
    const [note, setNote] = useState("");

    const t =
        color === "orange"
            ? {
                border: "border-orange-100",
                title: "text-orange-700",
                text: "text-orange-900/70",
                btnOutline: "border-orange-200 text-orange-700 hover:bg-orange-50",
            }
            : {
                border: "border-blue-100",
                title: "text-blue-700",
                text: "text-blue-900/70",
                btnOutline: "border-blue-200 text-blue-700 hover:bg-blue-50",
            };

    // Khôi phục cooldown theo email (khi reload)
    useEffect(() => {
        if (!email) return;
        try {
            const key = `activationResendAt:${email}`;
            const last = Number(localStorage.getItem(key)) || 0;
            if (!last) return;
            const elapsed = Math.floor((Date.now() - last) / 1000);
            const remain = Math.max(0, fallbackCooldownSec - elapsed);
            if (remain > 0) setCooldown(remain);
        } catch {
        }
    }, [email, fallbackCooldownSec]);

    useEffect(() => {
        if (cooldown <= 0) return;
        const id = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
        return () => clearInterval(id);
    }, [cooldown]);

    const handleResend = async () => {
        if (!email || cooldown > 0 || sending) return;
        setSending(true);
        setNote("");
        try {
            const res = await dispatch(resendActivationThunk(email)).unwrap();
            const nextCd =
                Number(res?.cooldownSec) > 0 ? Number(res.cooldownSec) : fallbackCooldownSec;

            try {
                localStorage.setItem(`activationResendAt:${email}`, String(Date.now()));
            } catch {
            }

            setNote(
                res?.message ||
                "If the email is valid and the account is not activated, a new activation link has been sent.",
            );
            setCooldown(nextCd);
        } catch (err) {
            setNote(err?.message || "Failed to send the request. Please try again.");
        } finally {
            setSending(false);
        }
    };

    return (
        <>
            <h3 className={`text-lg font-semibold mb-1 ${t.title}`}>Check your email</h3>
            <p className={`text-sm ${t.text}`}>
                We sent an activation link to <b>{email}</b>. If you don&apos;t see it, check your spam folder.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
                {typeof onBack === "function" && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onBack}
                        className="rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4"/>
                        Back
                    </Button>
                )}

                <Button
                    type="button"
                    variant="outline"
                    className={`rounded-xl ${t.btnOutline}`}
                    onClick={handleResend}
                    disabled={sending || cooldown > 0}
                >
                    {sending ? "Sending..." : cooldown > 0 ? `Resend in ${formatMMSS(cooldown)}` : "Resend"}
                </Button>
            </div>

            {note && <p className="mt-2 text-xs text-gray-600">{note}</p>}
        </>
    );
}