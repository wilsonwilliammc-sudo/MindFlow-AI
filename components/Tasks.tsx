
import React, { useState } from 'react';
import { Task, Priority, Status } from '../types';
import { parseTaskFromNaturalLanguage } from '../services/geminiService';
import { 
  Plus, 
  Search, 
  Filter, 
  Sparkles, 
  Calendar as CalendarIcon, 
  Clock, 
  Trash2, 
  CheckCircle2,
  MoreVertical,
  CheckSquare
} from 'lucide-react';

interface TasksProps {
  tasks: Task[];
  onAddTask: (task: Task) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

const Tasks: React.FC<TasksProps> = ({ tasks, onAddTask, onUpdateTask, onDeleteTask }) => {
  const [inputText, setInputText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddTask = async () => {
    if (!inputText.trim()) return;
    
    setIsParsing(true);
    try {
      const parsed = await parseTaskFromNaturalLanguage(inputText);
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: parsed.title || inputText,
        description: parsed.description || '',
        priority: (parsed.priority as Priority) || Priority.MEDIUM,
        status: Status.TODO,
        dueDate: parsed.dueDate || new Date().toISOString(),
        estimatedMinutes: parsed.estimatedMinutes || 30,
        category: parsed.category || 'General',
      };
      onAddTask(newTask);
      setInputText('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsParsing(false);
    }
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Tasks</h1>
          <p className="text-slate-500">Manage and organize your work efficiently.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative group flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500" size={18} />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* AI Quick Entry */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-2">
        <input 
          type="text" 
          placeholder="e.g., 'Draft project proposal by Friday at high priority'"
          className="flex-1 px-4 py-3 focus:outline-none text-slate-700"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
        />
        <button 
          onClick={handleAddTask}
          disabled={isParsing || !inputText.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition-all"
        >
          {isParsing ? (
            <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
          ) : (
            <>
              <Sparkles size={18} />
              <span>Smart Add</span>
            </>
          )}
        </button>
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTasks.map((task) => (
          <div 
            key={task.id} 
            className="group bg-white border border-slate-100 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <button 
                onClick={() => onUpdateTask(task.id, { status: task.status === Status.DONE ? Status.TODO : Status.DONE })}
                className={`mt-1 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  task.status === Status.DONE 
                    ? 'bg-emerald-500 border-emerald-500 text-white' 
                    : 'border-slate-300 hover:border-indigo-500 text-transparent'
                }`}
              >
                <CheckCircle2 size={16} />
              </button>
              <div>
                <h3 className={`font-bold text-lg ${task.status === Status.DONE ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                  {task.title}
                </h3>
                <div className="flex flex-wrap gap-3 mt-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                    task.priority === Priority.HIGH ? 'bg-red-50 text-red-600' :
                    task.priority === Priority.MEDIUM ? 'bg-amber-50 text-amber-600' :
                    'bg-blue-50 text-blue-600'
                  }`}>
                    {task.priority}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500 text-xs">
                    <CalendarIcon size={14} />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500 text-xs">
                    <Clock size={14} />
                    {task.estimatedMinutes}m
                  </span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">
                    {task.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => onDeleteTask(task.id)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
              >
                <Trash2 size={20} />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>
        ))}
        {filteredTasks.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <div className="p-4 bg-slate-100 rounded-full inline-block text-slate-400 mb-4">
              {/* CheckSquare icon reference fixed by adding import */}
              <CheckSquare size={48} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No tasks found</h3>
            <p className="text-slate-500 mt-2">Use the AI input above to create your first task!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tasks;
