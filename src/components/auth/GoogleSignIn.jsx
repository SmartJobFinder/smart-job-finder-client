"use client";

import {useEffect, useRef} from "react";
import {useRouter} from "next/navigation";
import {toast} from "react-toastify";
import {useDispatch} from "react-redux";
import {meThunk} from "@/features/auth/authSlice";
import {API_CONFIG} from "@/lib/config";

export default function GoogleSignIn({role = "CANDIDATE", onBanned}) {
    const btnRef = useRef(null);
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!window.google) return;
        if (btnRef.current && btnRef.current.childElementCount > 0) return;

        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        if (!clientId) {
            return;
        }

        window.google.accounts.id.initialize({
            client_id: clientId,
            callback: async ({credential}) => {
                try {
                    const res = await fetch(
                        `${API_CONFIG.BASE_URL}/auth/google`,
                        {
                            method: "POST",
                            headers: {"Content-Type": "application/json"},
                            credentials: "include",
                            body: JSON.stringify({idToken: credential}),
                        },
                    );

                    const data = await res.json().catch(() => ({}));
                    if (!res.ok) throw data;

                    await dispatch(meThunk()).unwrap();

                    toast.success(
                        data?.message || "Google sign-in successful!",
                    );
                    router.replace("/");
                } catch (err) {
                    if (err?.status === 403 && err?.code === "ACCOUNT_BANNED") {
                        const contact = err?.extra?.contactEmail || "help.jobhuntly@gmail.com";
                        onBanned({
                            email: err?.extra?.email,
                            contactEmail: contact,
                            reason: err?.extra?.reason || "",
                        });
                        return;
                    }
                    const msg =
                        err?.detail ||
                        err?.title ||
                        err?.message ||
                        err?.data?.message ||
                        "Google sign-in failed";
                    toast.error(msg);
                }
            },

            ux_mode: "popup",
            auto_select: false,
            use_fedcm_for_prompt: true,
        });

        window.google.accounts.id.renderButton(btnRef.current, {
            type: "standard",
            theme: "outline",
            size: "large",
            text: "sign_in_with",
            shape: "pill",
            logo_alignment: "left",
            width: 360,
        });

        window.google.accounts.id.prompt();
    }, [role, dispatch, router, onBanned]);

    return <div ref={btnRef} className="w-full flex justify-center"/>;
}
