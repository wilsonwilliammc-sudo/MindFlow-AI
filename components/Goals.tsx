
import React, { useState } from 'react';
import { Goal } from '../types';
import { Target, Calendar, ChevronRight, PlusCircle, Trash2, X } from 'lucide-react';

interface GoalsProps {
  goals: Goal[];
  onAddGoal: (title: string, date: string) => void;
  onDeleteGoal: (id: string) => void;
  onUpdateProgress: (id: string, progress: number) => void;
}

const Goals: React.FC<GoalsProps> = ({ goals, onAddGoal, onDeleteGoal, onUpdateProgress }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim() && newDate) {
      onAddGoal(newTitle, newDate);
      setNewTitle('');
      setNewDate('');
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your Goals</h1>
          <p className="text-slate-500">Dream big, plan smart, execute daily.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
        >
          <PlusCircle size={20} />
          <span>New Goal</span>
        </button>
      </header>

      {isAdding && (
        <div className="bg-white border-2 border-indigo-100 p-8 rounded-[2rem] shadow-xl animate-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-900">Create New Goal</h3>
            <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
          </div>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase px-1">Goal Title</label>
                <input 
                  autoFocus
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Run a Marathon"
                  className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase px-1">Target Date</label>
                <input 
                  type="date" 
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-5 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button 
                type="button" 
                onClick={() => setIsAdding(false)}
                className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-2xl transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100"
              >
                Create Goal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {goals.map(goal => (
          <div key={goal.id} className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm group hover:border-indigo-300 transition-all relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110">
                  <Target size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{goal.title}</h3>
                  <div className="flex gap-4">
                    <span className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                      <Calendar size={16} />
                      Due {new Date(goal.targetDate).toLocaleDateString()}
                    </span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                      goal.progress >= 100 ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {goal.progress >= 100 ? 'Completed' : 'On Track'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-1 md:max-w-xs">
                <div className="flex justify-between mb-2 text-sm">
                  <span className="font-bold text-slate-600">Progress</span>
                  <span className="font-bold text-indigo-600">{goal.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden cursor-pointer" 
                     onClick={(e) => {
                       const rect = e.currentTarget.getBoundingClientRect();
                       const x = e.clientX - rect.left;
                       const percentage = Math.round((x / rect.width) * 100);
                       onUpdateProgress(goal.id, Math.min(100, Math.max(0, percentage)));
                     }}>
                  <div 
                    className="bg-indigo-600 h-full rounded-full transition-all duration-700"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-2 text-center">Click bar to adjust progress</p>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => onDeleteGoal(goal.id)}
                  className="p-4 bg-red-50 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={24} />
                </button>
                <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-slate-100">
              <div className="p-4 bg-slate-50 rounded-2xl text-center">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Status</p>
                <p className="text-xl font-bold text-slate-800">{goal.progress < 100 ? 'In Progress' : 'Mastered'}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl text-center">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Time Left</p>
                <p className="text-xl font-bold text-slate-800">
                  {Math.max(0, Math.ceil((new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} Days
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl text-center">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Milestones</p>
                <p className="text-xl font-bold text-slate-800">{(goal.progress / 20).toFixed(0)} / 5</p>
              </div>
            </div>
          </div>
        ))}
        {goals.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
             <Target size={64} className="mx-auto text-slate-200 mb-6" />
             <h3 className="text-2xl font-bold text-slate-800">No active goals</h3>
             <p className="text-slate-500 mt-2 max-w-sm mx-auto">Goals are the fuel in the furnace of achievement. Create your first one to get started.</p>
             <button onClick={() => setIsAdding(true)} className="mt-8 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold">Start Your Journey</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;
