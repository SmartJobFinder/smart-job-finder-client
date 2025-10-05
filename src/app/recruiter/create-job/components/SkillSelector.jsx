"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Loader2 } from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

const SkillSelector = ({
    availableSkills = [],
    selectedSkills = [],
    onSkillAdd,
    onSkillRemove,
    isLoading = false,
}) => {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredSkills = availableSkills.filter(
        (skill) =>
            skill.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !selectedSkills.includes(skill.name)
    );

    const handleSkillSelect = (skillName) => {
        onSkillAdd(skillName);
        setSearchTerm("");
        setOpen(false);
    };

    const handleSkillRemove = (skillName) => {
        onSkillRemove(skillName);
    };

    return (
        <div className="space-y-4">
            {/* Selected Skills */}
            {selectedSkills.length > 0 && (
                <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                        {selectedSkills.map((skill) => (
                            <Badge
                                key={skill}
                                variant="secondary"
                                className="flex items-center gap-1"
                            >
                                {skill}
                                <X
                                    className="w-3 h-3 cursor-pointer hover:text-red-500"
                                    onClick={() => handleSkillRemove(skill)}
                                />
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {/* Skill Selector */}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                        <Plus className="w-4 h-4 mr-2" />
                        Add skill
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    <Command>
                        <CommandInput
                            placeholder="Search skill..."
                            value={searchTerm}
                            onValueChange={setSearchTerm}
                        />
                        <CommandList>
                            {isLoading ? (
                                <div className="flex items-center justify-center p-4">
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Loading...
                                </div>
                            ) : filteredSkills.length === 0 ? (
                                <CommandEmpty>
                                    {availableSkills.length === 0
                                        ? "No skills found for this category"
                                        : "No skills found"}
                                </CommandEmpty>
                            ) : (
                                <CommandGroup>
                                    {filteredSkills.map((skill) => (
                                        <CommandItem
                                            key={skill.id}
                                            onSelect={() =>
                                                handleSkillSelect(skill.name)
                                            }
                                            className="cursor-pointer"
                                        >
                                            {skill.name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default SkillSelector;
