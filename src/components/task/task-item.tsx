import React, { useState } from 'react';
import type { Task, Priority } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, CalendarDays } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { EditTaskForm } from './edit-task-form';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
}

const getPriorityBadgeClass = (priority: Priority, completed: boolean) => {
  const baseClasses = "capitalize text-xs px-2 py-0.5";
  if (completed) {
    return cn(baseClasses, "bg-muted text-muted-foreground border-muted-foreground/50");
  }
  switch (priority) {
    case 'High': return cn(baseClasses, 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700');
    case 'Medium': return cn(baseClasses, 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-800/50 dark:text-yellow-300 dark:border-yellow-600');
    case 'Low': return cn(baseClasses, 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700');
    default: return cn(baseClasses, 'bg-primary/10 text-primary border-primary/30');
  }
};

export function TaskItem({ task, onUpdateTask, onDeleteTask, onToggleComplete }: TaskItemProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleUpdateTask = (updatedTask: Task) => {
    onUpdateTask(updatedTask);
    setIsEditModalOpen(false); // Close modal after successful update
  };

  return (
    <>
      <Card className={cn(
        "w-full shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out",
        task.completed ? "bg-card/60 dark:bg-card/40" : "bg-card"
      )}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-3 flex-grow min-w-0">
              <Checkbox
                id={`task-${task.id}`}
                checked={task.completed}
                onCheckedChange={() => onToggleComplete(task.id)}
                aria-labelledby={`task-title-${task.id}`}
                className="mt-1 h-5 w-5 flex-shrink-0 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              />
              <CardTitle 
                id={`task-title-${task.id}`}
                className={cn(
                  "text-lg font-semibold leading-tight break-words", 
                  task.completed ? "line-through text-muted-foreground" : "text-foreground"
                )}
              >
                {task.title}
              </CardTitle>
            </div>
            <div className="flex-shrink-0">
              <Badge className={getPriorityBadgeClass(task.priority, task.completed)}>
                {task.priority}
              </Badge>
            </div>
          </div>
        </CardHeader>
        {(task.description || task.dueDate) && (
          <CardContent className="pt-0 pb-4 space-y-1.5">
            {task.description && (
              <p className={cn("text-sm text-muted-foreground break-words", task.completed ? "line-through" : "")}>
                {task.description}
              </p>
            )}
            {task.dueDate && (
              <div className={cn("text-xs text-muted-foreground flex items-center", task.completed ? "line-through" : "")}>
                <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
                Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
              </div>
            )}
          </CardContent>
        )}
        <CardFooter className="flex justify-end gap-2 pt-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsEditModalOpen(true)} 
            aria-label={`Edit task ${task.title}`}
            className="text-primary hover:bg-primary/10 hover:text-primary"
            disabled={task.completed}
          >
            <Edit2 className="h-4 w-4 mr-1" /> Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-destructive hover:text-destructive hover:bg-destructive/10" 
                aria-label={`Delete task ${task.title}`}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the task "{task.title}".
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDeleteTask(task.id)} className="bg-destructive hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
      {isEditModalOpen && (
        <EditTaskForm
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdateTask={handleUpdateTask}
          taskToEdit={task}
        />
      )}
    </>
  );
}
