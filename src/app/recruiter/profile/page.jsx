"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Phone,
  ShieldCheck,
  UserCircle2,
  BadgeCheck,
  Edit,
  Save,
  X,
  Loader2,
  AlertCircle,
  Crown,
} from "lucide-react";
import { getCurrentUser, updateUserProfile } from "@/services/userService";
import Link from "next/link";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { meThunk } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { t } from "@/i18n/i18n";

export default function RecruiterProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
  });

  const [formErrors, setFormErrors] = useState({
    fullName: "",
    phone: "",
  });

  // Load user data
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCurrentUser();

        console.log("Loaded user data:", data);

        if (mounted) {
          setUser(data);
          setFormData({
            fullName: data.fullName || "",
            phone: data.phone || "",
          });
        }
      } catch (e) {
        console.error("Error loading user:", e);
        if (mounted) {
          setError(e.message || "Failed to load profile");
          toast.error(t`Failed to load profile`);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // Validate fullName
    if (!formData.fullName || !formData.fullName.trim()) {
      errors.fullName = t`Full name is required`;
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = t`Full name must be at least 2 characters`;
    } else if (formData.fullName.trim().length > 100) {
      errors.fullName = t`Full name must not exceed 100 characters`;
    }

    // Validate phone (optional, but if provided must be valid)
    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(formData.phone.trim().replace(/\s/g, ""))) {
        errors.phone = t`Phone number must be 10-11 digits`;
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error(t`Please fix the errors before saving`);
      return;
    }

    if (!user || !user.id) {
      toast.error(t`User ID not found`);
      return;
    }

    try {
      setSaving(true);

      const updateData = {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim() || "",
      };

      console.log("=== SUBMIT UPDATE ===");
      console.log("User ID:", user.id);
      console.log("Update Data:", updateData);

      const updatedUser = await updateUserProfile(user.id, updateData);

      console.log("Updated user:", updatedUser);

      setUser(updatedUser);
      setIsEditing(false);

      // Update Redux store
      try {
        await dispatch(meThunk()).unwrap();
      } catch (reduxError) {
        console.warn("Failed to update Redux store:", reduxError);
      }

      toast.success(t`Profile updated successfully!`);
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMessage = error.message || t`Failed to update profile`;
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      fullName: user?.fullName || "",
      phone: user?.phone || "",
    });
    setFormErrors({
      fullName: "",
      phone: "",
    });
  };

  const handleUpgradeVip = () => {
    router.push("/recruiter/companyVip");
  };

  const handleContactSupport = () => {
    const subject = encodeURIComponent("Support Request - Recruiter Profile");
    const body = encodeURIComponent(`Hello JobFind Support Team,

I need assistance with my recruiter account.

User Details:
- Name: ${user?.fullName || "N/A"}
- Email: ${user?.email || "N/A"}
- User ID: ${user?.id || "N/A"}
- Role: ${user?.roleName || "RECRUITER"}

Issue Description:
[Please describe your issue here]

Thank you for your support.

Best regards,
${user?.fullName || "Recruiter"}`);

    const mailtoLink = `mailto:pvp.1803ac@gmail.com?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
  };

  const statusBadge = useMemo(() => {
    const active = user?.isActive || user?.status === "ACTIVE";
    const text = active ? t`Active` : t`Inactive`;
    const cls = active
      ? "bg-green-50 text-green-700 border-green-300"
      : "bg-gray-100 text-gray-600 border-gray-300";
    return (
      <span
        className={`px-2.5 py-1 rounded-full text-xs border font-medium ${cls}`}
      >
        {text}
      </span>
    );
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{t`Loading profile...`}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="max-w-md w-full">
          <div className="px-6 py-8 rounded-lg border bg-red-50 text-red-600 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {t`Error Loading Profile`}
            </h3>
            <p className="text-sm mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-red-300 hover:bg-red-100"
            >
              {t`Try Again`}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white shadow-lg mb-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <img
              src={
                user?.avatar ||
                "https://res.cloudinary.com/drozptref/image/upload/v1763315109/phqjenyfgic1dw5yxcas.jpg"
              }
              className="w-24 h-24 rounded-full ring-4 ring-white/30 object-cover"
              alt="avatar"
            />
            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-lg">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <h1 className="text-3xl font-bold truncate">
                {user?.fullName || user?.email}
              </h1>
              {statusBadge}
            </div>
            <p className="text-white/90 flex items-center gap-2 text-sm">
              <ShieldCheck size={16} />
              <span className="uppercase tracking-wide font-medium">
                {user?.roleName === "RECRUITER" ? t`RECRUITER` : user?.roleName}
              </span>
            </p>
            {user?.email && (
              <p className="text-white/80 text-sm mt-1 flex items-center gap-2">
                <Mail size={14} />
                {user.email}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            {!isEditing ? (
              <Button
                variant="secondary"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="w-4 h-4 mr-2" />
                {t`Edit Profile`}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className="bg-green-500 hover:bg-green-600 text-white shadow-lg"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t`Saving...`}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {t`Save`}
                    </>
                  )}
                </Button>
                <Button
                  variant="secondary"
                  className="bg-red-500 hover:bg-red-600 text-white shadow-lg"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  <X className="w-4 h-4 mr-2" />
                  {t`Cancel`}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* General Information */}
          <div className="rounded-xl border bg-white shadow-sm">
            <div className="p-6 border-b bg-gray-50">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <UserCircle2 size={22} className="text-blue-600" />
                {t`General Information`}
              </h2>
            </div>

            <div className="p-6">
              {isEditing ? (
                <div className="space-y-5">
                  {/* CHỈ CÒN FULL NAME VÀ STATUS - BỎ PHONE NUMBER */}
                  <div>
                    <Label
                      htmlFor="fullName"
                      className="text-sm font-medium mb-2 flex items-center gap-1"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder={t`Enter your full name`}
                      className={`w-full transition-colors ${
                        formErrors.fullName
                          ? "border-red-500 focus:ring-red-500"
                          : "focus:border-blue-500 focus:ring-blue-500"
                      }`}
                      disabled={saving}
                      autoFocus
                    />
                    {formErrors.fullName && (
                      <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {formErrors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-gray-100">
                    <Label className="text-sm font-medium mb-2 block">
                      {t`Account Status`}
                    </Label>
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 text-sm">
                      {user?.status || (user?.isActive ? "ACTIVE" : "INACTIVE")}
                    </div>
                    <p className="text-gray-500 text-xs mt-1.5">
                      {t`Account status is managed by system administrators`}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <div className="text-gray-500 text-xs uppercase mb-2 font-medium">
                      {t`FULL NAME`}
                    </div>
                    <div className="font-medium text-gray-900">
                      {user?.fullName || "—"}
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-500 text-xs uppercase mb-2 font-medium">
                      {t`STATUS`}
                    </div>
                    <div className="font-medium text-gray-900">
                      {user?.status || (user?.isActive ? "ACTIVE" : "INACTIVE")}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information - HIỂN THỊ VÀ EDIT PHONE NUMBER Ở ĐÂY */}
          <div className="rounded-xl border bg-white shadow-sm">
            <div className="p-6 border-b bg-gray-50">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <BadgeCheck size={22} className="text-blue-600" />
                {t`Contact Information`}
              </h2>
            </div>

            <div className="p-6">
              {isEditing ? (
                <div className="space-y-4">
                  {/* Email - Read only */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      {t`Email Address`}
                    </Label>
                    <div className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50">
                      <Mail size={18} className="text-blue-600" />
                      <div className="flex-1 min-w-0">
                        <div className="truncate font-medium text-gray-900">
                          {user?.email}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs mt-1.5">
                      {t`Email cannot be changed`}
                    </p>
                  </div>

                  {/* Phone Number - Editable */}
                  <div>
                    <Label
                      htmlFor="phone"
                      className="text-sm font-medium mb-2 flex items-center gap-1"
                    >
                      Phone Number{" "}
                      <span className="text-gray-400 text-xs font-normal">
                        (Optional)
                      </span>
                    </Label>
                    <div className="relative">
                      <Phone
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={16}
                      />
                      <Input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="0987654321"
                        className={`w-full pl-10 transition-colors ${
                          formErrors.phone
                            ? "border-red-500 focus:ring-red-500"
                            : "focus:border-blue-500 focus:ring-blue-500"
                        }`}
                        disabled={saving}
                      />
                    </div>
                    {formErrors.phone && (
                      <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {formErrors.phone}
                      </p>
                    )}
                    <p className="text-gray-500 text-xs mt-1.5">
                      {t`Enter 10-11 digit phone number`}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg border bg-gradient-to-r from-blue-50 to-blue-100">
                    <Mail size={20} className="text-blue-600" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-600 mb-1">{t`Email`}</div>
                      <div className="truncate font-medium text-gray-900">
                        {user?.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-lg border bg-gradient-to-r from-green-50 to-green-100">
                    <Phone size={20} className="text-green-600" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-600 mb-1">{t`Phone`}</div>
                      <div className="font-medium text-gray-900">
                        {user?.phone || t`Not provided`}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-500 mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                <span>
                  {t`Email address cannot be changed. If you need to update your email, please contact our support team.`}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl border bg-white shadow-sm">
            <div className="p-6 border-b bg-gray-50">
              <h2 className="text-lg font-semibold">{t`Quick Actions`}</h2>
            </div>

            <div className="p-6">
              <div className="flex flex-col gap-3">
                <Button
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg"
                  onClick={handleUpgradeVip}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  {t`Upgrade to VIP`}
                </Button>

                <Link href="/recruiter/company" className="w-full">
                  <Button variant="outline" className="w-full">
                    {t`View Company Profile`}
                  </Button>
                </Link>

                <Link href="/recruiter/manage-job" className="w-full">
                  <Button variant="outline" className="w-full">
                    {t`Manage Jobs`}
                  </Button>
                </Link>

                <Link href="/recruiter/applicants/all" className="w-full">
                  <Button variant="outline" className="w-full">
                    {t`View Applicants`}
                  </Button>
                </Link>

                <Link href="/recruiter/settings" className="w-full">
                  <Button variant="outline" className="w-full">
                    {t`Change Password`}
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Help Card */}
          <div className="rounded-xl border bg-gradient-to-br from-purple-50 to-pink-50 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Mail size={18} className="text-purple-600" />
              {t`Need Help?`}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {t`Contact our support team for assistance with your recruiter account.`}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-purple-200 hover:bg-purple-50 hover:text-purple-700"
              onClick={handleContactSupport}
            >
              <Mail size={14} className="mr-2" />
              {t`Contact Support`}
            </Button>
            <p className="text-xs text-gray-500 mt-3 text-center">
              pvp.1803ac@gmail.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
