import { Test } from "./test";

export type Step1Data = {
  clientName: string;
  clientAddress: string;
  clientContact: string;
  sameForBilling: "yes" | "no";
  billedClientName?: string;
  billedClientAddress?: string;
  billedClientContact?: string;
  projectTitle: string;
  sampleStatus: string;
  deliveredBy: string;
  deliveryContact: string;
  resultTransmittal: string[];
  transmittalEmail?: string;
  transmittalWhatsapp?: string;
  receiptDate: string;
  receiptTime: string;
};

export type Step3Data = {
  [category: string]: {
    quantity: number;
    notes: string;
    selectedTests: { [testId: string]: boolean };
    testQuantities: { [testId: string]: number };
  }
}

export type Step4Data = {
    [category: string]: {
        numberOfSets: number;
        setDistribution: number[];
        sets: {
            serials: string;
            castingDate: Date;
            testingDate: Date;
            age: number;
            areaOfUse: string;
            class?: string;
        }[];
    }
}

export type FormData = {
    step1: Step1Data;
    step2: string[]; // selectedCategories
    step3: Step3Data;
    step4: Step4Data;
    allTests: Test[];
}
