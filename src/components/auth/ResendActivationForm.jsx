"use client";

import React, {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {resendActivationThunk} from "@/features/auth/authSlice";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Clock, Loader2, Mail, RefreshCw} from "lucide-react";

const formatMMSS = (sec) => {
    const s = Math.max(0, Math.floor(sec));
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
};

export default function ResendActivationForm({
                                                 fallbackCooldownSec = 120,
                                                 ttlSec = 300,
                                             }) {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [sending, setSending] = useState(false);
    const [note, setNote] = useState("");
    const [cooldown, setCooldown] = useState(0);

    // countdown tick
    useEffect(() => {
        if (cooldown <= 0) return;
        const id = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
        return () => clearInterval(id);
    }, [cooldown]);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (sending || cooldown > 0) return;

        setSending(true);
        setNote("");
        try {
            const res = await dispatch(resendActivationThunk(email)).unwrap();
            const nextCd =
                Number(res?.cooldownSec) > 0 ? Number(res.cooldownSec) : fallbackCooldownSec;

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
        <form onSubmit={onSubmit} className="space-y-3">
            <div>
                <Label htmlFor="resend-email" className="text-blue-900/80 font-medium">
                    Email
                </Label>
                <Input
                    id="resend-email"
                    type="email"
                    placeholder="Enter your email"
                    className="mt-1 focus-visible:ring-2 focus-visible:ring-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                />
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <Button
                    type="submit"
                    disabled={sending || cooldown > 0}
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
                            Resend in {formatMMSS(cooldown)}
                        </>
                    ) : (
                        <>
                            <RefreshCw className="mr-2 h-4 w-4"/>
                            Resend Activation Link
                        </>
                    )}
                </Button>
            </div>


            <div className="text-center">
                <a
                    href="https://mail.google.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 hover:underline underline-offset-2"
                >
                    <Mail className="h-4 w-4"/>
                    Open Gmail
                </a>
            </div>

            {note && <p className="text-sm text-gray-600">{note}</p>}
        </form>
    );
}
