
import { FormCategoryData, FormStep1Data } from "./test";

export type Receipt = {
    id: string;
    receiptDate: string; // Changed to string to be serializable
    formData: FormStep1Data;
    categories: Record<string, FormCategoryData>;
    specialData: Record<string, any>;
};
