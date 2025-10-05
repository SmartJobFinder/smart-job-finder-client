"use client";

import {useEffect, useRef, useState} from "react";
import {Card, CardContent} from "@/components/ui/card";
import {Calendar, MapPin, Users} from "lucide-react";
import {t} from "@/i18n/i18n";

const COMPANY = {
    name: "Like Lion",
    logo: "https://avatars.githubusercontent.com/u/218940044?s=48&v=4",
};

function cloudinaryPosterFromVideo(url) {
    try {
        const u = new URL(url);
        const parts = u.pathname.split("/");
        const uploadIdx = parts.indexOf("upload");
        if (uploadIdx === -1) return null;
        // chèn transform lấy frame ở giây 1, xuất jpg tối ưu
        parts.splice(uploadIdx + 1, 0, "so_1,q_auto,f_jpg");
        parts[parts.length - 1] = parts[parts.length - 1].replace(
            /\.[^/.]+$/,
            ".jpg"
        );
        u.pathname = parts.join("/");
        return u.toString();
    } catch {
        return null;
    }
}


export default function EventsSection() {
    const events = [
        {
            id: 1,
            title: t`Recap Korean Insight Trip 2025` + " ✈️🌏",
            description:
                t`A special journey bringing K-Tech College 2025 candidates closer to Korean enterprises and global work culture. Memorable experiences and clearer views of a global career path.`,
            date: t`August` + " 2025",
            location: t`Korea`,
            attendees: "100+",
            videoSrc:
                "https://res.cloudinary.com/dvgp7ezzc/video/upload/v1758794035/FSave.com_Facebook_Media_002_1289109009583421v_rn1t9y.mp4",
            highlight: t`Event Highlight`
        },
        {
            id: 2,
            title: t`Mentoring Day — What Korean Mentors Think`,
            description:
                t`Honest sharing from mentors about working with Vietnamese candidates and what stands out in the eyes of employers. Don’t miss K-Tech Fest 2025 for more 1:1 mentor sessions!`,
            date: t`July` + " 2025",
            location: t`Ho Chi Minh City`,
            attendees: "300+",
            videoSrc:
                "https://res.cloudinary.com/dvgp7ezzc/video/upload/v1758793904/FSave.com_Facebook_Media_001_1141616037935553v_dead11.mp4",
            highlight: t`Mentoring Day`,
        },
        {
            id: 3,
            title: t`Recap Offline Interview` + "💫",
            description:
                t`Korean tech companies praised the potential of Vietnamese candidates and the role of K-Tech College in global talent matching. Hear their reflections from the on-site interviews.`,
            date: t`June` + " 2025",
            location: t`Ho Chi Minh City`,
            attendees: "200+",
            videoSrc:
                "https://res.cloudinary.com/dvgp7ezzc/video/upload/v1758793968/FSave.com_Facebook_Media_002_664351916233092v_nghvl9.mp4",
            highlight: t`Interview Series`,
        },
        {
            id: 4,
            title: t`Customer Success Stories`,
            description:
                t`Direct stories from clients about their transformation journeys and results achieved with our programs and partners.`,
            date: t`May` + " 2025",
            location: t`Virtual Event`,
            attendees: "1000+",
            videoSrc:
                "https://res.cloudinary.com/dvgp7ezzc/video/upload/v1758794000/FSave.com_Facebook_Media_002_741709925536104v_i2hiay.mp4",
            highlight: t`Success Stories`,
        },
    ];
    const [inView, setInView] = useState({});
    const cardsRef = useRef({});

    useEffect(() => {
        const io = new IntersectionObserver(
            (entries) => {
                const next = {};
                for (const e of entries) {
                    const id = Number(e.target.getAttribute("data-id"));
                    next[id] = e.isIntersecting;
                }
                setInView((prev) => ({...prev, ...next}));
            },
            {rootMargin: "200px"}
        );
        Object.values(cardsRef.current).forEach((el) => el && io.observe(el));
        return () => io.disconnect();
    }, []);

    const handleEnter = (id) => {
        const v = cardsRef.current[id]?.querySelector("video");
        if (v) v.play().catch(() => {
        });
    };

    const handleLeave = (id) => {
        const v = cardsRef.current[id]?.querySelector("video");
        if (v) {
            v.pause();
            v.currentTime = 0;
        }
    };

    return (
        <section id="events" className="p-3 sm:p-4 lg:p-6 bg-muted/30">
            <div className="container px-4 mx-auto sm:px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold sm:text-4xl text-balance">
                        {t`Company Events`}
                    </h2>
                    <p className="max-w-2xl mx-auto text-lg text-muted-foreground text-pretty">
                        {t`Experience highlights from recent events, conferences, and workshops — where we bring innovation to life and connect with community.`}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {events.map((event) => {
                        const poster =
                            cloudinaryPosterFromVideo(event.videoSrc) ||
                            "/placeholder.svg";
                        return (
                            <Card
                                key={event.id}
                                ref={(el) => (cardsRef.current[event.id] = el)}
                                data-id={event.id}
                                className="py-0 overflow-hidden transition-shadow duration-300 hover:shadow-lg border-blue-700/10"
                                onMouseEnter={() => handleEnter(event.id)}
                                onMouseLeave={() => handleLeave(event.id)}
                            >
                                <div className="relative h-56 overflow-hidden bg-black sm:h-64 lg:h-72 rounded-t-xl">
                                    <video
                                        className="absolute inset-0 object-contain w-full h-full"
                                        src={
                                            inView[event.id]
                                                ? `${event.videoSrc}#t=0.1`
                                                : undefined
                                        }
                                        poster={poster}
                                        preload="none"
                                        muted
                                        playsInline
                                        controls={false}
                                    />
                                </div>

                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between w-full gap-3">
                                        <div className="flex items-center min-w-0 gap-3">
                                            <img
                                                src={COMPANY.logo}
                                                alt={`${COMPANY.name} logo`}
                                                className="rounded-full w-9 h-9 ring-2 ring-blue-700/20"
                                            />
                                            <div className="min-w-0">
                                                <div className="text-sm font-medium text-blue-700">
                                                    {COMPANY.name}
                                                </div>
                                                <h3 className="text-xl font-semibold truncate text-balance">
                                                    {event.title}
                                                </h3>
                                            </div>
                                        </div>

                                        <div
                                            className="px-3 py-1 text-sm font-medium text-white bg-blue-700 rounded-full whitespace-nowrap">
                                            {event.highlight ||
                                                "Event Highlight"}
                                        </div>
                                    </div>

                                    <p className="mt-3 mb-4 text-muted-foreground text-pretty">
                                        {event.description}
                                    </p>

                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4"/>
                                            {event.date}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4"/>
                                            {event.location}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4"/>
                                            {event.attendees} attendees
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
