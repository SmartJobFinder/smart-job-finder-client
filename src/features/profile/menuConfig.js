import {
  Briefcase,
  Building2,
  CalendarRange,
  FileText,
  Heart,
  LayoutDashboard,
  Mic,
  Settings,
  User,
} from "lucide-react";
import { t } from "@/i18n/i18n";

export const menuItems = router => [
  {
    label: t`Dashboard`,
    icon: LayoutDashboard,
    onClick: () => router.push("/dashboard"),
  },
  {
    label: t`Profile`,
    icon: User,
    onClick: () => router.push("/profile"),
  },
  {
    label: t`Manage CV`,
    icon: FileText,
    onClick: () => router.push("/manageCv"),
  },
  {
    label: t`My Interviews`,
    icon: CalendarRange,
    onClick: () => router.push("/interviews"),
  },
  {
    label: t`Companies Follow`,
    icon: Building2,
    onClick: () => router.push("/companyFollows"),
  },
  {
    label: t`My Jobs`,
    icon: Briefcase,
    onClick: () => router.push("/jobs"),
  },
  {
    label: t`Saved Jobs`,
    icon: Heart,
    onClick: () => router.push("/jobs/saved"),
  },
  {
    label: t`AI Practice History`,
    icon: Mic,
    onClick: () => router.push("/ai-practice-history"),
  },
  {
    label: t`Settings`,
    icon: Settings,
    onClick: () => router.push("/settings"),
  },
];
