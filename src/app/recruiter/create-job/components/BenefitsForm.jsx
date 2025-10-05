"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
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
import JoditEditorComponent from "@/components/ui/JoditEditor";

const benefitIcons = [
    { value: "heart", label: "Healthcare", icon: Heart },
    { value: "plane", label: "Travel", icon: Plane },
    { value: "graduation", label: "Education", icon: GraduationCap },
    { value: "coffee", label: "Perks", icon: Coffee },
    { value: "car", label: "Transportation", icon: Car },
    { value: "home", label: "Remote Work", icon: Home },
    { value: "shield", label: "Insurance", icon: Shield },
    { value: "zap", label: "Energy", icon: Zap },
    { value: "users", label: "Team", icon: Users },
    { value: "trophy", label: "Achievement", icon: Trophy },
    { value: "clock", label: "Flexible Hours", icon: Clock },
];

const BenefitsForm = ({ formData, onInputChange }) => {
    const handleBenefitChange = (index, field, value) => {
        const newBenefits = [...(formData.benefits || [])];
        newBenefits[index] = {
            ...newBenefits[index],
            [field]: value,
        };
        onInputChange("benefits", newBenefits);
    };

    const addBenefit = () => {
        const newBenefits = [...(formData.benefits || [])];
        newBenefits.push({
            id: Date.now().toString(),
            title: "",
            description: "",
            icon: "heart",
        });
        onInputChange("benefits", newBenefits);
    };

    const removeBenefit = (index) => {
        const newBenefits = [...(formData.benefits || [])];
        newBenefits.splice(index, 1);
        onInputChange("benefits", newBenefits);
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Benefits & Perks
                </h2>
                <p className="text-gray-600">
                    Add attractive benefits and perks for candidates
                </p>
            </div>

            <div className="space-y-4">
                {(formData.benefits || []).map((benefit, index) => (
                    <Card key={benefit.id || index}>
                        <CardContent className="p-4">
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-medium">
                                        Benefits {index + 1}
                                    </h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeBenefit(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor={`benefit-title-${index}`}>
                                        Title
                                    </Label>
                                    <Input
                                        id={`benefit-title-${index}`}
                                        value={benefit.title || ""}
                                        onChange={(e) =>
                                            handleBenefitChange(
                                                index,
                                                "title",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Example: Health insurance"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor={`benefit-icon-${index}`}>
                                        Icon
                                    </Label>
                                    <Select
                                        value={benefit.icon || "heart"}
                                        onValueChange={(value) =>
                                            handleBenefitChange(
                                                index,
                                                "icon",
                                                value
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {benefitIcons.map((icon) => (
                                                <SelectItem
                                                    key={icon.value}
                                                    value={icon.value}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <icon.icon className="w-4 h-4" />
                                                        {icon.label}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor={`benefit-description-${index}`}
                                    >
                                        Description
                                    </Label>
                                    <JoditEditorComponent
                                        value={benefit.description || ""}
                                        onChange={(value) =>
                                            handleBenefitChange(
                                                index,
                                                "description",
                                                value
                                            )
                                        }
                                        placeholder="Detailed description of this benefit..."
                                        height="150px"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                <Button
                    type="button"
                    variant="outline"
                    onClick={addBenefit}
                    className="w-full"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add benefit
                </Button>
            </div>
        </div>
    );
};

export default BenefitsForm;
