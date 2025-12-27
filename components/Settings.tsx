
import React from 'react';
import { User, Bell, Shield, Palette, HelpCircle, LogOut } from 'lucide-react';

const Settings: React.FC = () => {
  const sections = [
    { icon: <User />, title: 'Profile', desc: 'Manage your public and private info' },
    { icon: <Bell />, title: 'Notifications', desc: 'Control alerts and focus reminders' },
    { icon: <Shield />, title: 'Privacy & Security', desc: 'Password and data management' },
    { icon: <Palette />, title: 'Appearance', desc: 'Dark mode and accent colors' },
    { icon: <HelpCircle />, title: 'Support', desc: 'Help center and community' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500">Customize MindFlow to your liking.</p>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-8 border-b border-slate-100 flex items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-indigo-100 border-4 border-white shadow-xl flex items-center justify-center text-indigo-600 font-bold text-3xl">
            JS
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">John Smith</h3>
            <p className="text-slate-500">Premium Member • Pro Productivity</p>
            <button className="mt-2 text-sm text-indigo-600 font-bold hover:underline">Edit Avatar</button>
          </div>
        </div>

        <div className="p-2">
          {sections.map((section, i) => (
            <button key={i} className="w-full flex items-center gap-4 p-6 hover:bg-slate-50 transition-colors rounded-2xl group text-left">
              <div className="p-3 bg-slate-100 rounded-xl text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                {section.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900">{section.title}</h4>
                <p className="text-sm text-slate-500">{section.desc}</p>
              </div>
              <ChevronRight className="text-slate-300" size={20} />
            </button>
          ))}
        </div>
      </div>

      <button className="w-full flex items-center justify-center gap-2 p-4 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-colors">
        <LogOut size={20} />
        Log Out
      </button>
    </div>
  );
};

const ChevronRight = ({ className, size }: { className?: string, size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);

export default Settings;
