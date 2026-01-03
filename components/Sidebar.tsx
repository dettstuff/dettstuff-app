
import React from 'react';
import { ICONS } from '../constants';

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: any) => void;
  isOpen: boolean;
  isMinimized: boolean;
  toggleMinimize: () => void;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeModule, 
  setActiveModule, 
  isOpen, 
  isMinimized, 
  toggleMinimize,
  onClose 
}) => {
  const menuItems = [
    { id: 'CGM', label: 'Goal Map', icon: ICONS.Goal },
    { id: 'CDF', label: 'Decision Gate', icon: ICONS.Decision },
    { id: 'AOCE', label: 'Ideation', icon: ICONS.Idea },
    { id: 'COT', label: 'Ops Pipeline', icon: ICONS.Production },
    { id: 'AIP', label: 'Analytics', icon: ICONS.Analytics },
    { id: 'MKT', label: 'Marketplace', icon: ICONS.Marketplace },
  ];

  const sidebarWidthClass = isMinimized ? 'w-20' : 'w-72';
  
  return (
    <aside className={`
      fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-black border-r border-zinc-900 transition-all duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      ${sidebarWidthClass}
    `}>
      {/* Sidebar Header */}
      <div className={`p-6 mb-4 flex items-center justify-between overflow-hidden ${isMinimized ? 'justify-center' : ''}`}>
        {!isMinimized && (
          <div className="text-xl font-black bg-cyan-gradient bg-clip-text text-transparent whitespace-nowrap">
            WORKSPACE
          </div>
        )}
        {isMinimized && (
          <div className="w-8 h-8 rounded bg-cyan-gradient flex-shrink-0" />
        )}
        
        <button 
          onClick={onClose}
          className="lg:hidden p-1 text-zinc-500 hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Navigation - Scrollable */}
      <nav className="flex-1 overflow-y-auto px-4 space-y-1 custom-scrollbar">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveModule(item.id)}
            title={isMinimized ? item.label : ''}
            className={`w-full flex items-center rounded-lg transition-all duration-200 group relative
              ${isMinimized ? 'justify-center px-0 py-3' : 'gap-3 px-4 py-3'}
              ${activeModule === item.id 
                ? 'bg-zinc-900 text-white shadow-lg' 
                : 'text-zinc-500 hover:text-white hover:bg-zinc-900/50'
              }
            `}
          >
            <span className={`flex-shrink-0 ${activeModule === item.id ? 'text-cyan-400' : 'text-zinc-600 group-hover:text-zinc-300'}`}>
              <item.icon />
            </span>
            
            {!isMinimized && (
              <span className="text-sm font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                {item.label}
              </span>
            )}
            
            {activeModule === item.id && isMinimized && (
              <div className="absolute left-0 w-1 h-6 bg-cyan-400 rounded-r-full" />
            )}
          </button>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className="mt-auto p-4 border-t border-zinc-900 bg-black">
        {/* User Info */}
        <div className={`flex items-center gap-3 mb-4 ${isMinimized ? 'justify-center' : 'px-2'}`}>
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold flex-shrink-0 border border-zinc-700">JD</div>
          {!isMinimized && (
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-white whitespace-nowrap text-ellipsis">John Doe</div>
              <div className="text-[10px] text-zinc-600 uppercase tracking-widest whitespace-nowrap text-ellipsis">Admin Role</div>
            </div>
          )}
        </div>

        {/* Desktop Minimize Toggle */}
        <button 
          onClick={toggleMinimize}
          className="hidden lg:flex w-full items-center justify-center p-2 text-zinc-600 hover:text-white hover:bg-zinc-900/50 rounded-lg transition-colors"
        >
          <svg 
            className={`w-5 h-5 transition-transform duration-300 ${isMinimized ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
