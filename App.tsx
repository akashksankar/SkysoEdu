
import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from './components/Layout';
import { Category, Task } from './types';
import { STUDY_PLAN, MARK_DISTRIBUTION } from './constants';
import { loadTasks, saveTasks } from './utils/storage';
import { LinearProgressBar, CircularProgressBar } from './components/ProgressBar';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { AIMockTest } from './components/AIMockTest';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [activeQuizTopic, setActiveQuizTopic] = useState<string | null>(null);

  useEffect(() => {
    const saved = loadTasks();
    if (saved.length > 0) {
      setTasks(saved);
    } else {
      const initialTasks: Task[] = [];
      STUDY_PLAN.forEach(weekData => {
        weekData.tasks.forEach((t, i) => {
          initialTasks.push({
            id: `w${weekData.week}-t${i}`,
            week: weekData.week,
            category: t.category,
            title: t.title,
            description: t.description,
            isCompleted: false,
            priority: i < 3 ? 'High' : 'Medium',
            resourceLink: t.resourceLink
          });
        });
      });
      setTasks(initialTasks);
      saveTasks(initialTasks);
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      saveTasks(tasks);
    }
  }, [tasks, initialized]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  const overallProgress = useMemo(() => {
    if (tasks.length === 0) return 0;
    return (tasks.filter(t => t.isCompleted).length / tasks.length) * 100;
  }, [tasks]);

  const statsByCategory = useMemo(() => {
    return MARK_DISTRIBUTION.map(cat => {
      const catTasks = tasks.filter(t => t.category === cat.category);
      const completed = catTasks.filter(t => t.isCompleted).length;
      return {
        ...cat,
        totalTasks: catTasks.length,
        completed,
        progress: catTasks.length > 0 ? (completed / catTasks.length) * 100 : 0
      };
    });
  }, [tasks]);

  const renderDashboard = () => (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-white rounded-[32px] p-8 md:p-10 border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col lg:flex-row items-center gap-10">
        <div className="relative">
            <CircularProgressBar progress={overallProgress} size={180} color="#4f46e5" />
            <div className="absolute -bottom-2 -right-2 bg-white p-3 rounded-2xl shadow-lg border border-slate-50">
                <i className="fas fa-bolt text-yellow-500 text-xl"></i>
            </div>
        </div>
        <div className="flex-1 text-center lg:text-left space-y-6">
          <div>
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Level Up, Aspirant!</h3>
            <p className="text-slate-500 mt-3 text-lg font-medium">You've mastered <span className="text-indigo-600 font-bold">{Math.round(overallProgress)}%</span> of the Junior Project Assistant syllabus.</p>
          </div>
          <div className="flex flex-wrap justify-center lg:justify-start gap-3">
             <button onClick={() => setActiveTab('studyplan')} className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:scale-105 transition-transform">Continue Plan</button>
             <button onClick={() => setActiveQuizTopic('Kerala General Knowledge')} className="px-8 py-3 bg-slate-100 text-slate-900 rounded-2xl font-bold hover:bg-slate-200 transition-colors">Start AI Test</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsByCategory.map(stat => (
          <div key={stat.category} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 rounded-2xl" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                 <i className={`fas ${getCategoryIcon(stat.category)} text-xl`}></i>
              </div>
              <span className="text-2xl font-black text-slate-900">{stat.marks}m</span>
            </div>
            <h4 className="font-bold text-slate-800 text-lg mb-4">{stat.category}</h4>
            <LinearProgressBar progress={stat.progress} color={getBgColor(stat.color)} />
            <div className="flex justify-between items-center mt-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.completed}/{stat.totalTasks} Done</span>
                <span className="text-xs font-black text-slate-800">{Math.round(stat.progress)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStudyPlan = () => (
    <div className="space-y-12 animate-fadeIn max-w-4xl mx-auto">
      {STUDY_PLAN.map(week => (
        <section key={week.week} className="space-y-6">
          <div className="flex items-center gap-6 sticky top-20 bg-[#f8fafc]/90 backdrop-blur-sm py-4 z-20">
            <div className="w-16 h-16 bg-white rounded-3xl border border-slate-200 shadow-sm flex items-center justify-center text-indigo-600 font-black text-2xl rotate-3">
              {week.week}
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{week.title}</h3>
              <p className="text-slate-500 font-medium">Weekly syllabus for Junior Project Assistant.</p>
            </div>
          </div>

          <div className="space-y-4">
            {tasks.filter(t => t.week === week.week).map(task => (
              <div 
                key={task.id}
                className={`group bg-white p-5 rounded-[28px] border transition-all duration-300 ${
                    task.isCompleted 
                    ? 'border-emerald-100 bg-emerald-50/30' 
                    : 'border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/50'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                  <div 
                    onClick={() => toggleTask(task.id)}
                    className={`shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                      task.isCompleted ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 group-hover:border-indigo-500'
                    }`}
                  >
                    {task.isCompleted && <i className="fas fa-check text-[12px] text-white"></i>}
                  </div>
                  
                  <div className="flex-1" onClick={() => toggleTask(task.id)}>
                    <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-extrabold uppercase tracking-widest ${getCategoryTextColor(task.category)}`}>
                            {task.category}
                        </span>
                    </div>
                    <h4 className={`text-lg font-bold text-slate-800 transition-all ${task.isCompleted ? 'line-through opacity-40' : ''}`}>
                      {task.title}
                    </h4>
                    {task.description && <p className="text-sm text-slate-500 mt-1 font-medium">{task.description}</p>}
                  </div>

                  <div className="flex items-center gap-2 pt-2 sm:pt-0">
                    {task.resourceLink && (
                        <a href={task.resourceLink} target="_blank" rel="noopener noreferrer" 
                           className="h-12 px-4 rounded-xl bg-red-50 text-red-600 flex items-center justify-center gap-2 text-xs font-bold hover:bg-red-100 transition-colors">
                            <i className="fab fa-youtube"></i> Study
                        </a>
                    )}
                    <button 
                        onClick={(e) => { e.stopPropagation(); setActiveQuizTopic(task.title); }}
                        className="h-12 px-4 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center gap-2 text-xs font-bold hover:bg-indigo-100 transition-colors">
                        <i className="fas fa-brain"></i> AI Test
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );

  const renderDailyFocus = () => (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
        <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-lg space-y-4">
                <div className="inline-flex px-4 py-1.5 bg-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">Active Focus</div>
                <h2 className="text-4xl font-black tracking-tight leading-none">Daily High-Power Routine</h2>
                <p className="text-slate-400 text-lg font-medium leading-relaxed">Touch the 20-mark Computer module every single day to guarantee your success.</p>
                <div className="pt-4 flex items-center gap-6">
                    <div>
                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">GOAL</p>
                        <p className="text-xl font-bold">180 Mins</p>
                    </div>
                    <div className="w-px h-10 bg-slate-800"></div>
                    <div>
                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">INTENSITY</p>
                        <p className="text-xl font-bold">High</p>
                    </div>
                </div>
            </div>
            <div className="absolute top-0 right-0 p-12 opacity-10">
                <i className="fas fa-bolt text-[12rem]"></i>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <h3 className="text-xl font-black text-slate-900 px-2">Fixed Routine</h3>
                <div className="space-y-4">
                    {[
                        { title: 'Current Affairs', dur: '30 min', icon: 'fa-newspaper', color: 'text-red-500' },
                        { title: 'Computer Modules', dur: '60 min', icon: 'fa-desktop', color: 'text-amber-500' },
                        { title: 'Core Subject (GK/Math)', dur: '90 min', icon: 'fa-book-quran', color: 'text-indigo-500' },
                        { title: 'Revision & Error Log', dur: '10 min', icon: 'fa-clock-rotate-left', color: 'text-emerald-500' }
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50/50 transition-all">
                            <div className="flex items-center gap-5">
                                <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center ${item.color} text-xl group-hover:bg-indigo-50 group-hover:scale-110 transition-all`}>
                                    <i className={`fas ${item.icon}`}></i>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                                    <p className="text-xs text-slate-400 font-bold tracking-tight">{item.dur}</p>
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-emerald-500 group-hover:border-emerald-200">
                                <i className="fas fa-check"></i>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-xl font-black text-slate-900 px-2">AI Daily Challenge</h3>
                <div className="bg-indigo-600 rounded-[32px] p-8 text-white space-y-6 shadow-xl shadow-indigo-200">
                    <p className="font-bold text-indigo-100 text-lg">Test your knowledge with Skyso AI's randomized mock questions.</p>
                    <button 
                        onClick={() => setActiveQuizTopic('Daily General Challenge')}
                        className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-black shadow-lg shadow-indigo-700/50 hover:bg-slate-50 transition-colors">
                        Launch AI Mock Test
                    </button>
                </div>
            </div>
        </div>
    </div>
  );

  const renderSyllabus = () => (
    <div className="max-w-6xl mx-auto space-y-12 animate-fadeIn">
        <div className="text-center space-y-6">
            <h2 className="text-5xl font-black text-slate-900 tracking-tight leading-none">The Blueprint</h2>
            <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto">Rank-focused distribution based on the official Kerala KSBCDC notification.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MARK_DISTRIBUTION.map((item, idx) => (
                <div key={idx} className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                    <div className="absolute -right-4 -top-4 w-32 h-32 rounded-full opacity-[0.03] transition-transform group-hover:scale-150" style={{ backgroundColor: item.color }}></div>
                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                            <i className={`fas ${getCategoryIcon(item.category)}`}></i>
                        </div>
                        <div className="text-right">
                            <span className="block text-4xl font-black text-slate-900 leading-none">{item.marks}</span>
                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Weightage</span>
                        </div>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">{item.category}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium mb-8">
                        AI-mock sessions are available for every topic in this module.
                    </p>
                    <button 
                        onClick={() => setActiveQuizTopic(item.category)}
                        className="flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all group-hover:gap-4" style={{ color: item.color }}>
                        Practice Topic <i className="fas fa-arrow-right"></i>
                    </button>
                </div>
            ))}
        </div>
    </div>
  );

  const renderDeveloper = () => (
    <div className="max-w-4xl mx-auto py-10 px-4 animate-fadeIn">
      <div className="bg-white rounded-[48px] shadow-2xl shadow-indigo-100 border border-slate-100 overflow-hidden relative">
        <div className="h-48 bg-gradient-to-r from-indigo-600 to-purple-700 relative">
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
        </div>

        <div className="px-8 pb-12 -mt-20 relative z-10 text-center">
          <div className="inline-block p-2 bg-white rounded-[40px] shadow-xl mb-6">
            <img 
              src="https://i.ibb.co/3Y9f3hD6/Add-braces-for-2k-202601210025-modified.png" 
              alt="Akash Sankar" 
              className="w-40 h-40 rounded-[32px] object-cover bg-slate-100 border-4 border-white" 
            />
          </div>
          
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Akash Sankar</h2>
          <p className="text-indigo-600 font-bold uppercase tracking-widest text-xs mt-2">World-Class Frontend Engineer & UI/UX Expert</p>
          
          <p className="mt-8 text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto font-medium">
            Building Skyso Edu to revolutionize how competitive exam aspirants track their progress. My goal is to combine aesthetics with powerful AI to make learning more efficient and engaging.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 max-w-xl mx-auto">
            <a 
              href="https://www.instagram.com/akash.sankar._/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-pink-100 hover:scale-105 transition-all"
            >
              <i className="fab fa-instagram text-xl"></i> Instagram
            </a>
            <a 
              href="https://x.com/AkashSankar20" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-slate-900 text-white py-4 rounded-2xl font-black shadow-lg shadow-slate-200 hover:scale-105 transition-all"
            >
              <i className="fab fa-x-twitter text-xl"></i> Twitter (X)
            </a>
          </div>

          <div className="mt-12 pt-12 border-t border-slate-100">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Connect for Collaborations</h4>
            <div className="flex flex-wrap justify-center gap-3">
              {['React', 'Gemini AI', 'Tailwind', 'Product Design'].map(tech => (
                <span key={tech} className="px-4 py-2 bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border border-slate-100">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'studyplan' && renderStudyPlan()}
      {activeTab === 'daily' && renderDailyFocus()}
      {activeTab === 'syllabus' && renderSyllabus()}
      {activeTab === 'developer' && renderDeveloper()}

      {activeQuizTopic && (
          <AIMockTest topic={activeQuizTopic} onClose={() => setActiveQuizTopic(null)} />
      )}
    </Layout>
  );
};

const getCategoryIcon = (cat: Category) => {
    switch (cat) {
        case Category.COMPUTER: return 'fa-desktop';
        case Category.GK: return 'fa-landmark';
        case Category.MATHS: return 'fa-calculator';
        case Category.ENGLISH: return 'fa-font';
        case Category.LANGUAGE: return 'fa-pen-clip';
        case Category.CURRENT_AFFAIRS: return 'fa-newspaper';
        default: return 'fa-book';
    }
}

const getCategoryTextColor = (cat: Category) => {
    switch (cat) {
        case Category.COMPUTER: return 'text-amber-600';
        case Category.GK: return 'text-indigo-600';
        case Category.MATHS: return 'text-emerald-600';
        case Category.ENGLISH: return 'text-purple-600';
        case Category.LANGUAGE: return 'text-pink-600';
        case Category.CURRENT_AFFAIRS: return 'text-red-600';
        default: return 'text-slate-600';
    }
}

const getBgColor = (hex: string) => {
    const map: Record<string, string> = {
        '#6366f1': 'bg-indigo-600',
        '#f59e0b': 'bg-amber-500',
        '#ef4444': 'bg-red-500',
        '#10b981': 'bg-emerald-500',
        '#8b5cf6': 'bg-purple-500',
        '#ec4899': 'bg-pink-500',
    };
    return map[hex] || 'bg-slate-600';
}

export default App;
