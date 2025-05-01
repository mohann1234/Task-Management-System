import React from 'react';
import { TaskProvider } from './context/TaskContext';
import { ThemeProvider } from './context/ThemeContext';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <ThemeProvider>
      <TaskProvider>
        <Dashboard />
      </TaskProvider>
    </ThemeProvider>
  );
}

export default App;