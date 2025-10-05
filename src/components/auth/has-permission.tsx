
"use client";

import { usePermissions } from "@/hooks/use-permissions";
import React from "react";

interface HasPermissionProps {
  permissionId: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function HasPermission({
  permissionId,
  children,
  fallback = null,
}: HasPermissionProps) {
  const { hasPermission } = usePermissions();

  if (hasPermission(permissionId)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
