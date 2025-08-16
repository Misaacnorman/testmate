'use server';
/**
 * @fileOverview An anomaly detection AI agent.
 *
 * - detectDataAnomalies - A function that handles the data anomaly detection process.
 * - DetectDataAnomaliesInput - The input type for the detectDataAnomalies function.
 * - DetectDataAnomaliesOutput - The return type for the detectDataAnomalies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectDataAnomaliesInputSchema = z.object({
  experimentalData: z
    .string()
    .describe(
      'The experimental data to analyze for anomalies.  Should be in a format that can be parsed, such as CSV or JSON.'
    ),
  description: z.string().describe('The description of the experiment.'),
});
export type DetectDataAnomaliesInput = z.infer<typeof DetectDataAnomaliesInputSchema>;

const DetectDataAnomaliesOutputSchema = z.object({
  hasAnomalies: z.boolean().describe('Whether or not the data contains anomalies.'),
  anomaliesDescription: z
    .string()
    .describe('The description of the anomalies found in the data.'),
});
export type DetectDataAnomaliesOutput = z.infer<typeof DetectDataAnomaliesOutputSchema>;

export async function detectDataAnomalies(
  input: DetectDataAnomaliesInput
): Promise<DetectDataAnomaliesOutput> {
  return detectDataAnomaliesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectDataAnomaliesPrompt',
  input: {schema: DetectDataAnomaliesInputSchema},
  output: {schema: DetectDataAnomaliesOutputSchema},
  prompt: `You are an expert data analyst specializing in detecting anomalies in experimental data.

You will use this information to detect any anomalies in the data. You will make a determination as to whether the data contains anomalies or not, and what those anomalies are, and set the hasAnomalies output field appropriately.

Description of the experiment: {{{description}}}
Experimental data: {{{experimentalData}}}`,
});

const detectDataAnomaliesFlow = ai.defineFlow(
  {
    name: 'detectDataAnomaliesFlow',
    inputSchema: DetectDataAnomaliesInputSchema,
    outputSchema: DetectDataAnomaliesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
