

import { z } from 'zod';
import { type FormData, type SelectedCategory, type Step4Data } from '@/app/samples/components/receive-sample-dialog';


export const testSchema = z.object({
  id: z.string().optional(),
  materialCategory: z.string({ required_error: "Material category is required." }).min(1, "Material category is required."),
  testCode: z.string({ required_error: "Test code is required." }).min(1, "Test code is required."),
  materialTest: z.string({ required_error: "Material test is required." }).min(1, "Material test is required."),
  testMethod: z.string().optional(),
  accreditationStatus: z.boolean().optional().default(false),
  unit: z.string().optional(),
  amountUGX: z.number().nonnegative().optional(),
  amountUSD: z.number().nonnegative().optional(),
  leadTimeDays: z.number().nonnegative().optional(),
});


export type Test = z.infer<typeof testSchema>;

export interface Receipt {
    id: string;
    receiptId: string;
    date: string;
    formData: FormData;
    selectedCategories: Record<string, SelectedCategory>;
    step4Data: Step4Data;
}

export type CertificateStatus = 'Pending Test' | 'Pending Initial Approval' | 'Pending Final Approval' | 'Approved' | 'Rejected';

export interface SampleTestResult {
    sampleId: string;
    length?: number | null;
    width?: number | null;
    height?: number | null;
    diameter?: number | null;
    weight?: number | null;
    load?: number | null;
    correctedFailureLoad?: number | null;
    modeOfFailure?: string;
  }
  
  export interface BaseRegisterEntry {
    id: string;
    receiptId: string;
    dateReceived: string;
    client: string;
    project: string;
    castingDate: any;
    testingDate: any;
    age: number | string | null;
    areaOfUse: string;
    sampleIds: string[];
    setId: number;
    machineUsed: string; // Now stores machine ID
    temperature: number | null;
    certificateNumber: string;
    comment: string;
    technicianId?: string;
    technician: string;
    dateOfIssue: string | null;
    issueId: string;
    takenBy: string;
    dateTaken: string | null;
    contact: string;

    // Approval Workflow
    status: CertificateStatus;
    engineerOnDutyId?: string;
    approvedByEngineer?: { uid: string; name: string, date: string; };
    approvedByManager?: { uid: string; name: string, date: string; };
    rejectionReason?: string;
    rejectedBy?: { uid: string; name: string; date: string; };
  }

  export interface ConcreteCubeRegisterEntry extends BaseRegisterEntry {
    class: string;
    results?: SampleTestResult[];
  }

  export interface CylinderRegisterEntry extends BaseRegisterEntry {
    class: string;
    results?: SampleTestResult[];
  }

  export interface PaverTestResult {
    sampleId: string;
    weight?: number | null;
    load?: number | null;
    correctedFailureLoad?: number | null;
    modeOfFailure?: string;
    calculatedArea?: number | null;
    measuredThickness?: number | null;
  }
  
  export interface PaverRegisterEntry extends BaseRegisterEntry {
    paverType: string;
    paverThickness?: string; // e.g., "60 mm Plain"
    paversPerSquareMetre: number | null;
    results?: PaverTestResult[];
  }

  export interface HoleDimension {
    l?: number;
    w?: number;
    no?: number;
  }

  export interface BricksBlocksTestResult {
    sampleId: string;
    length?: number;
    width?: number;
    height?: number;
    holeA?: HoleDimension;
    holeB?: HoleDimension;
    notch?: HoleDimension;
    weight?: number;
    load?: number;
    correctedFailureLoad?: number;
    modeOfFailure?: string;
  }

  export type BrickType = 'Regular Fired Clay Bricks' | 'Regular Fired Earth Bricks' | 'Stabilised Earth Bricks' | 'Regular Earth bricks';

  export interface BricksBlocksRegisterEntry extends BaseRegisterEntry {
    sampleType: string; // Brick, Solid, Hollow
    results?: BricksBlocksTestResult[];
    solidBlockType?: 'Regular concrete blocks' | 'Stabilised earth Blocks';
    brickType?: BrickType;
    modeOfCompaction?: 'Not Specified' | 'Static';
  }
  
  export interface WaterAbsorptionTestResult {
    sampleId: string;
    length?: number;
    width?: number;
    height?: number;
    ovenDriedWeight?: number;
    weightAfterSoaking?: number;
    weightOfWater?: number;
    waterAbsorption?: number;
  }

  export interface WaterAbsorptionRegisterEntry extends BaseRegisterEntry {
    sampleType: string;
    results?: WaterAbsorptionTestResult[];
  }

  export interface ProjectLabTest {
    testId: string;
    materialCategory: string;
    categoryQuantity: number;
    materialTest: string;
    quantity: number;
    technician: string;
  }
  
  export interface Project {
    id: string;
    date: string;
    projectIdBig?: string;
    projectIdSmall?: string;
    client: string;
    project: string;
    engineer?: string;
    fieldTestDetails?: string;
    fieldTechnician?: string;
    fieldStartDate?: string;
    fieldEndDate?: string;
    fieldRemarks?: string;
    labTests: ProjectLabTest[];
    tasks?: ProjectLabTest[]; // Duplicating for task management
    labStartDate?: string;
    agreedDelivery?: string;
    agreedSignature?: string;
    actualDelivery?: string;
    actualSignature?: string;
    labRemarks?: string;
    ackAfterDelivery?: string;
    reportIssuedBy?: string;
    reportPickedBy?: string;
    contact?: string;
    dateTime?: string;
    sampleReceipt: string;
    laboratoryId: string;
  }
  
  export type ThemeColors = {
    sidebarBg: string;
    contentBg: string;
    topbarBg: string;
  };

  export interface StampSettings {
    stampUrl?: string;
    stampSerialPart1?: string;
    stampSerialPart2?: number;
  }
  
  export type ProfileExperience = {
    id: string;
    title: string;
    company: string;
    logo?: string;
    location?: string;
    startDate: string;
    endDate?: string;
    description?: string;
    documents?: string[]; // Array of document IDs
  };

  export type ProfileEducation = {
    id: string;
    institution: string;
    logo?: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string;
    documents?: string[]; // Array of document IDs
  };

  export type AcademicDocument = {
    id: string;
    name: string;
    url: string;
    uploadedAt: string;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    educationId?: string; // Reference to the education entry
  };

  export type WorkDocument = {
    id: string;
    name: string;
    url: string;
    uploadedAt: string;
    company: string;
    title: string;
    location?: string;
    experienceId?: string; // Reference to the experience entry
  };
  
  // Admin Types
  export type User = {
    uid: string;
    email?: string;
    name?: string;
    photoURL?: string;
    signatureURL?: string;
    status: 'active' | 'suspended';
    createdAt: string;
    laboratoryId: string;
    roleId?: string;
    // Permission Overrides
    grantedPermissions?: string[];
    revokedPermissions?: string[];
    // Profile fields
    headline?: string;
    bio?: string;
    location?: string;
    skills?: string[];
    experience?: ProfileExperience[];
    education?: ProfileEducation[];
    academicDocuments?: AcademicDocument[];
    workDocuments?: WorkDocument[];
    contact?: {
        phone?: string;
    };
    // Employment Details
    contractType?: 'Full-time' | 'Part-time' | 'Contract';
    startDate?: string;
    endDate?: string;
    salary?: number;
    workload?: number;
  };

  export type Role = {
    id: string;
    name: string;
    permissions: string[];
    laboratoryId: string;
    memberIds: string[];
  };

  export type Permission = {
    id: string;
    label: string;
  };
  
  export type PermissionGroup = {
    id: string;
    label: string;
    permissions: Permission[];
  };

  export interface Laboratory {
    id: string;
    name: string;
    location: string;
    logo: string;
    themeColors: ThemeColors;
    stampSettings: StampSettings;
    ownerUid: string;
    createdAt: any;
    // Legacy fields (keeping for backward compatibility)
    address?: string;
    email?: string;
    bio?: string;
    engineerOnDuty?: string;
    
    // New comprehensive company profile fields
    companyDetails?: {
      name: string;
      region: string;
      slogan?: string;
      trade?: string;
    };
    addressDetails?: {
      plotNo?: string;
      streetNameVillage: string;
      parishTown?: string;
      subCountyTownCouncil?: string;
      countyMunicipality?: string;
      district: string;
      country: string;
      postOfficeBoxNo: string;
      boxOfficeLocation?: string;
    };
    contactDetails?: {
      officePhones: string[];
      mobilePhones: string[];
      emails: string[];
      website?: string;
    };
    regulatoryDetails?: {
      businessRegistrationNumber: string;
      yearOfRegistration: string;
      tin: string;
      vatRegNumber?: string;
      vatRate?: string;
      nssfRegNo?: string;
    };
    customSections?: Array<{
      id: string;
      title: string;
      fields: Array<{
        id: string;
        label: string;
        value: string;
        required?: boolean;
      }>;
    }>;
  }

  // Asset Management Types
