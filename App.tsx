
import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from './components/Layout.tsx';
import { Category, Task } from './types.ts';
import { STUDY_PLAN, MARK_DISTRIBUTION } from './constants.ts';
import { loadTasks, saveTasks } from './utils/storage.ts';
import { LinearProgressBar, CircularProgressBar } from './components/ProgressBar.tsx';
import { AIMockTest } from './components/AIMockTest.tsx';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [activeQuizTopic, setActiveQuizTopic] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
           (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

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

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

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
      <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 md:p-10 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none flex flex-col lg:flex-row items-center gap-10">
        <div className="relative">
            <CircularProgressBar progress={overallProgress} size={180} color="#4f46e5" />
            <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-lg border border-slate-50 dark:border-slate-700">
                <i className="fas fa-bolt text-yellow-500 text-xl"></i>
            </div>
        </div>
        <div className="flex-1 text-center lg:text-left space-y-6">
          <div>
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Focus on Your Goal</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg font-medium">Progress Tracker: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{Math.round(overallProgress)}%</span> of the syllabus covered.</p>
          </div>
          <div className="flex flex-wrap justify-center lg:justify-start gap-3">
             <button onClick={() => setActiveTab('studyplan')} className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 dark:shadow-none hover:scale-105 transition-transform">Continue Studying</button>
             <button onClick={() => setActiveQuizTopic('Kerala General Knowledge')} className="px-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Take Quick Quiz</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsByCategory.map(stat => (
          <div key={stat.category} className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl dark:hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 rounded-2xl" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                 <i className={`fas ${getCategoryIcon(stat.category)} text-xl`}></i>
              </div>
              <span className="text-2xl font-black text-slate-900 dark:text-slate-100">{stat.marks}m</span>
            </div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-lg mb-4">{stat.category}</h4>
            <LinearProgressBar progress={stat.progress} color={getBgColor(stat.color)} />
            <div className="flex justify-between items-center mt-4">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stat.completed}/{stat.totalTasks} Done</span>
                <span className="text-xs font-black text-slate-800 dark:text-slate-100">{Math.round(stat.progress)}%</span>
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
          <div className="flex items-center gap-6 sticky top-20 bg-[#f8fafc]/90 dark:bg-[#020617]/90 backdrop-blur-sm py-4 z-20">
            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-2xl">
              {week.week}
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{week.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Syllabus for Week {week.week}</p>
            </div>
          </div>

          <div className="space-y-4">
            {tasks.filter(t => t.week === week.week).map(task => (
              <div 
                key={task.id}
                className={`group bg-white dark:bg-slate-900 p-5 rounded-[28px] border transition-all duration-300 ${
                    task.isCompleted 
                    ? 'border-emerald-100 dark:border-emerald-900 bg-emerald-50/30 dark:bg-emerald-900/10' 
                    : 'border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-lg'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                  <div 
                    onClick={() => toggleTask(task.id)}
                    className={`shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                      task.isCompleted ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 dark:border-slate-700 group-hover:border-indigo-500'
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
                    <h4 className={`text-lg font-bold text-slate-800 dark:text-slate-200 transition-all ${task.isCompleted ? 'line-through opacity-40' : ''}`}>
                      {task.title}
                    </h4>
                    {task.description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">{task.description}</p>}
                  </div>

                  <div className="flex items-center gap-2 pt-2 sm:pt-0">
                    {task.resourceLink && (
                        <a href={task.resourceLink} target="_blank" rel="noopener noreferrer" 
                           className="h-10 px-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center gap-2 text-xs font-bold hover:bg-red-100 transition-colors">
                            <i className="fab fa-youtube"></i> Video
                        </a>
                    )}
                    <button 
                        onClick={(e) => { e.stopPropagation(); setActiveQuizTopic(task.title); }}
                        className="h-10 px-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-2 text-xs font-bold hover:bg-indigo-100 transition-colors">
                        <i className="fas fa-brain"></i> Mock
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
        <div className="bg-slate-900 dark:bg-slate-950 rounded-[40px] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl border dark:border-slate-800">
            <div className="relative z-10 max-w-lg space-y-4">
                <div className="inline-flex px-4 py-1.5 bg-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">Recommended Path</div>
                <h2 className="text-4xl font-black tracking-tight leading-none">Daily Study Routine</h2>
                <p className="text-slate-400 text-lg font-medium leading-relaxed">Ensure you cover the high-weightage Computer and GK modules daily.</p>
            </div>
            <div className="absolute top-0 right-0 p-12 opacity-5">
                <i className="fas fa-calendar-check text-[12rem]"></i>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 px-2">Core Schedule</h3>
                <div className="space-y-4">
                    {[
                        { title: 'Current Affairs', dur: '30 min', icon: 'fa-newspaper', color: 'text-red-500' },
                        { title: 'Computer Concepts', dur: '60 min', icon: 'fa-desktop', color: 'text-amber-500' },
                        { title: 'Main Subject Focus', dur: '90 min', icon: 'fa-book', color: 'text-indigo-500' },
                        { title: 'Daily Review', dur: '15 min', icon: 'fa-history', color: 'text-emerald-500' }
                    ].map((item, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center justify-between group transition-all">
                            <div className="flex items-center gap-5">
                                <div className={`w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center ${item.color} text-xl group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-all`}>
                                    <i className={`fas ${item.icon}`}></i>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-slate-100">{item.title}</h4>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 font-bold tracking-tight">{item.dur}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 px-2">AI Quiz Section</h3>
                <div className="bg-indigo-600 rounded-[32px] p-8 text-white space-y-6 shadow-xl">
                    <p className="font-bold text-indigo-100 text-lg">Generate a set of 5 questions based on your study plan to test your recall.</p>
                    <button 
                        onClick={() => setActiveQuizTopic('Kerala Junior Project Assistant Comprehensive')}
                        className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-black shadow-lg hover:bg-slate-50 transition-colors">
                        Launch Mock Test
                    </button>
                </div>
            </div>
        </div>
    </div>
  );

  const renderSyllabus = () => (
    <div className="max-w-6xl mx-auto space-y-12 animate-fadeIn">
        <div className="text-center space-y-4">
            <h2 className="text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-none">Exam Blueprint</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xl font-medium max-w-2xl mx-auto">Mark distribution based on official KSBCDC notification.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MARK_DISTRIBUTION.map((item, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                            <i className={`fas ${getCategoryIcon(item.category)}`}></i>
                        </div>
                        <div className="text-right">
                            <span className="block text-4xl font-black text-slate-900 dark:text-slate-100 leading-none">{item.marks}</span>
                            <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Marks</span>
                        </div>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-3 tracking-tight">{item.category}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-8">
                        This module accounts for {item.marks}% of your total score.
                    </p>
                    <button 
                        onClick={() => setActiveQuizTopic(item.category)}
                        className="flex items-center gap-2 text-xs font-black uppercase tracking-widest" style={{ color: item.color }}>
                        Practice Questions <i className="fas fa-arrow-right ml-2"></i>
                    </button>
                </div>
            ))}
        </div>
    </div>
  );

  const renderDeveloper = () => (
    <div className="max-w-4xl mx-auto py-10 px-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden relative">
        <div className="h-32 bg-slate-900 dark:bg-slate-950"></div>

        <div className="px-8 pb-12 -mt-16 relative z-10 text-center">
          <div className="inline-block p-1.5 bg-white dark:bg-slate-800 rounded-full shadow-lg mb-6">
            <img 
              src="https://i.ibb.co/3Y9f3hD6/Add-braces-for-2k-202601210025-modified.png" 
              alt="Akash Sankar" 
              className="w-32 h-32 rounded-full object-cover bg-slate-100 dark:bg-slate-800" 
            />
          </div>
          
          <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Akash Sankar</h2>
          <p className="text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest text-[10px] mt-2">Frontend Developer & Student</p>
          
          <p className="mt-8 text-slate-600 dark:text-slate-300 text-base leading-relaxed max-w-2xl mx-auto font-medium">
            I developed Skyso Edu to provide a practical and structured way for Kerala PSC aspirants to manage their study time. My focus is on building functional tools that solve real problems through clean code and simple design.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 max-w-md mx-auto">
            <a 
              href="https://www.instagram.com/akash.sankar._/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-3.5 rounded-2xl font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
            >
              <i className="fab fa-instagram"></i> Instagram
            </a>
            <a 
              href="https://x.com/AkashSankar20" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-3.5 rounded-2xl font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
            >
              <i className="fab fa-x-twitter"></i> Twitter (X)
            </a>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
            <div className="flex flex-wrap justify-center gap-2">
              {['React', 'Tailwind CSS', 'Gemini AI', 'Productivity Tools'].map(tech => (
                <span key={tech} className="px-4 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg text-xs font-bold border border-slate-100 dark:border-slate-700">
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
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}>
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
        case Category.COMPUTER: return 'text-amber-600 dark:text-amber-400';
        case Category.GK: return 'text-indigo-600 dark:text-indigo-400';
        case Category.MATHS: return 'text-emerald-600 dark:text-emerald-400';
        case Category.ENGLISH: return 'text-purple-600 dark:text-purple-400';
        case Category.LANGUAGE: return 'text-pink-600 dark:text-pink-400';
        case Category.CURRENT_AFFAIRS: return 'text-red-600 dark:text-red-400';
        default: return 'text-slate-600 dark:text-slate-400';
    }
}

const getBgColor = (hex: string) => {
    const map: Record<string, string> = {
        '#6366f1': 'bg-indigo-600 dark:bg-indigo-500',
        '#f59e0b': 'bg-amber-500 dark:bg-amber-400',
        '#ef4444': 'bg-red-500 dark:bg-red-400',
        '#10b981': 'bg-emerald-500 dark:bg-emerald-400',
        '#8b5cf6': 'bg-purple-500 dark:bg-purple-400',
        '#ec4899': 'bg-pink-500 dark:bg-pink-400',
    };
    return map[hex] || 'bg-slate-600';
}

export default App;
