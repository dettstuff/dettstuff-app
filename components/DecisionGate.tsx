
import React, { useState } from 'react';
import { Goal, Idea, IdeaStatus, CDFScore } from '../types';
import { evaluateIdeaCDF } from '../services/geminiService';

interface DecisionGateProps {
  goals: Goal[];
  ideas: Idea[];
  onEvaluate: (id: string, updates: Partial<Idea>) => void;
  onAddIdea: (idea: Idea) => void;
}

const DecisionGate: React.FC<DecisionGateProps> = ({ goals, ideas, onEvaluate, onAddIdea }) => {
  const [selectedGoalId, setSelectedGoalId] = useState<string>(goals[0]?.id || '');
  const [draftTitle, setDraftTitle] = useState('');
  const [draftContent, setDraftContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEvaluate = async () => {
    if (!draftTitle || !draftContent || !selectedGoalId) return;
    
    setLoading(true);
    try {
      const goal = goals.find(g => g.id === selectedGoalId);
      const score = await evaluateIdeaCDF(draftContent, goal?.description || '');
      
      const newIdea: Idea = {
        id: Date.now().toString(),
        title: draftTitle,
        content: draftContent,
        goalId: selectedGoalId,
        status: IdeaStatus.GATED,
        cdfScore: score,
        createdAt: new Date().toISOString()
      };
      
      onAddIdea(newIdea);
      setDraftTitle('');
      setDraftContent('');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const currentIdeas = ideas.filter(i => i.status === IdeaStatus.GATED);

  return (
    <section className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-1">Content Decision Framework</h2>
          <p className="text-zinc-500 text-sm">Rigorous gating for new ideas. Stop overproduction at the source.</p>
        </div>
      </div>

      <div className="bg-zinc-900 p-6 md:p-8 rounded-xl border border-zinc-800">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="space-y-6 md:col-span-1 lg:col-span-3">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Select Strategy context</label>
              <select 
                value={selectedGoalId}
                onChange={e => setSelectedGoalId(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded p-3 text-white outline-none focus:border-cyan-500 appearance-none"
              >
                {goals.length === 0 ? <option>No goals available</option> : goals.map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Idea Title</label>
              <input 
                className="w-full bg-black border border-zinc-800 rounded p-3 text-white outline-none focus:border-cyan-500"
                placeholder="What is the concept?"
                value={draftTitle}
                onChange={e => setDraftTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Elevator Pitch</label>
              <textarea 
                className="w-full bg-black border border-zinc-800 rounded p-3 text-white outline-none focus:border-cyan-500 h-32 md:h-40"
                placeholder="Describe why this content matters..."
                value={draftContent}
                onChange={e => setDraftContent(e.target.value)}
              />
            </div>
            <button 
              disabled={loading || goals.length === 0}
              onClick={handleEvaluate}
              className="w-full bg-white text-black py-4 rounded font-black hover:bg-cyan-500 hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'CALCULATING FEASIBILITY...' : 'ENTER THE GATE'}
            </button>
          </div>

          <div className="md:col-span-1 lg:col-span-2 bg-black/50 rounded-xl p-6 border border-zinc-800 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full border-4 border-zinc-800 flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-zinc-800 rounded-sm rotate-45"></div>
            </div>
            <h4 className="font-bold text-zinc-400 mb-2 uppercase tracking-tighter">Real-time Gating Logic</h4>
            <ul className="text-xs text-zinc-500 space-y-2 list-none text-left md:text-center">
              <li>• Alignment Weight: 40%</li>
              <li>• Impact Weight: 30%</li>
              <li>• Threshold: 0.7 Total Score</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-600">Evaluation History</h3>
        {currentIdeas.map(idea => (
          <div key={idea.id} className="p-4 md:p-6 bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col md:flex-row gap-4 md:items-center">
            <div className="flex-1">
              <h4 className="font-bold mb-1 truncate">{idea.title}</h4>
              <p className="text-xs text-zinc-500 line-clamp-1">{idea.content}</p>
            </div>
            <div className="flex gap-4 items-center md:w-48 lg:w-64">
              <div className="flex-1 bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${idea.cdfScore!.decision === 'START' ? 'bg-cyan-400' : 'bg-red-500'}`} 
                  style={{ width: `${idea.cdfScore!.totalScore * 100}%` }}
                ></div>
              </div>
              <span className={`text-xs font-mono font-bold w-10 text-right ${idea.cdfScore!.decision === 'START' ? 'text-cyan-400' : 'text-red-500'}`}>
                {Math.round(idea.cdfScore!.totalScore * 100)}%
              </span>
            </div>
            <div className="flex justify-end gap-2 border-t border-zinc-800 md:border-0 pt-3 md:pt-0">
              {idea.cdfScore!.decision === 'START' && (
                <button 
                  onClick={() => onEvaluate(idea.id, { status: IdeaStatus.APPROVED })}
                  className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 text-[10px] font-black px-4 py-2 rounded uppercase tracking-widest hover:bg-cyan-500 hover:text-white transition-all whitespace-nowrap"
                >
                  Approve
                </button>
              )}
              <button 
                onClick={() => onEvaluate(idea.id, { status: IdeaStatus.ARCHIVED })}
                className="text-zinc-500 hover:text-red-500 text-[10px] font-black px-2 uppercase tracking-widest whitespace-nowrap"
              >
                Archive
              </button>
            </div>
          </div>
        ))}
        {currentIdeas.length === 0 && (
          <div className="p-12 text-center bg-zinc-900/50 border border-dashed border-zinc-800 rounded-xl text-zinc-600 text-sm">
            No ideas in evaluation.
          </div>
        )}
      </div>
    </section>
  );
};

export default DecisionGate;
