"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe } from "lucide-react";

const SocialMedia = ({ formData, onInputChange }) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
                <Globe className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold">Social Media & Links</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="facebookUrl">Facebook URL</Label>
                    <Input
                        id="facebookUrl"
                        value={formData.facebookUrl}
                        onChange={(e) => onInputChange("facebookUrl", e.target.value)}
                        placeholder="https://facebook.com/company"
                    />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                    <Input
                        id="linkedinUrl"
                        value={formData.linkedinUrl}
                        onChange={(e) => onInputChange("linkedinUrl", e.target.value)}
                        placeholder="https://linkedin.com/company/company"
                    />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="twitterUrl">Twitter URL</Label>
                    <Input
                        id="twitterUrl"
                        value={formData.twitterUrl}
                        onChange={(e) => onInputChange("twitterUrl", e.target.value)}
                        placeholder="https://twitter.com/company"
                    />
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="mapEmbedUrl">Google Maps Embed URL</Label>
                    <Input
                        id="mapEmbedUrl"
                        value={formData.mapEmbedUrl}
                        onChange={(e) => onInputChange("mapEmbedUrl", e.target.value)}
                        placeholder="https://www.google.com/maps/embed/..."
                    />
                </div>
            </div>
        </div>
    );
};

export default SocialMedia; 