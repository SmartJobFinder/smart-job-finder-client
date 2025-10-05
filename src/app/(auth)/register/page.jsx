"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import CandidateRegisterForm from "@/components/auth/CandidateRegisterForm";
import RecruiterRegisterForm from "@/components/auth/RecruiterRegisterForm";
import AfterRegisterPanel from "@/components/auth/AfterRegisterPanel";
import RightPanel from "@/components/auth/RightPanel";
import { useSearchParams } from "next/navigation";
import { t } from "@/i18n/i18n";

export default function RegisterPage() {
    const [candidateEmail, setCandidateEmail] = useState("");
    const [recruiterEmail, setRecruiterEmail] = useState("");
    const sp = useSearchParams();
    const initialRole =
        sp.get("role") === "RECRUITER" ? "RECRUITER" : "CANDIDATE";
    const [activeTab, setActiveTab] = useState(initialRole);

    const theme = useMemo(
        () => ({
            CANDIDATE: {
                primary: "text-blue-700",
                secondary: "text-blue-900/70",
                title: t`Create your Candidate account`,
                description:
                    t`Find jobs, track applications, and connect with recruiters.`,
            },
            RECRUITER: {
                primary: "text-blue-700",
                secondary: "text-blue-900/70",
                title: t`Create your Recruiter account`,
                description: t`Post jobs, manage applicants, and hire faster.`,
            },
        }),
        []
    );

    const th = theme[activeTab];

    const showCandidatePanel = Boolean(candidateEmail);
    const showRecruiterPanel = Boolean(recruiterEmail);

    useEffect(() => {
        if (candidateEmail || recruiterEmail) {
            const el = document.scrollingElement || document.documentElement;
            el.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [candidateEmail, recruiterEmail]);

    return (
        <div className="min-h-screen">
            <main className="container px-8 py-8 mx-auto">
                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* Register Form */}
                    <div className="w-full lg:w-1/2">
                        <Card className="shadow-md">
                            <CardHeader className="text-center">
                                <div className="mb-6 text-center">
                                    <h1
                                        className={`text-2xl font-bold tracking-tight ${th.primary}`}
                                    >
                                        {th.title}
                                    </h1>
                                    <p
                                        className={`mt-1 text-sm ${th.secondary}`}
                                    >
                                        {th.description}
                                    </p>
                                </div>
                            </CardHeader>

                            <CardContent>
                                {showCandidatePanel || showRecruiterPanel ? (
                                    showCandidatePanel ? (
                                        <AfterRegisterPanel
                                            email={candidateEmail}
                                            color="blue"
                                            onBack={() => setCandidateEmail("")}
                                        />
                                    ) : (
                                        <AfterRegisterPanel
                                            email={recruiterEmail}
                                            color="blue"
                                            onBack={() => setRecruiterEmail("")}
                                        />
                                    )
                                ) : (
                                    // Chỉ khi CHƯA có panel thì mới hiển thị Tabs + form
                                    <Tabs
                                        value={activeTab}
                                        onValueChange={setActiveTab}
                                        className="w-full"
                                    >
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
                                            <CandidateRegisterForm
                                                role={activeTab}
                                                onRegistered={(email) =>
                                                    setCandidateEmail(email)
                                                }
                                            />
                                        </TabsContent>

                                        <TabsContent value="RECRUITER">
                                            <RecruiterRegisterForm
                                                role={activeTab}
                                                onRegistered={(email) =>
                                                    setRecruiterEmail(email)
                                                }
                                            />
                                        </TabsContent>
                                    </Tabs>
                                )}

                                {!(
                                    showCandidatePanel || showRecruiterPanel
                                ) && (
                                    <div className="mt-6 text-center">
                                        <p className="text-sm text-gray-600">
                                            {t`Already have an account?`}{" "}
                                            <Link
                                                href={`/login?role=${activeTab}`}
                                                className={`font-medium ${
                                                    activeTab === "RECRUITER"
                                                        ? " text-blue-500"
                                                        : activeTab ===
                                                          "CANDIDATE"
                                                        ? " text-blue-500"
                                                        : " text-gray-500"
                                                } hover:underline`}
                                            >
                                                {t`Login Now`}
                                            </Link>
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <RightPanel activeTab={activeTab} />
                </div>
            </main>
        </div>
    );
}
