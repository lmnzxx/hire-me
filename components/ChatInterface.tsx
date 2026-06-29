'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCVData } from '@/store/cvSlice';
import { RootState } from '@/store';
import { Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ChatInterface() {
  const dispatch = useDispatch();
  const cvComplete = useSelector((state: RootState) => state.cv.isComplete);
  const bottomRef = useRef<HTMLDivElement>(null);
  
  // Manage our own input state!
  const [input, setInput] = useState('');
  
  const chat: any = useChat({
    onFinish: (message: any) => {
      console.log('ONFINISH MESSAGE:', message);
      const content = message?.parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') || message?.text || message?.content || (typeof message === 'string' ? message : '');
      if (!content) return;
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        try {
          const rawJson = jsonMatch[1].replace(/,(?!\s*?[{["'\w])/g, ''); // strip trailing commas
          const data = JSON.parse(rawJson);
          dispatch(updateCVData(data));
        } catch (e) {
          console.error("Failed to parse JSON", e);
        }
      }
    },
    onError: (error: any) => {
      console.error("useChat Error:", error);
      if (error.message?.includes('Too Large')) {
        alert("Pesan lo kepanjangan bro! Tolong diringkas di bawah 2000 karakter ya.");
      } else if (error.message?.includes('Forbidden')) {
        alert("Akses diblokir (Origin Protection).");
      } else {
        alert("Waduh, koneksi ke AI lagi gangguan nih. Coba lagi bentar ya.");
      }
    }
  });

  // Depending on exact AI SDK version, it's either append or sendMessage
  const submitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // @ts-ignore
    if (chat.append) chat.append({ role: 'user', content: input });
    // @ts-ignore
    else if (chat.sendMessage) chat.sendMessage({ role: 'user', content: input });
    
    setInput('');
  };

  useEffect(() => {
    // block: 'nearest' prevents the entire browser window from jumping down
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [chat.messages]);

  const messages = chat.messages || [];

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('chat_history');
      if (saved) {
        chat.setMessages(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load chat history', e);
    }
  }, []); // Run once on mount

  // Save to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (!chat.isLoading && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        const content = lastMessage.parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') || lastMessage.text || lastMessage.content || '';
        const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          try {
            const rawJson = jsonMatch[1].replace(/,(?!\s*?[{["'\w])/g, '');
            const data = JSON.parse(rawJson);
            dispatch(updateCVData(data));
          } catch (e) {
            console.error("Failed to parse JSON in useEffect", e);
          }
        }
      }
    }
  }, [messages, chat.isLoading, dispatch]);

  return (
    <div className="w-full flex flex-col gap-6 transition-all duration-700">
      {/* DYNAMIC HEADER: Hides when chatting starts for "Focus Mode" */}
      {messages.length === 0 && (
        <header className="mb-6 mt-12 text-center space-y-6 animate-in fade-in zoom-in duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold tracking-[0.2em] uppercase border border-indigo-500/20 shadow-sm backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" /> Local Privacy First
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-balance">
            Conversational <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-400 drop-shadow-sm">CV Builder</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-lg leading-relaxed">
            Chat with our AI Architect to pivot your career. All data is processed securely right in your browser.
          </p>
        </header>
      )}

      {/* CHAT BOX: Grows to fill screen when chatting */}
      <div className={`flex flex-col border border-white/20 dark:border-gray-800/50 rounded-2xl overflow-hidden bg-white/40 dark:bg-black/40 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] relative transition-all duration-700 ease-in-out ${messages.length === 0 ? 'h-[500px]' : 'h-[85vh] max-h-[900px] min-h-[600px]'}`}>
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 dark:text-gray-500 mt-28 animate-in fade-in duration-700">
              <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-white dark:bg-gray-800/50 p-[2px] shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="w-full h-full rounded-[22px] flex items-center justify-center">
                  <span className="text-2xl">✨</span>
                </div>
              </div>
              <p className="text-sm font-medium">Say hi to start building your CV</p>
            </div>
          )}
        
        {messages.map((m: any, idx: number) => {
          const content = m.parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') || m.text || m.content || '';
          const isUser = m.role === 'user';
          return (
            <div key={m.id || idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-3 duration-500`}>
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-400 flex-shrink-0 mr-3 mt-1 shadow-md flex items-center justify-center text-white text-xs">AI</div>
              )}
              <div className={`max-w-[80%] rounded-3xl p-5 shadow-sm ${isUser ? 'bg-indigo-600 text-white rounded-tr-sm shadow-indigo-600/20' : 'bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-100 rounded-tl-sm border border-white/40 dark:border-gray-700/50 backdrop-blur-md'}`}>
                <div className="prose dark:prose-invert prose-sm md:prose-base leading-relaxed max-w-none break-words prose-p:leading-relaxed prose-pre:p-0">
                  <ReactMarkdown>
                    {content.replace(/```json\s*[\s\S]*?\s*```/, '*CV Data successfully processed. You can download it below! ✨*')}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          );
        })}
        
        {chat.isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-emerald-400 flex-shrink-0 mr-3 shadow-md flex items-center justify-center text-white text-xs">AI</div>
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-3xl rounded-tl-sm p-5 shadow-sm border border-white/40 dark:border-gray-700/50 backdrop-blur-md flex items-center gap-1.5 h-[52px]">
              <div className="w-2 h-2 rounded-full bg-gray-400/80 animate-[bounce_1s_infinite_0ms]" />
              <div className="w-2 h-2 rounded-full bg-gray-400/80 animate-[bounce_1s_infinite_150ms]" />
              <div className="w-2 h-2 rounded-full bg-gray-400/80 animate-[bounce_1s_infinite_300ms]" />
            </div>
          </div>
        )}
        <div ref={bottomRef} className="h-4" />
      </div>

      {cvComplete && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-400 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-[0_0_20px_rgba(16,185,129,0.4)] animate-bounce border border-emerald-400/50 tracking-wide">
          ✨ CV Ready! Check below.
        </div>
      )}

      <form onSubmit={submitMessage} className="p-4 bg-white/40 dark:bg-black/40 backdrop-blur-2xl border-t border-white/20 dark:border-gray-800/50 flex gap-3 items-center z-10">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tell me about your experience..."
          className="flex-1 rounded-full px-6 py-4 bg-gray-100/50 dark:bg-gray-900/50 border border-transparent focus:border-indigo-500/30 focus:bg-white dark:focus:bg-black outline-none text-[15px] shadow-inner transition-all placeholder:text-gray-400"
        />
        <button type="submit" disabled={!input.trim()} className="p-4 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none transition-all active:scale-95">
          <Send size={20} className="ml-0.5" />
        </button>
      </form>
    </div>
    </div>
  );
}
