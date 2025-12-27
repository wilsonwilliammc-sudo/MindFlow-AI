
import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  Timer, 
  BarChart3, 
  Activity, 
  Target, 
  MessageSquare,
  Settings,
  Brain
} from 'lucide-react';
import { ViewType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'focus', label: 'Focus Mode', icon: Timer },
    { id: 'habits', label: 'Habits', icon: Activity },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'stats', label: 'Analytics', icon: BarChart3 },
    { id: 'chat', label: 'AI Assistant', icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full hidden md:flex">
        <div className="p-6 flex items-center gap-2">
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <Brain size={24} />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">MindFlow AI</span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as ViewType)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  activeView === item.id 
                    ? 'bg-indigo-50 text-indigo-700 font-semibold' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 hover:bg-slate-50">
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-full scrollbar-hide">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex justify-between items-center md:hidden">
          <div className="flex items-center gap-2">
            <Brain className="text-indigo-600" size={24} />
            <span className="text-lg font-bold">MindFlow</span>
          </div>
          {/* Mobile menu could be here */}
        </header>
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      
      {/* Mobile Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 md:hidden z-50">
        {navItems.slice(0, 4).map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as ViewType)}
              className={`p-2 rounded-lg ${activeView === item.id ? 'text-indigo-600' : 'text-slate-400'}`}
            >
              <Icon size={24} />
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
