
import React from 'react';
import { Goal } from '../types';
import { Target, Calendar, ChevronRight, PlusCircle } from 'lucide-react';

interface GoalsProps {
  goals: Goal[];
}

const Goals: React.FC<GoalsProps> = ({ goals }) => {
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your Goals</h1>
          <p className="text-slate-500">Dream big, plan smart, execute daily.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
          <PlusCircle size={20} />
          <span>New Goal</span>
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {goals.map(goal => (
          <div key={goal.id} className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm group hover:border-indigo-300 transition-all">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center flex-shrink-0">
                  <Target size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{goal.title}</h3>
                  <div className="flex gap-4">
                    <span className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                      <Calendar size={16} />
                      Due {new Date(goal.targetDate).toLocaleDateString()}
                    </span>
                    <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full uppercase">
                      On Track
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-1 md:max-w-xs">
                <div className="flex justify-between mb-2 text-sm">
                  <span className="font-bold text-slate-600">Progress</span>
                  <span className="font-bold text-indigo-600">{goal.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>

              <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-slate-100">
              <div className="p-4 bg-slate-50 rounded-2xl text-center">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Subtasks</p>
                <p className="text-xl font-bold text-slate-800">12 / 18</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl text-center">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Time Invested</p>
                <p className="text-xl font-bold text-slate-800">42 Hours</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl text-center">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Estimated End</p>
                <p className="text-xl font-bold text-slate-800">Oct 2024</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Goals;
