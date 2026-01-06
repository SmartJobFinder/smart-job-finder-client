"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // ✅ THÊM IMPORT NÀY
import { Label } from "@/components/ui/label"; // ✅ THÊM IMPORT NÀY
import { Loader2, ArrowLeft, Map } from "lucide-react"; // ✅ THÊM Map ICON
import { toast } from "react-toastify";
import Link from "next/link";
import { t } from "@/i18n/i18n";

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
    wardName: "",
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
            wardName:
              (Array.isArray(companyData.wardNames) &&
                companyData.wardNames[0]) ||
              companyData.wardName ||
              "",
            locationCountry: companyData.locationCountry || "Vietnam",
            foundedYear: companyData.foundedYear || new Date().getFullYear(),
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

  // ✅ THÊM FUNCTION ĐỂ EXTRACT URL TỪ IFRAME
  const extractMapUrl = input => {
    if (!input || typeof input !== "string") return "";

    const trimmedInput = input.trim();

    // Nếu input đã là URL hợp lệ (bắt đầu bằng https://www.google.com/maps/embed)
    if (trimmedInput.startsWith("https://www.google.com/maps/embed")) {
      return trimmedInput;
    }

    // Nếu input là iframe HTML, extract URL từ src attribute
    const srcMatch = trimmedInput.match(/src=["']([^"']+)["']/);
    if (srcMatch && srcMatch[1]) {
      return srcMatch[1];
    }

    // Nếu không match, return input gốc (user có thể đang gõ dở)
    return trimmedInput;
  };

  // ✅ SỬA handleInputChange ĐỂ XỬ LÝ RIÊNG mapEmbedUrl
  const handleInputChange = (nameOrEvent, value) => {
    if (typeof nameOrEvent === "string") {
      // Gọi từ các component con: handleInputChange(name, value)
      let processedValue = value;

      // ✅ Xử lý đặc biệt cho mapEmbedUrl
      if (nameOrEvent === "mapEmbedUrl") {
        processedValue = extractMapUrl(value);
      }

      setFormData(prev => ({
        ...prev,
        [nameOrEvent]: processedValue,
      }));

      if (errors[nameOrEvent]) {
        setErrors(prev => ({
          ...prev,
          [nameOrEvent]: null,
        }));
      }
    } else {
      // Gọi từ event trực tiếp: onChange={handleInputChange}
      const { name, value } = nameOrEvent.target;
      let processedValue = value;

      // ✅ Xử lý đặc biệt cho mapEmbedUrl
      if (name === "mapEmbedUrl") {
        processedValue = extractMapUrl(value);
      }

      setFormData(prev => ({
        ...prev,
        [name]: processedValue,
      }));

      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: null,
        }));
      }
    }
  };

  const handleCategoryChange = categoryIds => {
    setFormData(prev => ({
      ...prev,
      categoryIds: Array.isArray(categoryIds) ? categoryIds : [],
    }));
  };

  const handleImageUpload = (file, type) => {
    if (!file) return;

    // Kiểm tra kích thước file (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors(prev => ({
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
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({
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
      setErrors(prev => ({
        ...prev,
        [type]: null,
      }));
    }
  };

  const removeImage = type => {
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

  const handleSubmit = async e => {
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
          ? formData.categoryIds.filter(id => id != null && id !== "")
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
          <p className="text-gray-600">Update your company information</p>
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

          {/* Map Embed URL Section */}
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Map className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold">
                  {t`Google Maps Location`}
                </h2>
              </div>

              <div>
                <Label htmlFor="mapEmbedUrl" className="text-sm font-medium">
                  {t`Map Embed URL or HTML`}{" "}
                  <span className="text-gray-400 text-xs font-normal">
                    {t`(Optional)`}
                  </span>
                </Label>
                <textarea
                  id="mapEmbedUrl"
                  name="mapEmbedUrl"
                  rows={3}
                  placeholder={t`Paste entire iframe HTML or just the URL...`}
                  value={formData.mapEmbedUrl}
                  onChange={e =>
                    handleInputChange("mapEmbedUrl", e.target.value)
                  }
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {t`Smart input: Paste the entire iframe HTML or just the embed URL - we'll extract it automatically!`}
                </p>
              </div>

              {/* Helper Instructions - CẬP NHẬT */}
              <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-gray-800 font-semibold mb-2 flex items-center gap-2">
                  {t`How to get Google Maps Embed:`}
                </p>
                <ol className="text-xs text-gray-700 space-y-1.5 list-decimal list-inside ml-2">
                  <li>
                    {t`Go to`}{" "}
                    <a
                      href="https://www.google.com/maps"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Google Maps
                    </a>{" "}
                    {t`and search your company address`}
                  </li>
                  <li>
                    {t`Click the`} <strong>{t`"Share"`}</strong> {t`button`}
                  </li>
                  <li>
                    {t`Select`} <strong>{t`"Embed a map"`}</strong> {t`tab`}
                  </li>
                  <li>
                    {t`Click`} <strong>{t`"COPY HTML"`}</strong>
                  </li>
                  <li className="font-medium text-blue-700">
                    {t`Paste the entire HTML here - we'll extract the URL automatically!`}
                  </li>
                </ol>

                <div className="mt-3 p-2 bg-white/50 rounded border border-blue-100">
                  <p className="text-xs text-gray-600 mb-1 font-medium">
                    Example input (both work!):
                  </p>
                  <code className="text-xs text-gray-700 block mb-1">
                    {`<iframe src="https://www.google.com/maps/embed?pb=..." ...></iframe>`}
                  </code>
                  <p className="text-xs text-gray-500 italic">or just:</p>
                  <code className="text-xs text-gray-700 block">
                    {`https://www.google.com/maps/embed?pb=...`}
                  </code>
                </div>
              </div>

              {/* Preview Map if URL exists */}
              {formData.mapEmbedUrl &&
                formData.mapEmbedUrl.startsWith(
                  "https://www.google.com/maps/embed"
                ) && (
                  <div className="mt-4">
                    <Label className="text-sm font-medium mb-2 block items-center gap-2">
                      <span className="text-green-600">✓</span>
                      Map Preview
                    </Label>
                    <div className="overflow-hidden rounded-lg border-2 border-green-200 shadow-sm">
                      <iframe
                        src={formData.mapEmbedUrl}
                        width="100%"
                        height="300"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Company Location Map Preview"
                      />
                    </div>
                    <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                      Map loaded successfully! Candidates will see this location
                      on your company page.
                    </p>
                  </div>
                )}

              {/* Invalid URL Warning */}
              {formData.mapEmbedUrl &&
                !formData.mapEmbedUrl.startsWith(
                  "https://www.google.com/maps/embed"
                ) && (
                  <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-800 flex items-center gap-2">
                      Invalid map URL. Please paste the entire iframe HTML or a
                      valid embed URL starting with{" "}
                      <code className="bg-amber-100 px-1 rounded">
                        https://www.google.com/maps/embed
                      </code>
                    </p>
                  </div>
                )}
            </div>
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
