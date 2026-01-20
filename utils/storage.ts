
import { Task } from '../types';

const STORAGE_KEY = 'ace_exam_jpa_tasks';

export const saveTasks = (tasks: Task[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

export const loadTasks = (): Task[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
};

export const clearTasks = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
