
import React, { useState } from 'react';
import { Goal } from '../types';

interface GoalMapProps {
  goals: Goal[];
  onAddGoal: (goal: Goal) => void;
}

const GoalMap: React.FC<GoalMapProps> = ({ goals, onAddGoal }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', metric: '', deadline: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newGoal: Goal = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      targetMetric: formData.metric,
      deadline: formData.deadline,
      createdAt: new Date().toISOString()
    };
    onAddGoal(newGoal);
    setIsAdding(false);
    setFormData({ title: '', description: '', metric: '', deadline: '' });
  };

  return (
    <section className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold mb-1">Onboarding Goal Map</h2>
          <p className="text-zinc-500">Define the core objectives that govern your content pipeline.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-cyan-500 hover:text-white transition-colors"
        >
          Create Goal
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Goal Title</label>
              <input 
                required
                className="w-full bg-black border border-zinc-800 rounded p-3 text-white focus:border-cyan-500 outline-none"
                placeholder="e.g., Scale Newsletter"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Target Metric</label>
              <input 
                required
                className="w-full bg-black border border-zinc-800 rounded p-3 text-white focus:border-cyan-500 outline-none"
                placeholder="e.g., 10k Subs"
                value={formData.metric}
                onChange={e => setFormData({...formData, metric: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Description</label>
            <textarea 
              required
              className="w-full bg-black border border-zinc-800 rounded p-3 text-white focus:border-cyan-500 outline-none h-24"
              placeholder="What are we trying to achieve?"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setIsAdding(false)} className="text-zinc-400 px-4">Cancel</button>
            <button type="submit" className="bg-cyan-gradient text-white px-8 py-2 rounded font-bold shadow-lg shadow-cyan-500/20">Save Strategy</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map(goal => (
          <div key={goal.id} className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-600 transition-colors cursor-default">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold">{goal.title}</h3>
              <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-1 rounded uppercase tracking-tighter">Active Goal</span>
            </div>
            <p className="text-sm text-zinc-400 mb-6 line-clamp-2">{goal.description}</p>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="text-cyan-400">KPI: {goal.targetMetric}</div>
              <div className="text-zinc-600">Created: {new Date(goal.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        ))}
        {goals.length === 0 && !isAdding && (
          <div className="col-span-2 py-20 border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center text-zinc-600">
            <p className="font-bold mb-2">No active goals found.</p>
            <p className="text-sm">Start by creating a strategy map.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default GoalMap;
