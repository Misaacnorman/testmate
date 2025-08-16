
'use client';

import {
  FlaskConical,
  History,
  LayoutDashboard,
  FileText,
  SlidersHorizontal,
  TestTube,
  Beaker,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface SidebarNavProps {
  isMobile?: boolean;
}

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/samples', icon: FlaskConical, label: 'Sample Tracking', badge: '6' },
  { href: '/tests', icon: Beaker, label: 'Tests' },
  { href: '/instruments', icon: SlidersHorizontal, label: 'Instruments' },
  { href: '/reports', icon: FileText, label: 'Report Generation' },
  { href: '/audit-trail', icon: History, label: 'Audit Trail' },
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
            {item.badge && isMobile && (
              <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                {item.badge}
              </Badge>
            )}
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
