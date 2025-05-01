import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useTask } from '../../context/TaskContext';
import { TaskPriority, TaskCategory } from '../../types';
import { useTheme } from '../../context/ThemeContext';

function TaskFilters() {
  const { filter, dispatch } = useTask();
  const { theme } = useTheme();
  const [showFullFilters, setShowFullFilters] = React.useState(false);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: 'SET_FILTER',
      payload: { searchTerm: e.target.value },
    });
  };
  
  const handlePriorityChange = (priority: TaskPriority | 'all') => {
    dispatch({
      type: 'SET_FILTER',
      payload: { priority },
    });
  };
  
  const handleCategoryChange = (category: TaskCategory | 'all') => {
    dispatch({
      type: 'SET_FILTER',
      payload: { category },
    });
  };
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const [sortBy, sortDirection] = value.split('-');
    
    dispatch({
      type: 'SET_FILTER',
      payload: {
        sortBy: sortBy as 'dueDate' | 'priority' | 'createdAt',
        sortDirection: sortDirection as 'asc' | 'desc',
      },
    });
  };
  
  const clearFilters = () => {
    dispatch({
      type: 'SET_FILTER',
      payload: {
        priority: 'all',
        category: 'all',
        searchTerm: '',
        sortBy: 'dueDate',
        sortDirection: 'asc',
      },
    });
  };
  
  const isFiltered =
    filter.priority !== 'all' ||
    filter.category !== 'all' ||
    filter.searchTerm !== '';
  
  return (
    <div className={`rounded-lg p-4 ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    } shadow-sm mb-6`}>
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search tasks..."
            value={filter.searchTerm}
            onChange={handleSearchChange}
            className={`w-full pl-10 pr-4 py-2 rounded-md ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600'
                : 'bg-gray-50 border-gray-200'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFullFilters(!showFullFilters)}
            className={`flex items-center space-x-1 px-3 py-2 rounded-md ${
              showFullFilters
                ? 'bg-blue-500 text-white'
                : theme === 'dark'
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="text-sm font-medium">Filters</span>
          </button>
          
          {isFiltered && (
            <button
              onClick={clearFilters}
              className="flex items-center px-3 py-2 rounded-md bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/30"
            >
              <X className="h-4 w-4 mr-1" />
              <span className="text-sm">Clear</span>
            </button>
          )}
        </div>
      </div>
      
      {showFullFilters && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <div className="flex flex-wrap gap-2">
              {(['all', 'low', 'medium', 'high'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePriorityChange(p)}
                  className={`px-3 py-1 text-xs rounded-full ${
                    filter.priority === p
                      ? 'bg-blue-500 text-white'
                      : theme === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {p === 'all' ? 'All' : p}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <div className="flex flex-wrap gap-2">
              {(['all', 'work', 'personal', 'urgent'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => handleCategoryChange(c)}
                  className={`px-3 py-1 text-xs rounded-full ${
                    filter.category === c
                      ? 'bg-blue-500 text-white'
                      : theme === 'dark'
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {c === 'all' ? 'All' : c}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label htmlFor="sort" className="block text-sm font-medium mb-1">
              Sort By
            </label>
            <select
              id="sort"
              value={`${filter.sortBy}-${filter.sortDirection}`}
              onChange={handleSortChange}
              className={`w-full px-3 py-2 rounded-md ${
                theme === 'dark'
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-gray-50 border-gray-200'
              } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="dueDate-asc">Due Date (Earliest)</option>
              <option value="dueDate-desc">Due Date (Latest)</option>
              <option value="priority-desc">Priority (High to Low)</option>
              <option value="priority-asc">Priority (Low to High)</option>
              <option value="createdAt-desc">Created (Newest)</option>
              <option value="createdAt-asc">Created (Oldest)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskFilters;