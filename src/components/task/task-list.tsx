import type { Task } from '@/types';
import { TaskItem } from './task-item';
import { AnimatePresence, motion } from 'framer-motion';

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
}

export function TaskList({ tasks, onUpdateTask, onDeleteTask, onToggleComplete }: TaskListProps) {
  // The "no tasks" message is handled by the parent component (page.tsx)
  // based on both total tasks and filtered tasks.
  // If tasks array is empty here, it means no tasks match the current filter
  // OR there are no tasks at all. Parent handles the specific message.

  return (
    <div className="space-y-4">
      <AnimatePresence initial={false}>
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3, ease: "easeInOut", delay: index * 0.03 }}
            className="ListItem"
          >
            <TaskItem
              task={task}
              onUpdateTask={onUpdateTask}
              onDeleteTask={onDeleteTask}
              onToggleComplete={onToggleComplete}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
