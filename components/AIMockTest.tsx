
import { GoogleGenAI, Type } from '@google/genai';
import React, { useEffect, useState } from 'react';
import { AIQuestion } from '../types.ts';

interface AIMockTestProps {
  topic: string;
  onClose: () => void;
}

export const AIMockTest: React.FC<AIMockTestProps> = ({ topic, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<AIQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generateQuestions();
  }, [topic]);

  const generateQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Accessing API Key directly from environment as per guidelines
      // In Vercel, ensure you have added "API_KEY" in project settings -> Environment Variables
      const apiKey = process.env.API_KEY;

      if (!apiKey) {
        throw new Error("API_KEY is undefined. Please ensure the environment variable is set in your Vercel project settings.");
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Topic: ${topic}. Generate 5 multiple-choice questions for the Kerala Junior Project Assistant (KSBCDC) exam.`,
        config: {
          systemInstruction: `You are an examiner for the Kerala PSC Junior Project Assistant exam. 
          Focus on accurate, exam-relevant content. 
          Return a JSON object with a "questions" array. 
          Each question MUST include: "question", "options" (4 items), "answerIndex" (0-3), and "explanation".`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    answerIndex: { type: Type.INTEGER },
                    explanation: { type: Type.STRING }
                  },
                  required: ['question', 'options', 'answerIndex', 'explanation']
                }
              }
            },
            required: ['questions']
          }
        }
      });

      // Correctly accessing the text property from GenerateContentResponse
      const text = response.text;
      if (!text) {
        throw new Error("AI service returned an empty response. This might be a transient connection issue.");
      }

      const data = JSON.parse(text);
      
      if (!data.questions || !Array.isArray(data.questions)) {
        throw new Error("Invalid response format from AI. Retrying may help.");
      }

      setQuestions(data.questions);
      setLoading(false);
    } catch (err: any) {
      console.error("AI Integration Error:", err);
      // Detailed error message for diagnostics on Vercel
      setError(err.message || "An unexpected network error occurred while connecting to Skyso AI.");
      setLoading(false);
    }
  };

  const handleSelect = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    if (index === questions[currentIndex].answerIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedAnswer(null);
    } else {
      setIsFinished(true);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
        <div className="w-12 h-12 border-4 border-indigo-100 dark:border-slate-800 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
        <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-1">Connecting to Skyso AI</h3>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Generating custom mock test for: <br/><span className="text-indigo-600 dark:text-indigo-400 font-bold">{topic}</span></p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-[100] bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-2xl flex items-center justify-center text-2xl mb-6">
            <i className="fas fa-wifi-slash"></i>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Connection Problem</h3>
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 mb-8 max-w-sm">
            <p className="text-slate-600 dark:text-slate-400 text-xs font-mono break-words leading-relaxed">{error}</p>
        </div>
        <div className="flex flex-col w-full max-w-xs gap-3">
            <button 
                onClick={generateQuestions} 
                className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95"
            >
                Retry Connection
            </button>
            <button 
                onClick={onClose} 
                className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-8 py-4 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
                Cancel
            </button>
        </div>
        <p className="mt-8 text-[10px] text-slate-400 font-medium max-w-xs">
            Tip: Ensure you've added the <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">API_KEY</code> environment variable to your Vercel project settings.
        </p>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="fixed inset-0 z-[100] bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
        <div className="w-20 h-20 bg-indigo-600 text-white rounded-[24px] flex items-center justify-center text-3xl mb-8 shadow-xl shadow-indigo-100 rotate-3">
            <i className="fas fa-graduation-cap"></i>
        </div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-1">Session Complete</h3>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-10">You got <span className="font-black text-indigo-600 dark:text-indigo-400">{score}</span> out of <span className="font-black text-slate-900 dark:text-slate-100">{questions.length}</span> correct.</p>
        <div className="w-full max-w-sm space-y-2">
            <button onClick={() => {
                setIsFinished(false);
                setCurrentIndex(0);
                setSelectedAnswer(null);
                setScore(0);
                generateQuestions();
            }} className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-100 active:scale-95 transition-all">New Questions</button>
            <button onClick={onClose} className="w-full bg-slate-900 dark:bg-slate-800 text-white dark:text-slate-100 py-4 rounded-xl font-bold transition-all">Done</button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 dark:bg-slate-950 flex flex-col h-screen md:max-w-2xl md:mx-auto md:shadow-2xl overflow-hidden animate-fadeIn transition-colors duration-300">
      <header className="p-5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 z-10 pt-[calc(1.25rem+var(--safe-top,0px))]">
        <div className="flex items-center gap-3">
            <button onClick={onClose} className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 flex items-center justify-center">
                <i className="fas fa-chevron-left text-sm"></i>
            </button>
            <div>
                <span className="block text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Mock Module</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate max-w-[150px] block">{topic}</span>
            </div>
        </div>
        <div className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold">
            {currentIndex + 1} / {questions.length}
        </div>
      </header>

      <div className="flex-1 p-6 overflow-y-auto space-y-6 pb-40 no-scrollbar">
        <div className="bg-white dark:bg-slate-900 p-7 rounded-[28px] shadow-sm border border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">{currentQ.question}</h2>
        </div>

        <div className="grid grid-cols-1 gap-3">
            {currentQ.options.map((opt, i) => (
                <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    disabled={selectedAnswer !== null}
                    className={`w-full p-5 rounded-[20px] text-left border-2 transition-all group relative ${
                        selectedAnswer === null 
                        ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-indigo-600 dark:hover:border-indigo-500' 
                        : i === currentQ.answerIndex 
                            ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-900 dark:text-emerald-400' 
                            : selectedAnswer === i 
                                ? 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-900 dark:text-red-400' 
                                : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 opacity-60'
                    }`}
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs border transition-colors ${
                            selectedAnswer === null ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700' : 
                            i === currentQ.answerIndex ? 'bg-emerald-500 border-emerald-500 text-white' :
                            selectedAnswer === i ? 'bg-red-500 border-red-500 text-white' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-600'
                        }`}>
                            {String.fromCharCode(65 + i)}
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-slate-200 flex-1 text-sm">{opt}</span>
                    </div>
                </button>
            ))}
        </div>

        {selectedAnswer !== null && (
            <div className="bg-indigo-600 rounded-[28px] p-6 text-white animate-fadeIn shadow-lg shadow-indigo-100">
                <div className="flex items-center gap-2 mb-3">
                    <i className="fas fa-lightbulb text-sm"></i>
                    <p className="text-[9px] font-black uppercase tracking-widest">Analysis</p>
                </div>
                <p className="text-sm leading-relaxed font-semibold">{currentQ.explanation}</p>
            </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 safe-bottom md:max-w-2xl md:mx-auto z-20 transition-colors duration-300">
        <button
            onClick={nextQuestion}
            disabled={selectedAnswer === null}
            className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg text-base ${
                selectedAnswer === null ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed' : 'bg-indigo-600 text-white'
            }`}
        >
            {currentIndex === questions.length - 1 ? 'Finish Test' : 'Next Question'}
        </button>
      </div>
    </div>
  );
};
