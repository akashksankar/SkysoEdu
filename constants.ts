
import { Category, StudyPlanData } from './types.ts';

export const STUDY_PLAN: StudyPlanData[] = [
  {
    week: 1,
    title: "Strong Base + Polity Start",
    tasks: [
      { category: Category.GK, title: "Kerala History", description: "Europeans arrival", resourceLink: "https://www.youtube.com/results?search_query=kerala+history+european+arrival+psc" },
      { category: Category.GK, title: "Travancore Rulers", description: "Marthanda Varma to Sree Chithira Thirunal", resourceLink: "https://www.youtube.com/results?search_query=travancore+history+marthanda+varma+psc" },
      { category: Category.GK, title: "Constitution Basics", description: "Preamble, Rights, DPSP", resourceLink: "https://www.youtube.com/results?search_query=indian+constitution+basics+psc" },
      { category: Category.COMPUTER, title: "Hardware/Software Basics", description: "I/O devices, Memory", resourceLink: "https://www.youtube.com/results?search_query=computer+hardware+software+basics+psc" },
      { category: Category.MATHS, title: "Numbers & Operations", description: "Basic series", resourceLink: "https://www.youtube.com/results?search_query=psc+maths+number+series" },
      { category: Category.ENGLISH, title: "Parts of Speech", description: "Articles", resourceLink: "https://www.youtube.com/results?search_query=psc+english+grammar+articles" },
      { category: Category.LANGUAGE, title: "Word Purity", description: "Sentence correctness", resourceLink: "https://www.youtube.com/results?search_query=kerala+psc+malayalam+sentence+correction" }
    ]
  },
  {
    week: 2,
    title: "Geography + Kerala Governance",
    tasks: [
      { category: Category.GK, title: "Physical Geography", description: "Earth structure, Atmosphere", resourceLink: "https://www.youtube.com/results?search_query=physical+geography+for+psc" },
      { category: Category.GK, title: "Kerala Governance", description: "Civil service, Welfare schemes", resourceLink: "https://www.youtube.com/results?search_query=kerala+governance+schemes+psc" },
      { category: Category.COMPUTER, title: "Internet Basics", description: "WWW, IP, URL, DNS", resourceLink: "https://www.youtube.com/results?search_query=internet+basics+computer+psc" },
      { category: Category.MATHS, title: "Percentage basics", description: "Fractions & Decimals", resourceLink: "https://www.youtube.com/results?search_query=percentage+problems+psc+maths" },
      { category: Category.ENGLISH, title: "Tenses & Prepositions", resourceLink: "https://www.youtube.com/results?search_query=psc+english+tenses+prepositions" }
    ]
  },
  {
    week: 3,
    title: "Indian History + Freedom Movement",
    tasks: [
      { category: Category.GK, title: "British Rule & 1857 War", resourceLink: "https://www.youtube.com/results?search_query=indian+history+1857+revolt+psc" },
      { category: Category.COMPUTER, title: "MS Word Basics", description: "Formatting, Templates", resourceLink: "https://www.youtube.com/results?search_query=ms+word+basics+for+psc+exam" },
      { category: Category.MATHS, title: "Ratio & Proportion", resourceLink: "https://www.youtube.com/results?search_query=ratio+and+proportion+psc+maths" },
      { category: Category.ENGLISH, title: "Active/Passive Voice", resourceLink: "https://www.youtube.com/results?search_query=active+passive+voice+psc+english" }
    ]
  },
  {
    week: 4,
    title: "Economics + Indian Polity Deep",
    tasks: [
      { category: Category.GK, title: "Economic Planning", description: "NITI Aayog", resourceLink: "https://www.youtube.com/results?search_query=niti+aayog+five+year+plans+psc" },
      { category: Category.GK, title: "Polity Amendments", description: "Important amendments", resourceLink: "https://www.youtube.com/results?search_query=important+amendments+indian+constitution+psc" },
      { category: Category.COMPUTER, title: "MS Excel Start", description: "Formulas, Filtering", resourceLink: "https://www.youtube.com/results?search_query=ms+excel+formulas+psc" },
      { category: Category.MATHS, title: "Profit & Loss", resourceLink: "https://www.youtube.com/results?search_query=profit+and+loss+psc+maths" }
    ]
  }
];

export const MARK_DISTRIBUTION = [
  { category: Category.GK, marks: 40, color: '#6366f1' },
  { category: Category.COMPUTER, marks: 20, color: '#f59e0b' },
  { category: Category.CURRENT_AFFAIRS, marks: 10, color: '#ef4444' },
  { category: Category.MATHS, marks: 10, color: '#10b981' },
  { category: Category.ENGLISH, marks: 10, color: '#8b5cf6' },
  { category: Category.LANGUAGE, marks: 10, color: '#ec4899' },
];
