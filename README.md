# FanyaFocus - A Smart TODO Application

FanyaFocus is a modern and intuitive TODO application designed to help users efficiently organize their tasks and enhance productivity. Built with NextJS, React, ShadCN UI components, and Tailwind CSS, it offers a clean and responsive user interface. The app leverages Genkit for its AI-powered features, providing intelligent assistance to users.

## How it Works

FanyaFocus allows users to manage their tasks through a simple and user-friendly interface. Tasks are stored locally in the browser's localStorage, ensuring data persistence across sessions without requiring a backend server for this core functionality.

### Core Features:

1.  **Task Management:**
    *   **Add Tasks:** Users can add new tasks by providing a title, an optional description, an optional due date, and a priority level (Low, Medium, High).
    *   **Edit Tasks:** Existing tasks can be modified, allowing users to update any of their details.
    *   **Delete Tasks:** Tasks can be removed from the list.
    *   **Toggle Completion:** Users can mark tasks as completed or pending. Completed tasks are visually distinguished (e.g., strikethrough).

2.  **Task Prioritization:**
    *   **Manual Priority:** Users can set a priority (Low, Medium, High) for each task.
    *   **AI-Powered Priority Suggestion:** When adding or editing a task, users can request an AI-driven priority suggestion. The AI analyzes the task's details (title, description, due date) to recommend an appropriate priority level and provides a brief reasoning for its suggestion. This feature uses Genkit and a configured AI model.

3.  **Task Filtering and Sorting:**
    *   **Filter by Status:** Tasks can be filtered to show "all", "pending", or "completed" tasks.
    *   **Automatic Sorting:** Tasks are automatically sorted based on a combination of factors:
        1.  Completion status (pending tasks appear before completed tasks).
        2.  Due date (tasks with earlier due dates appear first; tasks without due dates appear after those with due dates).
        3.  Priority (High > Medium > Low).

4.  **User Interface:**
    *   **Responsive Design:** The application is designed to work seamlessly across different screen sizes.
    *   **Intuitive Components:** Utilizes ShadCN UI components for a polished and consistent look and feel.
    *   **Modals for Forms:** Adding and editing tasks are handled through modal dialogs.
    *   **Toast Notifications:** Provides feedback for actions like adding, updating, or AI suggestions using toast notifications.
    *   **Empty States:** Displays helpful messages when the task list is empty or when filters result in no matching tasks.

5.  **Local Storage:**
    *   Tasks are saved in the browser's `localStorage`. This means your tasks persist even if you close the browser tab or window, as long as you are using the same browser and don't clear its storage.

### Technical Stack:

*   **Frontend Framework:** Next.js (with App Router)
*   **UI Library:** React
*   **UI Components:** ShadCN UI
*   **Styling:** Tailwind CSS
*   **AI Integration:** Genkit (for AI flows like task prioritization)
*   **State Management:** React Hooks (`useState`, `useEffect`, `useMemo`)
*   **Form Handling:** React Hook Form with Zod for validation

## Getting Started

To get started with FanyaFocus in Firebase Studio:
1.  Explore the main application logic in `src/app/page.tsx`.
2.  Task-related components can be found in `src/components/task/`.
3.  The AI flow for task prioritization is located in `src/ai/flows/prioritize-task.ts`.
4.  Global styles and theme configuration are in `src/app/globals.css`.

This application serves as a robust starting point for a feature-rich TODO application, demonstrating modern web development practices and AI integration.
