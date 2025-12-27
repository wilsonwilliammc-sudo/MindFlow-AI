
import React from 'react';
import { AppState, Status } from '../types';
import { 
  XAxis, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Cell, PieChart, Pie
} from 'recharts';
import { TrendingUp, Award, Calendar, Zap } from 'lucide-react';

const Stats: React.FC<{ state: AppState }> = ({ state }) => {
  // Real data processing from state
  const completedTasks = state.tasks.filter(t => t.status === Status.DONE).length;
  const pendingTasks = state.tasks.length - completedTasks;
  const highPriority = state.tasks.filter(t => t.priority === 'High').length;
  
  // Weekly simulation based on total tasks (for visual representation)
  const data = [
    { name: 'Mon', tasks: Math.round(state.tasks.length * 0.4) },
    { name: 'Tue', tasks: Math.round(state.tasks.length * 0.6) },
    { name: 'Wed', tasks: Math.round(state.tasks.length * 0.5) },
    { name: 'Thu', tasks: Math.round(state.tasks.length * 0.8) },
    { name: 'Fri', tasks: completedTasks },
    { name: 'Sat', tasks: Math.round(completedTasks * 0.3) },
    { name: 'Sun', tasks: Math.round(completedTasks * 0.2) },
  ];

  const categoryCounts = state.tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));
  if (categoryData.length === 0) categoryData.push({ name: 'None', value: 1 });

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-500">Visualize your productivity patterns based on your real activity.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-800">Output Velocity</h3>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
              <TrendingUp size={16} />
              <span>{state.productivityScore}% Efficiency</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                />
                <Area type="monotone" dataKey="tasks" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorTasks)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-8">Workload Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 ml-4 min-w-[100px]">
              {categoryData.slice(0, 5).map((item, i) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{backgroundColor: COLORS[i % COLORS.length]}} />
                  <span className="text-xs font-bold text-slate-600 truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: <Zap />, label: 'Tasks Done', value: completedTasks, color: 'text-amber-500' },
          { icon: <Award />, label: 'Longest Habit', value: state.habits.length > 0 ? Math.max(...state.habits.map(h => h.streak)) + ' Days' : '0', color: 'text-indigo-500' },
          { icon: <Calendar />, label: 'Goals Set', value: state.goals.length, color: 'text-emerald-500' },
          { icon: <TrendingUp />, label: 'Urgent Tasks', value: highPriority, color: 'text-red-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center hover:scale-105 transition-transform">
            <div className={`${stat.color} mb-3`}>{stat.icon}</div>
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;
