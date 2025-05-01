import React from 'react';
import { ClipboardList, PlusCircle, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useTask } from '../../context/TaskContext';
import TaskModal from '../tasks/TaskModal';

function Header() {
  const { theme, toggleTheme } = useTheme();
  const { getProductivityScore } = useTask();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  
  const productivityScore = getProductivityScore();
  const formattedScore = Math.round(productivityScore);
  
  return (
    <header className={`sticky top-0 z-10 shadow-sm transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-gray-800 text-white border-b border-gray-700' 
        : 'bg-white text-gray-900 border-b border-gray-200'
    }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ClipboardList className="h-7 w-7 text-blue-500" />
            <h1 className="text-xl font-bold">TaskFlow</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
              <span className="text-sm font-medium">Today's Score:</span>
              <span className={`text-sm font-bold ${
                formattedScore >= 70 
                  ? 'text-green-500' 
                  : formattedScore >= 40 
                    ? 'text-yellow-500' 
                    : 'text-red-500'
              }`}>
                {formattedScore}%
              </span>
            </div>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md transition-colors duration-200"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden md:inline">New Task</span>
            </button>
            
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors duration-200 ${
                theme === 'dark'
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-blue-500" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {isModalOpen && (
        <TaskModal onClose={() => setIsModalOpen(false)} />
      )}
    </header>
  );
}

export default Header;