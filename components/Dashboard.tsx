
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
  const [suggestions, setSuggestions] = useState<string>('Loading AI insights...');
  
  const pendingTasks = state.tasks.filter(t => t.status !== Status.DONE);
  const completedToday = state.tasks.filter(t => t.status === Status.DONE).length;
  
  const chartData = [
    { name: 'Completed', value: completedToday },
    { name: 'Pending', value: pendingTasks.length },
  ];
  const COLORS = ['#4f46e5', '#e2e8f0'];

  useEffect(() => {
    getSmartSuggestions(state.tasks, state.habits).then(setSuggestions);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Good morning!</h1>
        <p className="text-slate-500 mt-1">Here's how your day is shaping up.</p>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-3xl p-6 shadow-sm flex items-center justify-between border-indigo-100 bg-gradient-to-br from-white to-indigo-50/30">
          <div>
            <p className="text-sm font-medium text-slate-500">Productivity Score</p>
            <h3 className="text-4xl font-black text-indigo-600 mt-1">{state.productivityScore}%</h3>
            <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold mt-2">
              <TrendingUp size={14} />
              <span>+5% from yesterday</span>
            </div>
          </div>
          <div className="h-20 w-20">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} innerRadius={25} outerRadius={35} paddingAngle={5} dataKey="value">
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
            <span className="font-semibold text-slate-700">Daily Goal</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{completedToday} / {state.tasks.length}</p>
          <p className="text-sm text-slate-500 mt-1">Tasks completed today</p>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-1000" 
              style={{ width: `${(completedToday / (state.tasks.length || 1)) * 100}%` }}
            />
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 shadow-sm border-amber-100 bg-gradient-to-br from-white to-amber-50/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
              <Clock size={20} />
            </div>
            <span className="font-semibold text-slate-700">Focus Time</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">2h 45m</p>
          <p className="text-sm text-slate-500 mt-1">Deep work sessions</p>
        </div>
      </div>

      {/* AI Suggestions */}
      <section className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden group">
        <Sparkles className="absolute right-[-10px] top-[-10px] opacity-20 group-hover:scale-110 transition-transform" size={120} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={20} />
            <span className="font-bold tracking-wide uppercase text-xs opacity-80">AI Smart Assistant</span>
          </div>
          <div className="prose prose-invert max-w-none">
            <p className="text-indigo-100 leading-relaxed font-medium">
              {suggestions}
            </p>
          </div>
        </div>
      </section>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Priority Tasks</h2>
            <button onClick={() => onNavigate('tasks')} className="text-indigo-600 text-sm font-semibold flex items-center gap-1 hover:underline">
              View all <ChevronRight size={16} />
            </button>
          </div>
          <div className="space-y-3">
            {pendingTasks.slice(0, 3).map(task => (
              <div key={task.id} className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center justify-between hover:border-indigo-200 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    task.priority === 'High' ? 'bg-red-500' : 
                    task.priority === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'
                  }`} />
                  <div>
                    <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{task.title}</h4>
                    <p className="text-xs text-slate-500">{task.estimatedMinutes} mins • {task.category}</p>
                  </div>
                </div>
                <div className="text-slate-400">
                  <ChevronRight size={18} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800">Habits Progress</h2>
          <div className="grid grid-cols-2 gap-4">
            {state.habits.slice(0, 4).map(habit => (
              <div key={habit.id} className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                   <h4 className="font-semibold text-slate-800 text-sm">{habit.name}</h4>
                   <span className="text-amber-600 font-bold text-xs flex items-center gap-1">
                     🔥 {habit.streak}
                   </span>
                </div>
                <div className="flex gap-1 mt-3">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className={`flex-1 h-1.5 rounded-full ${i < 5 ? 'bg-indigo-500' : 'bg-slate-100'}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
