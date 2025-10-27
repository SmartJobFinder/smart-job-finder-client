"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { t } from "@/i18n/i18n";

export default function TestimonialsSection() {
    const [index, setIndex] = useState(0);
    const [perView, setPerView] = useState(1);

    const testimonials = [
        {
            rating: 5,
            text: "JobFind has a clean, modern interface that makes job searching feel effortless. I found exactly what I was looking for in just a few days!",
            name: "Võ Nhật Hào",
            title: "UI/UX Designer",
            avatar: "https://scontent.fsgn5-5.fna.fbcdn.net/v/t39.30808-1/475199787_2099959677144177_6478358276230291067_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=100&ccb=1-7&_nc_sid=e99d92&_nc_ohc=PLQx4FLpkacQ7kNvwEQjS34&_nc_oc=Adl-nVgJ_5FkMx0GzZ2A08MARzIvwaISKROKY4MYXG1CQYLf2LmxOg_Pi6HRsKL4lyuQWTMFoKeQBP5AB0DX5d-P&_nc_zt=24&_nc_ht=scontent.fsgn5-5.fna&_nc_gid=Y-6Sq87jhpL0TqFoBGYCUQ&oh=00_AfezgY_ogXguBOXQHl2RIvD1H4EFHU7aGMtqy1o9ihlvzw&oe=690588D4",
        },
        {
            rating: 5,
            text: "The job search and application process is incredibly smooth. JobFind helped me connect with companies that truly match my creative vision.",
            name: "Phạm Văn Phúc",
            title: "Creative Director",
            avatar: "https://scontent.fsgn5-10.fna.fbcdn.net/v/t39.30808-1/562374811_2112519982654414_830120964938939457_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=107&ccb=1-7&_nc_sid=e99d92&_nc_ohc=BUinRh6mpYoQ7kNvwHMWlsD&_nc_oc=AdkFE1RoClUuQ4hX_FgQiO7MG6UEpf65HeCoV5xC585JBfAtS3N6L1CXy3fjN986DlvNc5jfkHK0fOCLL8Vl6cOG&_nc_zt=24&_nc_ht=scontent.fsgn5-10.fna&_nc_gid=42xXx0ddL4OSFpEPiLhI5A&oh=00_AfcRLZ6SL4JzvKYiV38Jr4wvyBEB41oLRJ2aizYWtv_odg&oe=69057737",
        },
        {
            rating: 5,
            text: "As an intern looking for my first opportunity, JobFind gave me access to real openings and helpful tips. I landed my first internship thanks to this platform!",
            name: "Ngô Đức Huy",
            title: "Intern",
            avatar: "https://scontent.fsgn5-15.fna.fbcdn.net/v/t39.30808-1/412561075_3553409431642399_8967119420852612607_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=111&ccb=1-7&_nc_sid=e99d92&_nc_ohc=Fw3MYsenFxoQ7kNvwEfk7Om&_nc_oc=Admh7HgmuNX9yiYyTgTjwBIfzyl_zGd8r4GTSurOFu7AKsRZ0Qa3sgzkdqaeVzFBOoccifaZ2AsdK89WgDOYOuZL&_nc_zt=24&_nc_ht=scontent.fsgn5-15.fna&_nc_gid=TtmXHYpjtyRa5PzySkIS0g&oh=00_AffKnX_3QaAK-KmK6jtbXNVtpho9xruCGupPicmlxXqXFw&oe=6905A1C6",
        },
        {
            rating: 5,
            text: "Over 1,000 users – including myself – have found jobs through JobFind. It's not just a platform; it's a launchpad for your career.",
            name: "Nguyễn Đức Huy",
            title: "Software Engineer",
            avatar: "https://scontent.fsgn5-9.fna.fbcdn.net/v/t39.30808-1/564077220_1542147446919890_8196546704255616210_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=102&ccb=1-7&_nc_sid=e99d92&_nc_ohc=D9QZJYGiOxUQ7kNvwFgZsAT&_nc_oc=AdmGDBppOypjYk1Zy_3GG1-zrN1RtcXbdskRGsyZrsaCAGAnOgMqiCvK2Wbm0YUPBK4zg_ApJX9TCr2bVnxPzN78&_nc_zt=24&_nc_ht=scontent.fsgn5-9.fna&_nc_gid=dOF5sCZkWIqfycx0C68nKw&oh=00_AfekPYrsGiWaVQAfV6wMr4QeMDyXRcCq_0002hgA9_6R-g&oe=69059049",
        },
    ];

    useEffect(() => {
        const mq = window.matchMedia("(min-width: 768px)");
        const update = () => setPerView(mq.matches ? 3 : 1);
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, []);

    const lastIndex = Math.max(0, testimonials.length - perView);
    const next = () => setIndex((i) => Math.min(i + 1, lastIndex));
    const prev = () => setIndex((i) => Math.max(i - 1, 0));
    const translatePct = (100 / perView) * index;
    const pages = lastIndex + 1;

    return (
        <section className="py-8 sm:py-12 lg:py-16">
            <div className="container px-2 mx-auto sm:px-4">
                <h2 className="mb-8 text-xl font-bold text-center text-gray-900 sm:mb-12 sm:text-2xl lg:text-3xl">
                    {t`Clients Testimonial`}
                </h2>
                <div className="relative max-w-6xl mx-auto overflow-hidden">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={prev}
                        className="absolute left-0 z-10 transform -translate-y-1/2 bg-white shadow-lg top-1/2"
                    >
                        <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <div className="w-full px-4 sm:px-8 lg:px-12">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{
                                transform: `translateX(-${translatePct}%)`,
                            }}
                        >
                            {testimonials.map((t, i) => (
                                <div
                                    key={i}
                                    className="flex-none px-2 basis-full md:basis-1/3 sm:px-4"
                                >
                                    <div className="flex flex-col justify-between h-full p-3 bg-white rounded-lg shadow-sm sm:p-4 lg:p-6">
                                        <div>
                                            <div className="flex mb-3 sm:mb-4">
                                                {[...Array(t.rating)].map(
                                                    (_, k) => (
                                                        <Star
                                                            key={k}
                                                            className="w-3 h-3 text-yellow-400 sm:h-4 sm:w-4 lg:h-5 lg:w-5 fill-yellow-400"
                                                        />
                                                    )
                                                )}
                                            </div>
                                            <p className="mb-4 text-xs italic text-gray-600 sm:mb-6 sm:text-sm">
                                                "{t.text}"
                                            </p>
                                        </div>
                                        <div className="flex items-center">
                                            <img
                                                src={
                                                    t.avatar ||
                                                    "/placeholder.svg"
                                                }
                                                alt={t.name}
                                                className="w-6 h-6 mr-2 rounded-full sm:mr-3 sm:h-8 sm:w-8 lg:h-10 lg:w-10"
                                            />
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900 sm:text-base">
                                                    {t.name}
                                                </p>
                                                <p className="text-xs text-gray-600 sm:text-sm">
                                                    {t.title}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={next}
                        className="absolute right-0 z-10 transform -translate-y-1/2 bg-white shadow-lg top-1/2"
                    >
                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <div className="flex justify-center mt-6 space-x-2 sm:mt-8">
                        {Array.from({ length: pages }).map((_, p) => (
                            <button
                                key={p}
                                onClick={() => setIndex(p)}
                                className={`h-2 w-2 sm:h-3 sm:w-3 rounded-full transition-colors ${
                                    p === index ? "bg-blue-600" : "bg-gray-300"
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
