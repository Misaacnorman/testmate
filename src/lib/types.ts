
export type Test = {
  id: string;
  name: string; // was materialTest
  material: string; // was materialCategory
  method: string; // was testMethods
  turnAroundTime: string;
  price: number;
  isAccredited: boolean;
  unit: string;
  priceUGX: number;
};

export type Receipt = {
  id: string;
  clientName: string;
  projectTitle: string;
  receiptDate: string; // Changed from object to string
  // Add other fields from the form as needed
  [key: string]: any; 
};
