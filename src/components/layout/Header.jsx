"use client";
import {
    Bookmark,
    Building,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Menu,
    Search,
    X,
} from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import logo from "@/assets/images/logo-title-white.png";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
    selectAuthHydrated,
    selectAuthLoading,
    selectAuthUser,
    selectIsLoggedIn,
} from "@/features/auth/authSelectors";
import { logoutThunk } from "@/features/auth/authSlice";
import ProfileDropdown from "../ui/ProfileDropdown";
import NotificationBell from "@/components/ui/NotificationBell";
import LanguageSelector from "@/components/ui/LanguageSelector";
import { t } from "@/i18n/i18n";


export const Header = () => {
    const dispatch = useDispatch();
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobilePage, setMobilePage] = useState(null);
    const router = useRouter();
    const pathname = usePathname();

    const isLoggedIn = useSelector(selectIsLoggedIn);
    const user = useSelector(selectAuthUser);
    const isAuthLoading = useSelector(selectAuthLoading);
    const isAuthHydrated = useSelector(selectAuthHydrated);

    const role = (user?.role || "").toUpperCase();

    if (pathname?.startsWith("/recruiter") || role === "RECRUITER") return null;
    if (!isAuthHydrated) return null;

    const handleMouseEnter = (menu) => setActiveDropdown(menu);
    const handleMouseLeave = () => setActiveDropdown(null);

    const handleRegisterClick = () => {
        router.push("/register");
    };
    const handleLoginClick = () => {
        router.push("/login?view=login");
    };
    const handleLogout = async () => {
        try {
            await dispatch(logoutThunk()).unwrap();
            router.push("/");
        } catch (error) {
            console.error("Logout error:", error);
            router.push("/");
        }
    };

    const toggleMobile = () => setMobileOpen((p) => !p);

    // Jobs dropdown (Find Jobs, Favorite Jobs)
    const jobsContent = (
        <div className="min-w-[280px] p-2 text-gray-800">
            <Link href="/search">
                <div className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-50">
                    <Search className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">{t`Find Jobs`}</span>
                </div>
            </Link>
            <Link href="/jobs/saved">
                <div className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-50">
                    <Bookmark className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">{t`Favorite Jobs`}</span>
                </div>
            </Link>
        </div>
    );

    // Companies dropdown (Companies, Find Companies)
    const companiesContent = (
        <div className="min-w-[280px] p-2 text-gray-800">
            <Link href="/company/company-search/results">
                <div className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-50">
                    <Building className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">{t`Companies`}</span>
                </div>
            </Link>
            <Link href="/company/company-search">
                <div className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-50">
                    <Search className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">{t`Find Companies`}</span>
                </div>
            </Link>
        </div>
    );

    const dropdownContent = {
        jobs: jobsContent,
        companies: companiesContent,
    };

    const navItems = [
        { key: "home",       label: t`Home`,       href: "/" },
        { key: "about",      label: t`About`,      href: "/#aboutUs" },
        { key: "jobs",       label: t`Jobs`,       hasDropdown: true },
        { key: "companies",  label: t`Companies`,  hasDropdown: true },
        { key: "categories", label: t`Categories`, href: "/#categories" },
        { key: "dashboard",  label: t`Dashboard`,  href: "/dashboard" },
    ];

    // take 2 initials from user name if no avatar (align with HeaderBackup)
    const getUserInitials = (name) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    return (
        <header className="relative bg-blue-700 h-18">
            <div className="flex items-center justify-between h-full px-8">
                {/* Mobile menu button */}
                <button
                    className="flex items-center justify-center p-2 mr-2 text-white rounded lg:hidden hover:bg-white/20"
                    onClick={toggleMobile}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? (
                        <X className="w-6 h-6" />
                    ) : (
                        <Menu className="w-6 h-6" />
                    )}
                </button>

                {/* Logo + Desktop navigation */}
                <div className="flex justify-start flex-1">
                    <Link href="/">
                        <div className="flex-shrink-0">
                            <Image
                                src={logo}
                                alt="JobHuntly Logo"
                                width={120}
                                height={40}
                                className="w-auto h-10"
                            />
                        </div>
                    </Link>
                    <nav className="hidden text-white lg:flex">
                        <div
                            className="relative ml-6"
                            onMouseLeave={handleMouseLeave}
                        >
                            <ul className="flex items-center space-x-2 text-white">
                                {navItems.map((item) => (
                                    <li
                                        key={item.key}
                                        className={
                                            item.hasDropdown
                                                ? "relative"
                                                : undefined
                                        }
                                    >
                                        {item.hasDropdown ? (
                                            <>
                                                <div
                                                    className="group flex items-center gap-1 text-white font-medium px-3 py-2 rounded-lg cursor-pointer hover:bg-[#d0e5f9] hover:text-[#0a66c2] transition-colors"
                                                    onMouseEnter={() =>
                                                        handleMouseEnter(
                                                            item.key
                                                        )
                                                    }
                                                >
                                                    <span>{item.label}</span>
                                                    <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
                                                </div>
                                                {activeDropdown ===
                                                    item.key && (
                                                    <div className="absolute left-0 top-full mt-2 bg-white rounded-xl shadow-lg p-2 z-50 min-w-[240px] text-gray-800">
                                                        <div className="absolute left-0 w-full h-3 -top-3"></div>
                                                        {
                                                            dropdownContent[
                                                                item.key
                                                            ]
                                                        }
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <Link href={item.href || "#"}>
                                                <div className="px-3 py-2 font-medium text-white rounded-lg hover:bg-white/20">
                                                    {item.label}
                                                </div>
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </nav>
                </div>

                {/* Right actions */}
                <ul className="flex items-center space-x-2">
                    <li className="hidden lg:block">
                         <LanguageSelector />
                    </li>
                    {isLoggedIn && (
                        <>
                            <li>
                                <NotificationBell onClick={() => {}} />
                            </li>
                            <li>
                                <ProfileDropdown
                                    user={user}
                                    onLogout={handleLogout}
                                    getUserInitials={getUserInitials}
                                />
                            </li>
                        </>
                    )}
                    {!isLoggedIn && (
                        <>
                            <li>
                                <Button
                                    variant="secondary"
                                    className="bg-[#d6eaff] text-[#0a66c2] hover:bg-[#b6dbfb] font-semibold"
                                    onClick={() => router.push("/register")}
                                    disabled={isAuthLoading}
                                >
                                    {t`Register`}
                                </Button>
                            </li>
                            <li>
                                <Button
                                    variant="outline"
                                    className="text-white bg-transparent border-white hover:bg-white/20 hover:text-white"
                                    onClick={() =>
                                        router.push("/login?view=login")
                                    }
                                    disabled={isAuthLoading}
                                >
                                    {isAuthLoading ? "Processing..." : t`Login`}
                                </Button>
                            </li>
                        </>
                    )}
                </ul>
            </div>

            {/* MOBILE OVERLAY */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden">
                    <div className="flex items-center justify-between px-4 border-b h-14">
                        {mobilePage ? (
                            <button
                                onClick={() => setMobilePage(null)}
                                className="p-2 -ml-2"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                        ) : (
                            <Link href="/" onClick={() => setMobileOpen(false)}>
                                <Image
                                    src={logo}
                                    alt="logo"
                                    height={32}
                                    className="w-auto h-8"
                                />
                            </Link>
                        )}
                        <span className="text-base font-semibold truncate">
                            {navItems.find((i) => i.key === mobilePage)
                                ?.label || ""}
                        </span>
                        <button
                            onClick={() => setMobileOpen(false)}
                            className="p-2 -mr-2"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {!mobilePage && (
                            <ul className="divide-y">
                                {navItems.map((item) => (
                                    <li key={item.key}>
                                        {item.hasDropdown ? (
                                            <button
                                                className="w-full flex items-center justify-between px-4 py-4 text-[17px] font-medium"
                                                onClick={() =>
                                                    setMobilePage(item.key)
                                                }
                                            >
                                                <span>{item.label}</span>
                                                <ChevronRight className="w-5 h-5 text-gray-500" />
                                            </button>
                                        ) : (
                                            <Link
                                                href={item.href || "#"}
                                                onClick={() =>
                                                    setMobileOpen(false)
                                                }
                                            >
                                                <div className="px-4 py-4 text-[17px] font-medium">
                                                    {item.label}
                                                </div>
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        )}
                        {mobilePage && (
                            <div
                                className="p-2"
                                onClick={() => setMobileOpen(false)}
                            >
                                {dropdownContent[mobilePage]}
                            </div>
                        )}
                    </div>
                    {!mobilePage && (
                        <div className="p-4 space-y-2 border-t">
                            <div className="min-w-full ">
                                <LanguageSelector isRecruiter />
                            </div>
                            {!isLoggedIn ? (
                                <>
                                    <button
                                        onClick={() => {
                                            handleRegisterClick();
                                            setMobileOpen(false);
                                        }}
                                        className="block w-full py-3 text-center font-semibold text-[#0a66c2] border border-[#0a66c2] rounded"
                                    >
                                        {t`Register`}
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleLoginClick();
                                            setMobileOpen(false);
                                        }}
                                        className="block w-full py-3 text-center font-semibold text-white bg-[#0a66c2] rounded"
                                    >
                                        {t`Login`}
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setMobileOpen(false);
                                    }}
                                    className="block w-full py-3 font-semibold text-center text-red-600 border border-red-600 rounded"
                                >
                                   {t`Logout`}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};