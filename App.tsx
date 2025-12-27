
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
import { AppState, ViewType, Task, Priority, Status, Habit, Goal } from './types';

const INITIAL_STATE: AppState = {
  tasks: [
    {
      id: '1',
      title: 'Explore MindFlow AI Features',
      description: 'Check out the task manager, habit tracker, and AI chat.',
      priority: Priority.HIGH,
      status: Status.TODO,
      dueDate: new Date().toISOString(),
      estimatedMinutes: 30,
      category: 'Onboarding'
    }
  ],
  habits: [
    {
      id: 'h1',
      name: 'Drink Water',
      frequency: 'Daily',
      streak: 0,
      completedToday: false,
      history: {}
    }
  ],
  goals: [
    {
      id: 'g1',
      title: 'Master Productivity',
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 10,
      subtasks: []
    }
  ],
  productivityScore: 50
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('mindflow_state');
    try {
      return saved ? JSON.parse(saved) : INITIAL_STATE;
    } catch (e) {
      return INITIAL_STATE;
    }
  });
  const [activeView, setActiveView] = useState<ViewType>('dashboard');

  useEffect(() => {
    localStorage.setItem('mindflow_state', JSON.stringify(state));
  }, [state]);

  // Task Handlers
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

  // Habit Handlers
  const toggleHabit = (id: string) => {
    setState(prev => ({
      ...prev,
      habits: prev.habits.map(h => {
        if (h.id === id) {
          const isCompleting = !h.completedToday;
          return { 
            ...h, 
            completedToday: isCompleting, 
            streak: isCompleting ? h.streak + 1 : Math.max(0, h.streak - 1) 
          };
        }
        return h;
      })
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

  const deleteHabit = (id: string) => {
    setState(prev => ({ ...prev, habits: prev.habits.filter(h => h.id !== id) }));
  };

  // Goal Handlers
  const addGoal = (title: string, date: string) => {
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      title,
      targetDate: date,
      progress: 0,
      subtasks: []
    };
    setState(prev => ({ ...prev, goals: [newGoal, ...prev.goals] }));
  };

  const deleteGoal = (id: string) => {
    setState(prev => ({ ...prev, goals: prev.goals.filter(g => g.id !== id) }));
  };

  const updateGoalProgress = (id: string, progress: number) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.map(g => g.id === id ? { ...g, progress } : g)
    }));
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
        return <Habits habits={state.habits} onToggleHabit={toggleHabit} onAddHabit={addHabit} onDeleteHabit={deleteHabit} />;
      case 'goals':
        return <Goals goals={state.goals} onAddGoal={addGoal} onDeleteGoal={deleteGoal} onUpdateProgress={updateGoalProgress} />;
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
