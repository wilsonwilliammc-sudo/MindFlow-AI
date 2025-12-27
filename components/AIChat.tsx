
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Brain, Sparkles, Loader2 } from 'lucide-react';
import { chatWithAI } from '../services/geminiService';
import { AppState } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIChat: React.FC<{ state: AppState }> = ({ state }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am MindFlow AI. How can I help you optimize your productivity today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const response = await chatWithAI(userMsg, state);
      setMessages(prev => [...prev, { role: 'assistant', content: response || "I'm sorry, I couldn't process that." }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Error connecting to AI. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)]">
      <div className="flex-1 overflow-y-auto space-y-6 px-4 py-8 scrollbar-hide">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-slate-200' : 'bg-indigo-600 text-white'
              }`}>
                {msg.role === 'user' ? <User size={20} /> : <Brain size={20} />}
              </div>
              <div className={`p-4 rounded-3xl ${
                msg.role === 'user' 
                  ? 'bg-indigo-50 text-indigo-900 rounded-tr-none' 
                  : 'bg-white border border-slate-100 shadow-sm rounded-tl-none'
              }`}>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex gap-4 max-w-[80%]">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center">
                <Brain size={20} />
              </div>
              <div className="p-4 bg-white border border-slate-100 shadow-sm rounded-3xl rounded-tl-none flex items-center gap-2">
                <Loader2 className="animate-spin text-indigo-600" size={16} />
                <span className="text-sm text-slate-500 italic">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-200 rounded-b-3xl">
        <div className="max-w-4xl mx-auto flex gap-3 relative">
          <input 
            type="text"
            placeholder="Ask me anything: 'What should I do now?' or 'Analyze my week'"
            className="flex-1 pl-4 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 transition-all"
          >
            <Send size={20} />
          </button>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['Prioritize my tasks', 'Suggest a new habit', 'Analyze goals'].map(suggestion => (
            <button 
              key={suggestion}
              onClick={() => setInput(suggestion)}
              className="whitespace-nowrap px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIChat;
