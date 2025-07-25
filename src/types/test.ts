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
