"use client";

import React, {useMemo, useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Check, ChevronDown, MapPin, Search} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem,} from "@/components/ui/command";
import {cn} from "@/lib/utils";
import illustration from "@/assets/images/home-illustration.png";
import Image from "next/image";
import Link from "next/link";
import {useRouter} from "next/navigation";

import {useJobSearchStore} from "@/store/jobSearchStore";
import {useGetCitiesQuery} from "@/services/locationService";
import {t} from "@/i18n/i18n";

const HeroSection = () => {
    const [keyword, setKeyword] = useState("");
    const [selectedProvince, setSelectedProvince] = useState("");
    const [openProvince, setOpenProvince] = useState(false);
    const [searchProvinceTerm, setSearchProvinceTerm] = useState("");

    const setSearchTerm = useJobSearchStore((state) => state.setSearchTerm);
    const router = useRouter();

    const {data: provinces = []} = useGetCitiesQuery();

    const filteredProvinces = useMemo(() => {
        const topProvinces = [
            "Thành phố Hồ Chí Minh",
            "Thành phố Hà Nội",
            "Thành phố Hải Phòng",
            "Thành phố Đà Nẵng",
            "Thành phố Huế",
            "Thành phố Cần Thơ",
        ];

        if (!searchProvinceTerm) {
            return provinces.filter((name) => topProvinces.includes(name));
        }

        const term = searchProvinceTerm.toLowerCase();
        return provinces.filter((name) => name.toLowerCase().includes(term));
    }, [searchProvinceTerm, provinces]);

    const handleSearch = () => {
        setSearchTerm({
            keyword,
            province: selectedProvince,
        });
        router.push("/search");
    };

    return (
        <section className="py-8 sm:py-12 lg:py-24">
            <div className="container px-2 mx-auto sm:px-4">
                <div className="flex flex-col items-center gap-4 sm:gap-8 lg:gap-12 lg:flex-row">
                    {/* Left */}
                    <div className="flex-1 max-w-full sm:max-w-2xl">
                        <h1 className="mb-4 text-2xl font-bold text-gray-900 sm:mb-6 sm:text-3xl lg:text-5xl">
                            {t`Your First Step to a Big Future: Find a Job That Matches Your Passion & Skills.`}
                        </h1>
                        <p className="mb-4 text-sm text-gray-600 sm:mb-8 sm:text-base lg:text-lg">
                            {t`Discover opportunities that fit you perfectly—from your first job to a successful career ahead.`}
                        </p>

                        {/* Search Form */}
                        <div className="flex flex-col gap-2 p-2 mb-4 bg-white rounded-lg shadow-lg sm:mb-6 sm:flex-row">
                            {/* Keyword input */}
                            <div className="relative flex-1">
                                <Search
                                    className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 sm:w-5 sm:h-5 left-2 sm:left-3 top-1/2"/>
                                <Input
                                    placeholder={t`Job title, Keyword...`}
                                    className="pl-8 text-sm border-0 sm:pl-10 focus-visible:ring-0 sm:text-base"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                />
                            </div>

                            {/* Province select */}
                            <Popover
                                open={openProvince}
                                onOpenChange={setOpenProvince}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="flex items-center justify-between w-full px-2 py-2 text-sm text-gray-700 bg-white border sm:px-3 sm:w-auto sm:flex-1 sm:text-base"
                                    >
                                        <MapPin className="w-3 h-3 mr-1 sm:w-4 sm:h-4"/>
                                        {selectedProvince || "City"}
                                        <ChevronDown className="w-3 h-3 ml-auto opacity-50"/>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[180px] sm:w-[220px] p-0">
                                    <Command>
                                        <CommandInput
                                            placeholder="Search for more ..."
                                            className="h-8 text-sm sm:h-9"
                                            onValueChange={
                                                setSearchProvinceTerm
                                            }
                                            value={searchProvinceTerm}
                                        />
                                        <CommandEmpty>
                                            Không tìm thấy tỉnh
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {filteredProvinces.map((name) => (
                                                <CommandItem
                                                    key={name}
                                                    value={name}
                                                    onSelect={(val) => {
                                                        setSelectedProvince(
                                                            val
                                                        );
                                                        setOpenProvince(false);
                                                    }}
                                                >
                                                    {name}
                                                    <Check
                                                        className={cn(
                                                            "ml-auto w-4 h-4",
                                                            selectedProvince ===
                                                            name
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>

                            <Button
                                className="px-4 text-sm bg-blue-700 sm:px-6 hover:bg-blue-800 sm:text-base"
                                onClick={handleSearch}
                            >
                                {t`Find Jobs`}
                            </Button>
                        </div>

                        {/* Suggestions */}
                        <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base">
                            <span className="text-gray-600">Suggestion:</span>
                            <Link
                                href="#"
                                className="text-gray-700 hover:text-blue-600"
                            >
                                Designer,
                            </Link>
                            <Link
                                href="#"
                                className="text-gray-700 hover:text-blue-600"
                            >
                                Programming,
                            </Link>
                            <Link
                                href="#"
                                className="text-gray-700 hover:text-blue-700"
                            >
                                Digital Marketing,
                            </Link>
                            <Link
                                href="#"
                                className="text-gray-700 hover:text-blue-600"
                            >
                                Animation
                            </Link>
                        </div>
                    </div>

                    {/* Right */}
                    <div className="flex-1 max-w-full sm:max-w-md lg:max-w-lg">
                        <div className="relative">
                            <Image
                                src={illustration}
                                alt="Job Search Illustration"
                                className="w-full h-auto"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
