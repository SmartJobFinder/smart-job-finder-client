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
    CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const ProvinceCombobox = ({ value, onChange, error, multiple = false }) => {
    const [open, setOpen] = useState(false);
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
            // Hiển thị tất cả thành phố, với thành phố nổi bật lên đầu
            const featured = provinces.filter((p) =>
                featuredCities.includes(p.name)
            );
            const others = provinces.filter(
                (p) => !featuredCities.includes(p.name)
            );
            return [...featured, ...others];
        }

        // Khi có tìm kiếm, lọc theo tên
        return provinces.filter((p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, provinces]);

    const handleSelect = (selectedProvince) => {
        if (multiple) {
            onChange(selectedProvince);
        } else {
            onChange(selectedProvince);
            setOpen(false);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={`w-full justify-between ${
                        error ? "border-red-500" : ""
                    }`}
                >
                    {value ? value : "Chọn tỉnh/thành phố"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput
                        onValueChange={setSearchTerm}
                        placeholder="Tìm tỉnh/thành..."
                        className="border-none focus:ring-0"
                    />
                    <CommandList className="max-h-80 overflow-auto">
                        <CommandEmpty>Không tìm thấy kết quả.</CommandEmpty>
                        <CommandGroup>
                            {filteredProvinces.map((province) => {
                                const isSelected = multiple
                                    ? Array.isArray(value) &&
                                      value.includes(province.name)
                                    : value === province.name;

                                return (
                                    <CommandItem
                                        key={province.code}
                                        value={province.name}
                                        onSelect={() =>
                                            handleSelect(province.name)
                                        }
                                        className="flex items-center"
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                isSelected
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        <span
                                            className={
                                                isSelected ? "font-medium" : ""
                                            }
                                        >
                                            {province.name}
                                        </span>
                                        {featuredCities.includes(
                                            province.name
                                        ) && (
                                            <span className="ml-auto text-xs text-blue-500">
                                                Phổ biến
                                            </span>
                                        )}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default ProvinceCombobox;
