
export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export enum Status {
  TODO = 'Todo',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  dueDate: string;
  estimatedMinutes: number;
  category: string;
}

export interface Habit {
  id: string;
  name: string;
  frequency: 'Daily' | 'Weekly';
  streak: number;
  completedToday: boolean;
  history: Record<string, boolean>;
}

export interface Goal {
  id: string;
  title: string;
  targetDate: string;
  progress: number;
  subtasks: { id: string; text: string; completed: boolean }[];
}

export type ViewType = 'dashboard' | 'tasks' | 'calendar' | 'focus' | 'habits' | 'goals' | 'stats' | 'chat';

export interface AppState {
  tasks: Task[];
  habits: Habit[];
  goals: Goal[];
  productivityScore: number;
}
