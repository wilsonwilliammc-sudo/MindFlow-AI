
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Zap } from 'lucide-react';

const Focus: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play sound notification
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode: 'work' | 'break') => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const percentage = (timeLeft / (mode === 'work' ? 25 * 60 : 5 * 60)) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-12">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black text-slate-900">Focus Mode</h1>
        <p className="text-slate-500">Tune out distractions and stay in the flow.</p>
      </div>

      <div className="relative w-80 h-80 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="160" cy="160" r="140"
            fill="transparent" stroke="#e2e8f0" strokeWidth="12"
          />
          <circle
            cx="160" cy="160" r="140"
            fill="transparent" stroke={mode === 'work' ? '#4f46e5' : '#10b981'} 
            strokeWidth="12" strokeDasharray={880}
            strokeDashoffset={880 - (880 * percentage) / 100}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-7xl font-black text-slate-900 tabular-nums">{formatTime(timeLeft)}</span>
          <span className={`text-sm font-bold uppercase tracking-widest mt-2 ${mode === 'work' ? 'text-indigo-600' : 'text-emerald-600'}`}>
            {mode === 'work' ? 'Time to Focus' : 'Take a Break'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={resetTimer}
          className="p-4 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-slate-900 transition-colors shadow-sm"
        >
          <RotateCcw size={28} />
        </button>
        <button 
          onClick={toggleTimer}
          className={`w-24 h-24 flex items-center justify-center rounded-full text-white shadow-2xl transition-all hover:scale-110 active:scale-95 ${
            isActive ? 'bg-slate-900 shadow-slate-200' : 'bg-indigo-600 shadow-indigo-200'
          }`}
        >
          {isActive ? <Pause size={40} fill="currentColor" /> : <Play size={40} className="ml-2" fill="currentColor" />}
        </button>
        <button 
          onClick={() => switchMode(mode === 'work' ? 'break' : 'work')}
          className="p-4 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-indigo-600 transition-colors shadow-sm"
        >
          {mode === 'work' ? <Coffee size={28} /> : <Zap size={28} />}
        </button>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={() => switchMode('work')}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
            mode === 'work' ? 'bg-indigo-100 text-indigo-700' : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          Pomodoro
        </button>
        <button 
          onClick={() => switchMode('break')}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
            mode === 'break' ? 'bg-emerald-100 text-emerald-700' : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          Short Break
        </button>
      </div>
    </div>
  );
};

export default Focus;
