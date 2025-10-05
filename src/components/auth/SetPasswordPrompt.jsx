"use client";

import React from "react";
import {CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Key, Mail, ShieldCheck} from "lucide-react";

export default function SetPasswordPrompt({email, onYes, onNo, loading = false}) {
    return (

        <CardContent>
            {/* Email chip */}
            <div
                className="mb-4 flex items-center justify-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-sm text-blue-800">
                <Mail className="h-4 w-4"/>
                <span className="font-medium">{email}</span>
            </div>

            {/* Benefits */}
            <ul className="mb-6 space-y-2 text-sm text-blue-900/80">
                <li className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 h-4 w-4 text-blue-500"/>
                    <span>Keep Google Sign-In. This only adds a password option.</span>
                </li>
                <li className="flex items-start gap-2">
                    <Key className="mt-0.5 h-4 w-4 text-blue-500"/>
                    <span>Use email + password when Google isn’t available.</span>
                </li>
            </ul>

            {/* Actions */}
            <div className="flex justify-center gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onNo}
                    disabled={loading}
                    className="rounded-xl border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                    Not now
                </Button>
                <Button
                    type="button"
                    onClick={onYes}
                    disabled={loading}
                    className="rounded-xl bg-blue-600 hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                    Set password
                </Button>
            </div>

            <p className="mt-4 text-center text-xs text-gray-500">
                You can set a password later in Account Settings.
            </p>
        </CardContent>
    );
}
