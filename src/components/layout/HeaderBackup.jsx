// "use client";
// import {
//     Bookmark,
//     Building,
//     ChevronDown,
//     ChevronLeft,
//     ChevronRight,
//     ClipboardCheck,
//     Crown,
//     Eye,
//     Headphones,
//     ListChecks,
//     Menu,
//     Search,
//     Star,
//     TrendingUp,
//     X,
// } from "lucide-react";
// import React, { useState } from "react";
// import { Button } from "../ui/button";
// import Image from "next/image";
// import logo from "@/assets/images/logo-title-white.png";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";
// import {
//     selectAuthHydrated,
//     selectAuthLoading,
//     selectAuthUser,
//     selectIsLoggedIn,
// } from "@/features/auth/authSelectors";
// import { logoutThunk } from "@/features/auth/authSlice";
// import ProfileDropdown from "../ui/ProfileDropdown";
// import NotificationBell from "@/components/ui/NotificationBell";
//
// export const Header = () => {
//     const dispatch = useDispatch();
//     const [activeDropdown, setActiveDropdown] = useState(null);
//     const [mobileOpen, setMobileOpen] = useState(false); // open/close overlay
//     const [mobilePage, setMobilePage] = useState(null); // null = root page; 'jobs' | 'cv' | ...
//     const [notificationCount, setNotificationCount] = useState(3);
//     const router = useRouter();
//     const pathname = usePathname();
//
//     const isLoggedIn = useSelector(selectIsLoggedIn);
//     const user = useSelector(selectAuthUser);
//     const isAuthLoading = useSelector(selectAuthLoading);
//     const isAuthHydrated = useSelector(selectAuthHydrated);
//
//     const role = (user?.role || "").toUpperCase();
//
//     if (pathname?.startsWith("/recruiter") || role === "RECRUITER") return null;
//     if (!isAuthHydrated) return null;
//
//     const handleMouseEnter = (menu) => {
//         setActiveDropdown(menu);
//     };
//
//     const handleMouseLeave = () => {
//         setActiveDropdown(null);
//     };
//     const handleRegisterClick = () => {
//         router.push("/register");
//     };
//
//     const handleLoginClick = () => {
//         router.push("/login?view=login");
//     };
//
//     const handleProfileClick = () => {
//         router.push("/profile");
//     };
//     const handleLogout = async () => {
//         try {
//             await dispatch(logoutThunk()).unwrap();
//             router.push("/");
//         } catch (error) {
//             console.error("Logout error:", error);
//             router.push("/");
//         }
//     };
//
//     const toggleMobile = () => setMobileOpen((p) => !p);
//
//     const jobsContent = (
//         // mobile: vertical block; md+: 2 horizontal blocks
//         <div className="flex flex-col gap-4 md:flex-row md:gap-8">
//             <div className="flex-1">
//                 <div className="mb-6">
//                     <div className="mb-3 text-xs font-medium tracking-wide text-gray-500 uppercase">
//                         Jobs
//                     </div>
//                     <div className="space-y-2">
//                         <Link href="/search">
//                             <div className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-50">
//                                 <Search className="w-4 h-4 text-gray-600" />
//                                 <span className="text-sm">Find Jobs</span>
//                             </div>
//                         </Link>
//                         <Link href="/jobs/saved">
//                             <div className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-50">
//                                 <Bookmark className="w-4 h-4 text-gray-600" />
//                                 <span className="text-sm">Saved Jobs</span>
//                             </div>
//                         </Link>
//                         <Link href="/jobs/applied">
//                             <div className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-50">
//                                 <ListChecks className="w-4 h-4 text-gray-600" />
//                                 <span className="text-sm">Applied Jobs</span>
//                             </div>
//                         </Link>
//                     </div>
//                 </div>
//                 <div>
//                     <div className="mb-3 text-xs font-medium tracking-wide text-gray-500 uppercase">
//                         Companies
//                     </div>
//                     <div className="space-y-2">
//                         <Link href="/company/company-search/results">
//                             <div className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-50">
//                                 <Building className="w-4 h-4 text-gray-600" />
//                                 <span className="text-sm">Company List</span>
//                             </div>
//                         </Link>
//                         <Link href="/company/company-search#RecommendedCompanies">
//                             <div className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-50">
//                                 <Star className="w-4 h-4 text-gray-600" />
//                                 <span className="text-sm">Top Companies</span>
//                             </div>
//                         </Link>
//                     </div>
//                 </div>
//             </div>
//             <div className="flex-1">
//                 <div className="mb-3 text-xs font-medium tracking-wide text-gray-500 uppercase">
//                     Jobs by Category
//                 </div>
//                 <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
//                     {[
//                         "IT Jobs",
//                         "Marketing Jobs",
//                         "Sales Jobs",
//                         "Accounting Jobs",
//                         "HR Jobs",
//                         "Finance Jobs",
//                         "Business Jobs",
//                         "Logistics Jobs",
//                         "IT Jobs",
//                         "Marketing Jobs",
//                         "Sales Jobs",
//                         "Accounting Jobs",
//                         "HR Jobs",
//                         "Finance Jobs",
//                         "Business Jobs",
//                         "Logistics Jobs",
//                     ].map((job, index) => (
//                         <div
//                             key={index}
//                             className="p-2 text-sm rounded cursor-pointer hover:bg-gray-50"
//                         >
//                             {job}
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
//
//     const cvContent = (
//         <div>
//             <div className="mb-2 text-xs font-medium tracking-wide text-gray-500 uppercase">
//                 CV Tools
//             </div>
//             <div className="mb-4 text-sm text-gray-600">
//                 Create a professional CV in minutes
//             </div>
//             <div className="space-y-2">
//                 {[
//                     "Beautiful CV Templates",
//                     "Create CV Online",
//                     "Industry-specific CVs",
//                     "CV Check",
//                     "CV Writing Service",
//                     "AI CV Builder",
//                 ].map((item, index) => (
//                     <div
//                         key={index}
//                         className="p-2 text-sm rounded cursor-pointer hover:bg-gray-50"
//                     >
//                         {item}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
//
//     const toolsContent = (
//         <div>
//             <div className="mb-3 text-xs font-medium tracking-wide text-gray-500 uppercase">
//                 Support Tools
//             </div>
//             <div className="space-y-2">
//                 {[
//                     "Gross - Net Salary Calculator",
//                     "Unemployment Insurance Calculator",
//                     "Tax Code Lookup",
//                     "Personal Income Tax Calculator",
//                     "Salary Converter",
//                 ].map((item, index) => (
//                     <div
//                         key={index}
//                         className="p-2 text-sm rounded cursor-pointer hover:bg-gray-50"
//                     >
//                         {item}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
//
//     const guideContent = (
//         <div>
//             <div className="mb-4 text-xs font-medium tracking-wide text-gray-500 uppercase">
//                 Featured Articles
//             </div>
//             <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
//                 <div className="flex gap-3">
//                     <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded"></div>
//                     <div>
//                         <div className="mb-1 text-sm font-medium">
//                             5 Tips for Writing an Impressive CV
//                         </div>
//                         <div className="text-xs text-gray-600">
//                             Detailed guide on how to write an attractive CV for
//                             recruiters
//                         </div>
//                     </div>
//                 </div>
//                 <div className="flex gap-3">
//                     <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded"></div>
//                     <div>
//                         <div className="mb-1 text-sm font-medium">
//                             Effective Job Search in 2024
//                         </div>
//                         <div className="text-xs text-gray-600">
//                             Strategies for successful job hunting in today's
//                             market
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div className="text-sm text-blue-600 cursor-pointer hover:text-blue-800">
//                 View All Articles
//             </div>
//         </div>
//     );
//
//     const premiumContent = (
//         <div>
//             <div className="mb-2 text-xs font-medium tracking-wide text-gray-500 uppercase">
//                 JobHuntly Pro
//             </div>
//             <div className="mb-4 text-sm text-gray-600">
//                 Upgrade your account to access premium features
//             </div>
//             <div className="space-y-2">
//                 <div className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-50">
//                     <Crown className="w-4 h-4 text-yellow-500" />
//                     <span className="text-sm">Pro CV Templates</span>
//                 </div>
//                 <div className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-50">
//                     <TrendingUp className="w-4 h-4 text-green-500" />
//                     <span className="text-sm">CV Analytics</span>
//                 </div>
//                 <div className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-50">
//                     <Eye className="w-4 h-4 text-blue-500" />
//                     <span className="text-sm">See Who Viewed Your CV</span>
//                 </div>
//                 <div className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-50">
//                     <Star className="w-4 h-4 text-yellow-500" />
//                     <span className="text-sm">Priority Display</span>
//                 </div>
//                 <div className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-50">
//                     <Headphones className="w-4 h-4 text-purple-500" />
//                     <span className="text-sm">Priority Support</span>
//                 </div>
//             </div>
//         </div>
//     );
//
//     const dropdownContent = {
//         jobs: jobsContent,
//         cv: cvContent,
//         tools: toolsContent,
//         guide: guideContent,
//         premium: premiumContent,
//     };
//
//     // take 2 initials from user name if no avatar
//     const getUserInitials = (name) => {
//         if (!name) return "U";
//         return name
//             .split(" ")
//             .map((n) => n[0])
//             .join("")
//             .toUpperCase();
//     };
//
//     const navItems = [
//         { key: "jobs", label: "Jobs" },
//         { key: "cv", label: "Create CV" },
//         { key: "tools", label: "Tools" },
//         { key: "guide", label: "Career Guide" },
//         { key: "premium", label: "JobHuntly" },
//     ];
//
//     return (
//         <header className="relative bg-blue-700 h-18">
//             <div className="flex items-center justify-between h-full px-8">
//                 {/* Mobile menu button */}
//                 <button
//                     className="flex items-center justify-center p-2 mr-2 text-white rounded lg:hidden hover:bg-white/20"
//                     onClick={toggleMobile}
//                 >
//                     {mobileOpen ? (
//                         <X className="w-6 h-6" />
//                     ) : (
//                         <Menu className="w-6 h-6" />
//                     )}
//                 </button>
//
//                 {/* Logo (Centered) */}
//                 <div className="flex justify-center flex-1 md:justify-start">
//                     <Link href="/">
//                         <div className="flex-shrink-0">
//                             <Image
//                                 src={logo}
//                                 alt="JobHuntly Logo"
//                                 width={120}
//                                 height={40}
//                                 className="w-auto h-10"
//                             />
//                         </div>
//                     </Link>
//                     {/* Desktop navigation (below header on desktop) */}
//                     <nav className="justify-center hidden px-4 bg-blue-700 lg:flex">
//                         <div
//                             className="relative"
//                             onMouseLeave={handleMouseLeave}
//                         >
//                             <ul className="flex items-center space-x-1">
//                                 {navItems.map((item) => (
//                                     <li key={item.key}>
//                                         <div
//                                             className="group flex items-center gap-1 text-white font-medium px-3 py-2 rounded-lg cursor-pointer hover:bg-[#d0e5f9] hover:text-[#0a66c2] transition-colors"
//                                             onMouseEnter={() =>
//                                                 handleMouseEnter(item.key)
//                                             }
//                                         >
//                                             <span>{item.label}</span>
//                                             <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
//                                         </div>
//                                     </li>
//                                 ))}
//                             </ul>
//                             {activeDropdown && (
//                                 <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg min-w-[592px] p-5 z-50">
//                                     <div className="absolute left-0 w-full h-3 -top-3"></div>
//                                     {dropdownContent[activeDropdown]}
//                                 </div>
//                             )}
//                         </div>
//                     </nav>
//                 </div>
//                 {/* Right Navigation (Always visible) */}
//                 <ul className="flex items-center space-x-2">
//                     {isLoggedIn && (
//                         <>
//                             <li>
//                                 <NotificationBell
//                                     onClick={() => {
//                                         // open dropdown list or navigate
//                                         // router.push("/notifications");
//                                     }}
//                                 />
//                             </li>
//                             <li>
//                                 <ProfileDropdown
//                                     user={user}
//                                     onLogout={handleLogout}
//                                     getUserInitials={getUserInitials}
//                                 />
//                             </li>
//                         </>
//                     )}
//                     {!isLoggedIn && (
//                         <>
//                             <li>
//                                 <Button
//                                     variant="secondary"
//                                     className="bg-[#d6eaff] text-[#0a66c2] hover:bg-[#b6dbfb] font-semibold"
//                                     onClick={handleRegisterClick}
//                                     disabled={isAuthLoading}
//                                 >
//                                     Register
//                                 </Button>
//                             </li>
//                             <li>
//                                 <Button
//                                     variant="outline"
//                                     className="text-white bg-transparent border-white hover:bg-white/20 hover:text-white"
//                                     onClick={handleLoginClick}
//                                     disabled={isAuthLoading}
//                                 >
//                                     {isAuthLoading ? "Processing..." : "Login"}
//                                 </Button>
//                             </li>
//                         </>
//                     )}
//                     {/* Language Switcher - Always visible */}
//                     {/* <li className="flex items-center text-sm text-white/80">
//                         <button className="px-2 py-1 rounded hover:bg-white/20 hover:text-white">
//                             EN
//                         </button>
//                         <span className="mx-1">|</span>
//                         <button className="px-2 py-1 font-semibold text-white rounded bg-white/20">
//                             VI
//                         </button>
//                     </li> */}
//                 </ul>
//             </div>
//
//             {/* MOBILE OVERLAY */}
//             {mobileOpen && (
//                 <div className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden">
//                     <div className="flex items-center justify-between px-4 border-b h-14">
//                         {mobilePage ? (
//                             <button
//                                 onClick={() => setMobilePage(null)}
//                                 className="p-2 -ml-2"
//                             >
//                                 <ChevronLeft className="w-5 h-5" />
//                             </button>
//                         ) : (
//                             <Link href="/" onClick={() => setMobileOpen(false)}>
//                                 <Image
//                                     src={logo}
//                                     alt="logo"
//                                     height={32}
//                                     className="w-auto h-8"
//                                 />
//                             </Link>
//                         )}
//                         <span className="text-base font-semibold truncate">
//                             {navItems.find((i) => i.key === mobilePage)
//                                 ?.label || ""}
//                         </span>
//                         <button
//                             onClick={() => setMobileOpen(false)}
//                             className="p-2 -mr-2"
//                         >
//                             <X className="w-6 h-6" />
//                         </button>
//                     </div>
//                     <div className="flex-1 overflow-y-auto">
//                         {!mobilePage && (
//                             <ul className="divide-y">
//                                 {navItems.map((item) => (
//                                     <li key={item.key}>
//                                         <button
//                                             className="w-full flex items-center justify-between px-4 py-4 text-[17px] font-medium"
//                                             onClick={() =>
//                                                 setMobilePage(item.key)
//                                             }
//                                         >
//                                             <span>{item.label}</span>
//                                             <ChevronRight className="w-5 h-5 text-gray-500" />
//                                         </button>
//                                     </li>
//                                 ))}
//                             </ul>
//                         )}
//                         {mobilePage && (
//                             <div className="p-4 space-y-4">
//                                 {/* tất cả content con cũng phải đóng khi click */}
//                                 <div
//                                     onClick={() => setMobileOpen(false)} // ⬅️ close sidebar khi click bất kỳ chỗ con
//                                 >
//                                     {dropdownContent[mobilePage]}
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                     {!mobilePage && (
//                         <div className="p-4 space-y-2 border-t">
//                             {!isLoggedIn ? (
//                                 <>
//                                     <button
//                                         onClick={() => {
//                                             handleRegisterClick();
//                                             setMobileOpen(false); // ⬅️ close khi register
//                                         }}
//                                         className="block w-full py-3 text-center font-semibold text-[#0a66c2] border border-[#0a66c2] rounded"
//                                     >
//                                         {t`Register`}
//                                     </button>
//                                     <button
//                                         onClick={() => {
//                                             handleLoginClick();
//                                             setMobileOpen(false); // ⬅️ close khi login
//                                         }}
//                                         className="block w-full py-3 text-center font-semibold text-white bg-[#0a66c2] rounded"
//                                     >
//                                         {t`Login`}
//                                     </button>
//                                 </>
//                             ) : (
//                                 <button
//                                     onClick={() => {
//                                         handleLogout();
//                                         setMobileOpen(false); // ⬅️ close khi logout
//                                     }}
//                                     className="block w-full py-3 font-semibold text-center text-red-600 border border-red-600 rounded"
//                                 >
//                                     {t`Logout`}
//                                 </button>
//                             )}
//                         </div>
//                     )}
//                 </div>
//             )}
//         </header>
//     );
// };
