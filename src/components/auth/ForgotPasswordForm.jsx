"use client";

import {useDispatch} from "react-redux";
import {useEffect, useMemo, useState} from "react";
import {forgotPasswordThunk} from "@/features/auth/authSlice";
import {toast} from "react-toastify";
import clsx from "clsx";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {ArrowLeft, CheckCircle2, Clock, Loader2, Mail} from "lucide-react";

const COOLDOWN_SEC = 120;
const formatMMSS = (sec) => {
    const s = Math.max(0, Math.floor(sec));
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
};

export default function ForgotPasswordForm({onBack, activeTab = "CANDIDATE"}) {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");

    // phase: idle | ready | sending | cooldown
    const [phase, setPhase] = useState("idle");
    const [cooldown, setCooldown] = useState(0);
    const [justSent, setJustSent] = useState(false);

    const theme = useMemo(
        () =>
            activeTab === "RECRUITER"
                ? {
                    textPrimary: "text-blue-700",
                    textSecondary: "text-blue-900/70",
                    ring: "focus-visible:ring-blue-500",
                    icon: "text-blue-300",
                    btnSolid: "bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500",
                    btnOutline:
                        "border-blue-200 text-blue-700 hover:bg-blue-50 focus-visible:ring-blue-500",
                    border: "border-blue-100",
                    gradient: "from-blue-50 to-blue-100",
                    spinner: "text-blue-600",
                }
                : {
                    textPrimary: "text-blue-700",
                    textSecondary: "text-blue-900/70",
                    ring: "focus-visible:ring-blue-500",
                    icon: "text-blue-300",
                    btnSolid: "bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500",
                    btnOutline:
                        "border-blue-200 text-blue-700 hover:bg-blue-50 focus-visible:ring-blue-500",
                    border: "border-blue-100",
                    gradient: "from-blue-50 to-blue-100",
                    spinner: "text-blue-600",
                },
        [activeTab]
    );

    // Tick cooldown
    useEffect(() => {
        if (phase !== "cooldown" || cooldown <= 0) return;
        const id = setInterval(() => {
            setCooldown((s) => {
                const next = Math.max(0, s - 1);
                if (next === 0) setPhase("ready");
                return next;
            });
        }, 1000);
        return () => clearInterval(id);
    }, [phase, cooldown]);

    const isEmailValid = /\S+@\S+\.\S+/.test(email);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!email || !isEmailValid || phase === "sending" || phase === "cooldown") return;

        setJustSent(false);
        setPhase("sending");
        try {
            await dispatch(forgotPasswordThunk(email)).unwrap();
            toast.success("Please check your email, we have sent you a password reset link.", {
                autoClose: 3000,
            });
            setJustSent(true);
            setCooldown(COOLDOWN_SEC);   // ⬅️ chỉ bắt đầu đếm sau khi gửi THÀNH CÔNG
            setPhase("cooldown");
        } catch (err) {
            toast.error(err?.message || "Failed to send the email. Please try again.");
            setPhase("ready");           // ⬅️ quay lại trạng thái sẵn sàng
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <div className="mb-6 text-center">
                <h2 className={clsx("text-2xl font-bold tracking-tight", theme.textPrimary)}>
                    Forgot password
                </h2>
                <p className={clsx("mt-1 text-sm", theme.textSecondary)}>
                    Enter the email associated with your account and we’ll send a reset link.
                </p>
                {justSent && (
                    <div
                        className="inline-flex items-center gap-2 px-3 py-2 mt-3 text-sm bg-white border rounded-lg shadow-sm">
                        <CheckCircle2 className={clsx("h-4 w-4", theme.textPrimary)}/>
                        <span className="text-gray-700">Reset email sent. Please check your inbox.</span>
                    </div>
                )}
            </div>

            <div className={clsx("rounded-2xl border bg-white p-5 shadow-sm", theme.border)}>
                <form onSubmit={onSubmit} className="space-y-4" noValidate>
                    <div>
                        <Label htmlFor="fp-email" className={clsx("font-medium", theme.textSecondary)}>
                            Email
                        </Label>
                        <div className="relative mt-1">
                            <Mail
                                className={clsx(
                                    "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2",
                                    theme.icon
                                )}
                            />
                            <Input
                                id="fp-email"
                                type="email"
                                placeholder="you@example.com"
                                className={clsx("pl-10", theme.ring, "focus-visible:ring-2")}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoFocus
                                autoComplete="email"
                            />
                        </div>
                        {!isEmailValid && email.length > 0 && (
                            <p className="mt-1 text-sm text-red-500">Please enter a valid email address.</p>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                        {typeof onBack === "function" && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onBack}
                                className={clsx("rounded-xl", theme.btnOutline, "border")}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2"/>
                                Back
                            </Button>
                        )}

                        {/* SENDING: chỉ hiện khi đang gọi API */}
                        {phase === "sending" && (
                            <Button
                                type="button"
                                disabled
                                variant="outline"
                                className={clsx("rounded-xl border", theme.btnOutline)}
                            >
                                <Loader2 className={clsx("mr-2 h-4 w-4 animate-spin", theme.spinner)}/>
                                Sending…
                            </Button>
                        )}

                        {/* COOLDOWN: chỉ hiện sau khi gửi thành công */}
                        {phase === "cooldown" && (
                            <span
                                className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 border rounded-xl">
                <Clock className="w-4 h-4"/>
                You can resend in {formatMMSS(cooldown)}
              </span>
                        )}

                        {/* Submit chỉ hiện khi KHÔNG sending & KHÔNG cooldown */}
                        {(phase === "idle" || phase === "ready") && (
                            <Button
                                type="submit"
                                disabled={!isEmailValid}
                                className={clsx("ml-auto rounded-xl", theme.btnSolid, "w-[180px]")}
                            >
                                {justSent ? "Resend link" : "Send reset link"}
                            </Button>
                        )}
                    </div>
                </form>
            </div>

            <div
                className={clsx(
                    "mt-6 rounded-xl bg-gradient-to-r p-4 text-xs text-gray-700",
                    theme.gradient
                )}
            >
                Tip: If you don’t see the email, check your spam folder or search for “JobHuntly”.
            </div>
        </div>
    );
}
