"use client";

import React, {useEffect, useRef, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {useDispatch} from "react-redux";
import {activateThunk} from "@/features/auth/authSlice";
import ActivationResultCard from "@/components/auth/ActivationResultCard";

const RESEND_COOLDOWN_SEC = 120;
const TTL_SEC = 300;
const REDIRECT_AFTER_SUCCESS_SEC = 5;

export default function ActivateClient() {
    const search = useSearchParams();
    const router = useRouter();
    const dispatch = useDispatch();

    const [status, setStatus] = useState("pending"); // pending | success | failed
    const [message, setMessage] = useState("Verifying your activation link...");
    const [redirectCountdown, setRedirectCountdown] = useState(REDIRECT_AFTER_SUCCESS_SEC);

    const calledRef = useRef(false);

    useEffect(() => {
        if (calledRef.current) return;
        calledRef.current = true;

        const token = search.get("active_token");
        if (!token) {
            setStatus("failed");
            setMessage("Invalid token. Please check the link again.");
            return;
        }

        (async () => {
            try {
                const res = await dispatch(activateThunk(token)).unwrap();
                setStatus("success");
                setMessage(res?.message || "Account activated successfully. You can now log in.");
            } catch (e) {
                const st = e?.status;
                const dataMsg = e?.message || e?.data?.message;
                if (st === 409) {
                    setStatus("success");
                    setMessage(dataMsg || "Your account is already activated. You can log in now.");
                    return;
                }
                if (st === 410 || st === 422) {
                    setStatus("failed");
                    setMessage(dataMsg || "Activation link is expired or invalid. Please request a new one.");
                    return;
                }
                setStatus("failed");
                setMessage(dataMsg || "Activation link is invalid or expired.");
            }
        })();
    }, [search, dispatch]);

    useEffect(() => {
        if (status !== "success" || REDIRECT_AFTER_SUCCESS_SEC <= 0) return;
        const id = setInterval(() => setRedirectCountdown((s) => Math.max(0, s - 1)), 1000);
        return () => clearInterval(id);
    }, [status]);

    useEffect(() => {
        if (status === "success" && redirectCountdown <= 0) router.replace("/login");
    }, [status, redirectCountdown, router]);

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <ActivationResultCard
                status={status}
                message={message}
                redirectCountdown={redirectCountdown}
                showRedirect={REDIRECT_AFTER_SUCCESS_SEC > 0}
                onGoLogin={() => router.push("/login")}
                onGoHome={() => router.push("/")}
                resendProps={{ttlSec: TTL_SEC, fallbackCooldownSec: RESEND_COOLDOWN_SEC}}
            />
        </div>
    );
}
