
import React, { useEffect, useState } from 'react';
import { AppState, Task, Status } from '../types';
import { getSmartSuggestions } from '../services/geminiService';
import { Sparkles, TrendingUp, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  state: AppState;
  onNavigate: (view: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ state, onNavigate }) => {
  const [suggestions, setSuggestions] = useState<string>('MindFlow AI is analyzing your workflow...');
  
  const pendingTasks = state.tasks.filter(t => t.status !== Status.DONE);
  const completedTodayCount = state.tasks.filter(t => t.status === Status.DONE).length;
  
  const chartData = [
    { name: 'Completed', value: completedTodayCount || 0 },
    { name: 'Pending', value: pendingTasks.length || 1 }, // Ensure chart shows something
  ];
  const COLORS = ['#4f46e5', '#e2e8f0'];

  useEffect(() => {
    if (state.tasks.length > 0 || state.habits.length > 0) {
      getSmartSuggestions(state.tasks, state.habits).then(setSuggestions);
    } else {
      setSuggestions("Add your first task or habit to get personalized AI productivity insights!");
    }
  }, [state.tasks.length, state.habits.length]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 mt-1">Consistency leads to great results. Keep flowing.</p>
        </div>
        <div className="hidden md:block bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
           <p className="text-[10px] font-bold text-slate-400 uppercase">Today</p>
           <p className="font-bold text-slate-800">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-3xl p-6 shadow-sm flex items-center justify-between border-indigo-100 bg-gradient-to-br from-white to-indigo-50/30">
          <div>
            <p className="text-sm font-medium text-slate-500">Productivity Score</p>
            <h3 className="text-4xl font-black text-indigo-600 mt-1">{state.productivityScore}%</h3>
            <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold mt-2">
              <TrendingUp size={14} />
              <span>Optimized Workflow</span>
            </div>
          </div>
          <div className="h-20 w-20">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} innerRadius={25} outerRadius={35} paddingAngle={5} dataKey="value" stroke="none">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 shadow-sm border-emerald-100 bg-gradient-to-br from-white to-emerald-50/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
              <CheckCircle2 size={20} />
            </div>
            <span className="font-semibold text-slate-700">Completion</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{completedTodayCount} / {state.tasks.length}</p>
          <p className="text-sm text-slate-500 mt-1">Global progress</p>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-1000" 
              style={{ width: `${(completedTodayCount / (state.tasks.length || 1)) * 100}%` }}
            />
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 shadow-sm border-amber-100 bg-gradient-to-br from-white to-amber-50/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
              <Clock size={20} />
            </div>
            <span className="font-semibold text-slate-700">Deep Focus</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">Active</p>
          <p className="text-sm text-slate-500 mt-1">Ready for focus session</p>
          <button 
            onClick={() => onNavigate('focus')}
            className="mt-3 text-xs font-bold text-amber-600 flex items-center gap-1 hover:underline"
          >
            Start Timer <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* AI Suggestions */}
      <section className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden group">
        <Sparkles className="absolute right-[-20px] top-[-20px] opacity-10 group-hover:scale-125 transition-transform duration-1000" size={200} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <Sparkles size={18} />
            </div>
            <span className="font-bold tracking-widest uppercase text-xs opacity-90">AI Productivity Engine</span>
          </div>
          <div className="prose prose-invert max-w-none">
            <p className="text-indigo-50 text-xl leading-relaxed font-medium italic">
              "{suggestions}"
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Next Priority</h2>
            <button onClick={() => onNavigate('tasks')} className="text-indigo-600 text-sm font-semibold flex items-center gap-1 hover:underline">
              View Tasks <ChevronRight size={16} />
            </button>
          </div>
          <div className="space-y-3">
            {pendingTasks.slice(0, 3).map(task => (
              <div key={task.id} onClick={() => onNavigate('tasks')} className="bg-white border border-slate-100 p-5 rounded-3xl flex items-center justify-between hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    task.priority === 'High' ? 'bg-red-500' : 
                    task.priority === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'
                  }`} />
                  <div>
                    <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{task.title}</h4>
                    <p className="text-xs text-slate-400 font-medium uppercase mt-0.5">{task.category} • {task.estimatedMinutes}m</p>
                  </div>
                </div>
                <div className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all">
                  <ChevronRight size={18} />
                </div>
              </div>
            ))}
            {pendingTasks.length === 0 && (
              <div className="p-10 text-center border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50">
                 <p className="text-slate-400 font-bold">Inbox zero reached!</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
           <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Current Streaks</h2>
            <button onClick={() => onNavigate('habits')} className="text-indigo-600 text-sm font-semibold flex items-center gap-1 hover:underline">
              Habits <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {state.habits.slice(0, 4).map(habit => (
              <div key={habit.id} onClick={() => onNavigate('habits')} className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all cursor-pointer group">
                <div className="flex justify-between items-start mb-3">
                   <h4 className="font-bold text-slate-800 text-sm truncate pr-2 group-hover:text-indigo-600 transition-colors">{habit.name}</h4>
                   <span className="text-amber-500 font-black text-xs flex items-center gap-0.5">
                     <TrendingUp size={12} /> {habit.streak}
                   </span>
                </div>
                <div className="flex gap-1.5 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`flex-1 h-1.5 rounded-full ${i < (habit.streak % 5 || (habit.completedToday ? 1 : 0)) ? 'bg-indigo-500' : 'bg-slate-100'}`} />
                  ))}
                </div>
              </div>
            ))}
            {state.habits.length === 0 && (
              <div className="col-span-2 p-10 text-center border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50">
                 <p className="text-slate-400 font-bold">Build a new routine</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
