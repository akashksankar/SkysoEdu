
import React from 'react';

interface ProgressBarProps {
  progress: number;
  label?: string;
  color?: string;
}

export const LinearProgressBar: React.FC<ProgressBarProps> = ({ progress, label, color = 'bg-indigo-600' }) => {
  return (
    <div className="w-full">
      {label && <div className="flex justify-between mb-1 text-sm font-medium text-gray-700 dark:text-slate-300">
        <span>{label}</span>
        <span>{Math.round(progress)}%</span>
      </div>}
      <div className="w-full bg-gray-200 dark:bg-slate-800 rounded-full h-2.5">
        <div 
          className={`${color} h-2.5 rounded-full transition-all duration-500 ease-out`} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export const CircularProgressBar: React.FC<ProgressBarProps & { size?: number }> = ({ progress, size = 120, color = '#4f46e5' }) => {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="10"
          fill="transparent"
          className="text-gray-100 dark:text-slate-800"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold text-gray-800 dark:text-slate-100">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};
