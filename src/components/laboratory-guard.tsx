"use client";

import React from 'react';
import { useAuth } from '@/context/auth-context';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface LaboratoryGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Higher-order component that ensures laboratory context is available
 * and prevents data leakage between laboratories
 */
export function LaboratoryGuard({ children, fallback }: LaboratoryGuardProps) {
  const { laboratoryId, laboratory, loading, refresh } = useAuth();

  // Show loading state while checking laboratory context
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Loading laboratory context...</span>
        </div>
      </div>
    );
  }

  // Show error if no laboratory context
  if (!laboratoryId || !laboratory) {
    return fallback || (
      <div className="flex items-center justify-center min-h-[200px] p-4">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="mt-2">
            <div className="space-y-2">
              <p>No laboratory context found. This could indicate:</p>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>You're not assigned to a laboratory</li>
                <li>Your laboratory account is not properly set up</li>
                <li>There's a data synchronization issue</li>
              </ul>
              <Button 
                onClick={() => refresh()} 
                variant="outline" 
                size="sm" 
                className="mt-2"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Hook that provides laboratory context validation
 */
export function useLaboratoryContext() {
  const { laboratoryId, laboratory, loading } = useAuth();

  const isLaboratoryReady = !loading && !!laboratoryId && !!laboratory;
  const hasLaboratoryContext = !!laboratoryId;

  return {
    laboratoryId,
    laboratory,
    loading,
    isLaboratoryReady,
    hasLaboratoryContext,
    // Helper to throw error if laboratory context is missing
    requireLaboratoryContext: () => {
      if (!isLaboratoryReady) {
        throw new Error('Laboratory context is required but not available');
      }
      return { laboratoryId: laboratoryId!, laboratory: laboratory! };
    }
  };
}
