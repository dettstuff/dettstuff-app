
import React, { useState } from 'react';
import { Idea, IdeaStatus, AOCEVariant } from '../types';
import { generateAOCEVariants } from '../services/geminiService';

interface IdeationEngineProps {
  ideas: Idea[];
  onVariantsGenerated: (id: string, updates: Partial<Idea>) => void;
}

const IdeationEngine: React.FC<IdeationEngineProps> = ({ ideas, onVariantsGenerated }) => {
  const approvedIdeas = ideas.filter(i => i.status === IdeaStatus.APPROVED);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleGenerate = async (idea: Idea) => {
    setLoadingId(idea.id);
    try {
      const variants = await generateAOCEVariants(idea.content);
      onVariantsGenerated(idea.id, { variants });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <section className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold mb-1">Anti-Overthinking Content Engine</h2>
        <p className="text-zinc-500">Rapid ideation for approved concepts. Generate 8 variants instantly.</p>
      </div>

      {approvedIdeas.length === 0 ? (
        <div className="py-20 bg-zinc-900 border border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-zinc-600">
          <p className="font-bold">No approved ideas found.</p>
          <p className="text-sm">Pass an idea through the Decision Gate first.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {approvedIdeas.map(idea => (
            <div key={idea.id} className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
              <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-black/30">
                <div>
                  <h3 className="font-bold text-lg">{idea.title}</h3>
                  <p className="text-xs text-zinc-500">Parent Concept</p>
                </div>
                {!idea.variants ? (
                  <button 
                    disabled={loadingId === idea.id}
                    onClick={() => handleGenerate(idea)}
                    className="bg-cyan-gradient text-white px-6 py-2 rounded font-black text-xs uppercase tracking-widest flex items-center gap-2"
                  >
                    {loadingId === idea.id ? 'THINKING...' : 'Generate 8 Variants'}
                  </button>
                ) : (
                  <span className="text-[10px] font-black text-cyan-400 uppercase border border-cyan-400/30 px-3 py-1 rounded">Variants Ready</span>
                )}
              </div>

              {idea.variants && (
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {idea.variants.map((variant, idx) => (
                    <div key={idx} className="p-4 bg-black border border-zinc-800 rounded-lg hover:border-zinc-600 transition-all flex flex-col h-full">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[9px] font-bold bg-zinc-800 px-2 py-0.5 rounded uppercase">{variant.format}</span>
                        <span className="text-[9px] text-zinc-500 font-mono">{Math.round(variant.confidence_score * 100)}%</span>
                      </div>
                      <h4 className="text-sm font-bold mb-2 text-white">{variant.title}</h4>
                      <p className="text-[11px] text-zinc-500 italic mb-4 flex-1">"{variant.hook}"</p>
                      <div className="mt-auto pt-4 border-t border-zinc-900 flex flex-wrap gap-1">
                        {variant.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-[8px] border border-zinc-800 px-1 rounded text-zinc-600">#{tag}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default IdeationEngine;
