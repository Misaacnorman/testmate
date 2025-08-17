
'use client';

import {
  LayoutDashboard,
  Beaker,
  FlaskConical,
  ClipboardList,
  Archive,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { TestTube } from 'lucide-react';

interface SidebarNavProps {
  isMobile?: boolean;
}

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/samples', icon: FlaskConical, label: 'Samples'},
  { href: '/logs', icon: ClipboardList, label: 'Receipts'},
  { href: '/registers', icon: Archive, label: 'Registers' },
  { href: '/tests', icon: Beaker, label: 'Tests' },
];

export function SidebarNav({ isMobile = false }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <>
      <Link
        href="/dashboard"
        className="group mb-4 flex h-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
      >
        <TestTube className="h-5 w-5 transition-all group-hover:scale-110" />
        <span className="font-bold">TestMate</span>
      </Link>
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
              isActive && 'bg-accent text-primary font-semibold',
              isMobile && 'text-lg'
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </>
  );
}
