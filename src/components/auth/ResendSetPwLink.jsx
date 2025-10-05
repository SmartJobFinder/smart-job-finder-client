"use client";

import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {sendSetPasswordLinkThunk} from "@/features/auth/authSlice";
import {Clock, Loader2, Mail, RefreshCw} from "lucide-react";

const formatMMSS = (sec) => {
    const s = Math.max(0, Math.floor(sec));
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
};

const isValidEmail = (v) =>
    !!v && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());

export default function ResendSetPwLink({
                                            email: defaultEmail = "",
                                            fallbackCooldownSec = 120,
                                        }) {
    const dispatch = useDispatch();

    const [email, setEmail] = useState(defaultEmail);
    const [cooldown, setCooldown] = useState(0);
    const [sending, setSending] = useState(false);
    const [note, setNote] = useState("");

    // Khôi phục cooldown theo email
    useEffect(() => {
        if (!isValidEmail(email)) return;
        try {
            const key = `setPwResendAt:${email}`;
            const last = Number(localStorage.getItem(key)) || 0;
            if (!last) return;
            const elapsed = Math.floor((Date.now() - last) / 1000);
            const remain = Math.max(0, fallbackCooldownSec - elapsed);
            if (remain > 0) setCooldown(remain);
        } catch {
        }
    }, [email, fallbackCooldownSec]);

    // Tick đếm ngược
    useEffect(() => {
        if (cooldown <= 0) return;
        const id = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
        return () => clearInterval(id);
    }, [cooldown]);

    const disabled = sending || cooldown > 0 || !isValidEmail(email);

    const resend = async () => {
        if (disabled) return;
        setSending(true);
        setNote("");
        try {
            const res = await dispatch(sendSetPasswordLinkThunk(email)).unwrap();
            const nextCd =
                Number(res?.cooldownSec) > 0 ? Number(res.cooldownSec) : fallbackCooldownSec;

            try {
                localStorage.setItem(`setPwResendAt:${email}`, String(Date.now()));
            } catch {
            }

            setNote(
                res?.message ||
                "If the email is valid, a new set-password link has been sent.",
            );
            setCooldown(nextCd);
        } catch (err) {
            setNote(err?.message || "Failed to send the request. Please try again.");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="space-y-3">
            {/* Email input (luôn hiện, prefill nếu có) */}
            <div>
                <Label htmlFor="resend-setpw-email" className="text-blue-900/80 font-medium">
                    Email
                </Label>
                <div className="mt-1 flex items-center gap-2">
                    <div className="relative flex-1">
                        <Mail
                            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-300"/>
                        <Input
                            id="resend-setpw-email"
                            type="email"
                            placeholder="you@example.com"
                            className="pl-10 focus-visible:ring-2 focus-visible:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                        />
                    </div>

                    <Button
                        type="button"
                        onClick={resend}
                        disabled={disabled}
                        className="rounded-xl bg-blue-600 hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                        {sending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                Sending…
                            </>
                        ) : cooldown > 0 ? (
                            <>
                                <Clock className="mr-2 h-4 w-4"/>
                                {formatMMSS(cooldown)}
                            </>
                        ) : (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4"/>
                                Resend link
                            </>
                        )}
                    </Button>
                </div>

            </div>

            {note && <p className="text-sm text-gray-600">{note}</p>}
        </div>
    );
}
