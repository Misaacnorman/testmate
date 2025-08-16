
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import {
  TooltipProvider,
} from '@/components/ui/tooltip';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { Header } from '@/components/layout/header';

export const metadata: Metadata = {
  title: 'TestMate',
  description: 'Your advanced laboratory information management system.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body className="font-body antialiased">
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
        <Toaster />
      </body>
    </html>
  );
}
