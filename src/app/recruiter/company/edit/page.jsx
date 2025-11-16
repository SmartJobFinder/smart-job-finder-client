"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";

import { updateCompany, getMyCompany } from "@/services/myCompanyService";
import { getAllCategories } from "@/services/categoryService";

import CompanyImageUpload from "../../create-company/components/CompanyImageUpload";
import BasicInformation from "../../create-company/components/BasicInformation";
import LocationInformation from "../../create-company/components/LocationInformation";
import CompanyDetails from "../../create-company/components/CompanyDetails";
import SocialMedia from "../../create-company/components/SocialMedia";
import CategorySelection from "../../create-company/components/CategorySelection";

export default function EditCompanyPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [companyId, setCompanyId] = useState(null);

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
        categoryIds: [],
    });

    // State cho files và preview
    const [avatarFile, setAvatarFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [errors, setErrors] = useState({});

    // Load company data và categories
    useEffect(() => {
        const loadData = async () => {
            try {
                setInitialLoading(true);

                // Load categories
                const [companyData, categoriesData] = await Promise.all([
                    getMyCompany(),
                    getAllCategories(),
                ]);

                // Set company data
                if (companyData) {
                    setCompanyId(companyData.id);
                    setFormData({
                        companyName: companyData.companyName || "",
                        description: companyData.description || "",
                        email: companyData.email || "",
                        phoneNumber: companyData.phoneNumber || "",
                        website: companyData.website || "",
                        address: companyData.address || "",
                        locationCity: companyData.locationCity || "",
                        locationCountry:
                            companyData.locationCountry || "Vietnam",
                        foundedYear:
                            companyData.foundedYear || new Date().getFullYear(),
                        quantityEmployee: companyData.quantityEmployee || 1,
                        status: companyData.status || "active",
                        proCompany: companyData.proCompany || false,
                        facebookUrl: companyData.facebookUrl || "",
                        twitterUrl: companyData.twitterUrl || "",
                        linkedinUrl: companyData.linkedinUrl || "",
                        mapEmbedUrl: companyData.mapEmbedUrl || "",
                        categoryIds: companyData.categoryIds || [],
                    });

                    // Set avatar preview from existing data
                    if (companyData.avatar) {
                        setAvatarPreview(companyData.avatar);
                    }
                    if (companyData.avatarCover) {
                        setCoverPreview(companyData.avatarCover);
                    }
                }

                // Set categories
                setCategories(categoriesData || []);
            } catch (error) {
                console.error("Error loading data:", error);
                toast.error("Failed to load company data");
                router.push("/recruiter/company");
            } finally {
                setInitialLoading(false);
                setCategoriesLoading(false);
            }
        };

        loadData();
    }, [router]);

    const handleInputChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: null,
            }));
        }
    };

    const handleCategoryChange = (categoryIds) => {
        setFormData((prev) => ({
            ...prev,
            categoryIds: Array.isArray(categoryIds) ? categoryIds : [],
        }));
    };

    const handleImageUpload = (file, type) => {
        if (!file) return;

        // Kiểm tra kích thước file (5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            setErrors((prev) => ({
                ...prev,
                [type]: `File size must be less than 5MB. Current size: ${(
                    file.size /
                    1024 /
                    1024
                ).toFixed(2)}MB`,
            }));
            return;
        }

        // Kiểm tra định dạng file
        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
        ];
        if (!allowedTypes.includes(file.type)) {
            setErrors((prev) => ({
                ...prev,
                [type]: "File must be JPEG, JPG, PNG, or WebP format",
            }));
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            if (type === "avatar") {
                setAvatarFile(file);
                setAvatarPreview(reader.result);
            } else if (type === "avatarCover") {
                setCoverFile(file);
                setCoverPreview(reader.result);
            }
        };
        reader.readAsDataURL(file);

        // Clear error if exists
        if (errors[type]) {
            setErrors((prev) => ({
                ...prev,
                [type]: null,
            }));
        }
    };

    const removeImage = (type) => {
        if (type === "avatar") {
            setAvatarFile(null);
            setAvatarPreview(null);
        } else if (type === "avatarCover") {
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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (!companyId) {
            toast.error("Company ID not found");
            return;
        }

        try {
            setLoading(true);

            const updateData = {
                companyName: formData.companyName.trim(),
                description: formData.description.trim() || "",
                email: formData.email.trim(),
                phoneNumber: formData.phoneNumber.trim(),
                website: formData.website.trim() || "",
                address: formData.address.trim(),
                locationCity: formData.locationCity.trim(),
                locationCountry: formData.locationCountry || "Vietnam",
                foundedYear: parseInt(formData.foundedYear, 10),
                quantityEmployee: parseInt(formData.quantityEmployee, 10),
                status: formData.status || "active",
                proCompany: Boolean(formData.proCompany),
                facebookUrl: formData.facebookUrl?.trim() || "",
                twitterUrl: formData.twitterUrl?.trim() || "",
                linkedinUrl: formData.linkedinUrl?.trim() || "",
                mapEmbedUrl: formData.mapEmbedUrl?.trim() || "",
                categoryIds: Array.isArray(formData.categoryIds)
                    ? formData.categoryIds.filter(
                          (id) => id != null && id !== ""
                      )
                    : [],
            };

            console.log("=== SUBMIT UPDATE ===");
            console.log("Has avatar file:", !!avatarFile);
            console.log("Has cover file:", !!coverFile);

            // ✅ Truyền cả file ảnh
            const result = await updateCompany(
                companyId,
                updateData,
                avatarFile, // File ảnh avatar
                coverFile // File ảnh cover
            );

            console.log("Update result:", result);
            toast.success("Company updated successfully!");

            setTimeout(() => {
                router.push("/recruiter/company");
            }, 1500);
        } catch (error) {
            console.error("=== SUBMIT ERROR ===", error);
            toast.error(error.message || "Failed to update company");
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/recruiter/company"
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Company Profile
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Edit Company
                    </h1>
                    <p className="text-gray-600">
                        Update your company information
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Company Images */}
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
                            selectedCategories={formData.categoryIds}
                            onCategoryChange={handleCategoryChange}
                            isLoading={categoriesLoading}
                        />
                    </Card>

                    {/* Submit Buttons */}
                    <div className="flex gap-4 justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/recruiter/company")}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                "Update Company"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
