
"use client";

import { useAuth } from '@/context/auth-context';

export function usePermissions() {
    const { permissions, loading, user } = useAuth();

    const hasPermission = (permissionId: string) => {
        if (loading || !user) return false;

        return permissions.includes(permissionId);
    };
    
    return { hasPermission, permissions, isLoading: loading };
}
