"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Loader2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { getCities } from "@/services/jobCreateService";

const LocationInformation = ({ formData, errors, onInputChange }) => {
    const [cities, setCities] = useState([]);
    const [isLoadingCities, setIsLoadingCities] = useState(true);

    // Load cities from API
    useEffect(() => {
        const loadCities = async () => {
            try {
                setIsLoadingCities(true);
                const data = await getCities();
                
                // Xử lý data từ API - có thể là array of objects hoặc array of strings
                let processedCities = [];
                if (Array.isArray(data)) {
                    processedCities = data.map(item => {
                        // Nếu là object có city_name
                        if (typeof item === 'object' && item.city_name) {
                            return item.city_name;
                        }
                        // Nếu đã là string
                        if (typeof item === 'string') {
                            return item;
                        }
                        return item;
                    }).filter(Boolean); // Lọc bỏ các giá trị null/undefined
                }
                
                setCities(processedCities);
            } catch (error) {
                console.error("Error loading cities:", error);
                setCities([]);
            } finally {
                setIsLoadingCities(false);
            }
        };

        loadCities();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
                <MapPin className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-semibold">Location Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="address">
                        Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => onInputChange("address", e.target.value)}
                        placeholder="123 Main Street"
                        className={errors.address ? "border-red-500" : ""}
                    />
                    {errors.address && (
                        <p className="text-sm text-red-500">{errors.address}</p>
                    )}
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="locationCity">
                        City <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        value={formData.locationCity || ""}
                        onValueChange={(value) => onInputChange("locationCity", value)}
                    >
                        <SelectTrigger
                            className={errors.locationCity ? "border-red-500" : ""}
                        >
                            <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                            {isLoadingCities ? (
                                <div className="flex items-center justify-center p-4">
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Loading cities...
                                </div>
                            ) : (
                                cities.map((city, index) => (
                                    <SelectItem key={index} value={city}>
                                        {city}
                                    </SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>
                    {errors.locationCity && (
                        <p className="text-sm text-red-500">{errors.locationCity}</p>
                    )}
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="locationCountry">Country</Label>
                    <Input
                        id="locationCountry"
                        value={formData.locationCountry}
                        onChange={(e) => onInputChange("locationCountry", e.target.value)}
                        placeholder="Vietnam"
                    />
                </div>
            </div>
        </div>
    );
};

export default LocationInformation;