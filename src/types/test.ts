export type Test = {
  id: string;
  materialCategory: string;
  testCode: string;
  materialTest: string;
  testMethods: string;
  accreditation: string;
  unit: string;
  amountUGX: number;
  amountUSD: number;
  leadTimeDays: number;
};

export type SpecialCategoryTest = Test & {
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
};

export type FormStep1Data = {
    clientName: string;
    clientAddress: string;
    clientContact: string;
    isSameBillingClient: 'yes' | 'no';
    billingName?: string;
    billingAddress?: string;
    billingContact?: string;
    projectTitle: string;
    sampleStatus: string;
    deliveredBy: string;
    deliveredByContact: string;
    transmittalModes: string[];
    email?: string;
    whatsapp?: string;
};

export type FormCategoryData = {
    quantity: number;
    notes?: string;
    tests: {
        [testId: string]: {
            quantity: number;
            testMethods: string;
            materialTest: string;
        };
    };
};

export type FormSet = {
    serials: string;
    castingDate: Date | null;
    testingDate: Date | null;
    age: string;
    areaOfUse: string;
    class: string;
};

export type FormSpecialData = {
    numberOfSets: number;
    setDistribution: number[];
    sets: FormSet[];
};
