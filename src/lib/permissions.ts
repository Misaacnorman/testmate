

import type { Permission } from './types';

export const PERMISSIONS: Permission[] = [
  // User Management
  { id: 'admin:users:read', role: 'Admin', description: 'View all users' },
  { id: 'admin:users:assign-role', role: 'Admin', description: 'Assign users to roles' },
  { id: 'admin:users:manage-overrides', role: 'Admin', description: 'Manage individual user permission overrides' },
  { id: 'admin:users:delete', role: 'Admin', description: 'Delete a user' },

  // Role Management
  { id: 'admin:roles:read', role: 'Admin', description: 'View all permission roles' },
  { id: 'admin:roles:create', role: 'Admin', description: 'Create a new permission role' },
  { id: 'admin:roles:update', role: 'Admin', description: 'Update a permission role (name and permissions)' },
  { id: 'admin:roles:delete', role: 'Admin', description: 'Delete a permission role' },

  // Tests
  { id: 'tests:read', role: 'Tests', description: 'View the test catalog' },
  { id: 'tests:create', role: 'Tests', description: 'Create a new test' },
  { id: 'tests:update', role: 'Tests', description: 'Update an existing test' },
  { id: 'tests:delete', role: 'Tests', description: 'Delete a test from the catalog' },

  // Samples & Receipts
  { id: 'samples:create', role: 'Samples', description: 'Register a new sample and generate a receipt' },
  { id: 'receipts:read', role: 'Samples', description: 'View all sample receipts' },
  { id: 'receipts:delete', role: 'Samples', description: 'Delete a sample receipt' },

  // Registers
  { id: 'registers:read', role: 'Registers', description: 'View all sample registers' },
  { id: 'registers:update-results', role: 'Registers', description: 'Enter or update test results for a sample' },
  { id: 'registers:issue-certificate', role: 'Registers', description: 'Issue a test certificate for a sample' },
  { id: 'registers:delete-record', role: 'Registers', description: 'Delete a record from a register' },
  
  // Projects
  { id: 'projects:read', role: 'Projects', description: 'View all projects' },
  { id: 'projects:create', role: 'Projects', description: 'Create a new project' },
  { id: 'projects:update', role: 'Projects', description: 'Update an existing project' },
  { id: 'projects:delete', role: 'Projects', description: 'Delete a project' },
];

export const PERMISSION_ROLES = [...new Set(PERMISSIONS.map(p => p.role))];
