"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function SidebarHorizontal({ tabs }) {
  const pathname = usePathname();

  // Tìm tab active dựa trên pathname
  const getActiveTab = () => {
    // Nếu ở route cha (không có subpath), chọn tab đầu tiên làm mặc định
    if (
      pathname === "/jobInvitation" ||
      pathname === "/jobs"
    ) {
      return tabs.find((tab) => tab.href === pathname) || tabs[0]; // Chọn tab khớp hoặc tab đầu
    }
    // Nếu ở route con, tìm tab khớp chính xác hoặc bắt đầu bằng href
    return (
      tabs.find(
        (tab) => pathname === tab.href || pathname.startsWith(`${tab.href}/`),
      ) || tabs[0]
    );
  };

  const activeTab = getActiveTab();

  return (
    <div className="flex gap-4 mb-6 border-b border-gray-300">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          prefetch={false}
          className={clsx(
            "py-2 px-4 border-b-2 transition-all",
            tab.href === activeTab.href
              ? "border-blue-600 text-blue-600 font-semibold"
              : "border-transparent text-gray-500 hover:text-blue-600",
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
