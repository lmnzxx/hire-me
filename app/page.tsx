import ChatInterface from '@/components/ChatInterface';
import CVDownload from '@/components/CVDocument';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] dark:bg-[#030712] text-gray-900 dark:text-gray-100 p-4 md:p-8 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden relative">
      
      {/* EXTREME PREMIUM BACKGROUND EFFECTS */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 dark:bg-indigo-600/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[20%] right-[-5%] w-[35%] h-[45%] rounded-full bg-emerald-500/20 dark:bg-emerald-600/20 blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-blue-500/20 dark:bg-blue-600/20 blur-[150px] mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDuration: '12s' }} />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header moved to ChatInterface for dynamic focus mode */}

        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <ChatInterface />
          <CVDownload />
        </div>
      </div>
    </main>
  );
}
