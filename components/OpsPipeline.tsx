
import React, { useState } from 'react';
import { Idea, IdeaStatus, ProductionBrief } from '../types';
import { generateProductionBrief } from '../services/geminiService';

interface OpsPipelineProps {
  ideas: Idea[];
  onUpdateStatus: (id: string, updates: Partial<Idea>) => void;
  onGenerateBrief: (id: string, updates: Partial<Idea>) => void;
}

const OpsPipeline: React.FC<OpsPipelineProps> = ({ ideas, onUpdateStatus, onGenerateBrief }) => {
  const [activeBriefId, setActiveBriefId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const prodIdeas = ideas.filter(i => 
    i.status === IdeaStatus.APPROVED || 
    i.status === IdeaStatus.PRODUCTION || 
    i.status === IdeaStatus.SCHEDULED
  );

  const handleCreateBrief = async (idea: Idea) => {
    setLoadingId(idea.id);
    try {
      const brief = await generateProductionBrief(idea.content);
      onGenerateBrief(idea.id, { brief, status: IdeaStatus.PRODUCTION });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <section className="space-y-8 animate-in zoom-in-95 duration-500">
      <div>
        <h2 className="text-xl md:text-2xl font-bold mb-1">Content Ops Toolkit</h2>
        <p className="text-zinc-500 text-sm">Transform approved ideas into actionable production briefs.</p>
      </div>

      <div className="space-y-4">
        {prodIdeas.map(idea => (
          <div key={idea.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
            <div className="p-4 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4 md:gap-6">
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                  idea.status === IdeaStatus.PRODUCTION ? 'bg-cyan-500' : 
                  idea.status === IdeaStatus.SCHEDULED ? 'bg-green-500' : 'bg-zinc-700'
                }`}></div>
                <div>
                  <h3 className="font-bold text-sm md:text-base line-clamp-1">{idea.title}</h3>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">{idea.status}</p>
                </div>
              </div>
              <div className="flex w-full sm:w-auto gap-2">
                {!idea.brief ? (
                  <button 
                    disabled={loadingId === idea.id}
                    onClick={() => handleCreateBrief(idea)}
                    className="flex-1 sm:flex-none bg-white text-black text-[10px] md:text-xs font-black px-4 py-2 rounded uppercase hover:bg-cyan-500 hover:text-white transition-all"
                  >
                    {loadingId === idea.id ? 'PREPARING...' : 'Create Brief'}
                  </button>
                ) : (
                  <button 
                    onClick={() => setActiveBriefId(activeBriefId === idea.id ? null : idea.id)}
                    className="flex-1 sm:flex-none border border-zinc-700 text-zinc-300 text-[10px] md:text-xs font-black px-4 py-2 rounded uppercase hover:bg-zinc-800 transition-all"
                  >
                    {activeBriefId === idea.id ? 'Hide Brief' : 'View Brief'}
                  </button>
                )}
                {idea.status === IdeaStatus.PRODUCTION && (
                  <button 
                    onClick={() => onUpdateStatus(idea.id, { status: IdeaStatus.SCHEDULED })}
                    className="flex-1 sm:flex-none bg-cyan-gradient text-white text-[10px] md:text-xs font-black px-4 py-2 rounded uppercase shadow-lg shadow-cyan-500/10"
                  >
                    Schedule
                  </button>
                )}
              </div>
            </div>

            {activeBriefId === idea.id && idea.brief && (
              <div className="p-6 md:p-8 bg-black/50 border-t border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-top-4">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-black uppercase text-cyan-400 mb-3 tracking-widest">Storyboard</h4>
                    <ul className="space-y-3">
                      {idea.brief.storyboard.map((step, idx) => (
                        <li key={idx} className="text-sm text-zinc-300 flex gap-3">
                          <span className="text-zinc-600 font-mono text-xs">{idx + 1}.</span>
                          <span className="leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase text-cyan-400 mb-3 tracking-widest">Asset Requirements</h4>
                    <div className="flex flex-wrap gap-2">
                      {idea.brief.assetsList.map((asset, idx) => (
                        <span key={idx} className="bg-zinc-800 text-zinc-400 px-2 py-1 rounded text-[10px] border border-zinc-700">{asset}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-black uppercase text-cyan-400 mb-3 tracking-widest">Shot List</h4>
                    <ul className="space-y-3">
                      {idea.brief.shotList.map((shot, idx) => (
                        <li key={idx} className="text-sm text-zinc-300 flex gap-2">
                          <span className="text-zinc-600">•</span>
                          <span className="leading-relaxed">{shot}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded">
                    <h4 className="text-[10px] font-black uppercase text-cyan-400 mb-2 tracking-widest">Editor's Notes</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed italic">{idea.brief.editNotes}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {prodIdeas.length === 0 && (
          <div className="py-16 md:py-20 border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-zinc-600 text-center px-6">
            <p className="font-bold mb-1">Operational pipeline is empty.</p>
            <p className="text-sm">Approve some ideas to begin production.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default OpsPipeline;
