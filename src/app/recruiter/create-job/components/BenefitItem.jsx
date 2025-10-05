"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";
import {
    Heart,
    Plane,
    GraduationCap,
    Coffee,
    Car,
    Home,
    Shield,
    Zap,
    Users,
    Trophy,
    Clock,
} from "lucide-react";

const BenefitItem = ({ benefit, onRemove }) => {
    const getBenefitIcon = (iconType) => {
        const iconMap = {
            heart: Heart,
            plane: Plane,
            graduation: GraduationCap,
            coffee: Coffee,
            car: Car,
            home: Home,
            shield: Shield,
            zap: Zap,
            users: Users,
            trophy: Trophy,
            clock: Clock,
        };
        const IconComponent = iconMap[iconType] || Heart;
        return <IconComponent className="w-8 h-8 text-blue-500" />;
    };

    return (
        <Card className="relative">
            {onRemove && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-4 right-4 h-8 w-8 p-0"
                    onClick={() => onRemove(benefit.id)}
                >
                    <X className="w-4 h-4" />
                </Button>
            )}
            <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                        {getBenefitIcon(benefit.icon)}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {benefit.title}
                        </h3>
                        <div 
                            className="text-gray-600 text-sm leading-relaxed prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: benefit.description }}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default BenefitItem;
