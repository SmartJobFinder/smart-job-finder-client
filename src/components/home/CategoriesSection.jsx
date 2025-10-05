"use client";

import React from "react";
import {ArrowRight, Calculator, Code, Database, Heart, Megaphone, Music, Palette, Video,} from "lucide-react";
import Link from "next/link";
import {t} from "@/i18n/i18n";

const CategoriesSection = () => {
    const categories = [
        {
            icon: Palette,
            title: "Graphics & Design",
            positions: "357" + t`Open Positions`,
            bgColor: "bg-sky-100",
            iconColor: "text-sky-600",
        },
        {
            icon: Code,
            title: "Code & Programming",
            positions: "312" + t`Open Positions`,
            bgColor: "bg-slate-200",
            iconColor: "text-slate-600",
        },
        {
            icon: Megaphone,
            title: "Digital Marketing",
            positions: "297" + t`Open Positions`,
            bgColor: "bg-yellow-50",
            iconColor: "text-yellow-600",
        },
        {
            icon: Video,
            title: "Video & Animation",
            positions: "247" + t`Open Positions`,
            bgColor: "bg-purple-100",
            iconColor: "text-purple-600",
        },
        {
            icon: Music,
            title: "Music & Audio",
            positions: "204" + t`Open Positions`,
            bgColor: "bg-teal-100",
            iconColor: "text-teal-600",
        },
        {
            icon: Calculator,
            title: "Account & Finance",
            positions: "167" + t`Open Positions`,
            bgColor: "bg-indigo-100",
            iconColor: "text-indigo-600",
        },
        {
            icon: Heart,
            title: "Health & Care",
            positions: "125" + t`Open Positions`,
            bgColor: "bg-rose-50",
            iconColor: "text-rose-600",
        },
        {
            icon: Database,
            title: "Data & Science",
            positions: "57" + t`Open Positions`,
            bgColor: "bg-blue-100",
            iconColor: "text-blue-600",
        },
    ];

    return (
        <section className="py-8 sm:py-12 lg:py-16">
            <div className="container px-2 mx-auto sm:px-4">
                <div className="flex items-center justify-between mb-8 sm:mb-12">
                    <h2 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
                        {t`Popular category`}
                    </h2>
                    <Link
                        href="#"
                        className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 sm:text-base"
                    >
                        {t`View All`}{" "}
                        <ArrowRight className="w-3 h-3 ml-2 sm:w-4 sm:h-4"/>
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {categories.map((category, index) => (
                        <div
                            key={index}
                            className={`${category.bgColor} p-3 sm:p-4 lg:p-6 rounded-lg hover:shadow-lg transition-shadow cursor-pointer`}
                        >
                            <div className="flex items-center mb-3 sm:mb-4">
                                <category.icon
                                    className={`h-5 w-5 sm:h-6 lg:h-8 sm:w-6 lg:w-8 ${category.iconColor} mr-2 sm:mr-3`}
                                />
                                <div>
                                    <h3
                                        className={`font-semibold text-sm sm:text-base ${category.textColor}`}
                                    >
                                        {category.title}
                                    </h3>
                                    <p
                                        className={`text-xs sm:text-sm ${category.textColor}`}
                                    >
                                        {category.positions}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoriesSection;
