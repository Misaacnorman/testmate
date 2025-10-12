
import { type PermissionGroup } from "@/lib/types";

export const PERMISSION_GROUPS: PermissionGroup[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      permissions: [
        { id: "dashboard:view", label: "View Main Dashboard" },
        { id: "dashboard:assign-engineer-on-duty", label: "Assign Engineer on Duty" },
        { id: "dashboard:assign-projects", label: "View & Assign Unassigned Projects" },
        { id: "dashboard:view-my-tasks", label: "View 'My Tasks' List" },
      ],
    },
    {
      id: "test_catalog",
      label: "Test Catalog",
      permissions: [
        { id: "tests:read", label: "View Test Catalog" },
        { id: "tests:create", label: "Create New Tests" },
        { id: "tests:update", label: "Edit Existing Tests" },
        { id: "tests:delete", label: "Delete Tests" },
        { id: "tests:import", label: "Import Test Catalog" },
        { id: "tests:export", label: "Export Test Catalog" },
      ],
    },
    {
      id: "samples",
      label: "Sample Management",
      permissions: [
        { id: "samples:receive", label: "Receive New Samples & Create Receipts" },
        { id: "samples:read", label: "View All Samples" },
        { id: "samples:update", label: "Edit Sample Information" },
        { id: "samples:delete", label: "Delete Samples" },
      ],
    },
    {
      id: "receipts",
      label: "Sample Receipts",
      permissions: [
        { id: "receipts:read", label: "View All Sample Receipts" },
        { id: "receipts:create", label: "Create Sample Receipts" },
        { id: "receipts:update", label: "Edit Sample Receipts" },
        { id: "receipts:delete", label: "Delete Sample Receipts" },
      ],
    },
    {
      id: "registers",
      label: "Test Registers",
      permissions: [
        { id: "registers:read", label: "View All Test Registers" },
        { id: "registers:create", label: "Create Register Entries" },
        { id: "registers:update", label: "Edit Register Entries" },
        { id: "registers:delete", label: "Delete Register Entries" },
        { id: "registers:test", label: "Enter Test Results into Registers" },
        { id: "registers:projects", label: "Manage Projects in Registers" },
      ],
    },
    {
      id: "certificates",
      label: "Test Certificates",
      permissions: [
        { id: "certificates:read", label: "View All Test Certificates" },
        { id: "certificates:create", label: "Generate Test Certificates" },
        { id: "certificates:approve-initial", label: "Perform Initial Approval (Engineer)" },
        { id: "certificates:approve-final", label: "Perform Final Approval (Manager)" },
        { id: "certificates:reject", label: "Reject Certificates" },
        { id: "certificates:download", label: "Download Certificates as PDF" },
      ],
    },
    {
      id: "assets",
      label: "Asset Management",
      permissions: [
        { id: "assets:read", label: "View Assets" },
        { id: "assets:create", label: "Create Assets" },
        { id: "assets:update", label: "Edit Assets" },
        { id: "assets:delete", label: "Delete Assets" },
        { id: "assets:log-maintenance", label: "Log Maintenance Records" },
        { id: "assets:log-calibration", label: "Log Calibration Records" },
      ],
    },
    {
      id: "finance",
      label: "Finance",
      permissions: [
        { id: "finance:read-dashboard", label: "View Finance Dashboard" },
        { id: "finance:quotes:read", label: "View Quotes" },
        { id: "finance:quotes:create", label: "Create & Edit Quotes" },
        { id: "finance:quotes:update", label: "Update Quotes" },
        { id: "finance:quotes:delete", label: "Delete Quotes" },
        { id: "finance:invoices:read", label: "View Invoices" },
        { id: "finance:invoices:create", label: "Create Invoices from Quotes" },
        { id: "finance:invoices:update", label: "Update Invoice Status" },
        { id: "finance:invoices:delete", label: "Delete Invoices" },
        { id: "finance:expenses:read", label: "View Expenses" },
        { id: "finance:expenses:create", label: "Add & Edit Expenses" },
        { id: "finance:expenses:update", label: "Update Expenses" },
        { id: "finance:expenses:delete", label: "Delete Expenses" },
      ],
    },
    {
      id: "personnel",
      label: "Personnel & Profiles",
      permissions: [
        { id: "profile:read:own", label: "View Own Profile" },
        { id: "profile:update:own", label: "Update Own Profile" },
        { id: "profile:read:others", label: "View Other Users' Profiles" },
        { id: "personnel:read", label: "View Personnel List" },
        { id: "personnel:create", label: "Create Personnel Profiles" },
        { id: "personnel:update", label: "Edit Personnel Profiles" },
        { id: "personnel:delete", label: "Delete Personnel Profiles" },
      ],
    },
    {
      id: "admin",
      label: "System Administration",
      permissions: [
        { id: "users:read", label: "View User List" },
        { id: "users:create", label: "Create New Users" },
        { id: "users:update", label: "Edit Users & Permissions" },
        { id: "users:delete", label: "Delete Users" },
        { id: "roles:read", label: "View Roles" },
        { id: "roles:create", label: "Create Roles" },
        { id: "roles:update", label: "Edit Roles & Assign Permissions" },
        { id: "roles:delete", label: "Delete Roles" },
        { id: "permissions:read", label: "View Permissions" },
        { id: "permissions:manage", label: "Manage Permission Assignments" },
      ],
    },
    {
      id: "settings",
      label: "System Settings",
      permissions: [
        { id: "settings:read", label: "View Settings Page" },
        { id: "settings:company:update", label: "Update Company Profile" },
        { id: "settings:documents:update", label: "Update Document & ID Settings" },
        { id: "settings:machines:update", label: "Manage Machine Correction Factors" },
        { id: "settings:theme:update", label: "Update System Theme Colors" },
        { id: "settings:laboratory:update", label: "Update Laboratory Settings" },
      ],
    },
  ];

