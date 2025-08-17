
'use client';

import {
  LayoutDashboard,
  Beaker,
  FlaskConical,
  ClipboardList,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { TestTube } from 'lucide-react';

interface SidebarNavProps {
  isMobile?: boolean;
}

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/samples', icon: FlaskConical, label: 'Samples'},
  { href: '/logs', icon: ClipboardList, label: 'Receipts'},
  { href: '/tests', icon: Beaker, label: 'Tests' },
];

export function SidebarNav({ isMobile = false }: SidebarNavProps) {
  const pathname = usePathname();

  const LinkComponent = isMobile ? 'a' : TooltipTrigger;

  return (
    <>
      <Link
        href="/dashboard"
        className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
      >
        <TestTube className="h-4 w-4 transition-all group-hover:scale-110" />
        <span className="sr-only">TestMate</span>
      </Link>
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        const linkContent = (
          <Link
            href={item.href}
            className={cn(
              'flex items-center gap-4 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
              isActive && 'bg-accent text-primary',
              isMobile && 'mx-[-0.65rem] gap-5 px-4'
            )}
          >
            <item.icon className="h-5 w-5" />
            {isMobile && item.label}
          </Link>
        );

        if (isMobile) {
          return <div key={item.href}>{linkContent}</div>;
        }

        return (
          <Tooltip key={item.href}>
            <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        );
      })}
    </>
  );
}
