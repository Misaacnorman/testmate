'use server';

import { z } from 'zod';
import { detectDataAnomalies } from '@/ai/flows/detect-data-anomalies';
import { generatePreliminaryReport } from '@/ai/flows/generate-preliminary-report';

const anomalySchema = z.object({
  experimentalData: z.string().min(1, 'Experimental data cannot be empty.'),
  description: z.string().min(1, 'Experiment description cannot be empty.'),
});

export async function detectAnomaliesAction(prevState: any, formData: FormData) {
  const validatedFields = anomalySchema.safeParse({
    experimentalData: formData.get('experimentalData'),
    description: formData.get('description'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await detectDataAnomalies(validatedFields.data);
    return { message: 'Analysis complete.', data: result };
  } catch (error) {
    console.error(error);
    return { message: 'An error occurred during analysis.' };
  }
}


const reportSchema = z.object({
  experimentalData: z.string().min(1, 'Experimental data cannot be empty.'),
});

export async function generateReportAction(prevState: any, formData: FormData) {
  const validatedFields = reportSchema.safeParse({
    experimentalData: formData.get('experimentalData'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  try {
    const result = await generatePreliminaryReport(validatedFields.data);
    return { message: 'Report generated successfully.', data: result };
  } catch (error) {
    console.error(error);
    return { message: 'An error occurred while generating the report.' };
  }
}
