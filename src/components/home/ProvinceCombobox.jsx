"use client";

import { cn } from "@/lib/utils";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { t } from "@/i18n/i18n";

const ProvinceCombobox = () => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState("");
    const [provinces, setProvinces] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const featuredCities = [
        "Thành phố Hà Nội",
        "Thành phố Hồ Chí Minh",
        "Thành phố Đà Nẵng",
        "Thành phố Hải Phòng",
        "Tỉnh Đồng Nai",
        "Tỉnh Bà Rịa - Vũng Tàu",
    ];

    useEffect(() => {
        fetch("https://provinces.open-api.vn/api/p/")
            .then((res) => res.json())
            .then((data) => setProvinces(data));
    }, []);

    const filteredProvinces = useMemo(() => {
        if (!searchTerm) {
            return provinces.filter((p) => featuredCities.includes(p.name));
        }
        return provinces.filter((p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, provinces]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {selected ? selected : t`Select province/city`}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" avoidCollisions={false}>
                <Command>
                    <CommandInput
                        onValueChange={setSearchTerm}
                        placeholder={t`Search province/city...`}
                    />
                    <CommandEmpty>{t`Not found`}</CommandEmpty>
                    <CommandGroup>
                        {filteredProvinces.map((province) => (
                            <CommandItem
                                key={province.code}
                                value={province.name}
                                onSelect={() => {
                                    setSelected(province.name);
                                    setOpen(false);
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        selected === province.name
                                            ? "opacity-100"
                                            : "opacity-0"
                                    )}
                                />
                                {province.name}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default ProvinceCombobox;
