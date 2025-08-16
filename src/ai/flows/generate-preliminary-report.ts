'use server';

/**
 * @fileOverview Generates a preliminary report from experimental data.
 *
 * - generatePreliminaryReport - A function that generates a preliminary report.
 * - GeneratePreliminaryReportInput - The input type for the generatePreliminaryReport function.
 * - GeneratePreliminaryReportOutput - The return type for the generatePreliminaryReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePreliminaryReportInputSchema = z.object({
  experimentalData: z.string().describe('The experimental data to generate the report from.'),
});
export type GeneratePreliminaryReportInput = z.infer<typeof GeneratePreliminaryReportInputSchema>;

const GeneratePreliminaryReportOutputSchema = z.object({
  report: z.string().describe('The generated preliminary report.'),
  conclusions: z.string().describe('The conclusions from the experimental data.'),
  nextSteps: z.string().describe('The suggested next steps based on the experimental data.'),
});
export type GeneratePreliminaryReportOutput = z.infer<typeof GeneratePreliminaryReportOutputSchema>;

export async function generatePreliminaryReport(input: GeneratePreliminaryReportInput): Promise<GeneratePreliminaryReportOutput> {
  return generatePreliminaryReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePreliminaryReportPrompt',
  input: {schema: GeneratePreliminaryReportInputSchema},
  output: {schema: GeneratePreliminaryReportOutputSchema},
  prompt: `You are an AI assistant that generates preliminary reports from experimental data.

  Based on the following experimental data, generate a preliminary report, including conclusions and suggested next steps.

  Experimental Data:
  {{experimentalData}}

  Report:
  {{report}}

  Conclusions:
  {{conclusions}}

  Next Steps:
  {{nextSteps}}`,
});

const generatePreliminaryReportFlow = ai.defineFlow(
  {
    name: 'generatePreliminaryReportFlow',
    inputSchema: GeneratePreliminaryReportInputSchema,
    outputSchema: GeneratePreliminaryReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
