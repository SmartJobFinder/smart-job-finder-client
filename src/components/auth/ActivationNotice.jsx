"use client";

import {useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import {resendActivationThunk} from "@/features/auth/authSlice";
import Link from "next/link";

const formatMMSS = (sec) => {
    const s = Math.max(0, Math.floor(sec));
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
};

const TTL_SEC = 300;
const COOLDOWN_FALLBACK_SEC = 120;

export default function ActivationNotice({email}) {
    const dispatch = useDispatch();
    const [cooldown, setCooldown] = useState(0);
    const [sending, setSending] = useState(false);
    const [note, setNote] = useState("");

    // Khôi phục cooldown nếu từng bấm resend trước đó (per email)
    useEffect(() => {
        if (!email) return;
        try {
            const key = `activationResendAt:${email}`;
            const last = Number(localStorage.getItem(key)) || 0;
            if (!last) return;
            const elapsed = Math.floor((Date.now() - last) / 1000);
            const remain = Math.max(0, COOLDOWN_FALLBACK_SEC - elapsed);
            if (remain > 0) setCooldown(remain);
        } catch {
        }
    }, [email]);

    // Tick
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
                Number(res?.cooldownSec) > 0 ? Number(res.cooldownSec) : COOLDOWN_FALLBACK_SEC;
            try {
                localStorage.setItem(`activationResendAt:${email}`, String(Date.now()));
            } catch {
            }
            setNote(
                res?.message ||
                "If the email is valid and the account is not activated, a new activation link has been sent."
            );
            setCooldown(nextCd);
        } catch (err) {
            setNote(err?.message || "Failed to send the request. Please try again.");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto rounded-2xl border p-6 shadow-sm text-center">
            <h1 className="text-2xl font-semibold mb-2">Check your email</h1>
            {email ? (
                <p className="text-gray-700">
                    We sent an activation link to <b>{email}</b>. If you don&apos;t see it, check your spam folder.
                </p>
            ) : (
                <p className="text-gray-700">
                    We sent an activation link to your email. Please check your inbox (and spam folder).
                </p>
            )}

            <div className="mt-5 flex items-center justify-center gap-3">
                <button
                    type="button"
                    className="px-4 py-2 rounded-xl border disabled:opacity-50"
                    onClick={handleResend}
                    disabled={sending || cooldown > 0 || !email}
                >
                    {sending
                        ? "Sending..."
                        : cooldown > 0
                            ? `Resend in ${formatMMSS(cooldown)}`
                            : "Resend"}
                </button>
            </div>

            {note && <p className="mt-3 text-sm text-gray-600">{note}</p>}

            <div className="mt-6">
                <Link href="/login" className="text-blue-600 hover:underline">
                    Go to Login
                </Link>
            </div>
        </div>
    );
}
