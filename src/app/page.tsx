"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { AppHeader } from '@/components/shared/header';
import { AddTaskForm } from '@/components/task/add-task-form';
import { TaskList } from '@/components/task/task-list';
import { TaskFilters } from '@/components/task/task-filters';
import type { Task } from '@/types';
import { Button } from '@/components/ui/button';
import { PlusCircle, ClipboardList, SearchX } from 'lucide-react';

type FilterStatus = "all" | "pending" | "completed";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedTasks = localStorage.getItem('fanyaFocusTasks');
    if (storedTasks) {
      try {
        const parsedTasks = JSON.parse(storedTasks, (key, value) => {
          if (key === 'dueDate' && value) {
            const date = new Date(value);
            return isNaN(date.getTime()) ? undefined : date;
          }
          return value;
        });
        setTasks(Array.isArray(parsedTasks) ? parsedTasks : []);
      } catch (error) {
        console.error("Failed to parse tasks from localStorage:", error);
        setTasks([]); 
      }
    }
  }, []);

  useEffect(() => {
    if(isMounted) { // Only save to localStorage after initial mount and hydration
        localStorage.setItem('fanyaFocusTasks', JSON.stringify(tasks));
    }
  }, [tasks, isMounted]);

  const addTask = (newTaskData: Omit<Task, 'id' | 'completed'>) => {
    setTasks(prevTasks => [
      ...prevTasks,
      { ...newTaskData, id: crypto.randomUUID(), completed: false },
    ]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      if (filterStatus === "pending") return !task.completed;
      if (filterStatus === "completed") return task.completed;
      return true;
    }).sort((a, b) => {
        const priorityOrder = { High: 0, Medium: 1, Low: 2 };
        
        // Sort by completion status (pending first)
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }

        // Sort by due date (earliest first, undefined dates last)
        if (a.dueDate && b.dueDate) {
          const dueDateDiff = a.dueDate.getTime() - b.dueDate.getTime();
          if (dueDateDiff !== 0) return dueDateDiff;
        } else if (a.dueDate) {
          return -1; // a has due date, b doesn't
        } else if (b.dueDate) {
          return 1;  // b has due date, a doesn't
        }
        
        // Sort by priority (High > Medium > Low)
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        if (priorityDiff !== 0) return priorityDiff;

        return 0; // Keep original order if all else is equal (though ID is unique)
    });
  }, [tasks, filterStatus]);

  if (!isMounted) {
    // Render a loading state or null until the component is mounted to avoid hydration mismatch with localStorage
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <AppHeader />
        <main className="flex-grow container mx-auto p-4 md:p-8 flex items-center justify-center">
           <Loader2Icon className="h-12 w-12 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-card rounded-lg shadow">
          <TaskFilters currentFilter={filterStatus} onFilterChange={setFilterStatus} />
          <Button onClick={() => setIsAddTaskModalOpen(true)} className="w-full sm:w-auto shadow-md bg-accent hover:bg-accent/90 text-accent-foreground">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Task
          </Button>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground flex flex-col items-center justify-center bg-card rounded-lg shadow p-6">
            <ClipboardList className="h-16 w-16 opacity-50 mb-4 text-primary" />
            <h2 className="text-2xl font-semibold mb-2 text-foreground">Your Task List is Empty!</h2>
            <p className="text-lg">Ready to get productive? Click "Add New Task" to start organizing your day.</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground flex flex-col items-center justify-center bg-card rounded-lg shadow p-6">
            <SearchX className="h-16 w-16 opacity-50 mb-4 text-primary" />
            <h2 className="text-2xl font-semibold mb-2 text-foreground">No Tasks Found</h2>
            <p className="text-lg">Try adjusting your filters, or add new tasks if your list is empty.</p>
          </div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onToggleComplete={toggleTaskCompletion}
          />
        )}
      </main>
      <AddTaskForm
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onAddTask={addTask}
      />
    </div>
  );
}

function Loader2Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}
