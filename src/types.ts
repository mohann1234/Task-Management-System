export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskCategory = 'work' | 'personal' | 'urgent';
export type TaskStatus = 'todo' | 'inProgress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  createdAt: string;
  priority: TaskPriority;
  category: TaskCategory;
  status: TaskStatus;
  completed: boolean;
}

export interface TaskColumn {
  id: TaskStatus;
  title: string;
}

export interface DailyProductivity {
  date: string;
  completedTasks: number;
  totalTasks: number;
  score: number;
}

export interface TaskFilter {
  priority: TaskPriority | 'all';
  category: TaskCategory | 'all';
  searchTerm: string;
  sortBy: 'dueDate' | 'priority' | 'createdAt';
  sortDirection: 'asc' | 'desc';
}