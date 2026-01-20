
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', icon: 'fa-house', label: 'Home' },
    { id: 'studyplan', icon: 'fa-calendar-day', label: 'Plan' },
    { id: 'daily', icon: 'fa-bolt', label: 'Focus' },
    { id: 'syllabus', icon: 'fa-list-check', label: 'Syllabus' },
    { id: 'developer', icon: 'fa-address-card', label: 'Contact Dev' }
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f8fafc] text-slate-900">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200 h-screen sticky top-0">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100 transform -rotate-3">
              <i className="fas fa-rocket text-xl"></i>
            </div>
            <div>
              <h1 className="font-extrabold text-2xl tracking-tight text-slate-900 leading-none">Skyso Edu</h1>
              <p className="text-[10px] text-indigo-600 font-bold tracking-widest uppercase mt-1">Kerala JPA Elite</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
                activeTab === tab.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 font-semibold scale-105' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <i className={`fas ${tab.icon} text-lg`}></i>
              <span className="text-base">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6">
            <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-xs text-slate-400 mb-1 font-bold">NEXT MOCK TEST</p>
                    <p className="text-lg font-bold">Sunday, 10:00 AM</p>
                    <button className="mt-4 w-full bg-white/10 hover:bg-white/20 py-2 rounded-xl text-xs font-bold transition-all">Remind Me</button>
                </div>
                <div className="absolute -bottom-4 -right-4 text-white/5 transform rotate-12">
                    <i className="fas fa-clock text-7xl"></i>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Mobile Header */}
        <header className="md:hidden flex justify-between items-center px-6 py-5 bg-white border-b border-slate-100 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                <i className="fas fa-rocket text-sm"></i>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">Skyso Edu</span>
          </div>
          <div className="flex items-center gap-3">
             <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
                <i className="fas fa-magnifying-glass text-sm"></i>
             </button>
             <div className="w-10 h-10 rounded-full border-2 border-indigo-100 overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky" alt="avatar" />
             </div>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex h-20 items-center justify-between px-10 bg-[#f8fafc]/80 backdrop-blur-md sticky top-0 z-30">
            <h2 className="text-2xl font-bold text-slate-900 capitalize tracking-tight">{activeTab === 'developer' ? 'Contact Developer' : activeTab}</h2>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-sm">
                    <i className="fas fa-fire text-orange-500"></i>
                    <span className="font-bold text-sm text-slate-700">12 Day Streak</span>
                </div>
                <button className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                    <i className="fas fa-bell"></i>
                </button>
            </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto pb-24 md:pb-8 no-scrollbar">
          <div className="max-w-7xl mx-auto px-6 md:px-10 py-6">
            {children}
          </div>
        </main>

        {/* Mobile Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-100 flex justify-around py-3 px-6 z-50 safe-bottom">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${
                activeTab === tab.id ? 'text-indigo-600 scale-110' : 'text-slate-400'
              }`}
            >
              <div className={`w-12 h-1.5 rounded-full mb-1 transition-all ${activeTab === tab.id ? 'bg-indigo-600' : 'bg-transparent'}`}></div>
              <i className={`fas ${tab.icon} text-xl`}></i>
              <span className="text-[10px] font-bold tracking-tight">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};
