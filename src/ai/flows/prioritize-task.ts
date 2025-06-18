'use server';

/**
 * @fileOverview This file defines a Genkit flow for prioritizing tasks based on their due date and other parameters.
 *
 * - prioritizeTask - A function that suggests a priority level for a given task.
 * - PrioritizeTaskInput - The input type for the prioritizeTask function, including task details and due date.
 * - PrioritizeTaskOutput - The return type for the prioritizeTask function, providing a suggested priority level.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PrioritySchema = z.enum(['High', 'Medium', 'Low']);

const PrioritizeTaskInputSchema = z.object({
  taskDetails: z.string().describe('Details of the task to be prioritized.'),
  dueDate: z.string().describe('The due date of the task (YYYY-MM-DD).'),
  taskParameters: z
    .string()
    .optional()
    .describe('Other parameters associated with the task, such as effort required and dependencies.'),
});
export type PrioritizeTaskInput = z.infer<typeof PrioritizeTaskInputSchema>;

const PrioritizeTaskOutputSchema = z.object({
  suggestedPriority: PrioritySchema.describe('The suggested priority level for the task.'),
  reasoning: z.string().describe('The reasoning behind the suggested priority.'),
});
export type PrioritizeTaskOutput = z.infer<typeof PrioritizeTaskOutputSchema>;

export async function prioritizeTask(input: PrioritizeTaskInput): Promise<PrioritizeTaskOutput> {
  return prioritizeTaskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'prioritizeTaskPrompt',
  input: {schema: PrioritizeTaskInputSchema},
  output: {schema: PrioritizeTaskOutputSchema},
  prompt: `You are a helpful AI assistant that suggests a priority level (High, Medium, or Low) for a given task based on its details, due date, and other parameters.

Task Details: {{{taskDetails}}}
Due Date: {{{dueDate}}}
Other Parameters: {{{taskParameters}}}

Consider the task details, due date, and any other parameters to determine the appropriate priority level. Explain your reasoning for the suggested priority.

Output the suggested priority and the reasoning behind it.`,
});

const prioritizeTaskFlow = ai.defineFlow(
  {
    name: 'prioritizeTaskFlow',
    inputSchema: PrioritizeTaskInputSchema,
    outputSchema: PrioritizeTaskOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
