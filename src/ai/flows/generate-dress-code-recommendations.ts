'use server';
/**
 * @fileOverview Generates personalized dress code recommendations based on detected violations.
 *
 * - generateDressCodeRecommendations - A function that generates dress code recommendations.
 * - GenerateDressCodeRecommendationsInput - The input type for the generateDressCodeRecommendations function.
 * - GenerateDressCodeRecommendationsOutput - The return type for the generateDressCodeRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDressCodeRecommendationsInputSchema = z.object({
  detectedViolations: z
    .string()
    .describe('A description of the detected dress code violations.'),
});
export type GenerateDressCodeRecommendationsInput = z.infer<
  typeof GenerateDressCodeRecommendationsInputSchema
>;

const GenerateDressCodeRecommendationsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe('Personalized recommendations to correct dress code issues.'),
});
export type GenerateDressCodeRecommendationsOutput = z.infer<
  typeof GenerateDressCodeRecommendationsOutputSchema
>;

export async function generateDressCodeRecommendations(
  input: GenerateDressCodeRecommendationsInput
): Promise<GenerateDressCodeRecommendationsOutput> {
  return generateDressCodeRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDressCodeRecommendationsPrompt',
  input: {schema: GenerateDressCodeRecommendationsInputSchema},
  output: {schema: GenerateDressCodeRecommendationsOutputSchema},
  prompt: `You are an expert fashion advisor specializing in dress code compliance.

  Based on the detected dress code violations, generate personalized recommendations to correct the issues.

  Detected Violations: {{{detectedViolations}}}

  Recommendations:`, // The prompt should be tailored for better dress code recommendations.
});

const generateDressCodeRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateDressCodeRecommendationsFlow',
    inputSchema: GenerateDressCodeRecommendationsInputSchema,
    outputSchema: GenerateDressCodeRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
