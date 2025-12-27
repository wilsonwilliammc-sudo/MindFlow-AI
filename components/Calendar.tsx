
import React, { useState } from 'react';
import { Task } from '../types';
import { ChevronLeft, ChevronRight, Bell } from 'lucide-react';

interface CalendarProps {
  tasks: Task[];
}

const Calendar: React.FC<CalendarProps> = ({ tasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const calendarDays = [];
  for (let i = 0; i < startDay; i++) calendarDays.push(null);
  for (let i = 1; i <= days; i++) calendarDays.push(i);

  const getTasksForDay = (day: number) => {
    return tasks.filter(t => {
      const d = new Date(t.dueDate);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{monthNames[month]} {year}</h1>
          <p className="text-slate-500">Your schedule at a glance.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-white border border-slate-200 rounded-xl transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextMonth} className="p-2 hover:bg-white border border-slate-200 rounded-xl transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="grid grid-cols-7 border-b border-slate-100">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="py-4 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {calendarDays.map((day, i) => (
            <div key={i} className={`min-h-[120px] p-2 border-r border-b border-slate-50 relative ${day ? 'bg-white' : 'bg-slate-50/50'}`}>
              {day && (
                <>
                  <span className={`text-sm font-semibold ${day === new Date().getDate() && month === new Date().getMonth() ? 'bg-indigo-600 text-white w-7 h-7 flex items-center justify-center rounded-full' : 'text-slate-700'}`}>
                    {day}
                  </span>
                  <div className="mt-2 space-y-1">
                    {getTasksForDay(day).map(task => (
                      <div key={task.id} className="text-[10px] px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 truncate font-medium border border-indigo-100">
                        {task.title}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
