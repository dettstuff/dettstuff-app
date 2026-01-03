
import React, { useState, useEffect } from 'react';
import { Goal, Idea, IdeaStatus, AnalyticsEvent } from './types';
import { ICONS } from './constants';

// Module Components
import Sidebar from './components/Sidebar';
import GoalMap from './components/GoalMap';
import DecisionGate from './components/DecisionGate';
import IdeationEngine from './components/IdeationEngine';
import OpsPipeline from './components/OpsPipeline';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import Marketplace from './components/Marketplace';

type ActiveModule = 'CGM' | 'CDF' | 'AOCE' | 'COT' | 'AIP' | 'MKT';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ActiveModule>('CGM');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsEvent[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);

  // Local storage persistence
  useEffect(() => {
    const savedGoals = localStorage.getItem('arch_goals');
    const savedIdeas = localStorage.getItem('arch_ideas');
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    if (savedIdeas) setIdeas(JSON.parse(savedIdeas));
  }, []);

  useEffect(() => {
    localStorage.setItem('arch_goals', JSON.stringify(goals));
    localStorage.setItem('arch_ideas', JSON.stringify(ideas));
  }, [goals, ideas]);

  const emitEvent = (type: string, payload: any) => {
    const newEvent: AnalyticsEvent = {
      id: Math.random().toString(36).substr(2, 9),
      eventId: `EVT_${Date.now()}`,
      timestamp: new Date().toISOString(),
      type,
      payload
    };
    setAnalytics(prev => [newEvent, ...prev]);
  };

  const addGoal = (goal: Goal) => {
    setGoals(prev => [goal, ...prev]);
    emitEvent('GOAL_CREATED', goal);
  };

  const addIdea = (idea: Idea) => {
    setIdeas(prev => [idea, ...prev]);
    emitEvent('IDEA_CREATED', idea);
  };

  const updateIdea = (id: string, updates: Partial<Idea>) => {
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
    emitEvent('IDEA_UPDATED', { id, ...updates });
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'CGM':
        return <GoalMap goals={goals} onAddGoal={addGoal} />;
      case 'CDF':
        return <DecisionGate goals={goals} ideas={ideas} onEvaluate={updateIdea} onAddIdea={addIdea} />;
      case 'AOCE':
        return <IdeationEngine ideas={ideas} onVariantsGenerated={updateIdea} />;
      case 'COT':
        return <OpsPipeline ideas={ideas} onUpdateStatus={updateIdea} onGenerateBrief={updateIdea} />;
      case 'AIP':
        return <AnalyticsDashboard events={analytics} />;
      case 'MKT':
        return <Marketplace />;
      default:
        return <GoalMap goals={goals} onAddGoal={addGoal} />;
    }
  };

  return (
    <div className="flex h-screen bg-black overflow-hidden font-inter relative">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <Sidebar 
        activeModule={activeModule} 
        setActiveModule={(m) => {
          setActiveModule(m);
          setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
        isMinimized={isSidebarMinimized}
        toggleMinimize={() => setIsSidebarMinimized(!isSidebarMinimized)}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 border-b border-zinc-900 flex items-center justify-between px-6 shrink-0 bg-black z-30">
          <div className="text-xl font-black bg-cyan-gradient bg-clip-text text-transparent">
            ARCHITECT
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-zinc-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 scroll-smooth">
          <div className="max-w-6xl mx-auto">
            <header className="mb-8 lg:mb-12">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">Architect AI</h1>
              <p className="text-zinc-500 font-medium text-sm md:text-base">Deterministic Workspace for Content Strategy</p>
            </header>
            
            <div className="pb-24 lg:pb-0">
              {renderModule()}
            </div>
          </div>
        </div>

        {/* Floating Indicator - Hidden on very small screens for space */}
        <div className="hidden sm:flex fixed bottom-8 right-8 bg-zinc-900 border border-zinc-800 p-3 rounded-full items-center gap-3 shadow-2xl z-20">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">System Online</span>
        </div>
      </main>
    </div>
  );
};

export default App;
