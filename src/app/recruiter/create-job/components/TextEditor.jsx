"use client";

import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Bold, Italic, List, Link } from "lucide-react";

const TextEditor = ({
    placeholder,
    value,
    onChange,
    maxLength = 500,
    minHeight = "120px",
}) => {
    return (
        <div className="space-y-2">
            <Textarea
                placeholder={placeholder}
                value={value || ""}
                onChange={(e) => onChange(e.target.value)}
                className={`resize-none`}
                style={{ minHeight }}
                maxLength={maxLength}
            />
            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-blue-100"
                        type="button"
                        title="Bold"
                    >
                        <Bold className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-blue-100"
                        type="button"
                        title="Italic"
                    >
                        <Italic className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-blue-100"
                        type="button"
                        title="Bullet List"
                    >
                        <List className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-blue-100"
                        type="button"
                        title="Link"
                    >
                        <Link className="w-4 h-4" />
                    </Button>
                </div>
                <span className="text-sm text-gray-500">
                    {(value || "").length} / {maxLength}
                </span>
            </div>
        </div>
    );
};

export default TextEditor;
