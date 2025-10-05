"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import SockJS from "sockjs-client";
import { Client as StompClient } from "@stomp/stompjs";
import { useRouter } from "next/navigation";

/** format "time ago" ngắn gọn */
function timeAgo(iso) {
    if (!iso) return "";
    const s = Math.max(
        1,
        Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
    );
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h`;
    const d = Math.floor(h / 24);
    return `${d}d`;
}
const FORCE_XHR_ONLY = false;
const WATCHDOG_CHECK_MS = 30_000; // 30s kiểm tra 1 lần
const WATCHDOG_STALE_MS = 60_000; // >60s không thấy frame/heartbeat => stale
const HIDDEN_POLL_MS = 60_000; // tab ẩn thì 60s poll API 1 lần

export default function NotificationBell({ className = "" }) {
    const router = useRouter();
    const NEXT_PUBLIC_API_BASE = `${process.env.NEXT_PUBLIC_API_PROXY_TARGET}${process.env.NEXT_PUBLIC_API_BASE_URL}/`;
    const API_BASE = (NEXT_PUBLIC_API_BASE || "").replace(/\/+$/, "");
    const WS_ENDPOINT = process.env.NEXT_PUBLIC_WS_ENDPOINT || "/ws";
    const SUB_DEST_TEMPLATE =
        process.env.NEXT_PUBLIC_SUB_DEST || "/user/queue/noti";
    const userId =
        typeof window !== "undefined" ? window?._appUserId : undefined;
    const SUB_DEST = SUB_DEST_TEMPLATE.includes("{userId}")
        ? SUB_DEST_TEMPLATE.replace("{userId}", String(userId ?? ""))
        : SUB_DEST_TEMPLATE;

    const [open, setOpen] = useState(false);
    const [count, setCount] = useState(0);
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const stompRef = useRef(null);
    const subRef = useRef(null);
    const refetchTimerRef = useRef(null);
    const openRef = useRef(false);
    const lastBeatRef = useRef(Date.now());
    const watchdogRef = useRef(null);

    // chống trùng id
    const knownIdsRef = useRef(new Set());
    const getKey = (it) =>
        it?.id ??
        it?.clientId ??
        it?.uuid ??
        it?.notiId ??
        it?.providerId ??
        null;

    const mergeUnique = (prev, incoming, prepend = false) => {
        const next = [...prev];
        (incoming || []).forEach((it) => {
            if (!it) return;
            const rawKey = getKey(it);
            if (rawKey == null) return;
            const key = String(rawKey);

            if (!knownIdsRef.current.has(key)) {
                knownIdsRef.current.add(key);
                const normalized = { ...it, id: key, _k: key };
                prepend ? next.unshift(normalized) : next.push(normalized);
            } else {
                const idx = next.findIndex(
                    (x) => (x._k ?? String(x.id)) === key
                );
                if (idx >= 0)
                    next[idx] = { ...next[idx], ...it, id: key, _k: key };
            }
        });
        return next;
    };

    const displayCount = count > 99 ? "99+" : count;
    const fetchUnreadCount = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/notifications/unread-count`, {
                credentials: "include",
                cache: "no-store",
            });
            if (res.ok) {
                const n = await res.json();
                setCount(typeof n === "number" ? n : 0);
            }
        } catch (_) {}
    }, [API_BASE]);

    const fetchFeed = useCallback(
        async (p = 0, append = false) => {
            try {
                if (!append) setLoading(true);
                const res = await fetch(
                    `${API_BASE}/notifications/feed?page=${p}&size=${size}`,
                    { credentials: "include", cache: "no-store" }
                );
                if (res.ok) {
                    const data = await res.json();
                    const list = data?.items || [];

                    setTotalPages(data?.totalPages ?? 0);
                    setPage(p);

                    setItems((prev) => {
                        if (!append) {
                            knownIdsRef.current.clear();
                            return mergeUnique([], list, false);
                        }
                        return mergeUnique(prev, list, false);
                    });

                    if (!append && typeof data?.unreadCount === "number") {
                        setCount(data.unreadCount);
                    }
                }
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        },
        [API_BASE, size]
    );

    const markAllRead = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/notifications/mark-all-read`, {
                method: "POST",
                credentials: "include",
            });
            if (res.ok) {
                setItems((prev) =>
                    prev.map((it) =>
                        it.isRead
                            ? it
                            : {
                                  ...it,
                                  isRead: true,
                                  readAt: new Date().toISOString(),
                              }
                    )
                );
                setCount(0);
            }
        } catch (_) {}
    }, [API_BASE]);

    const markReadIds = useCallback(
        async (ids) => {
            if (!ids?.length) return;
            try {
                const res = await fetch(`${API_BASE}/notifications/mark-read`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(ids),
                });
                if (res.ok) {
                    setItems((prev) =>
                        prev.map((it) =>
                            ids.includes(it.id)
                                ? {
                                      ...it,
                                      isRead: true,
                                      readAt: new Date().toISOString(),
                                  }
                                : it
                        )
                    );
                    setCount((prev) => Math.max(0, prev - ids.length));
                }
            } catch (_) {}
        },
        [API_BASE]
    );

    const onItemClick = useCallback(
        async (it) => {
            if (!it) return;

            if (!it.isRead && it.id) await markReadIds([it.id]);

            let target = null;
            if (it.jobId) target = `/job-detail/${it.jobId}`;
            else if (it.link) target = it.link.trim();

            setOpen(false);

            if (!target) return;
            if (/^https?:\/\//i.test(target)) {
                window.location.href = target;
            } else {
                router.push(target);
            }
        },
        [markReadIds, router]
    );

    const loadMore = useCallback(async () => {
        if (loadingMore) return;
        if (page + 1 >= totalPages) return;
        setLoadingMore(true);
        await fetchFeed(page + 1, true);
    }, [fetchFeed, loadingMore, page, totalPages]);

    // ---- WS connect
    const connectStomp = useCallback(() => {
        if (stompRef.current?.active) return;

        const TRANSPORTS = FORCE_XHR_ONLY
            ? ["xhr-streaming", "xhr-polling"]
            : ["xhr-streaming", "xhr-polling", "websocket"];

        const sock = new SockJS(WS_ENDPOINT, null, {
            withCredentials: true,
            transports: TRANSPORTS,
            transportOptions: {
                "xhr-streaming": { withCredentials: true },
                "xhr-polling": { withCredentials: true },
                websocket: { withCredentials: true },
            },
        });

        const client = new StompClient({
            webSocketFactory: () => sock,
            reconnectDelay: 4000, // auto-reconnect tích hợp
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
            debug: (s) => console.debug("[STOMP]", s),

            onConnect: () => {
                if (!SUB_DEST) return;
                lastBeatRef.current = Date.now();

                if (subRef.current) {
                    try {
                        subRef.current.unsubscribe();
                    } catch {}
                    subRef.current = null;
                }

                subRef.current = client.subscribe(SUB_DEST, (frame) => {
                    lastBeatRef.current = Date.now();
                    setCount((p) => p + 1);
                    let notif = null;
                    try {
                        notif = frame?.body ? JSON.parse(frame.body) : null;
                    } catch {}

                    if (notif) {
                        if (!notif.createdAt)
                            notif.createdAt = new Date().toISOString();
                        if (notif.isRead == null) notif.isRead = false;
                        if (getKey(notif) == null) {
                            notif = {
                                ...notif,
                                clientId: `temp:${Date.now()}:${Math.random()}`,
                            };
                        }
                        if (openRef.current) {
                            setItems((prev) =>
                                mergeUnique(prev, [notif], true)
                            );
                        }
                    }

                    // Khi đang mở popover: luôn đồng bộ lại nguồn chân lý (debounce)
                    if (openRef.current) {
                        if (refetchTimerRef.current)
                            clearTimeout(refetchTimerRef.current);
                        refetchTimerRef.current = setTimeout(() => {
                            fetchFeed(0, false);
                        }, 200);
                    }
                });
            },

            onWebSocketClose: () => {
                if (subRef.current) {
                    try {
                        subRef.current.unsubscribe();
                    } catch {}
                    subRef.current = null;
                }
            },
        });

        if (stompRef.current?.active) {
            try {
                client.deactivate();
            } catch {}
            return;
        }

        client.activate();
        stompRef.current = client;
    }, [WS_ENDPOINT, SUB_DEST, fetchFeed]);

    // ---- auto-heal (force reconnect + refetch) dùng cho watchdog & awaken events
    const forceReconnectNow = useCallback(() => {
        try {
            stompRef.current?.deactivate?.();
        } catch {}
        stompRef.current = null;

        connectStomp(); 
        fetchUnreadCount();
        if (openRef.current) fetchFeed(0, false);
    }, [connectStomp, fetchUnreadCount, fetchFeed]);

    useEffect(() => {
        fetchUnreadCount();
        connectStomp();

        // ---- Awaken events — khi tab quay lại hoạt động, tự heal
        const onVisible = () => {
            if (document.visibilityState === "visible") forceReconnectNow();
        };
        const onFocus = () => forceReconnectNow();
        const onOnline = () => forceReconnectNow();
        const onPageShow = () => forceReconnectNow(); // quay lại từ bfcache

        document.addEventListener("visibilitychange", onVisible);
        window.addEventListener("focus", onFocus);
        window.addEventListener("online", onOnline);
        window.addEventListener("pageshow", onPageShow);

        // ---- Watchdog — kiểm tra định kỳ
        watchdogRef.current = setInterval(() => {
            const stale = Date.now() - lastBeatRef.current > WATCHDOG_STALE_MS;
            const connected = !!stompRef.current?.connected;
            if (!connected || stale) {
                forceReconnectNow();
            }
        }, WATCHDOG_CHECK_MS);

        // ---- Hidden fallback polling — khi tab ẩn, poll nhẹ để UI không "đóng băng"
        let hiddenTimer = null;
        const startHiddenPolling = () => {
            if (hiddenTimer) return;
            hiddenTimer = setInterval(() => {
                fetchUnreadCount();
                if (openRef.current) fetchFeed(0, false);
            }, HIDDEN_POLL_MS);
        };
        const stopHiddenPolling = () => {
            if (hiddenTimer) {
                clearInterval(hiddenTimer);
                hiddenTimer = null;
            }
        };
        const onHiddenSwitch = () => {
            if (document.visibilityState === "hidden") startHiddenPolling();
            else stopHiddenPolling();
        };
        document.addEventListener("visibilitychange", onHiddenSwitch);
        onHiddenSwitch(); // init theo trạng thái hiện tại

        return () => {
            document.removeEventListener("visibilitychange", onVisible);
            window.removeEventListener("focus", onFocus);
            window.removeEventListener("online", onOnline);
            window.removeEventListener("pageshow", onPageShow);
            document.removeEventListener("visibilitychange", onHiddenSwitch);

            if (watchdogRef.current) clearInterval(watchdogRef.current);
            if (hiddenTimer) clearInterval(hiddenTimer);
            if (refetchTimerRef.current) clearTimeout(refetchTimerRef.current);

            if (subRef.current) {
                try {
                    subRef.current.unsubscribe();
                } catch {}
                subRef.current = null;
            }
            if (stompRef.current) {
                try {
                    stompRef.current.deactivate();
                } catch {}
                stompRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        openRef.current = open;
    }, [open]);

    const onOpenChange = async (next) => {
        setOpen(next);
        if (next) {
            await fetchFeed(0, false);
        }
    };

    return (
        <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={
                        "relative text-white hover:bg-white/20 " + className
                    }
                    aria-label={`Notifications${
                        count ? `: ${displayCount}` : ""
                    }`}
                >
                    <Bell className="w-5 h-5" />
                    {count > 0 && (
                        <Badge className="absolute flex items-center justify-center w-5 h-5 p-0 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">
                            {displayCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>

            <PopoverContent align="end" className="p-0 w-96">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <div className="text-sm font-semibold">
                        Notifications {count > 0 ? `(${count} Unread)` : ""}
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                        onClick={markAllRead}
                        disabled={count === 0}
                        title="Đánh dấu tất cả đã đọc"
                    >
                        <CheckCheck className="w-4 h-4" />
                        Mark all read
                    </Button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto max-h-96">
                    {loading && (
                        <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Loading...
                        </div>
                    )}

                    {!loading && items.length === 0 && (
                        <div className="px-4 py-8 text-sm text-center text-muted-foreground">
                            Empty.
                        </div>
                    )}

                    {!loading &&
                        items.map((it) => (
                            <button
                                key={it.id}
                                onClick={() => onItemClick(it)}
                                className={
                                    "w-full text-left px-4 py-3 border-b last:border-0 hover:bg-gray-50 transition " +
                                    (!it.isRead ? "bg-blue-50/40" : "")
                                }
                            >
                                <div className="flex justify-between gap-3">
                                    <div className="min-w-0">
                                        <div
                                            className={
                                                "text-sm font-medium truncate " +
                                                (!it.isRead
                                                    ? "text-blue-900"
                                                    : "")
                                            }
                                        >
                                            {it.title || it.type}
                                        </div>
                                        {it.message && (
                                            <div className="mt-0.5 text-xs text-gray-600 line-clamp-2">
                                                {it.message}
                                            </div>
                                        )}
                                        {(it.jobId || it.link) && (
                                            <div className="mt-1 text-xs text-blue-600 hover:underline underline-offset-2 cursor-pointer">
                                                Xem chi tiết
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-shrink-0 ml-2 text-[11px] text-gray-500">
                                        {timeAgo(it.createdAt)}
                                    </div>
                                </div>
                            </button>
                        ))}
                </div>

                {/* Footer */}
                {page + 1 < totalPages && (
                    <div className="p-2">
                        <Button
                            variant="ghost"
                            className="w-full"
                            onClick={loadMore}
                            disabled={loadingMore}
                        >
                            {loadingMore ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                "More"
                            )}
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
