
'use client';
import { useAuth } from '@/hooks/use-auth';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (!loading) {
      if (user) {
        redirect('/dashboard');
      } else {
        redirect('/login');
      }
    }
  }, [user, loading]);

  // Render a loading state while checking auth status
  return (
    <div className="flex h-screen items-center justify-center">
      <p>Loading...</p>
    </div>
  );
}
