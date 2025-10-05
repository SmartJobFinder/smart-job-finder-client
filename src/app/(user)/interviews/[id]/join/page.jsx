"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/ui/loadingScreen";
import { useGetMetaQuery } from "@/services/interviewService";
import { Video } from "lucide-react";
import { JitsiMeeting } from "@jitsi/react-sdk";

export default function InterviewDetailPage({ params }) {
    const p = React.use(params);
    const id = p?.id;
    const router = useRouter();

    const { data: meta, isLoading, isError, refetch } = useGetMetaQuery(id);
    const [joining, setJoining] = useState(false);
    const [embedShown, setEmbedShown] = useState(false);
    const [warnMessage, setWarnMessage] = useState(null);
    const jitsiApiRef = useRef(null);
    const iframeRef = useRef(null);

    // set document title
    useEffect(() => {
        if (meta) document.title = `${meta.jobTitle} — ${meta.companyName}`;
        return () => {
            document.title = "JobHuntly";
        };
    }, [meta]);

    // cleanup jitsi api on unmount
    useEffect(() => {
        return () => {
            if (jitsiApiRef.current) {
                try {
                    jitsiApiRef.current.dispose();
                } catch (e) {
                    /* ignore */
                }
                jitsiApiRef.current = null;
            }
        };
    }, []);

    function handleApiReady(externalApi) {
        // store ref
        jitsiApiRef.current = externalApi;

        // conference failure (lobby / membersOnly etc.)
        externalApi.addEventListener("conferenceFailed", (err) => {
            console.warn("conferenceFailed", err);
            const reason =
                err?.name || (err && JSON.stringify(err)) || "unknown";
            if (
                String(reason).toLowerCase().includes("membersonly") ||
                String(reason).toLowerCase().includes("members_only") ||
                String(reason).toLowerCase().includes("members-only")
            ) {
                setWarnMessage(
                    "Room is members-only (lobby). Please wait for the moderator to admit you or open the portal link."
                );
            } else {
                setWarnMessage(`Conference failed: ${reason}`);
            }
        });

        externalApi.addEventListener("videoConferenceLeft", () => {
            // disposed by SDK sometimes; keep ref null
            try {
                // don't forcibly dispose here; let sdk handle
            } catch (e) {}
        });

        externalApi.addEventListener("participantRoleChanged", (ev) => {
            // useful to debug role changes (moderator etc.)
            console.log("participantRoleChanged", ev);
        });
    }

    async function onClickJoin() {
        if (!meta || joining) return;
        setJoining(true);
        setWarnMessage(null);
        // show the embed (JitsiMeeting mounts and will call onApiReady)
        setEmbedShown(true);
        // small delay to give Jitsi a moment
        setTimeout(() => setJoining(false), 600);
    }

    if (isLoading) return <LoadingScreen message="Loading interview..." />;
    if (isError || !meta)
        return (
            <div className="max-w-3xl p-6 mx-auto">
                <p className="text-rose-600">
                    Failed to load interview. Please try again.
                </p>
                <button
                    onClick={() => refetch()}
                    className="px-3 py-2 mt-4 text-white bg-blue-600 rounded"
                >
                    Retry
                </button>
            </div>
        );

    const room = meta.meetingRoom; // jobhuntly-uuid
    const JITSI_BASE = "https://meet.jit.si";

    // Build portal URL: if meetingRoom looks like a full URL, use it; otherwise join with Jitsi domain.
    // Fallback to meta.meetingUrl if neither exists.
    const portal = (() => {
        if (!room && meta.meetingUrl) return meta.meetingUrl;
        if (!room) return null;
        // if room already starts with http(s) use as-is
        if (/^https?:\/\//i.test(room)) return room;
        // otherwise build meet.jit.si/<room>
        return `${JITSI_BASE}/${encodeURIComponent(room)}`;
    })();

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="p-4 bg-white rounded shadow">
                <h1 className="text-2xl font-bold">{meta.jobTitle}</h1>
                <div className="text-sm text-gray-600">{meta.companyName}</div>
                <div className="mt-2 text-sm text-gray-700">
                    {new Date(meta.scheduledAt).toLocaleString()} · Duration:{" "}
                    {meta.durationMinutes} minutes
                </div>

                <div className="flex gap-2 mt-4">
                    <button
                        onClick={onClickJoin}
                        disabled={joining || embedShown}
                        className="inline-flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded disabled:opacity-50"
                    >
                        <Video className="w-4 h-4" />
                        {joining
                            ? "Joining…"
                            : embedShown
                            ? "Embedded"
                            : "Join meeting (embed)"}
                    </button>

                    {portal && (
                        <a
                            href={portal}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 text-blue-600 border rounded"
                        >
                            Open portal
                        </a>
                    )}
                </div>
            </div>

            {warnMessage && (
                <div className="p-3 text-sm text-yellow-800 border border-yellow-200 rounded bg-yellow-50">
                    {warnMessage}
                </div>
            )}

            {embedShown && room ? (
                <div className="overflow-hidden bg-black rounded">
                    <JitsiMeeting
                        domain="meet.jit.si"
                        roomName={room}
                        configOverwrite={{
                            prejoinPageEnabled: false, // reduces re-init when pressing moderator/prejoin actions
                            enableWelcomePage: false,
                            startWithAudioMuted: true,
                            startWithVideoMuted: false,
                            disableDeepLinking: true,
                        }}
                        interfaceConfigOverwrite={{
                            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                        }}
                        userInfo={{ displayName: undefined }}
                        onApiReady={(api) => handleApiReady(api)}
                        getIFrameRef={(node) => {
                            iframeRef.current = node;
                            if (node) {
                                node.style.height = "640px";
                                node.style.width = "100%";
                            }
                        }}
                    />
                </div>
            ) : (
                <div ref={iframeRef} className="h-[640px] bg-black rounded" />
            )}

            <div className="text-sm text-gray-500">
                If embed fails, open the portal link.
            </div>
        </div>
    );
}
