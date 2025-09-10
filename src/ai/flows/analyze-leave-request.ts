'use server';
/**
 * @fileOverview Analyzes a leave request reason and provides a structured summary.
 *
 * - analyzeLeaveRequest - A function that analyzes the leave request reason.
 * - AnalyzeLeaveRequestInput - The input type for the analyzeLeaveRequest function.
 * - AnalyzeLeaveRequestOutput - The return type for the analyzeLeaveRequest function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeLeaveRequestInputSchema = z.object({
  reason: z.string().describe('The reason for the leave or OD request.'),
});
export type AnalyzeLeaveRequestInput = z.infer<
  typeof AnalyzeLeaveRequestInputSchema
>;

const AnalyzeLeaveRequestOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise, one-sentence summary of the leave request reason.'),
});
export type AnalyzeLeaveRequestOutput = z.infer<
  typeof AnalyzeLeaveRequestOutputSchema
>;

export async function analyzeLeaveRequest(
  input: AnalyzeLeaveRequestInput
): Promise<AnalyzeLeaveRequestOutput> {
  return analyzeLeaveRequestFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeLeaveRequestPrompt',
  input: {schema: AnalyzeLeaveRequestInputSchema},
  output: {schema: AnalyzeLeaveRequestOutputSchema},
  prompt: `You are an administrative assistant who is expert at summarizing information.
  
  Analyze the following reason for a leave/OD request and provide a clear, concise, one-sentence summary.

  Reason: {{{reason}}}
  
  Summary:`,
});

const analyzeLeaveRequestFlow = ai.defineFlow(
  {
    name: 'analyzeLeaveRequestFlow',
    inputSchema: AnalyzeLeaveRequestInputSchema,
    outputSchema: AnalyzeLeaveRequestOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
