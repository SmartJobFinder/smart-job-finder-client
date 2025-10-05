"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, LogOut, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { menuItems } from "@/features/profile/menuConfig";
import { t } from "@/i18n/i18n";

export default function ProfileDropdown({ user, onLogout, getUserInitials }) {
    const router = useRouter();
    const [isMobile, setIsMobile] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Detect viewport
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (!user) return null;

    // Mobile render: Avatar opens sidebar
    if (isMobile) {
        return (
            <>
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="flex items-center gap-1"
                >
                    <Avatar>
                        <AvatarImage
                            src={
                                user?.avatar ||
                                "/placeholder.svg?height=32&width=32"
                            }
                            alt="User Avatar"
                        />
                        <AvatarFallback className="bg-white text-[#0a66c2] text-sm font-semibold">
                            {getUserInitials(user?.fullName)}
                        </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="w-4 h-4" />
                </button>

                {/* Custom Mobile Sidebar */}
                {isSidebarOpen && (
                    <div className="fixed inset-0 z-50 flex">
                        {/* Overlay */}
                        <div
                            className="flex-1 bg-black/50"
                            onClick={() => setIsSidebarOpen(false)}
                        ></div>
                        {/* Sidebar Content */}
                        <div className="w-64 transition-transform duration-300 ease-in-out transform translate-x-0 bg-white shadow-lg">
                            <div className="flex items-center justify-between p-4 border-b">
                                <span className="text-lg font-medium">
                                    {user?.name || user?.fullName || "User"}
                                </span>
                                <button
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="p-2"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="flex flex-col p-4 space-y-2">
                                <div className="mb-4 text-xs text-gray-500">
                                    {user?.email || "user@example.com"}
                                </div>
                                {menuItems(router).map((item, i) => (
                                    <button
                                        key={i}
                                        className="flex items-center gap-2 p-2 text-sm rounded cursor-pointer hover:bg-gray-100"
                                        onClick={() => {
                                            item.onClick();
                                            setIsSidebarOpen(false);
                                        }}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                                <div className="my-2 border-t"></div>
                                <button
                                    className="flex items-center gap-2 p-2 text-sm text-red-600 rounded cursor-pointer hover:bg-gray-100"
                                    onClick={() => {
                                        onLogout();
                                        setIsSidebarOpen(false);
                                    }}
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>{t`Logout`}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }

    // Desktop render: Dropdown
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center py-6 text-white hover:bg-white/20"
                >
                    <Avatar>
                        <AvatarImage
                            src={
                                user?.avatar ||
                                "/placeholder.svg?height=32&width=32"
                            }
                            alt="User Avatar"
                        />
                        <AvatarFallback className="bg-white text-[#0a66c2] text-sm font-semibold">
                            {getUserInitials(user?.fullName)}
                        </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="w-2 h-2" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-4">
                        <p className="text-lg font-medium">
                            {user?.name || user?.fullName || "User"}
                        </p>
                        <p className="text-xs text-gray-500">
                            {user?.email || "user@example.com"}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {menuItems(router).map((item, i) => (
                    <DropdownMenuItem
                        key={i}
                        className="cursor-pointer"
                        onClick={item.onClick}
                    >
                        <item.icon className="w-4 h-4 mr-2" />
                        <span>{item.label}</span>
                    </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    className="text-red-600 cursor-pointer focus:text-red-600"
                    onClick={onLogout}
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>{t`Logout`}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}