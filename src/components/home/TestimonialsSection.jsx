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
            text: "JobHuntly has a clean, modern interface that makes job searching feel effortless. I found exactly what I was looking for in just a few days!",
            name: "Vo Hoang Phuc",
            title: "UI/UX Designer",
            avatar: "https://ca.slack-edge.com/T092B4T8XTN-U092ZEL3C3A-65ccc92316e4-512",
        },
        {
            rating: 5,
            text: "The job search and application process is incredibly smooth. JobHuntly helped me connect with companies that truly match my creative vision.",
            name: "Nguyen Anh Huy",
            title: "Creative Director",
            avatar: "https://ca.slack-edge.com/T092B4T8XTN-U092ZEMP5CG-1fb35ba9101d-512",
        },
        {
            rating: 5,
            text: "As an intern looking for my first opportunity, JobHuntly gave me access to real openings and helpful tips. I landed my first internship thanks to this platform!",
            name: "Nguyen Thanh Trong",
            title: "Intern",
            avatar: "https://ca.slack-edge.com/T092B4T8XTN-U092WU8NMGF-44471c1e6caf-72",
        },
        {
            rating: 5,
            text: "Over 1,000 users – including myself – have found jobs through JobHuntly. It's not just a platform; it's a launchpad for your career.",
            name: "Do Phi Lau",
            title: "Software Engineer",
            avatar: "https://ca.slack-edge.com/T092B4T8XTN-U093TVABR3R-48c4f710a858-72",
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
