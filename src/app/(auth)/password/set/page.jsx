"use client";

import React, {useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import SetPasswordForm from "@/components/auth/SetPasswordForm";
import ResendSetPwLink from "@/components/auth/ResendSetPwLink";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {AlertCircle, ShieldCheck} from "lucide-react";

export default function SetPasswordPage() {
    const sp = useSearchParams();
    const router = useRouter();

    const token = sp.get("setpw_token") || "";
    const email = sp.get("email") || "";

    const [tokenInvalid, setTokenInvalid] = useState(!token);

    useEffect(() => {
        setTokenInvalid(!token);
    }, [token]);

    return (
        <div className="min-h-screen grid place-items-center px-4 py-12">
            <Card className="w-full max-w-md border border-blue-100 shadow-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-blue-700">Set password</CardTitle>
                    <CardDescription className="text-blue-900/70">
                        Create a password for your Google-linked Candidate account.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* TH: Token invalid/expired -> hiển thị alert + nút resend */}
                    {tokenInvalid ? (
                        <div className="space-y-4">
                            <div
                                className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                <AlertCircle className="mt-0.5 h-4 w-4"/>
                                <span>
                  The link is invalid or expired. Request a new set-password link below.
                </span>
                            </div>
                            <ResendSetPwLink email={email} fallbackCooldownSec={120}/>
                        </div>
                    ) : (
                        <>
                            <div
                                className="rounded-xl bg-blue-50/60 p-3 text-xs text-blue-900/80 flex items-start gap-2">
                                <ShieldCheck className="h-4 w-4 text-blue-500 mt-0.5"/>
                                <p>
                                    This only <b>adds</b> a password option. You can still sign in with Google anytime.
                                </p>
                            </div>

                            {/* Form đặt mật khẩu; nếu gặp 410/422 sẽ báo ngược lên để hiển thị resend */}
                            <SetPasswordForm
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
