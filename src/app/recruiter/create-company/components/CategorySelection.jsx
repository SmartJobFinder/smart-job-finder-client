"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, Loader2 } from "lucide-react";

const CategorySelection = ({ 
    categories, 
    categoriesLoading, 
    formData, 
    onCategoryChange 
}) => {
    // Đảm bảo categoryIds luôn là array
    const categoryIds = Array.isArray(formData.categoryIds) 
        ? formData.categoryIds 
        : formData.categoryIds 
            ? Array.from(formData.categoryIds) 
            : [];

    const handleCategoryChange = (categoryId, checked) => {
        let newCategoryIds;
        if (checked) {
            // Thêm categoryId nếu chưa có
            newCategoryIds = [...categoryIds, categoryId];
        } else {
            // Xóa categoryId nếu đã có
            newCategoryIds = categoryIds.filter(id => id !== categoryId);
        }
        onCategoryChange(newCategoryIds);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
                <Users className="w-5 h-5 text-orange-600" />
                <h2 className="text-xl font-semibold">Industry Categories</h2>
            </div>
            
            {categoriesLoading ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    <span>Loading categories...</span>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={`category-${category.id}`}
                                checked={categoryIds.includes(category.id)}
                                onCheckedChange={(checked) => handleCategoryChange(category.id, checked)}
                            />
                            <Label 
                                htmlFor={`category-${category.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                {category.name}
                            </Label>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategorySelection; 