"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

const CompanyImageUpload = ({ 
    formData, 
    errors, 
    avatarPreview, 
    coverPreview, 
    onImageUpload, 
    onRemoveImage 
}) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
                <ImageIcon className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-semibold">Company Images</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Avatar Upload */}
                <div className="space-y-4">
                    <Label>
                        Company Logo <span className="text-red-500">*</span>
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        {avatarPreview || formData.avatar ? (
                            <div className="relative">
                                <Image
                                    src={avatarPreview || formData.avatar}
                                    alt="Company logo preview"
                                    width={120}
                                    height={120}
                                    className="mx-auto rounded-lg object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => onRemoveImage('avatar')}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div>
                                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                <p className="text-sm text-gray-600 mb-2">Upload company logo</p>
                                <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => onImageUpload(e.target.files[0], 'avatar')}
                            className="hidden"
                            id="avatar-upload"
                        />
                        <label
                            htmlFor="avatar-upload"
                            className="cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Choose File
                        </label>
                    </div>
                    {errors.avatar && (
                        <p className="text-sm text-red-500">{errors.avatar}</p>
                    )}
                </div>

                {/* Cover Upload */}
                <div className="space-y-4">
                    <Label>
                        Company Cover Image <span className="text-red-500">*</span>
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        {coverPreview || formData.avatarCover ? (
                            <div className="relative">
                                <Image
                                    src={coverPreview || formData.avatarCover}
                                    alt="Company cover preview"
                                    width={200}
                                    height={120}
                                    className="mx-auto rounded-lg object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => onRemoveImage('avatarCover')}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div>
                                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                <p className="text-sm text-gray-600 mb-2">Upload cover image</p>
                                <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => onImageUpload(e.target.files[0], 'avatarCover')}
                            className="hidden"
                            id="cover-upload"
                        />
                        <label
                            htmlFor="cover-upload"
                            className="cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Choose File
                        </label>
                    </div>
                    {errors.avatarCover && (
                        <p className="text-sm text-red-500">{errors.avatarCover}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompanyImageUpload; 