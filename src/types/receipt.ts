
import { FormCategoryData, FormStep1Data } from "./test";

export type Receipt = {
    id: string;
    receiptDate: Date;
    formData: FormStep1Data;
    categories: Record<string, FormCategoryData>;
    specialData: Record<string, any>;
};
