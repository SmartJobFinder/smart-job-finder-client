"use client";

import {useState} from "react";
import Image from "next/image";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import logo from "@/assets/images/logo-title.png";
import {
    BarChart3,
    Bell,
    Briefcase,
    Building,
    Calendar,
    ChevronDown,
    Crown,
    FileText,
    LogOut,
    MessageSquare,
    Plus,
    Settings,
    User,
    Users,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutThunk } from "@/features/auth/authSlice";
import { t } from "@/i18n/i18n";
import LanguageSelector from "@/components/ui/LanguageSelector";

export default function RecruiterSidebar() {
    const dispatch = useDispatch();
    const pathname = usePathname();
    const router = useRouter();
    const [notificationCount] = useState(7000000000); // Replace with actual count if available
    const [expandedSections, setExpandedSections] = useState({});

    const navItems = [
        {href: "/recruiter/dashboard", label: "Dashboard", icon: BarChart3},
        {
            label: t`Manage Jobs`,
            icon: Briefcase,
            children: [
                {
                    href: "/recruiter/manage-job",
                    label: "All Job Posts",
                    icon: FileText,
                },
                {
                    href: "/recruiter/manage-job/active",
                    label: "Active Jobs",
                    icon: Briefcase,
                },
                {
                    href: "/recruiter/manage-job/drafts",
                    label: "Draft Jobs",
                    icon: FileText,
                },
                {
                    href: "/recruiter/manage-job/expired",
                    label: "Expired Jobs",
                    icon: Calendar,
                },
            ],
        },
        {
            label: t`Candidates`,
            icon: Users,
            children: [
                {
                    href: "/recruiter/applicants",
                    label: "All Applicants",
                    icon: Users,
                },
                // {
                //     href: "/recruiter/applicants/shortlisted",
                //     label: "Shortlisted",
                //     icon: User,
                // },
                {
                    href: "/recruiter/applicants/interviews",
                    label: "Interviewed",
                    icon: MessageSquare,
                },
                // {
                //     href: "/recruiter/talent-pool",
                //     label: "Talent Pool",
                //     icon: Search,
                // },
            ],
        },
        // { href: "/recruiter/analytics", label: "Analytics", icon: BarChart3 },
        {
            href: "/recruiter/payment-history",
            label: t`Payment History`,
            icon: Bell,
        },
        {
            href: "/recruiter/companyVip",
            label: t`Upgrade Vip`,
            icon: Crown,
        },
        {href: "/recruiter/profile", label: t`Profile`, icon: User},
        {href: "/recruiter/company", label: "Company", icon: Building},
        {href: "/recruiter/settings", label: t`Settings`, icon: Settings},
    ];

    const handleLogout = async () => {
        try {
            await dispatch(logoutThunk()).unwrap();
            router.push("/");
        } catch (error) {
            console.error("Lỗi đăng xuất:", error);
            router.push("/");
        }
    };

    const toggleSection = (label) => {
        setExpandedSections((prev) => ({
            ...prev,
            [label]: !prev[label],
        }));
    };

    return (
        <div className="flex flex-col h-full bg-white border-r">
            {/* Logo */}
            <div className="flex items-center justify-center py-6 border-b">
                <Link href="/recruiter" className="flex items-center">
                    <Image
                        src={logo}
                        alt="JobHuntly Logo"
                        width={120}
                        height={48}
                        className="max-w-[120px] h-auto object-contain"
                        priority
                    />
                </Link>
            </div>

            <div className="p-4">
                <Link href="/recruiter/create-job">
                    <Button
                        className="flex items-center w-full gap-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                        <Plus className="w-4 h-4"/>
                        <span>{t`Post a Job`}</span>
                    </Button>
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex flex-col justify-around h-full px-2 py-4">
                <nav
                    className="flex-1 space-y-3 overflow-y-auto scrollbar-thin"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {navItems.map((item, index) => {
                        if (item.children) {
                            const isExpanded = expandedSections[item.label];
                            return (
                                <div key={index}>
                                    <button
                                        onClick={() =>
                                            toggleSection(item.label)
                                        }
                                        className="flex items-center justify-between w-full px-4 py-2 rounded-md hover:bg-muted"
                                    >
                                        <div className="flex items-center gap-2">
                                            <item.icon className="w-5 h-5" />
                                            {item.label}
                                        </div>
                                        <ChevronDown
                                            className={`h-4 w-4 transition-transform ${
                                                isExpanded ? "rotate-180" : ""
                                            }`}
                                        />
                                    </button>
                                    {isExpanded && (
                                        <div className="mt-1 ml-6 space-y-1">
                                            {item.children.map(
                                                (sub, subIndex) => {
                                                    const isSubActive =
                                                        pathname === sub.href;
                                                    return (
                                                        <Link
                                                            key={subIndex}
                                                            href={sub.href}
                                                            className={`flex items-center gap-2 py-2 px-4 rounded-md hover:bg-muted text-sm ${
                                                                isSubActive
                                                                    ? "bg-muted"
                                                                    : ""
                                                            }`}
                                                        >
                                                            {sub.icon && (
                                                                <sub.icon className="w-4 h-4" />
                                                            )}
                                                            {sub.label}
                                                        </Link>
                                                    );
                                                }
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        } else {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={index}
                                    href={item.href}
                                    className={`flex items-center gap-2 py-2 px-4 rounded-md hover:bg-muted ${
                                        isActive ? "bg-muted" : ""
                                    }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.label}
                                    {item.label === "Notifications" &&
                                        notificationCount > 0 && (
                                            <Badge className="ml-auto bg-red-500">
                                                {notificationCount > 9
                                                    ? "9+"
                                                    : notificationCount}
                                            </Badge>
                                        )}
                                </Link>
                            );
                        }
                    })}
                </nav>
                <div className="w-full py-4">
                    <LanguageSelector isRecruiter />
                </div>
                {/* Logout */}
                <div className="py-2 mt-auto border-t-2">
                    <Button
                        variant="ghost"
                        className="justify-start w-full px-8 text-red-600 hover:text-red-600 hover:bg-red-50"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-5 h-5 mr-2" />
                        {t`Logout`}
                    </Button>
                </div>
            </div>
        </div>
    );
}
