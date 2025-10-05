
"use client";

import React, { useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { UserProfile } from "@/components/dashboard/user-profile";
import { Header } from "@/components/dashboard/header";
import { useTheme } from '@/hooks/use-theme';

const AUTH_ROUTES = ['/login', '/signup'];
const ONBOARDING_ROUTE = '/welcome/company-profile';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, laboratory, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { isMounted } = useTheme();

  useEffect(() => {
    if (loading || !isMounted) return;

    const isAuthRoute = AUTH_ROUTES.includes(pathname);
    const isOnboardingRoute = pathname === ONBOARDING_ROUTE;
    
    if (user) {
      const isFirstTimeUser = !laboratory || !laboratory.name;
      if (isAuthRoute) {
        router.push('/');
      } else if (isFirstTimeUser && !isOnboardingRoute) {
        router.push(ONBOARDING_ROUTE);
      } else if (!isFirstTimeUser && isOnboardingRoute) {
        router.push('/');
      }
    } else {
      if (!isAuthRoute) {
        router.push('/login');
      }
    }
  }, [user, laboratory, loading, isMounted, pathname, router]);

  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isOnboardingRoute = pathname === ONBOARDING_ROUTE;


  if (loading || !isMounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user && !isAuthRoute) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isAuthRoute || isOnboardingRoute) {
    return <>{children}</>;
  }
  
  if (user && (!laboratory || !laboratory.name)) {
      // While we wait for redirect to onboarding, show a loader.
      return (
        <div className="flex h-screen w-screen items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
  }

  // User is authenticated and has completed onboarding, show the main app layout
  return (
    <SidebarProvider>
      <Sidebar
        className="border-r border-border/20 bg-[var(--custom-sidebar-bg)]"
        collapsible="icon"
        variant="sidebar"
      >
        <SidebarHeader className="text-sidebar-foreground">
          <Logo />
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter className="p-2">
          <UserProfile />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col bg-[var(--custom-content-bg)]">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