export interface AssetCategory {
  id: string;
  name: string;
  description?: string;
}

export const ASSET_STATUSES = ['Active', 'In Repair', 'Under Maintenance', 'Decommissioned', 'Lost/Stolen'] as const;
export type AssetStatus = typeof ASSET_STATUSES[number];

export interface Asset {
  id: string;
  name: string;
  assetTag: string;
  serialNumber?: string;
  categoryId: string;
  status: AssetStatus;
  location: string;
  purchaseDate?: string;
  purchaseCost?: number;
  vendor?: string;
  warrantyExpiryDate?: string;
  assignedTo?: string; // User ID
  isCalibrated: boolean;
  calibrationFrequency?: number; // in days
  nextCalibrationDate?: string;
  maintenanceFrequency?: number; // in days
  nextMaintenanceDate?: string;
  notes?: string;
  laboratoryId: string;
}

export const CALIBRATION_RESULTS = ['Passed', 'Passed with Remarks', 'Failed'] as const;
export type CalibrationResult = typeof CALIBRATION_RESULTS[number];

export interface CalibrationRecord {
  id: string;
  assetId: string;
  date: string;
  technician: string;
  result: CalibrationResult;
  notes?: string;
  certificateUrl?: string;
  laboratoryId: string;
}

export const MAINTENANCE_TYPES = ['Preventive', 'Corrective', 'Inspection', 'Upgrade'] as const;
export type MaintenanceType = typeof MAINTENANCE_TYPES[number];

