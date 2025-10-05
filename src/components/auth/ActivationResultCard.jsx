"use client";

import React from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {CheckCircle2, Home, Loader2, LogIn, XCircle,} from "lucide-react";
import ResendActivationForm from "./ResendActivationForm";

export default function ActivationResultCard({
                                                 status,                 // "pending" | "success" | "failed"
                                                 message,
                                                 redirectCountdown = 0,
                                                 showRedirect = false,
                                                 onGoLogin,
                                                 onGoHome,
                                                 resendProps,            // { ttlSec, fallbackCooldownSec }
                                             }) {
    return (
        <Card className="max-w-md w-full border border-blue-100 shadow-sm">
            <CardHeader className="text-center">
                {status === "pending" && (
                    <>
                        <CardTitle className="text-2xl font-bold text-blue-700">
                            Activate your account
                        </CardTitle>
                        <CardDescription className="text-blue-900/70">
                            We are verifying your activation link. Please wait a moment.
                        </CardDescription>
                    </>
                )}

                {status === "success" && (
                    <>
                        <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold text-green-600">
                            <CheckCircle2 className="h-6 w-6"/>
                            Success
                        </CardTitle>
                        <CardDescription className="text-blue-900/70">
                            Your account is ready to go.
                        </CardDescription>
                    </>
                )}

                {status === "failed" && (
                    <>
                        <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold text-red-600">
                            <XCircle className="h-6 w-6"/>
                            Activation failed
                        </CardTitle>
                        <CardDescription className="text-blue-900/70">
                            The link may be invalid or expired.
                        </CardDescription>
                    </>
                )}
            </CardHeader>

            <CardContent className="space-y-5">
                {/* Message block */}
                <div className="rounded-xl bg-blue-50/70 p-3 text-sm text-blue-900/90">
                    {status === "pending" && (
                        <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin text-blue-600"/>
                            <span>{message}</span>
                        </div>
                    )}
                    {status === "success" && (
                        <div className="space-y-1">
                            <p>{message}</p>
                            {showRedirect && (
                                <p className="text-xs text-blue-700/80">
                                    Redirecting to login in <b>{redirectCountdown}s</b>…
                                </p>
                            )}
                        </div>
                    )}
                    {status === "failed" && <p>{message}</p>}
                </div>

                {/* Actions */}
                {status === "success" && (
                    <div className="flex flex-wrap justify-center gap-3">

                        <Button
                            variant="outline"
                            onClick={onGoHome}
                            className="rounded-xl border-blue-200 text-blue-700 hover:bg-blue-50"
                        >
                            <Home className="mr-2 h-4 w-4"/>
                            Go Home
                        </Button>
                        <Button
                            onClick={onGoLogin}
                            className="rounded-xl bg-blue-600 hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
                        >
                            <LogIn className="mr-2 h-4 w-4"/>
                            Log In
                        </Button>
                    </div>
                )}

                {status === "failed" && (
                    <div className="space-y-4">
                        <div className="text-center text-sm text-blue-900/80">
                            You can request a new activation link below.
                        </div>
                        <ResendActivationForm {...resendProps} />
                    </div>
                )}


            </CardContent>
        </Card>
    );
}
