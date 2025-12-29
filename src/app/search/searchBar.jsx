"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, MapPin, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useJobSearchStore } from "@/store/jobSearchStore";
import {
  useGetCitiesQuery,
  useLazySearchCitiesQuery,
} from "@/services/locationService";
import { t } from "@/i18n/i18n";

export default function SearchBar() {
  const searchTermFromStore = useJobSearchStore(s => s.searchTerm);
  const [keyword, setKeyword] = useState(searchTermFromStore?.keyword || "");
  const [selectedProvince, setSelectedProvince] = useState(
    searchTermFromStore?.province || ""
  );
  const [openProvince, setOpenProvince] = useState(false);
  const [searchProvinceTerm, setSearchProvinceTerm] = useState("");

  const setSearchTerm = useJobSearchStore(s => s.setSearchTerm);
  const setFilters = useJobSearchStore(s => s.setFilters);

  // Sync với store khi store thay đổi
  useEffect(() => {
    if (searchTermFromStore) {
      setKeyword(searchTermFromStore.keyword || "");
      setSelectedProvince(searchTermFromStore.province || "");
    }
  }, [searchTermFromStore]);

  // Lấy tất cả cities khi component mount
  const { data: allCities = [], isLoading: isLoadingAll } = useGetCitiesQuery();

  // Lazy query để search cities theo keyword
  const [searchCities, { data: searchResults = [], isLoading: isSearching }] =
    useLazySearchCitiesQuery();

  // Debounce search term
  useEffect(() => {
    if (searchProvinceTerm && searchProvinceTerm.length >= 2) {
      const timer = setTimeout(() => {
        searchCities(searchProvinceTerm);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchProvinceTerm, searchCities]);

  // Danh sách provinces để hiển thị
  const provinces = useMemo(() => {
    // Nếu đang search và có kết quả, dùng searchResults
    if (searchProvinceTerm && searchResults.length > 0) {
      return searchResults;
    }
    // Ngược lại dùng allCities
    return allCities;
  }, [searchProvinceTerm, searchResults, allCities]);

  const filteredProvinces = useMemo(() => {
    const topProvinces = [
      "Hồ Chí Minh",
      "Hà Nội",
      "Hải Phòng",
      "Đà Nẵng",
      "Huế",
      "Cần Thơ",
    ];

    if (!searchProvinceTerm) {
      // Hiển thị top provinces trước, sau đó là các tỉnh khác
      const topCities = provinces.filter(name =>
        topProvinces.some(top => name.includes(top))
      );
      const otherCities = provinces.filter(
        name => !topProvinces.some(top => name.includes(top))
      );
      return [...topCities, ...otherCities];
    }

    // Khi có search term, hiển thị kết quả từ API search
    return provinces;
  }, [searchProvinceTerm, provinces]);

  const handleSearch = () => {
    setSearchTerm({
      keyword,
      province: selectedProvince,
    });
  };

  // Tự động search khi chọn province
  const handleProvinceSelect = val => {
    setSelectedProvince(val);
    setOpenProvince(false);
    setSearchProvinceTerm("");

    // Tự động trigger search
    setSearchTerm({
      keyword,
      province: val,
    });
  };

  const handleReset = () => {
    setKeyword("");
    setSelectedProvince("");
    setSearchProvinceTerm("");
    setOpenProvince(false);
    setSearchTerm({ keyword: "", province: "" });
    setFilters({
      workTypes: [],
      levels: [],
      categories: [],
      skills: [],
    });
  };

  const isLoading = isLoadingAll || isSearching;

  return (
    <div className="flex justify-center mb-2">
      <div className="bg-white rounded-full shadow-md w-full min-h-[56px] flex items-center px-4 gap-2">
        <Input
          type="text"
          placeholder={t`Search` + "..."}
          className="flex-1 px-4 py-2 text-sm text-gray-800 border-0 focus:outline-none"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />

        <Popover open={openProvince} onOpenChange={setOpenProvince}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="bg-white border-none text-[#0a66c2] text-xs px-2 py-1 rounded-full flex items-center"
              role="combobox"
              aria-expanded={openProvince}
              disabled={isLoading}
            >
              <MapPin className="mr-1" size={14} />
              {isLoading ? t`Loading...` : selectedProvince || t`All Cities`}
              <ChevronDown className="w-3 h-3 ml-1 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-0">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder={t`Search for more ...`}
                className="h-9"
                onValueChange={setSearchProvinceTerm}
                value={searchProvinceTerm}
              />
              <CommandEmpty>
                {isSearching ? t`Searching...` : t`Not found`}
              </CommandEmpty>
              <CommandGroup className="max-h-[300px] overflow-y-auto">
                <CommandItem value="" onSelect={() => handleProvinceSelect("")}>
                  {t`All Cities`}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      !selectedProvince ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
                {filteredProvinces.map(name => (
                  <CommandItem
                    key={name}
                    value={name}
                    onSelect={handleProvinceSelect}
                  >
                    {name}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedProvince === name ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        <Button
          className="px-5 py-2 ml-3 text-sm text-white bg-blue-700 rounded-full hover:bg-blue-800"
          onClick={handleSearch}
        >
          <Search size={16} className="mr-1" />
          {t`Search`}
        </Button>

        <Button
          variant="outline"
          className="px-5 py-2 ml-2 text-sm text-red-700 border border-red-500 rounded-full"
          onClick={handleReset}
        >
          {t`Reset`}
        </Button>
      </div>
    </div>
  );
}
