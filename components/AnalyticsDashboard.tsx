
import React from 'react';
import { AnalyticsEvent } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';

interface AnalyticsDashboardProps {
  events: AnalyticsEvent[];
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ events }) => {
  // Aggregate events by type for visualization
  const typeDistribution = events.reduce((acc: any[], event) => {
    const existing = acc.find(a => a.name === event.type);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: event.type, value: 1 });
    }
    return acc;
  }, []);

  // Timeline of activity
  const timelineData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString();
    const count = events.filter(e => new Date(e.timestamp).toLocaleDateString() === dateStr).length;
    return { name: dateStr, count };
  }).reverse();

  return (
    <section className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold mb-1">Analytics & Insight Pack</h2>
        <p className="text-zinc-500">Real-time telemetry of your content machine's efficiency.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <h4 className="text-[10px] font-black uppercase text-zinc-500 mb-4 tracking-widest">Total Events Emitted</h4>
          <div className="text-4xl font-black text-white">{events.length}</div>
          <div className="mt-2 text-xs text-cyan-400 font-bold">+12% from last session</div>
        </div>
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <h4 className="text-[10px] font-black uppercase text-zinc-500 mb-4 tracking-widest">System Up-time</h4>
          <div className="text-4xl font-black text-white">99.9%</div>
          <div className="mt-2 text-xs text-green-500 font-bold">Stable Connection</div>
        </div>
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <h4 className="text-[10px] font-black uppercase text-zinc-500 mb-4 tracking-widest">Decision Latency</h4>
          <div className="text-4xl font-black text-white">1.2s</div>
          <div className="mt-2 text-xs text-zinc-600 font-bold">Avg. LLM Response</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 h-[400px] flex flex-col">
          <h4 className="text-[10px] font-black uppercase text-zinc-400 mb-8 tracking-widest">Event Type Distribution</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={typeDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
              <XAxis dataKey="name" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', border: '1px solid #1f1f1f', borderRadius: '8px' }}
                itemStyle={{ color: '#00D1FF' }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {typeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#00D1FF' : '#ffffff'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 h-[400px] flex flex-col">
          <h4 className="text-[10px] font-black uppercase text-zinc-400 mb-8 tracking-widest">Activity Timeline (7D)</h4>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D1FF" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00D1FF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" hide />
              <Tooltip 
                 contentStyle={{ backgroundColor: '#000', border: '1px solid #1f1f1f', borderRadius: '8px' }}
              />
              <Area type="monotone" dataKey="count" stroke="#00D1FF" fillOpacity={1} fill="url(#colorCount)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 bg-black/30">
          <h4 className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Raw Event Stream</h4>
        </div>
        <div className="divide-y divide-zinc-800 max-h-[300px] overflow-y-auto">
          {events.map(event => (
            <div key={event.id} className="p-4 flex justify-between items-center text-[11px] font-mono">
              <span className="text-zinc-600">[{new Date(event.timestamp).toLocaleTimeString()}]</span>
              <span className="text-cyan-400 font-bold uppercase">{event.type}</span>
              <span className="text-zinc-500 truncate max-w-[200px]">{JSON.stringify(event.payload)}</span>
              <span className="text-zinc-700">{event.eventId}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnalyticsDashboard;
