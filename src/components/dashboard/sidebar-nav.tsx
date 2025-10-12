
"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FlaskConical,
  Beaker,
  ClipboardList,
  Library,
  Package,
  Banknote,
  Users,
  Settings,
  Shield,
  ClipboardCheck,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { HasPermission } from "../auth/has-permission";

const navGroups = [
    {
        label: 'Main',
        items: [
            { label: "Dashboard", icon: LayoutDashboard, href: "/", permissionId: "dashboard:view" },
        ]
    },
    {
        label: 'Laboratory',
        items: [
            { label: "Tests", icon: Beaker, href: "/tests", permissionId: "tests:read" },
            { label: "Samples", icon: FlaskConical, href: "/samples", permissionId: "samples:receive" },
            { label: "Receipts", icon: ClipboardList, href: "/receipts", permissionId: "receipts:read" },
            { label: "Registers", icon: Library, href: "/registers", permissionId: "registers:read" },
            { label: "Test Certificates", icon: ClipboardCheck, href: "/test-certificates", permissionId: "certificates:read" },
        ]
    },
    {
        label: 'Business',
        items: [
            { label: "Assets", icon: Package, href: "/assets", permissionId: "assets:read" },
            { label: "Finance", icon: Banknote, href: "/finance", permissionId: "finance:read-dashboard" }, 
            { label: "Personnel", icon: Users, href: "/personnel", permissionId: "profile:read:own" },
        ]
    },
    {
        label: 'System Administration',
        items: [
            { label: "Admin", icon: Shield, href: "/admin", permissionId: "users:read" }, // Requires at least one admin permission
            { label: "Settings", icon: Settings, href: "/settings", permissionId: "settings:read" },
        ]
    }
]

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
        {navGroups.map((group) => (
            <SidebarGroup key={group.label} className="p-0">
                <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                <SidebarMenu>
                    {group.items.map((item) => (
                       <HasPermission key={item.label} permissionId={item.permissionId}>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    asChild
                                    tooltip={item.label}
                                    isActive={pathname.startsWith(item.href) && (item.href === "/" ? pathname === "/" : true)}
                                >
                                    <a href={item.href}>
                                    <item.icon />
                                    <span>{item.label}</span>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </HasPermission>
                    ))}
                </SidebarMenu>
            </SidebarGroup>
        ))}
    </>
  );
}
