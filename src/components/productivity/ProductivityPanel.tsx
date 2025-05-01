import React from 'react';
import { Lightbulb, TrendingUp, CheckSquare } from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import { useTheme } from '../../context/ThemeContext';
import { formatDate } from '../../utils/dateUtils';

function ProductivityPanel() {
  const { tasks, getProductivityScore } = useTask();
  const { theme } = useTheme();
  
  const productivityScore = getProductivityScore();
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const getTip = (): string => {
    // This would ideally connect to an AI API, but using static tips for now
    const tips = [
      "Break large tasks into smaller, manageable chunks.",
      "Use the 'two-minute rule': if it takes less than two minutes, do it now.",
      "Schedule your most challenging tasks during your peak energy hours.",
      "Take regular breaks using the Pomodoro technique (25 min work, 5 min break).",
      "Review your task list at the beginning and end of each day.",
      "Set realistic deadlines and prioritize tasks by importance and urgency.",
      "Minimize distractions by putting your phone on silent or using focus apps.",
      "Start your day with the most important task (MIT) to build momentum.",
    ];
    
    return tips[Math.floor(Math.random() * tips.length)];
  };
  
  const getTipsForToday = (): JSX.Element => {
    const tip = getTip();
    
    return (
      <div className={`p-4 rounded-lg mt-4 ${
        theme === 'dark' ? 'bg-indigo-900/20' : 'bg-indigo-50'
      }`}>
        <div className="flex items-center mb-2 text-indigo-600 dark:text-indigo-400">
          <Lightbulb className="h-5 w-5 mr-2" />
          <h3 className="font-semibold">Productivity Tip</h3>
        </div>
        <p className="text-sm">{tip}</p>
      </div>
    );
  };
  
  return (
    <div className={`rounded-lg shadow-sm overflow-hidden ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="font-semibold flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
          Productivity Insights
        </h2>
      </div>
      
      <div className="p-4">
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Today's Progress
          </h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold">
              {Math.round(productivityScore)}%
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${productivityScore}%` }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className={`p-3 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Completed
            </div>
            <div className="text-xl font-semibold">
              {completedTasks}
            </div>
          </div>
          <div className={`p-3 rounded-lg ${
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Total
            </div>
            <div className="text-xl font-semibold">
              {totalTasks}
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Overall Completion Rate
          </h3>
          <div className="flex items-center">
            <div className="flex items-center mr-3">
              <CheckSquare className="h-4 w-4 mr-1 text-green-500" />
              <span className="text-lg font-semibold">
                {Math.round(completionRate)}%
              </span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              of all tasks
            </span>
          </div>
        </div>
        
        {getTipsForToday()}
      </div>
    </div>
  );
}

export default ProductivityPanel;