
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Tasks from './components/Tasks';
import Focus from './components/Focus';
import AIChat from './components/AIChat';
import Calendar from './components/Calendar';
import Habits from './components/Habits';
import Goals from './components/Goals';
import Stats from './components/Stats';
import Settings from './components/Settings';
import { AppState, ViewType, Task, Priority, Status, Habit } from './types';

const INITIAL_STATE: AppState = {
  tasks: [
    {
      id: '1',
      title: 'Design MindFlow Landing Page',
      description: 'Create high-fidelity mockups for the landing page.',
      priority: Priority.HIGH,
      status: Status.TODO,
      dueDate: new Date().toISOString(),
      estimatedMinutes: 120,
      category: 'Design'
    },
    {
      id: '2',
      title: 'Integration Gemini API',
      description: 'Implement task parsing and productivity suggestions.',
      priority: Priority.MEDIUM,
      status: Status.IN_PROGRESS,
      dueDate: new Date().toISOString(),
      estimatedMinutes: 90,
      category: 'Engineering'
    }
  ],
  habits: [
    {
      id: 'h1',
      name: 'Morning Meditation',
      frequency: 'Daily',
      streak: 12,
      completedToday: true,
      history: {}
    },
    {
      id: 'h2',
      name: 'Coding Practice',
      frequency: 'Daily',
      streak: 5,
      completedToday: false,
      history: {}
    }
  ],
  goals: [
    {
      id: 'g1',
      title: 'Learn AI App Development',
      targetDate: '2024-12-31',
      progress: 65,
      subtasks: []
    }
  ],
  productivityScore: 82
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('mindflow_state');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });
  const [activeView, setActiveView] = useState<ViewType>('dashboard');

  useEffect(() => {
    localStorage.setItem('mindflow_state', JSON.stringify(state));
  }, [state]);

  const addTask = (task: Task) => {
    setState(prev => ({ ...prev, tasks: [task, ...prev.tasks] }));
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
    }));
  };

  const deleteTask = (id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id)
    }));
  };

  const toggleHabit = (id: string) => {
    setState(prev => ({
      ...prev,
      habits: prev.habits.map(h => 
        h.id === id ? { ...h, completedToday: !h.completedToday, streak: h.completedToday ? h.streak - 1 : h.streak + 1 } : h
      )
    }));
  };

  const addHabit = (name: string) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      frequency: 'Daily',
      streak: 0,
      completedToday: false,
      history: {}
    };
    setState(prev => ({ ...prev, habits: [...prev.habits, newHabit] }));
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard state={state} onNavigate={setActiveView} />;
      case 'tasks':
        return <Tasks tasks={state.tasks} onAddTask={addTask} onUpdateTask={updateTask} onDeleteTask={deleteTask} />;
      case 'calendar':
        return <Calendar tasks={state.tasks} />;
      case 'habits':
        return <Habits habits={state.habits} onToggleHabit={toggleHabit} onAddHabit={addHabit} />;
      case 'goals':
        return <Goals goals={state.goals} />;
      case 'stats':
        return <Stats state={state} />;
      case 'focus':
        return <Focus />;
      case 'chat':
        return <AIChat state={state} />;
      default:
        return <Settings />;
    }
  };

  return (
    <Layout activeView={activeView} setActiveView={setActiveView}>
      {renderContent()}
    </Layout>
  );
};

export default App;
