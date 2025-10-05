import React from "react";
import { Briefcase, Building, PlusCircle, Users } from "lucide-react";

const StatsSection = () => {
    const stats = [
        {
            icon: Briefcase,
            number: "1,75,324",
            label: "Live Job",
            bgColor: "bg-blue-100",
            iconColor: "text-blue-600",
        },
        {
            icon: Building,
            number: "97,354",
            label: "Companies",
            bgColor: "bg-blue-100",
            iconColor: "text-blue-600",
        },
        {
            icon: Users,
            number: "38,47,154",
            label: "Candidates",
            bgColor: "bg-blue-100",
            iconColor: "text-blue-600",
        },
        {
            icon: PlusCircle,
            number: "7,532",
            label: "New Jobs",
            bgColor: "bg-blue-100",
            iconColor: "text-blue-600",
        },
    ];

    return (
        <section className="py-8 sm:py-12 lg:py-16">
            <div className="container px-2 mx-auto sm:px-4">
                <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className={`${stat.bgColor} p-3 sm:p-4 lg:p-6 rounded-lg text-center`}
                        >
                            <div className="flex justify-center mb-3 sm:mb-4">
                                <stat.icon
                                    className={`h-6 w-6 sm:h-8 lg:h-10 sm:w-8 lg:w-10 ${stat.iconColor}`}
                                />
                            </div>
                            <div
                                className={`text-lg sm:text-xl lg:text-2xl font-bold mb-2 ${
                                    stat.textColor || "text-gray-900"
                                }`}
                            >
                                {stat.number}
                            </div>
                            <div
                                className={`text-xs sm:text-sm ${
                                    stat.textColor || "text-gray-600"
                                }`}
                            >
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
