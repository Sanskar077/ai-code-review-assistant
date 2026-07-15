import {
  FolderUp,
  History,
  LayoutDashboard,
  Settings,
  SquarePen,
  User,
  type LucideIcon,
} from "lucide-react";

import { ROUTES } from "@/constants/routes";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** False when the backend feature this links to doesn't exist yet. */
  enabled: boolean;
}

export const DASHBOARD_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: ROUTES.dashboard, icon: LayoutDashboard, enabled: true },
  { label: "New Review", href: ROUTES.newReview, icon: SquarePen, enabled: true },
  { label: "Review History", href: ROUTES.reviewHistory, icon: History, enabled: true },
  { label: "Profile", href: ROUTES.profile, icon: User, enabled: true },
  { label: "Settings", href: ROUTES.settings, icon: Settings, enabled: false },
];

export const QUICK_ACTIONS: NavItem[] = [
  { label: "New Code Review", href: `${ROUTES.newReview}?method=paste`, icon: SquarePen, enabled: true },
  { label: "Upload Source File", href: `${ROUTES.uploadFile}?method=upload`, icon: FolderUp, enabled: true },
  { label: "Review History", href: ROUTES.reviewHistory, icon: History, enabled: true },
  { label: "My Profile", href: ROUTES.profile, icon: User, enabled: true },
];
