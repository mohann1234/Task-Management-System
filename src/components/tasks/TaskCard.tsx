import React, { useState } from 'react';
import { Calendar, Tag, MoreHorizontal, Trash2, Edit2, CheckCircle, XCircle } from 'lucide-react';
import { Task } from '../../types';
import { useTask } from '../../context/TaskContext';
import { formatDate, isDatePast, isDateToday, getDaysUntilDue } from '../../utils/dateUtils';
import { getPriorityColor, getCategoryColor } from '../../utils/taskUtils';
import TaskModal from './TaskModal';
import { useTheme } from '../../context/ThemeContext';

interface TaskCardProps {
  task: Task;
}

function TaskCard({ task }: TaskCardProps) {
  const { dispatch } = useTask();
  const { theme } = useTheme();
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const handleComplete = () => {
    if (task.completed) {
      dispatch({ type: 'UNCOMPLETE_TASK', payload: task.id });
    } else {
      dispatch({ type: 'COMPLETE_TASK', payload: task.id });
    }
  };
  
  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      dispatch({ type: 'DELETE_TASK', payload: task.id });
    }
  };
  
  const renderDueDate = () => {
    if (isDatePast(task.dueDate) && !task.completed) {
      return <span className="text-red-500">Overdue!</span>;
    }
    
    if (isDateToday(task.dueDate)) {
      return <span className="text-orange-500">Today</span>;
    }
    
    const daysUntil = getDaysUntilDue(task.dueDate);
    if (daysUntil > 0 && daysUntil <= 3 && !task.completed) {
      return <span className="text-orange-500">In {daysUntil} days</span>;
    }
    
    return formatDate(task.dueDate);
  };
  
  return (
    <>
      <div 
        className={`relative rounded-md shadow-sm overflow-hidden ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } ${task.completed ? 'opacity-75' : ''}`}
      >
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </h3>
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
              {showActions && (
                <div 
                  className={`absolute right-0 mt-1 py-1 w-36 rounded-md shadow-lg z-10 ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-white border border-gray-200'
                  }`}
                >
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowActions(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                  >
                    <Edit2 className="h-3.5 w-3.5 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={handleComplete}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                  >
                    {task.completed ? (
                      <>
                        <XCircle className="h-3.5 w-3.5 mr-2 text-orange-500" />
                        Mark Incomplete
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-3.5 w-3.5 mr-2 text-green-500" />
                        Mark Complete
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {task.description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {task.description.length > 100 
                ? `${task.description.substring(0, 100)}...` 
                : task.description}
            </p>
          )}
          
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs">
              <span className={`inline-block w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
              <span className="capitalize">{task.priority} Priority</span>
            </div>
            
            <div className="flex items-center space-x-2 text-xs">
              <Tag className="h-3 w-3" />
              <span 
                className={`px-1.5 py-0.5 rounded-full capitalize ${getCategoryColor(task.category)} bg-opacity-20`}
              >
                {task.category}
              </span>
            </div>
          </div>
          
          <div className="mt-3 flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{renderDueDate()}</span>
          </div>
        </div>
        
        {task.completed && (
          <div className="absolute inset-0 bg-green-500 bg-opacity-10 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-500 opacity-30" />
          </div>
        )}
      </div>
      
      {isEditing && (
        <TaskModal 
          onClose={() => setIsEditing(false)} 
          existingTask={task} 
        />
      )}
    </>
  );
}

export default TaskCard;