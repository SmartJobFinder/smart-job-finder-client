"use client";

import React from "react";
import Image from "next/image";
import { PlusCircle, Edit, Trash2 } from "lucide-react";

export default function SectionCard({
    id,
    title,
    description,
    imageSrc,
    imageAlt,
    content,
    data,
    onAdd,
    onEdit,
    onDelete,
}) {
    const hasContent =
        data &&
        (Array.isArray(data)
            ? data.length > 0
            : id === "aboutMe"
            ? !!data.text
            : Object.keys(data).length > 0);

    const handleMainClick = () => {
        if (hasContent && onEdit) {
            onEdit();
        } else if (!hasContent && onAdd) {
            onAdd();
        }
    };

    const renderContent = () => {
        if (!hasContent) {
            return (
                <p className="p-3 mt-2 text-sm text-gray-400">{description}</p>
            );
        }
        return <div className="p-3 rounded-md ">{content}</div>;
    };

    return (
        <div className="relative p-4 transition-shadow bg-white shadow-sm rounded-xl hover:shadow-md">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    {title !== "Personal Detail" && (
                        <h3 className="text-lg font-bold text-black">
                            {title}
                        </h3>
                    )}
                    {renderContent()}
                </div>

                <div className="flex flex-col items-end gap-2 ml-4 shrink-0">
                    <div className="flex items-center gap-2">
                        {hasContent ? (
                            <>
                                {!Array.isArray(data) && (
                                    <Edit
                                        size={24}
                                        className="text-blue-800 transition-transform hover:scale-105"
                                        onClick={handleMainClick}
                                    />
                                )}
                                {Array.isArray(data) && onAdd && (
                                    <PlusCircle
                                        size={24}
                                        className="text-blue-800 transition-transform hover:scale-105"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onAdd();
                                        }}
                                    />
                                )}
                            </>
                        ) : (
                            <PlusCircle
                                size={24}
                                className="text-blue-800 transition-transform hover:scale-105"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAdd && onAdd();
                                }}
                            />
                        )}

                        {onDelete && (
                            <Trash2
                                size={24}
                                className="text-red-500 transition-transform hover:scale-105"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete();
                                }}
                            />
                        )}
                    </div>

                    {imageSrc && (
                        <div className="relative w-16 h-16 opacity-80">
                            <Image
                                src={imageSrc}
                                alt={imageAlt || title}
                                fill
                                sizes="24"
                                className="object-contain"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
