"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
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

const BenefitDialog = ({ onAddBenefit }) => {
    const [open, setOpen] = useState(false);
    const [newBenefit, setNewBenefit] = useState({
        title: "",
        description: "",
        icon: "heart",
    });

    const handleAddBenefit = () => {
        if (newBenefit.title.trim() && newBenefit.description.trim()) {
            const benefit = {
                id: Date.now().toString(),
                title: newBenefit.title.trim(),
                description: newBenefit.description.trim(),
                icon: newBenefit.icon,
            };
            onAddBenefit(benefit);
            resetAndClose();
        }
    };

    const resetAndClose = () => {
        setNewBenefit({
            title: "",
            description: "",
            icon: "heart",
        });
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-blue-600 bg-transparent"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Benefit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add New Benefit</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="benefit-title">Title</Label>
                        <Input
                            id="benefit-title"
                            placeholder="e.g. Health Insurance"
                            value={newBenefit.title}
                            onChange={(e) =>
                                setNewBenefit((prev) => ({
                                    ...prev,
                                    title: e.target.value,
                                }))
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="benefit-description">Description</Label>
                        <JoditEditorComponent
                            value={newBenefit.description}
                            onChange={(value) =>
                                setNewBenefit((prev) => ({
                                    ...prev,
                                    description: value,
                                }))
                            }
                            placeholder="Describe this benefit..."
                            height="120px"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Icon</Label>
                        <Select
                            value={newBenefit.icon}
                            onValueChange={(value) =>
                                setNewBenefit((prev) => ({
                                    ...prev,
                                    icon: value,
                                }))
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
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={resetAndClose}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddBenefit}
                            disabled={
                                !newBenefit.title.trim() ||
                                !newBenefit.description.trim()
                            }
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Add Benefit
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default BenefitDialog;
