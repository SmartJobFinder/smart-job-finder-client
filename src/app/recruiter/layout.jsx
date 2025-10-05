"use client";

import RecruiterSidebar from "@/components/layout/RecruiterSidebar";
import logo from "@/assets/images/logo-title-white.png";
import { Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import LoadingScreen from "@/components/ui/loadingScreen";
import { selectAuthLoading } from "@/features/auth/authSelectors";

export default function RecruiterLayout({ children }) {
    const isAuthLoading = useSelector(selectAuthLoading);

    if (isAuthLoading) {
        return <LoadingScreen message="Loading..." />;
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Mobile top bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0a66c2] h-16 flex items-center justify-between px-4 text-white">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="w-6 h-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[280px] p-0">
                        <RecruiterSidebar />
                    </SheetContent>
                </Sheet>
                <Link href="/recruiter" className="flex items-center space-x-2">
                    <Image
                        src={logo}
                        alt="JobHuntly Logo"
                        width={120}
                        height={48}
                        className="max-w-[120px] h-auto object-contain"
                        priority
                    />
                </Link>
                <Link href="/recruiter/create-job">
                    <Button variant="ghost" size="icon" className="text-white">
                        <Plus className="w-5 h-5" />
                    </Button>
                </Link>
            </div>

            {/* Main content */}
            <div className="flex flex-1 w-full pt-16 lg:pt-0">
                {/* Desktop sidebar */}
                <aside className="hidden lg:block w-[260px] shrink-0 sticky top-0 left-0 h-screen overflow-y-auto bg-white border-r border-gray-200">
                    <RecruiterSidebar />
                </aside>
                <main className="flex-1 min-h-screen px-6 py-8 mx-auto max-w-8xl">
                    {children}
                </main>
            </div>
        </div>
    );
}
