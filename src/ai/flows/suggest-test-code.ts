'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting test codes based on material category and test method.
 *
 * @exports suggestTestCode - An async function that takes material category and test method as input and returns a suggested test code.
 * @exports SuggestTestCodeInput - The input type for the suggestTestCode function.
 * @exports SuggestTestCodeOutput - The output type for the suggestTestCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTestCodeInputSchema = z.object({
  materialCategory: z.string().describe('The category of the material being tested.'),
  testMethod: z.string().describe('The method used for testing the material.'),
});
export type SuggestTestCodeInput = z.infer<typeof SuggestTestCodeInputSchema>;

const SuggestTestCodeOutputSchema = z.object({
  suggestedTestCode: z.string().describe('The suggested test code based on the input material category and test method.'),
});
export type SuggestTestCodeOutput = z.infer<typeof SuggestTestCodeOutputSchema>;

export async function suggestTestCode(input: SuggestTestCodeInput): Promise<SuggestTestCodeOutput> {
  return suggestTestCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTestCodePrompt',
  input: {schema: SuggestTestCodeInputSchema},
  output: {schema: SuggestTestCodeOutputSchema},
  prompt: `You are an expert laboratory technician. Based on the material category and test method provided, suggest a suitable test code.

Material Category: {{{materialCategory}}}
Test Method: {{{testMethod}}}

Suggest Test Code:`,
});

const suggestTestCodeFlow = ai.defineFlow(
  {
    name: 'suggestTestCodeFlow',
    inputSchema: SuggestTestCodeInputSchema,
    outputSchema: SuggestTestCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
