import React from 'react';
import Header from './layout/Header';
import TaskBoard from './tasks/TaskBoard';
import ProductivityPanel from './productivity/ProductivityPanel';
import TaskFilters from './tasks/TaskFilters';
import { useTheme } from '../context/ThemeContext';

function Dashboard() {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <TaskFilters />
            <TaskBoard />
          </div>
          
          <div className="lg:col-span-1">
            <ProductivityPanel />
          </div>
        </div>
      </main>
      
      <footer className={`py-4 border-t ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="container mx-auto px-4 text-center text-sm opacity-75">
          © {new Date().getFullYear()} TaskFlow • Your Productivity Partner
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;