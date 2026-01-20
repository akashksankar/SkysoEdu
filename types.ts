
export enum Category {
  COMPUTER = 'Computer Application',
  CURRENT_AFFAIRS = 'Current Affairs',
  MATHS = 'Maths & Mental Ability',
  ENGLISH = 'English',
  LANGUAGE = 'Regional Language',
  GK = 'General Knowledge',
  MOCK_TEST = 'Mock Test'
}

export interface Task {
  id: string;
  week: number;
  category: Category;
  title: string;
  description?: string;
  isCompleted: boolean;
  priority: 'High' | 'Medium' | 'Low';
  resourceLink?: string;
}

export interface StudyPlanData {
  week: number;
  title: string;
  tasks: {
    category: Category;
    title: string;
    description?: string;
    resourceLink?: string;
  }[];
}

export interface AIQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface UserStats {
  completedTasks: number;
  totalTasks: number;
  streak: number;
  lastActive: string | null;
}
