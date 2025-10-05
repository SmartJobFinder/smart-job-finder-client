"use client";

import React, {useEffect, useState} from "react";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import Link from "next/link";
import CandidateLoginForm from "@/components/auth/CandidateLoginForm";
import RecruiterLoginForm from "@/components/auth/RecruiterLoginForm";
import SetPasswordPrompt from "@/components/auth/SetPasswordPrompt";
import SetPasswordEmailSent from "@/components/auth/SetPasswordEmailSent";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import {useRouter, useSearchParams} from "next/navigation";
import RightPanel from "@/components/auth/RightPanel";
import { t } from "@/i18n/i18n";

const LoginPage = () => {
    const router = useRouter();
    const sp = useSearchParams();
    const [view, setView] = useState("login");
    const [googleEmail, setGoogleEmail] = useState("");
    const [tokenFromQuery, setTokenFromQuery] = useState("");
    const [resetTokenFromQuery, setResetTokenFromQuery] = useState("");
    const viewFromQuery = sp.get("view");
    const roleFromQuery = sp.get("role");
    const initialRole = sp.get("role") === "RECRUITER" ? "RECRUITER" : "CANDIDATE";
    const [activeTab, setActiveTab] = useState(initialRole);

    const theme = {
        CANDIDATE: {
            primary: "text-blue-700",
            secondary: "text-blue-900/70",
        },
        RECRUITER: {
            // primary: "text-orange-700",
            // secondary: "text-orange-900/70",
            primary: "text-blue-700",
            secondary: "text-blue-900/70",
        },
    };


    useEffect(() => {
        if (roleFromQuery === "RECRUITER" || roleFromQuery === "CANDIDATE") {
            setActiveTab(roleFromQuery);
        }
    }, [roleFromQuery]);

    const onForgot = () => {
        setView("forgot");
        router.replace("/login?view=forgot", {scroll: false});
    };

    const onGoogleNeedsPassword = (email) => {
        setGoogleEmail(email || "");
        setView("ask_setpw");
        router.replace("/login?view=ask_setpw", {scroll: false});
    };

    const handleAgreeSetPassword = () => {
        setView("setpw_email_sent");
        router.replace("/login?view=setpw_email_sent", {scroll: false});
    };

    const backToLogin = () => {
        setView("login");
        setGoogleEmail("");
        router.replace("/login?view=login", {scroll: false});
    };

    const handleSetPwSuccess = () => {
        setTokenFromQuery("");
        setView("login");
        router.replace("/login?view=login", {scroll: false});
    };

    useEffect(() => {
        const allowed = new Set(["login", "forgot", "ask_setpw", "setpw_email_sent"]);
        setView(allowed.has(viewFromQuery) ? viewFromQuery : "login");
    }, [viewFromQuery]);

    return (
        <div className="min-h-screen ">
            <main className="container px-8 py-8 mx-auto">
                <div className="flex flex-col gap-8 lg:flex-row">
                    <div className="w-full lg:w-1/2">
                        <Card className="shadow-md">
                            <CardHeader className="text-center">
                                <div className="mb-6">
                                    <h1
                                        className={`text-2xl font-bold tracking-tight ${theme[activeTab].primary}`}
                                    >
                                        {view === "login" && t`Login`}
                                        {view === "ask_setpw" && "Google account detected"}
                                        {view === "setpw_email_sent" && "Check your email"}
                                    </h1>
                                    <p className={`mt-1 text-sm ${theme[activeTab].secondary}`}>
                                        {view === "login" &&
                                            t`Link your account to continue using Job Huntly's services.`}
                                        {view === "ask_setpw" &&
                                            t`This account uses Google Sign-In. Do you want to set a password so you can log in with email/password too?`}
                                        {view === "setpw_email_sent" &&
                                            t`We sent a set-password link to your email. Click the link to continue here.`}

                                    </p>
                                </div>
                            </CardHeader>

                            <CardContent>
                                {view === "login" && (
                                    <>
                                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                            <TabsList className="grid w-full grid-cols-2">
                                                <TabsTrigger
                                                    value="CANDIDATE"
                                                    className="data-[state=active]:border-blue-500 data-[state=active]:text-blue-500"
                                                >
                                                    {t`Candidate`}
                                                </TabsTrigger>
                                                <TabsTrigger
                                                    value="RECRUITER"
                                                    className="data-[state=active]:border-blue-500 data-[state=active]:text-blue-500"
                                                >
                                                    {t`Recruiter`}
                                                </TabsTrigger>
                                            </TabsList>

                                            <TabsContent value="CANDIDATE">
                                                <CandidateLoginForm
                                                    role={activeTab}
                                                    onGoogleNeedsPassword={onGoogleNeedsPassword}
                                                    onForgot={onForgot}
                                                />
                                            </TabsContent>

                                            <TabsContent value="RECRUITER">
                                                <RecruiterLoginForm
                                                    role={activeTab}
                                                    onForgot={onForgot}
                                                />
                                            </TabsContent>
                                            <div className="text-center">
                                                <div className="text-center">
                                                    <button
                                                        type="button"
                                                        className={`text-sm font-medium ${
                                                            activeTab === "RECRUITER"
                                                                ? " text-blue-600"
                                                                : activeTab === "CANDIDATE"
                                                                    ? " text-blue-600"
                                                                    : " text-gray-600"
                                                        } hover:underline`}
                                                        onClick={() => onForgot?.()}
                                                    >
                                                        {t`Forgot password?`}
                                                    </button>
                                                </div>
                                            </div>
                                        </Tabs>

                                        <div className="mt-6 text-center">
                                            <p className="text-sm text-gray-600">
                                                {t`Don't have an account yet?`}{" "}
                                                <Link
                                                    href={`/register?role=${activeTab}`}
                                                    className={`font-medium ${
                                                        activeTab === "RECRUITER"
                                                            ? " text-blue-600"
                                                            : activeTab === "CANDIDATE"
                                                                ? " text-blue-600"
                                                                : " text-gray-500"
                                                    } hover:underline`}
                                                >
                                                    {t`Create one`}
                                                </Link>
                                            </p>
                                        </div>
                                    </>
                                )}

                                {view === "ask_setpw" && (
                                    <SetPasswordPrompt
                                        email={googleEmail}
                                        onYes={handleAgreeSetPassword}
                                        onNo={backToLogin}
                                    />
                                )}

                                {view === "setpw_email_sent" && (
                                    <SetPasswordEmailSent
                                        email={googleEmail}
                                        onBack={backToLogin}
                                    />
                                )}

                                {view === "forgot" && (
                                    <ForgotPasswordForm onBack={() => setView("login")} activeTab={activeTab}/>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <RightPanel activeTab={activeTab}/>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;
