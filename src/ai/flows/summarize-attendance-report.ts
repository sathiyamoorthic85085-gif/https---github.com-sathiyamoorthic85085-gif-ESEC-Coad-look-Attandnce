// Summarize Attendance Report
'use server';
/**
 * @fileOverview Summarizes the attendance report, highlighting key trends and potential issues.
 *
 * - summarizeAttendanceReport - A function that summarizes the attendance report.
 * - SummarizeAttendanceReportInput - The input type for the summarizeAttendanceReport function.
 * - SummarizeAttendanceReportOutput - The return type for the summarizeAttendanceReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeAttendanceReportInputSchema = z.object({
  attendanceData: z.string().describe('The attendance data in JSON format.'),
});
export type SummarizeAttendanceReportInput = z.infer<typeof SummarizeAttendanceReportInputSchema>;

const SummarizeAttendanceReportOutputSchema = z.object({
  summary: z.string().describe('A summary of the attendance report, highlighting key trends and potential issues.'),
});
export type SummarizeAttendanceReportOutput = z.infer<typeof SummarizeAttendanceReportOutputSchema>;

export async function summarizeAttendanceReport(input: SummarizeAttendanceReportInput): Promise<SummarizeAttendanceReportOutput> {
  return summarizeAttendanceReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeAttendanceReportPrompt',
  input: {schema: SummarizeAttendanceReportInputSchema},
  output: {schema: SummarizeAttendanceReportOutputSchema},
  prompt: `You are an AI assistant helping to summarize attendance reports.

  Please analyze the following attendance data and provide a summary of the key trends and potential issues.

  Attendance Data:
  {{attendanceData}}
  `,
});

const summarizeAttendanceReportFlow = ai.defineFlow(
  {
    name: 'summarizeAttendanceReportFlow',
    inputSchema: SummarizeAttendanceReportInputSchema,
    outputSchema: SummarizeAttendanceReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
