
import React from 'react';
import { Habit } from '../types';
import { Flame, CheckCircle2, Circle, Trophy, Trash2 } from 'lucide-react';

interface HabitsProps {
  habits: Habit[];
  onToggleHabit: (id: string) => void;
  onAddHabit: (name: string) => void;
  onDeleteHabit: (id: string) => void;
}

const Habits: React.FC<HabitsProps> = ({ habits, onToggleHabit, onAddHabit, onDeleteHabit }) => {
  const [newName, setNewName] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onAddHabit(newName);
      setNewName('');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Habits</h1>
          <p className="text-slate-500">Consistency is the key to mastery.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-2xl border border-amber-100 shadow-sm">
          <Trophy size={20} />
          <span className="font-bold">Master Builder</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input 
          type="text" 
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New habit (e.g., Drink 2L water)"
          className="flex-1 px-5 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
        />
        <button type="submit" className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95">
          Add Habit
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {habits.map(habit => (
          <div key={habit.id} className="group bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl transition-colors ${habit.completedToday ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  <Flame size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{habit.name}</h3>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{habit.frequency}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-amber-600 font-black text-xl">
                <span>{habit.streak}</span>
                <Flame size={20} fill="currentColor" />
              </div>
            </div>

            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
              <span className="text-sm font-bold text-slate-600">Today's Progress</span>
              <button 
                onClick={() => onToggleHabit(habit.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${
                  habit.completedToday 
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' 
                    : 'bg-white border border-slate-200 text-slate-400 hover:border-indigo-500 hover:text-indigo-600'
                }`}
              >
                {habit.completedToday ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                {habit.completedToday ? 'Completed' : 'Complete'}
              </button>
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-2">
                <span>Last 7 Days</span>
                <span>{habit.streak > 0 ? 'Consistent' : 'Start Today!'}</span>
              </div>
              <div className="flex gap-2">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className={`flex-1 h-3 rounded-full ${i < (habit.streak % 7 || (habit.completedToday ? 1 : 0)) ? 'bg-indigo-500' : 'bg-slate-100'}`} />
                ))}
              </div>
            </div>

            <button 
              onClick={() => onDeleteHabit(habit.id)}
              className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        {habits.length === 0 && (
          <div className="md:col-span-2 text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
             <Flame size={48} className="mx-auto text-slate-300 mb-4" />
             <h3 className="text-xl font-bold text-slate-800">No habits tracked yet</h3>
             <p className="text-slate-500">Building positive habits is the first step to success.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Habits;
