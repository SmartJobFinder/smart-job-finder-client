import SidebarHorizontal from "@/components/layout/SidebarHorizontal";
import { t } from "@/i18n/i18n";

export default function JobsLayout({ children }) {
    const tabs = [
        { label: t`Applied Jobs`, href: "/jobs/applied" },
        { label: t`Saved Jobs`, href: "/jobs/saved" },
        // { label: "Danh sách", href: "/jobs/list" },
    ];

    return (
        <div className="p-6 bg-white shadow rounded">
            <SidebarHorizontal tabs={tabs} />
            {children}
        </div>
    );
}
