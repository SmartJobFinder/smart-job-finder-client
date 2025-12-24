"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Lock,
  Save,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import CompanyGuard from "@/components/recruiter/CompanyGuard";
import { toast } from "react-toastify";
import { changePassword, getCurrentUser } from "@/services/userService";
import { useSelector } from "react-redux";

// Password Rule Component
function PasswordRule({ ok, label }) {
  return (
    <li className="flex items-center gap-2 text-xs">
      {ok ? (
        <CheckCircle2 className="w-3 h-3 text-green-600" />
      ) : (
        <AlertCircle className="w-3 h-3 text-gray-400" />
      )}
      <span className={ok ? "text-green-700" : "text-gray-500"}>{label}</span>
    </li>
  );
}

export default function RecruiterSettingsPage() {
  const user = useSelector(state => state.auth.user);
  const [accountInfo, setAccountInfo] = useState(user);
  const [accountLoading, setAccountLoading] = useState(!user);
  const [accountError, setAccountError] = useState(null);

  // Password change states
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});
  const displayUser = accountInfo || user;

  useEffect(() => {
    let mounted = true;

    const loadAccountInfo = async () => {
      try {
        setAccountLoading(true);
        setAccountError(null);
        const data = await getCurrentUser();
        if (mounted) {
          setAccountInfo(data);
        }
      } catch (error) {
        console.error("Error loading recruiter settings user:", error);
        const message = error?.message || "Không thể tải thông tin tài khoản";
        if (mounted) {
          setAccountError(message);
          toast.error(message);
        }
      } finally {
        if (mounted) {
          setAccountLoading(false);
        }
      }
    };

    loadAccountInfo();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (user) {
      setAccountInfo(prev => ({ ...user, ...prev }));
    }
  }, [user]);

  // Password validation rules
  const passwordRules = useMemo(() => {
    const pwd = passwordForm.newPassword;
    return {
      length: pwd.length >= 8,
      upper: /[A-Z]/.test(pwd),
      lower: /[a-z]/.test(pwd),
      digit: /\d/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd),
    };
  }, [passwordForm.newPassword]);

  const isPasswordValid = useMemo(() => {
    return Object.values(passwordRules).every(v => v === true);
  }, [passwordRules]);

  const handlePasswordInputChange = e => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordForm.oldPassword.trim()) {
      errors.oldPassword = "Current password is required";
    }

    if (!passwordForm.newPassword.trim()) {
      errors.newPassword = "New password is required";
    } else if (!isPasswordValid) {
      errors.newPassword = "Password does not meet all requirements";
    }

    if (!passwordForm.confirmPassword.trim()) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (
      passwordForm.oldPassword &&
      passwordForm.newPassword &&
      passwordForm.oldPassword === passwordForm.newPassword
    ) {
      errors.newPassword =
        "New password must be different from current password";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChangePassword = async () => {
    if (!validatePasswordForm()) {
      toast.error("Please fix the errors before saving");
      return;
    }

    try {
      setChangingPassword(true);

      await changePassword(passwordForm.oldPassword, passwordForm.newPassword);

      toast.success("Password changed successfully!");

      // Reset form
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors({});
    } catch (error) {
      console.error("Error changing password:", error);
      const errorMessage = error.message || "Failed to change password";
      toast.error(errorMessage);
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <CompanyGuard>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-500 mt-1">
            Manage your account information and security settings
          </p>
        </div>

        {/* Account Info Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User size={20} className="text-blue-600" />
                  Account Information
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Your basic account information
                </p>
              </div>

              {accountLoading && (
                <div className="text-sm text-blue-700 bg-blue-50 border border-blue-100 rounded-md px-3 py-2">
                  Đang cập nhật thông tin tài khoản...
                </div>
              )}

              {accountError && (
                <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-md px-3 py-2">
                  {accountError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Full Name
                  </Label>
                  <div className="mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900">
                    {displayUser?.fullName || "—"}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Email Address
                  </Label>
                  <div className="mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900">
                    {displayUser?.email || "—"}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  <div className="mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-900">
                    {displayUser?.phone || "Not provided"}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Account Status
                  </Label>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        displayUser?.status === "ACTIVE" ||
                        displayUser?.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {displayUser?.status ||
                        (displayUser?.isActive ? "ACTIVE" : "INACTIVE")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500">
                  <AlertCircle size={12} className="inline mr-1" />
                  To update your profile information, please go to the{" "}
                  <a
                    href="/recruiter/profile"
                    className="text-blue-600 hover:underline"
                  >
                    Profile page
                  </a>
                  .
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change Password Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Lock size={20} className="text-blue-600" />
                  Change Password
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Update your password to keep your account secure
                </p>
              </div>

              <div className="space-y-4 max-w-md">
                {/* Current Password */}
                <div>
                  <Label htmlFor="oldPassword" className="text-sm font-medium">
                    Current Password
                  </Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="oldPassword"
                      name="oldPassword"
                      type={showOldPassword ? "text" : "password"}
                      value={passwordForm.oldPassword}
                      onChange={handlePasswordInputChange}
                      placeholder="Enter current password"
                      className={`pl-10 pr-10 ${
                        passwordErrors.oldPassword ? "border-red-500" : ""
                      }`}
                      disabled={changingPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showOldPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.oldPassword && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {passwordErrors.oldPassword}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <Label htmlFor="newPassword" className="text-sm font-medium">
                    New Password
                  </Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={handlePasswordInputChange}
                      placeholder="Enter new password"
                      className={`pl-10 pr-10 ${
                        passwordErrors.newPassword ? "border-red-500" : ""
                      }`}
                      disabled={changingPassword}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {passwordErrors.newPassword}
                    </p>
                  )}

                  {/* Password Rules */}
                  {passwordForm.newPassword && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg border">
                      <p className="text-xs font-medium text-gray-700 mb-2">
                        Password must contain:
                      </p>
                      <ul className="space-y-1">
                        <PasswordRule
                          ok={passwordRules.length}
                          label="At least 8 characters"
                        />
                        <PasswordRule
                          ok={passwordRules.upper}
                          label="One uppercase letter"
                        />
                        <PasswordRule
                          ok={passwordRules.lower}
                          label="One lowercase letter"
                        />
                        <PasswordRule
                          ok={passwordRules.digit}
                          label="One number"
                        />
                        <PasswordRule
                          ok={passwordRules.special}
                          label="One special character"
                        />
                      </ul>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium"
                  >
                    Confirm New Password
                  </Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordInputChange}
                      placeholder="Confirm new password"
                      className={`pl-10 pr-10 ${
                        passwordErrors.confirmPassword ? "border-red-500" : ""
                      }`}
                      disabled={changingPassword}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle size={12} />
                      {passwordErrors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleChangePassword}
                    disabled={changingPassword}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {changingPassword ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Changing...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Change Password
                      </>
                    )}
                  </Button>

                  {Object.keys(passwordForm).some(k => passwordForm[k]) && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPasswordForm({
                          oldPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                        setPasswordErrors({});
                      }}
                      disabled={changingPassword}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CompanyGuard>
  );
}
