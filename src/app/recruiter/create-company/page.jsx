"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createCompany } from "@/services/companyService";
import { getAllCategories } from "@/services/categoryService";
import { useSelector } from "react-redux";
import CompanyImageUpload from "./components/CompanyImageUpload";
import BasicInformation from "./components/BasicInformation";
import LocationInformation from "./components/LocationInformation";
import CompanyDetails from "./components/CompanyDetails";
import SocialMedia from "./components/SocialMedia";
import CategorySelection from "./components/CategorySelection";

export default function CreateCompanyPage() {
    const router = useRouter();
    const user = useSelector((state) => state.auth.user);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    
    // State cho form data
    const [formData, setFormData] = useState({
        companyName: "",
        description: "",
        email: "",
        phoneNumber: "",
        website: "",
        address: "",
        locationCity: "",
        locationCountry: "Vietnam",
        foundedYear: new Date().getFullYear(),
        quantityEmployee: 1,
        status: "active",
        proCompany: false,
        facebookUrl: "",
        twitterUrl: "",
        linkedinUrl: "",
        mapEmbedUrl: "",
        categoryIds: [] // Đảm bảo luôn là array
    });

    // State cho files và preview
    const [avatarFile, setAvatarFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [errors, setErrors] = useState({});

    // Load categories from API
    useEffect(() => {
        const loadCategories = async () => {
            try {
                setCategoriesLoading(true);
                const response = await getAllCategories();
                setCategories(response || []);
            } catch (error) {
                console.error("Error loading categories:", error);
                setCategories([]);
            } finally {
                setCategoriesLoading(false);
            }
        };

        loadCategories();
    }, []);

    const handleInputChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const handleCategoryChange = (categoryIds) => {
        setFormData(prev => ({
            ...prev,
            categoryIds: Array.isArray(categoryIds) ? categoryIds : []
        }));
    };

    const handleImageUpload = (file, type) => {
        if (!file) return;

        // Kiểm tra kích thước file (5MB = 5 * 1024 * 1024 bytes)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            setErrors(prev => ({
                ...prev,
                [type]: `File size must be less than 5MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`
            }));
            return;
        }

        // Kiểm tra định dạng file
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setErrors(prev => ({
                ...prev,
                [type]: 'File must be JPEG, JPG, PNG, or WebP format'
            }));
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            if (type === 'avatar') {
                setAvatarFile(file);
                setAvatarPreview(reader.result);
            } else if (type === 'avatarCover') {
                setCoverFile(file);
                setCoverPreview(reader.result);
            }
        };
        reader.readAsDataURL(file);

        // Clear error if exists
        if (errors[type]) {
            setErrors(prev => ({
                ...prev,
                [type]: null
            }));
        }
    };

    const removeImage = (type) => {
        if (type === 'avatar') {
            setAvatarFile(null);
            setAvatarPreview(null);
        } else if (type === 'avatarCover') {
            setCoverFile(null);
            setCoverPreview(null);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.companyName.trim()) {
            newErrors.companyName = "Company name is required";
        }
        
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }
        
        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = "Phone number is required";
        }
        
        if (!formData.address.trim()) {
            newErrors.address = "Address is required";
        }
        
        if (!formData.locationCity.trim()) {
            newErrors.locationCity = "City is required";
        }
        
        if (formData.foundedYear < 1800 || formData.foundedYear > new Date().getFullYear()) {
            newErrors.foundedYear = "Founded year is invalid";
        }
        
        if (formData.quantityEmployee < 1) {
            newErrors.quantityEmployee = "Employee quantity must be at least 1";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Bắt buộc upload ảnh trước khi submit
        const imageErrors = {};
        if (!avatarFile) {
            imageErrors.avatar = "Company logo is required";
        }
        if (!coverFile) {
            imageErrors.avatarCover = "Company cover image is required";
        }
        if (Object.keys(imageErrors).length > 0) {
            setErrors(prev => ({ ...prev, ...imageErrors }));
            return;
        }
        
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        setUploadProgress(0);
        
        try {
            // Add userId to form data
            const companyData = {
                ...formData,
                userId: user?.id || user?.userId
            };
            
            // Simulate progress for better UX
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) return prev;
                    return prev + Math.random() * 10;
                });
            }, 500);
            
            // Gọi createCompany với files
            await createCompany(companyData, avatarFile, coverFile);
            
            clearInterval(progressInterval);
            setUploadProgress(100);
            
            // Delay một chút để user thấy progress 100%
            setTimeout(() => {
                router.push("/recruiter/company");
            }, 500);
            
        } catch (error) {
            console.error("Error creating company:", error);
            setUploadProgress(0);
            // Có thể thêm toast notification ở đây
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Company</h1>
                    <p className="text-gray-600">Set up your company profile to start posting jobs and attracting candidates.</p>
                </div>

                {/* Progress Bar */}
                {loading && (
                    <div className="mb-6">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Uploading...</span>
                            <span>{Math.round(uploadProgress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Company Images - Moved to top */}
                    <Card className="p-6">
                        <CompanyImageUpload
                            formData={formData}
                            errors={errors}
                            avatarPreview={avatarPreview}
                            coverPreview={coverPreview}
                            onImageUpload={handleImageUpload}
                            onRemoveImage={removeImage}
                        />
                    </Card>

                    {/* Basic Information */}
                    <Card className="p-6">
                        <BasicInformation
                            formData={formData}
                            errors={errors}
                            onInputChange={handleInputChange}
                        />
                    </Card>

                    {/* Location Information */}
                    <Card className="p-6">
                        <LocationInformation
                            formData={formData}
                            errors={errors}
                            onInputChange={handleInputChange}
                        />
                    </Card>

                    {/* Company Details */}
                    <Card className="p-6">
                        <CompanyDetails
                            formData={formData}
                            errors={errors}
                            onInputChange={handleInputChange}
                        />
                    </Card>

                    {/* Social Media */}
                    <Card className="p-6">
                        <SocialMedia
                            formData={formData}
                            onInputChange={handleInputChange}
                        />
                    </Card>

                    {/* Categories */}
                    <Card className="p-6">
                        <CategorySelection
                            categories={categories}
                            categoriesLoading={categoriesLoading}
                            formData={formData}
                            onCategoryChange={handleCategoryChange}
                        />
                    </Card>

                    {/* Submit Buttons */}
                    <div className="flex justify-end space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || categoriesLoading}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {loading ? "Creating..." : "Create Company"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}