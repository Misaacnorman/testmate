
import type { Permission } from './types';

export const PERMISSIONS: Permission[] = [
  // User Management
  { id: 'admin:users:read', group: 'Admin', description: 'View all users' },
  { id: 'admin:users:assign-group', group: 'Admin', description: 'Assign users to groups' },
  { id: 'admin:users:manage-overrides', group: 'Admin', description: 'Manage individual user permission overrides' },
  { id: 'admin:users:delete', group: 'Admin', description: 'Delete a user' },

  // Group Management
  { id: 'admin:groups:read', group: 'Admin', description: 'View all permission groups' },
  { id: 'admin:groups:create', group 'Admin',: description: 'Create a new permission group' },
  { id: 'admin:groups:update', group: 'Admin', description: 'Update a permission group (name and permissions)' },
  { id: 'admin:groups:delete', group: 'Admin', description: 'Delete a permission group' },

  // Tests
  { id: 'tests:read', group: 'Tests', description: 'View the test catalog' },
  { id: 'tests:create', group: 'Tests', description: 'Create a new test' },
  { id: 'tests:update', group: 'Tests', description: 'Update an existing test' },
  { id: 'tests:delete', group: 'Tests', description: 'Delete a test from the catalog' },

  // Samples & Receipts
  { id: 'samples:create', group: 'Samples', description: 'Register a new sample and generate a receipt' },
  { id: 'receipts:read', group: 'Samples', description: 'View all sample receipts' },
  { id: 'receipts:delete', group: 'Samples', description: 'Delete a sample receipt' },

  // Registers
  { id: 'registers:read', group: 'Registers', description: 'View all sample registers' },
  { id: 'registers:update-results', group: 'Registers', description: 'Enter or update test results for a sample' },
  { id: 'registers:issue-certificate', group: 'Registers', description: 'Issue a test certificate for a sample' },
  { id: 'registers:delete-record', group: 'Registers', description: 'Delete a record from a register' },
  
  // Projects
  { id: 'projects:read', group: 'Projects', description: 'View all projects' },
  { id: 'projects:create', group: 'Projects', description: 'Create a new project' },
  { id: 'projects:update', group: 'Projects', description: 'Update an existing project' },
  { id: 'projects:delete', group: 'Projects', description: 'Delete a project' },
];

export const PERMISSION_GROUPS = [...new Set(PERMISSIONS.map(p => p.group))];