export interface MaintenanceRecord {
  id: string;
  assetId: string;
  date: string;
  technician: string;
  type: MaintenanceType;
  description: string;
  cost?: number;
  laboratoryId: string;
}

export interface CorrectionFactorMachine {
    id: string;
    name: string;
    tagId: string;
    factorM: number;
    factorC: number;
    laboratoryId: string;
}


// Finance Module Types
export const QUOTE_STATUSES = ['Draft', 'Sent', 'Accepted', 'Declined'] as const;
export type QuoteStatus = typeof QUOTE_STATUSES[number];

export interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quote {
  id: string;
  quoteId: string; // User-friendly ID
  clientId?: string; // Could link to a future 'clients' collection
  clientName: string;
  projectTitle: string;
  date: string;
  validUntil: string;
  items: QuoteItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: QuoteStatus;
  notes?: string;
  laboratoryId: string;
}

export const INVOICE_STATUSES = ['Draft', 'Sent', 'Paid', 'Partially Paid', 'Overdue'] as const;
export type InvoiceStatus = typeof INVOICE_STATUSES[number];

export interface Invoice {
    id: string;
    invoiceId: string;
    clientId?: string;
    clientName: string;
    projectTitle: string;
    date: string;
    dueDate: string;
    items: QuoteItem[];
    subtotal: number;
    tax: number;
    total: number;
    amountPaid?: number;
    status: InvoiceStatus;
    notes?: string;
    laboratoryId: string;
    quoteId?: string; // Link to original quote
}

export const EXPENSE_CATEGORIES = ['Equipment', 'Consumables', 'Utilities', 'Salaries', 'Rent', 'Marketing', 'Travel', 'Repairs & Maintenance', 'Other'] as const;
export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];

export interface Expense {
    id: string;
    date: string;
    category: ExpenseCategory;
    description: string;
    amount: number;
    vendor?: string;
    receiptUrl?: string;
    laboratoryId: string;
}
