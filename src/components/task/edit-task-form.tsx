"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Task } from '@/types';
import { priorities } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Sparkles, Loader2 } from 'lucide-react';
import { format, isValid } from 'date-fns';
import { cn } from '@/lib/utils';
import { prioritizeTask, type PrioritizeTaskInput, type PrioritizeTaskOutput } from '@/ai/flows/prioritize-task';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
  description: z.string().max(500, "Description must be 500 characters or less").optional().default(''),
  dueDate: z.date().optional(),
  priority: z.enum(priorities),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface EditTaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateTask: (task: Task) => void;
  taskToEdit: Task;
}

export function EditTaskForm({ isOpen, onClose, onUpdateTask, taskToEdit }: EditTaskFormProps) {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<PrioritizeTaskOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    // Default values are set in useEffect
  });
  
  useEffect(() => {
    if (isOpen && taskToEdit) {
      form.reset({
        title: taskToEdit.title,
        description: taskToEdit.description || '',
        dueDate: taskToEdit.dueDate,
        priority: taskToEdit.priority,
      });
    }
    setAiSuggestion(null); 
  }, [isOpen, taskToEdit, form]);


  const onSubmit = (data: TaskFormValues) => {
    onUpdateTask({ ...taskToEdit, ...data });
    setAiSuggestion(null);
    onClose();
    toast({
      title: "Task Updated!",
      description: `"${data.title}" has been updated.`,
    });
  };

  const handleSuggestPriority = async () => {
    const { title, description, dueDate } = form.getValues();
    if (!title) {
      form.setError("title", { type: "manual", message: "Title is needed for AI suggestion." });
      return;
    }
     if (!dueDate || !isValid(dueDate)) {
       form.setError("dueDate", { type: "manual", message: "A valid due date is needed for AI suggestion." });
      return;
    }

    setIsAiLoading(true);
    setAiSuggestion(null);
    try {
      const input: PrioritizeTaskInput = {
        taskDetails: `${title}${description ? `\n${description}` : ''}`,
        dueDate: format(dueDate, 'yyyy-MM-dd'),
      };
      const suggestion = await prioritizeTask(input);
      setAiSuggestion(suggestion);
      toast({
        title: "AI Priority Suggested",
        description: `AI suggested '${suggestion.suggestedPriority}'. Reason: ${suggestion.reasoning.substring(0,50)}...`,
      });
    } catch (error) {
      console.error("Error getting AI priority suggestion:", error);
       toast({
        variant: "destructive",
        title: "AI Suggestion Failed",
        description: "Could not get priority suggestion from AI. Please set manually.",
      });
    } finally {
      setIsAiLoading(false);
    }
  };
  
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setAiSuggestion(null);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[525px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline">Edit Task</DialogTitle>
           <DialogDescription>
            Update the details for your task. You can also get an AI-powered priority suggestion.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-2 max-h-[70vh] overflow-y-auto pr-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value && isValid(new Date(field.value)) ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-card" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-popover">
                        {priorities.map(p => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {aiSuggestion && (
              <Alert className="bg-primary/10 border-primary/30">
                <Sparkles className="h-5 w-5 text-primary" />
                <AlertTitle className="font-semibold text-primary">AI Suggestion: {aiSuggestion.suggestedPriority} Priority</AlertTitle>
                <AlertDescription className="text-sm text-foreground/80">
                  {aiSuggestion.reasoning}
                   <Button 
                    type="button" 
                    variant="link" 
                    className="p-0 h-auto ml-2 text-primary hover:text-primary/80"
                    onClick={() => form.setValue('priority', aiSuggestion.suggestedPriority, { shouldValidate: true })}
                  >
                    Apply suggestion
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <Button 
              type="button" 
              variant="outline" 
              onClick={handleSuggestPriority} 
              disabled={isAiLoading || !form.formState.isValid && (!form.formState.errors.title && !form.formState.errors.dueDate)}
              className="w-full flex items-center gap-2 group"
            >
              {isAiLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 text-accent group-hover:scale-110 transition-transform" />
              )}
              Suggest Priority with AI
            </Button>

            <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => handleDialogClose(false)}>Cancel</Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
