export const priorities = ["Low", "Medium", "High"] as const;
export type Priority = (typeof priorities)[number];

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  priority: Priority;
  completed: boolean;
}
