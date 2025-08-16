
'use server';
/**
 * @fileOverview A Genkit flow for processing imported test data from a file.
 * This flow takes raw parsed data from a spreadsheet, validates it,
 * and returns structured test data.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ParsedRowSchema = z.array(z.union([z.string(), z.number(), z.boolean()]));
const ParsedDataSchema = z.object({
  headers: z.array(z.string()),
  rows: z.array(ParsedRowSchema),
});

export type ParsedData = z.infer<typeof ParsedDataSchema>;

const ProcessedOutputSchema = z.array(
    z.object({
        materialCategory: z.string(),
        testCode: z.string(),
        materialTest: z.string(),
        testMethods: z.string(),
        accreditationStatus: z.string(),
        unit: z.string(),
        amountUGX: z.number(),
        amountUSD: z.number(),
        leadTimeDays: z.string(),
    })
);

export type ProcessedOutput = z.infer<typeof ProcessedOutputSchema>;

export async function processImportedFile(input: ParsedData): Promise<ProcessedOutput> {
  return processImportedFileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'processImportPrompt',
  input: { schema: ParsedDataSchema },
  output: { schema: ProcessedOutputSchema },
  prompt: `You are an intelligent data processor for a laboratory information system.
  Your task is to process raw data extracted from an uploaded spreadsheet and convert it into a structured JSON format.
  
  You need to map the headers from the input data to the expected fields in the output schema.
  The headers might be slightly different but you should intelligently map them.
  For example, 'Test Name' should map to 'materialTest' and 'Price' to 'amountUSD'.
  'Accredited' could map to 'accreditationStatus'.
  'Turnaround Time' should map to 'leadTimeDays'.
  
  Here is the raw data:
  Headers: {{{json headers}}}
  Rows:
  {{#each rows}}
  - {{{json this}}}
  {{/each}}
  
  Please process this data and return it in the specified structured format. Ensure data types are correct (e.g., numbers for amounts).
  If a value is missing or cannot be determined, use a sensible default (e.g., 0 for price, empty string for text).
  The output must be a valid JSON array of objects.`,
});

const processImportedFileFlow = ai.defineFlow(
  {
    name: 'processImportedFileFlow',
    inputSchema: ParsedDataSchema,
    outputSchema: ProcessedOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
