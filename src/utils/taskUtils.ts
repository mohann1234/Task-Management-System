import { v4 as uuidv4 } from 'uuid';
import { Task, TaskPriority, TaskCategory, TaskStatus } from '../types';

export function createNewTask(
  title: string,
  description: string,
  dueDate: string,
  priority: TaskPriority,
  category: TaskCategory,
  status: TaskStatus = 'todo'
): Task {
  return {
    id: uuidv4(),
    title,
    description,
    dueDate,
    createdAt: new Date().toISOString(),
    priority,
    category,
    status,
    completed: false,
  };
}

export function getPriorityColor(priority: TaskPriority): string {
  switch (priority) {
    case 'high':
      return 'bg-red-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'low':
      return 'bg-green-500';
    default:
      return 'bg-blue-500';
  }
}

export function getCategoryColor(category: TaskCategory): string {
  switch (category) {
    case 'work':
      return 'bg-blue-500';
    case 'personal':
      return 'bg-purple-500';
    case 'urgent':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
}

export function getStatusColor(status: TaskStatus): string {
  switch (status) {
    case 'todo':
      return 'bg-gray-200 dark:bg-gray-700';
    case 'inProgress':
      return 'bg-blue-100 dark:bg-blue-900';
    case 'done':
      return 'bg-green-100 dark:bg-green-900';
    default:
      return 'bg-gray-100 dark:bg-gray-800';
  }
}

export function getStatusTitle(status: TaskStatus): string {
  switch (status) {
    case 'todo':
      return 'To Do';
    case 'inProgress':
      return 'In Progress';
    case 'done':
      return 'Done';
    default:
      return '';
  }
}