
import { AssetCategory } from './types';

export const ASSET_CATEGORIES: AssetCategory[] = [
  // Laboratory Equipment
  { id: 'analytical-balance', name: 'Analytical Balance' },
  { id: 'spectrophotometer', name: 'Spectrophotometer' },
  { id: 'microscope', name: 'Microscope' },
  { id: 'centrifuge', name: 'Centrifuge' },
  { id: 'ph-meter', name: 'pH Meter' },
  { id: 'incubator', name: 'Incubator' },
  { id: 'autoclave', name: 'Autoclave' },
  { id: 'fume-hood', name: 'Fume Hood' },
  { id: 'water-bath', name: 'Water Bath' },
  { id: 'compression-machine', name: 'Compression Machine' },
  { id: 'oven', name: 'Oven' },
  { id: 'sieve-shaker', name: 'Sieve Shaker' },
  { id: 'viscometer', name: 'Viscometer' },

  // IT & Office Equipment
  { id: 'desktop-computer', name: 'Desktop Computer' },
  { id: 'laptop', name: 'Laptop' },
  { id: 'printer', name: 'Printer' },
  { id: 'scanner', name: 'Scanner' },
  { id: 'server', name: 'Server' },
  { id: 'network-switch', name: 'Network Switch' },
  { id: 'projector', name: 'Projector' },
  { id: 'telephone-system', name: 'Telephone System' },
  
  // Furniture & Fixtures
  { id: 'lab-bench', name: 'Lab Bench' },
  { id: 'office-desk', name: 'Office Desk' },
  { id: 'chair', name: 'Chair' },
  { id: 'storage-cabinet', name: 'Storage Cabinet' },
  { id: 'shelving-unit', name: 'Shelving Unit' },

  // Vehicles
  { id: 'company-car', name: 'Company Car' },
  { id: 'delivery-truck', name: 'Delivery Truck' },
  { id: 'motorcycle', name: 'Motorcycle' },
  
  // Field Equipment
  { id: 'gps-unit', name: 'GPS Unit' },
  { id: 'field-testing-kit', name: 'Field Testing Kit' },
  { id: 'portable-generator', name: 'Portable Generator' },
  { id: 'durable-tablet', name: 'Durable Tablet' },

  // Facility & Safety
  { id: 'hvac-system', name: 'HVAC System' },
  { id: 'fire-extinguisher', name: 'Fire Extinguisher' },
  { id: 'emergency-shower', name: 'Emergency Shower' },
  { id: 'ups-system', name: 'UPS System' },
  
  // Other
  { id: 'other', name: 'Other' }
];

export const getCategoryName = (categoryId: string) => {
    return ASSET_CATEGORIES.find(c => c.id === categoryId)?.name || 'N/A';
}
