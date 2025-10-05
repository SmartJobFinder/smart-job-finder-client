"use client";

import React from "react";
import LoadingScreen from "@/components/ui/loadingScreen";
import { useGetMetaQuery } from "@/services/interviewService";
import { JitsiMeeting } from "@jitsi/react-sdk";

export default function InterviewJoinPage({ params }) {
    const p = React.use(params);
    const id = p?.id;

    const { data: meta, isLoading, isError, refetch } = useGetMetaQuery(id);
    const iframeRef = React.useRef(null);
    const [warnMessage, setWarnMessage] = React.useState(null);

    if (isLoading) return <LoadingScreen message="Loading interview..." />;
    if (isError || !meta)
        return (
            <div className="max-w-3xl p-6 mx-auto">
                <p className="text-rose-600">
                    Failed to load interview. Please try again.
                </p>
                <button
                    onClick={() => refetch()}
                    className="px-3 py-2 mt-3 text-white bg-blue-600 rounded"
                >
                    Retry
                </button>
            </div>
        );

    const room = meta.meetingRoom;
    const JITSI_BASE = "https://meet.jit.si";

    const portal = (() => {
        if (!room && meta.meetingUrl) return meta.meetingUrl;
        if (!room) return null;
        if (/^https?:\/\//i.test(room)) return room;
        return `${JITSI_BASE}/${encodeURIComponent(room)}`;
    })();

    // handlers for events from the embedded Jitsi (via external API)
    function handleApiReady(externalApi) {
        externalApi.addEventListener("conferenceFailed", (err) => {
            console.warn("conferenceFailed", err);
            const reason =
                err?.name || (err && JSON.stringify(err)) || "unknown";
            if (
                String(reason).toLowerCase().includes("membersonly") ||
                String(reason).toLowerCase().includes("members_only")
            ) {
                setWarnMessage(
                    "Room has a lobby (members-only). Please wait for moderator to admit you or open portal."
                );
            } else {
                setWarnMessage(`Conference failed: ${reason}`);
            }
        });

        // externalApi.addEventListener("videoConferenceLeft", () => {
        //     console.log("left conference");
        // });

        // externalApi.addEventListener("participantRoleChanged", (ev) => {
        //     console.log("participantRoleChanged", ev);
        // });
    }

    return (
        <div className="px-6 py-2 mx-auto space-y-6 max-w-7xl">
            <div className="p-4 bg-white rounded shadow">
                <h1 className="text-2xl font-bold">{meta.jobTitle}</h1>
                <div className="text-sm text-gray-600">{meta.companyName}</div>
                <div className="mt-2 text-sm text-gray-700">
                    {new Date(meta.scheduledAt).toLocaleString()} · Duration:{" "}
                    {meta.durationMinutes} minutes
                </div>
                <div className="flex flex-col items-start gap-2 mt-5">
                    <a
                        href={portal}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 font-medium text-white bg-blue-800 border rounded-md"
                    >
                        Open portal
                    </a>
                    <p className="max-w-xs text-sm text-gray-600">
                        If the embedded version fails, please click this button
                        and we’ll redirect you to Jitsi in a new tab.
                    </p>
                </div>
            </div>

            {warnMessage && (
                <div className="p-3 text-sm text-yellow-800 border border-yellow-200 rounded bg-yellow-50">
                    {warnMessage}
                </div>
            )}

            {room ? (
                <div className="overflow-hidden bg-black rounded">
                    <JitsiMeeting
                        domain="meet.jit.si"
                        roomName={room}
                        configOverwrite={{
                            prejoinPageEnabled: false, // important: removes prejoin screen (để tránh re-init khi click "I'm moderator")
                            enableWelcomePage: false,
                            startWithAudioMuted: true,
                            startWithVideoMuted: false,
                            disableDeepLinking: true,
                            // other config you need
                        }}
                        interfaceConfigOverwrite={{
                            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                            // thêm interface options nếu muốn
                        }}
                        userInfo={{
                            displayName: undefined,
                        }}
                        onApiReady={handleApiReady}
                        getIFrameRef={(node) => {
                            iframeRef.current = node;
                            if (node) {
                                node.style.height = "640px"; // set desired height
                                node.style.width = "100%";
                            }
                        }}
                    />
                </div>
            ) : (
                <div className="p-4 rounded bg-gray-50">
                    <p className="text-sm text-gray-700">
                        Meeting room not available (no embed). Use portal link
                        instead:
                    </p>
                    {portal ? (
                        <a
                            href={portal}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block mt-2 text-blue-600 hover:underline"
                        >
                            Open portal
                        </a>
                    ) : (
                        <p className="text-sm text-gray-500">
                            No meeting URL provided.
                        </p>
                    )}
                </div>
            )}

            <div className="text-sm text-gray-500">
                If embed fails, open the portal link.
            </div>
        </div>
    );
}
