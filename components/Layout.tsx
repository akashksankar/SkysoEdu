
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, isDarkMode, toggleDarkMode }) => {
  const tabs = [
    { id: 'dashboard', icon: 'fa-house', label: 'Home' },
    { id: 'studyplan', icon: 'fa-calendar-day', label: 'Plan' },
    { id: 'daily', icon: 'fa-bolt', label: 'Focus' },
    { id: 'syllabus', icon: 'fa-list-check', label: 'Syllabus' },
    { id: 'developer', icon: 'fa-address-card', label: 'Contact Dev' }
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Sidebar - Desktop Only */}
      <aside className="hidden md:flex flex-col w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-100 transform -rotate-3">
              <i className="fas fa-rocket text-xl"></i>
            </div>
            <div>
              <h1 className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-slate-100 leading-none">Skyso Edu</h1>
              <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold tracking-widest uppercase mt-1">Kerala JPA Elite</p>
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
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none font-semibold scale-105' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <i className={`fas ${tab.icon} text-lg`}></i>
              <span className="text-base">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 space-y-4">
            {/* Theme Toggle Button Desktop */}
            <button 
                onClick={toggleDarkMode}
                className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-transparent dark:border-slate-700"
            >
                <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'} text-lg`}></i>
                <span className="text-base font-bold">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            <div className="bg-slate-900 dark:bg-slate-800 rounded-3xl p-6 text-white relative overflow-hidden border border-slate-800">
                <div className="relative z-10">
                    <p className="text-xs text-slate-400 mb-1 font-bold uppercase">Ready for JPA?</p>
                    <p className="text-lg font-bold">2024 Exam Target</p>
                </div>
                <div className="absolute -bottom-4 -right-4 text-white/5 transform rotate-12">
                    <i className="fas fa-graduation-cap text-7xl"></i>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Mobile Header */}
        <header className="md:hidden flex justify-between items-center px-6 py-5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 sticky top-0 z-40 pt-[calc(1.25rem+var(--safe-top,0px))] transition-colors duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                <i className="fas fa-rocket text-sm"></i>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-slate-100">Skyso Edu</span>
          </div>
          <div className="flex items-center gap-2">
             <button 
                onClick={toggleDarkMode}
                className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center border border-slate-100 dark:border-slate-700"
             >
                <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
             </button>
             <button className="w-10 h-10 rounded-full border-2 border-indigo-100 dark:border-slate-700 overflow-hidden active:opacity-70">
                <img src="https://i.ibb.co/3Y9f3hD6/Add-braces-for-2k-202601210025-modified.png" alt="avatar" />
             </button>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex h-20 items-center justify-between px-10 bg-[#f8fafc]/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 transition-colors duration-300">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 capitalize tracking-tight">
              {activeTab === 'developer' ? 'Contact Developer' : activeTab}
            </h2>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-2xl shadow-sm">
                    <i className="fas fa-fire text-orange-500"></i>
                    <span className="font-bold text-sm text-slate-700 dark:text-slate-300">12 Day Streak</span>
                </div>
            </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto pb-32 md:pb-10 no-scrollbar">
          <div className="max-w-7xl mx-auto px-6 md:px-10 py-6">
            {children}
          </div>
        </main>

        {/* Mobile Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-100 dark:border-slate-800 flex justify-around items-center px-4 z-50 safe-bottom h-[calc(4.5rem+var(--safe-bottom,0px))] transition-colors duration-300">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200 ${
                activeTab === tab.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-600'
              }`}
            >
              <div className={`w-8 h-1 rounded-full mb-1 transition-all ${activeTab === tab.id ? 'bg-indigo-600 dark:bg-indigo-400' : 'bg-transparent'}`}></div>
              <i className={`fas ${tab.icon} text-xl mb-1`}></i>
              <span className="text-[9px] font-black tracking-widest uppercase">{tab.label.split(' ')[0]}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};
