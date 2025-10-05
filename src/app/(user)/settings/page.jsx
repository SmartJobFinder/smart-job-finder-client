"use client";

import SetPasswordEmailSent from "@/components/auth/SetPasswordEmailSent";
import { Mail, User, Lock, Trash2, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function SettingsPage() {
    const user = useSelector((state) => state.auth.user);
    const [showSetPwSent, setShowSetPwSent] = useState(false);

    if (showSetPwSent) {
        return (
            <SetPasswordEmailSent
                email={user.email}
                onBack={() => setShowSetPwSent(false)}
            />
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Account Info */}
            <section className="p-6 space-y-4 bg-white border rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold">Account Information</h2>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Email:</p>
                        <p className="font-medium text-gray-800">
                            {user.email}
                        </p>
                    </div>
                    <Mail className="w-5 h-5 text-gray-400" />
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Full name:</p>
                        <p className="font-medium text-gray-800">
                            {user.fullName}
                        </p>
                        <p className="text-sm text-gray-500">
                            Your account name is synchronized with profile
                            information.
                        </p>
                    </div>
                    <User className="w-5 h-5 text-gray-400" />
                </div>

                <a
                    href="/profile"
                    className="inline-flex items-center text-sm font-medium text-blue-500 hover:underline"
                >
                    Update profile information
                    <ChevronRight className="w-4 h-4 ml-1" />
                </a>
            </section>

            {/* Password */}
            <section className="p-6 bg-white border rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold">Password</h2>
                <div className="flex items-center mt-2 text-sm text-gray-600">
                    <Lock className="w-4 h-4 mr-2 text-gray-400" />
                    You signed up with Google, so your account doesn’t have a
                    password.
                </div>

                <div className="mt-3 text-sm">
                    <p className="mb-2 text-gray-600">
                        If you still want to set a password{"  "}
                    </p>
                    <button
                        onClick={() => setShowSetPwSent(true)}
                        className="inline-flex items-center px-4 py-2 mt-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 "
                    >
                        click here
                    </button>
                </div>
            </section>

            {/* Job Invitation Settings */}
            {/* <section className="p-6 space-y-4 bg-white border rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                        Job Invitation Settings
                    </h2>
                    <a
                        href="#"
                        className="text-sm font-medium text-blue-500 hover:underline"
                    >
                        Learn more
                    </a>
                </div>

                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-700">
                        Allow to receive job invitations from employers by
                        emails and SMS
                    </p>
                    <Switch.Root
                        defaultChecked
                        className="w-11 h-6 bg-gray-200 rounded-full data-[state=checked]:bg-blue-800 relative outline-none"
                    >
                        <Switch.Thumb className="block w-5 h-5 bg-gray-500 rounded-full transition-transform translate-x-[2px] data-[state=checked]:translate-x-[22px] data-[state=checked]:bg-white" />
                    </Switch.Root>
                </div>

                <div>
                    <p className="mb-1 text-sm text-gray-600">
                        Don’t receive invitations from: <br />
                        <span className="text-xs text-gray-500">
                            Maximum 5 employers
                        </span>
                    </p>
                    <select
                        disabled
                        className="w-full px-3 py-2 text-sm text-gray-500 bg-gray-100 border border-gray-300 rounded-md"
                    >
                        <option>No companies selected</option>
                    </select>
                </div>
            </section> */}

            {/* Delete Account */}
            {/* <section className="p-6 bg-white border rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold text-red-600">
                    Delete Account
                </h2>
                <p className="mt-1 text-sm text-gray-700">
                    Account deletion is a permanent action and cannot be undone.
                    If you're deleting due to too many emails, you can
                    unsubscribe{" "}
                    <a href="#" className="text-blue-500 underline">
                        here
                    </a>
                    .
                </p>
                <button className="flex items-center gap-2 px-4 py-2 mt-4 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600">
                    <Trash2 className="w-4 h-4" />
                    Delete your account
                </button>
            </section> */}
        </div>
    );
}
