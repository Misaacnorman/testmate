
'use server';

/**
 * @fileOverview A Genkit flow for suggesting a unique test code.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SuggestTestCodeInputSchema = z.object({
  material: z.string().describe('The material category for the test.'),
  method: z.string().describe('The method used for the test.'),
});

export type SuggestTestCodeInput = z.infer<typeof SuggestTestCodeInputSchema>;

export async function suggestTestCode(input: SuggestTestCodeInput): Promise<string> {
    return suggestTestCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTestCodePrompt',
  input: { schema: SuggestTestCodeInputSchema },
  output: { schema: z.string() },
  prompt: `You are an expert in laboratory information systems.
  
  Your task is to generate a unique, human-readable test code based on the provided material and method.
  
  The format should be: [First 2 letters of material][First 2 letters of method]-[3 random digits].
  For example, for Material "Blood" and Method "Hematology", a possible code is "BLHE-123".
  
  IMPORTANT: The generated code must NOT contain any forward slashes ('/').

  Material: {{{material}}}
  Method: {{{method}}}
  
  Provide only the generated test code.`,
});

const suggestTestCodeFlow = ai.defineFlow(
  {
    name: 'suggestTestCodeFlow',
    inputSchema: SuggestTestCodeInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
