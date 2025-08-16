
'use client';

import { usePathname } from 'next/navigation';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { Header } from '@/components/layout/header';
import { useAuth } from '@/hooks/use-auth';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (isAuthPage || !user) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <aside className="fixed inset-y-0 left-0 z-20 hidden w-14 flex-col border-r bg-background sm:flex">
          <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
            <SidebarNav />
          </nav>
        </aside>
        <div className="flex flex-col sm:pl-14">
          <Header />
          <main className="flex-1 flex flex-col p-4 sm:px-6 sm:py-0 md:gap-8 bg-background">
            {children}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
