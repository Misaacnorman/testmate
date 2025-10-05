
"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// This page just redirects to the default finance tab.
export default function FinanceRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/finance/dashboard');
  }, [router]);
  return null;
}
