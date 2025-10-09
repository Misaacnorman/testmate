"use client";

import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/hooks/use-theme";
import { AuthProvider } from "@/context/auth-context";
import { AuthGuard } from "@/components/auth/auth-guard";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

// Metadata needs to be exported from a server component, so we can't have it in the same file as "use client".
// We will move it to a new file or the page.tsx if needed, but for now, we'll comment it out to fix the build.
// export const metadata: Metadata = {
//   title: "LIMS Dashboard",
//   description: "A dashboard for Laboratory Information Management System.",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>LIMS Dashboard</title>
        <meta name="description" content="A dashboard for Laboratory Information Management System." />
      </head>
      <body className={`${inter.className} font-body antialiased`}>
        <AuthProvider>
          <ThemeProvider>
            <AuthGuard>{children}</AuthGuard>
          </ThemeProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
