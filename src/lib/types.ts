


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


export type ConcreteCubeSample = {
  id: string; // Document ID from firestore
  sampleId: string; // Human-readable sample ID
  receiptId: string;
  clientName: string;
  projectTitle: string;
  receivedAt: string;
  sampleSerialNumber?: string;
  setNumber?: number;
  castingDate?: string;
  testingDate?: string;
  class?: string;
  age?: number;
  areaOfUse?: string;
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
  load?: number;
  modeOfFailure?: string;
  machineUsed?: string;
  recordedTemp?: number;
  certificateNumber?: string;
  comment?: string;
  technician?: string;
  dateOfIssue?: string;
  issueId?: string;
  takenBy?: string;
  dateTaken?: string;
  contact?: string;
};

export interface GroupedConcreteCubeSample extends ConcreteCubeSample {
    samples: ConcreteCubeSample[];
}

export type PaverSample = {
  id: string; // Document ID from firestore
  sampleId: string; // Human-readable sample ID
  receiptId: string;
  clientName: string;
  projectTitle: string;
  receivedAt: string;
  sampleSerialNumber?: string;
  setNumber?: number;
  castingDate?: string;
  testingDate?: string;
  age?: number;
  areaOfUse?: string;
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
  load?: number;
  modeOfFailure?: string;
  machineUsed?: string;
  recordedTemp?: number;
  certificateNumber?: string;
  comment?: string;
  technician?: string;
  dateOfIssue?: string;
  issueId?: string;
  takenBy?: string;
  dateTaken?: string;
  contact?: string;
};

export interface GroupedPaverSample extends PaverSample {
    samples: PaverSample[];
}


export type IssueCertificateData = {
  certificateNumber: string;
  comment?: string;
  technician: string;
  dateOfIssue: string;
  takenBy: string;
  dateTaken: string;
  contact: string;
  issueId?: string;
};
