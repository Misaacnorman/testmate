
'use client';

import * as React from 'react';
import { UserManagement } from './components/user-management';

export default function AdminPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin</h1>
          <p className="text-muted-foreground">
            Manage users, groups, and permissions.
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <UserManagement />
      </div>
    </div>
  );
}
