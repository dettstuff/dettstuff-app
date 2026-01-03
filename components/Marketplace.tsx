
import React from 'react';
import { MarketplaceOffer } from '../types';

const Marketplace: React.FC = () => {
  const offers: MarketplaceOffer[] = [
    { id: '1', name: 'Premium Video Editor', provider: 'CutLab Studio', price: '$499/batch', description: 'Specialized in high-hook vertical video for approved AOCE concepts.' },
    { id: '2', name: 'Copywriting Normalizer', provider: 'VerbFlow AI', price: '$99/mo', description: 'Extra layer of deterministic review for all production briefs.' },
    { id: '3', name: 'Ads Management Pack', provider: 'Growth Engine', price: '$1500/mo', description: 'Deploy approved ideas directly to Meta/Google ad networks.' },
    { id: '4', name: 'SEO Strategy Audit', provider: 'RankMaster', price: '$750/audit', description: 'Full goal-alignment check for your top-performing ideas.' },
  ];

  return (
    <section className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold mb-1">Implementation Marketplace</h2>
        <p className="text-zinc-500">Accelerate your workflow with vetted services and add-ons.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {offers.map(offer => (
          <div key={offer.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl hover:bg-zinc-900/50 transition-all flex flex-col group">
            <div className="w-10 h-10 bg-zinc-800 rounded-lg mb-4 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg mb-1">{offer.name}</h3>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-3">{offer.provider}</p>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6 flex-1">{offer.description}</p>
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
              <span className="text-sm font-bold text-white">{offer.price}</span>
              <button className="text-[10px] font-black text-cyan-400 uppercase tracking-widest hover:text-white">Book Now</button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-cyan-gradient p-10 rounded-2xl flex flex-col md:flex-row items-center justify-between shadow-2xl shadow-cyan-500/20">
        <div className="mb-6 md:mb-0">
          <h3 className="text-2xl font-black text-black mb-2">Become a Partner</h3>
          <p className="text-black/70 font-medium">List your production services on the Workspace marketplace.</p>
        </div>
        <button className="bg-black text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:translate-y-[-2px] transition-transform">Apply Today</button>
      </div>
    </section>
  );
};

export default Marketplace;
