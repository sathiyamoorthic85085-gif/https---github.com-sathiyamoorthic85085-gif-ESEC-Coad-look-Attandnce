'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-attendance-report.ts';
import '@/ai/flows/generate-dress-code-recommendations.ts';
import '@/ai/flows/analyze-leave-request.ts';
