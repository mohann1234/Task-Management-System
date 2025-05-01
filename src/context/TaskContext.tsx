import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Task, TaskFilter, TaskStatus, DailyProductivity } from '../types';
import { getFormattedDate } from '../utils/dateUtils';

interface TaskState {
  tasks: Task[];
  filter: TaskFilter;
  dailyProductivity: DailyProductivity[];
}

type TaskAction =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'MOVE_TASK'; payload: { taskId: string; newStatus: TaskStatus } }
  | { type: 'COMPLETE_TASK'; payload: string }
  | { type: 'UNCOMPLETE_TASK'; payload: string }
  | { type: 'SET_FILTER'; payload: Partial<TaskFilter> }
  | { type: 'LOAD_TASKS'; payload: Task[] };

const defaultFilter: TaskFilter = {
  priority: 'all',
  category: 'all',
  searchTerm: '',
  sortBy: 'dueDate',
  sortDirection: 'asc',
};

const initialState: TaskState = {
  tasks: [],
  filter: defaultFilter,
  dailyProductivity: [],
};

function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case 'MOVE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.taskId
            ? { ...task, status: action.payload.newStatus }
            : task
        ),
      };
    case 'COMPLETE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload
            ? { ...task, completed: true, status: 'done' }
            : task
        ),
      };
    case 'UNCOMPLETE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload
            ? { ...task, completed: false, status: 'todo' }
            : task
        ),
      };
    case 'SET_FILTER':
      return {
        ...state,
        filter: { ...state.filter, ...action.payload },
      };
    case 'LOAD_TASKS':
      return {
        ...state,
        tasks: action.payload,
      };
    default:
      return state;
  }
}

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  filter: TaskFilter;
  dailyProductivity: DailyProductivity[];
  dispatch: React.Dispatch<TaskAction>;
  getTasksByStatus: (status: TaskStatus) => Task[];
  getProductivityScore: () => number;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      dispatch({ type: 'LOAD_TASKS', payload: JSON.parse(savedTasks) });
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(state.tasks));
    calculateDailyProductivity();
  }, [state.tasks]);

  // Filter and sort tasks
  const filteredTasks = React.useMemo(() => {
    return state.tasks
      .filter((task) => {
        const matchesCategory =
          state.filter.category === 'all' || task.category === state.filter.category;
        const matchesPriority =
          state.filter.priority === 'all' || task.priority === state.filter.priority;
        const matchesSearch =
          !state.filter.searchTerm ||
          task.title.toLowerCase().includes(state.filter.searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(state.filter.searchTerm.toLowerCase());
        return matchesCategory && matchesPriority && matchesSearch;
      })
      .sort((a, b) => {
        const { sortBy, sortDirection } = state.filter;
        const multiplier = sortDirection === 'asc' ? 1 : -1;

        if (sortBy === 'dueDate') {
          return (
            (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()) * multiplier
          );
        }
        if (sortBy === 'priority') {
          const priorityWeight = { low: 1, medium: 2, high: 3 };
          return (
            (priorityWeight[a.priority] - priorityWeight[b.priority]) * multiplier
          );
        }
        if (sortBy === 'createdAt') {
          return (
            (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) *
            multiplier
          );
        }
        return 0;
      });
  }, [state.tasks, state.filter]);

  const getTasksByStatus = (status: TaskStatus) => {
    return filteredTasks.filter((task) => task.status === status);
  };

  const calculateDailyProductivity = () => {
    const today = getFormattedDate(new Date());
    const todayTasks = state.tasks.filter(
      (task) => getFormattedDate(new Date(task.createdAt)) === today
    );
    
    if (todayTasks.length === 0) return;
    
    const completedTasks = todayTasks.filter((task) => task.completed).length;
    const totalTasks = todayTasks.length;
    const score = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    const dailyProductivity: DailyProductivity = {
      date: today,
      completedTasks,
      totalTasks,
      score,
    };

    // Update state with the new productivity data
    const existingIndex = state.dailyProductivity.findIndex(p => p.date === today);
    if (existingIndex >= 0) {
      state.dailyProductivity[existingIndex] = dailyProductivity;
    } else {
      state.dailyProductivity.push(dailyProductivity);
    }
  };

  const getProductivityScore = () => {
    const today = getFormattedDate(new Date());
    const todayProductivity = state.dailyProductivity.find(p => p.date === today);
    return todayProductivity?.score || 0;
  };

  return (
    <TaskContext.Provider
      value={{
        tasks: state.tasks,
        filteredTasks,
        filter: state.filter,
        dailyProductivity: state.dailyProductivity,
        dispatch,
        getTasksByStatus,
        getProductivityScore,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
}