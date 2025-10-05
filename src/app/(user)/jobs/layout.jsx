import SidebarHorizontal from "@/components/layout/SidebarHorizontal";

export default function JobsLayout({ children }) {
  const tabs = [
    { label: "Appied Jobs", href: "/jobs/applied" },
    { label: "Saved Jobs", href: "/jobs/saved" },
    // { label: "Danh sách", href: "/jobs/list" },
  ];

  return (
    <div className="p-6 bg-white shadow rounded">
      <SidebarHorizontal tabs={tabs} />
      {children}
    </div>
  );
}