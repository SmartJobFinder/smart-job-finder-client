"use client";

import * as React from "react";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {AlertTriangle, Ban, Info, Mail} from "lucide-react";

export default function BannedPanel({
                                        email = "",
                                        contactEmail = "help.jobhuntly@gmail.com",
                                        reason = "",
                                        onDismiss,
                                        className = "",
                                    }) {
    const subject = encodeURIComponent("[Appeal] Banned account assistance");
    const body = encodeURIComponent(
        `Hello Support,

I believe my account was banned by mistake. Could you please review?

Email: ${email || "(not provided)"}
Details:
- Describe your situation here...

Thank you.`
    );
    const mailtoHref = `mailto:${contactEmail}?subject=${subject}&body=${body}`;

    return (
        <Card className={`w-full border border-red-200/80 shadow-sm ${className}`}>
            <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
                        <Ban className="h-5 w-5 text-red-600"/>
                    </div>
                    <div className="flex-1">
                        <CardTitle className="text-xl font-semibold text-red-700">
                            Your account has been banned
                        </CardTitle>
                        <CardDescription className="text-red-900/80">
                            If you believe this is a mistake, please contact our support team: <a
                            href={`mailto:${"help.jobhuntly@gmail.com"}`}
                            className="text-blue-500 underline"
                        >
                            help.jobhuntly@gmail.com
                        </a>
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                {email ? (
                    <div className="flex items-center gap-2 text-sm">
                        <Info className="h-4 w-4 text-gray-500"/>
                        <span className="text-gray-700">
              Signed-in email:&nbsp;
                            <Badge variant="secondary" className="font-medium">
                {email}
              </Badge>
            </span>
                    </div>
                ) : null}

                {reason ? (
                    <div
                        className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                        <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0"/>
                        <p>
                            <span className="font-medium">Reason:</span> {reason}
                        </p>
                    </div>
                ) : (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700">
                        We can review your case after you get in touch. Please include any relevant details to help us
                        verify.
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex flex-wrap justify-between gap-3">
                <Button
                    asChild
                    className="rounded-xl bg-red-600 hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-500"
                >
                    <a href={mailtoHref}>
                        <Mail className="mr-2 h-4 w-4"/>
                        Contact support
                    </a>
                </Button>

                {onDismiss && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onDismiss}
                        className="rounded-xl border-red-200 text-red-700 hover:bg-red-50"
                    >
                        Dismiss
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
