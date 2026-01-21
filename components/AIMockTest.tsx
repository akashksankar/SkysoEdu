
import { GoogleGenAI, Type } from '@google/genai';
import React, { useEffect, useState } from 'react';
import { AIQuestion } from '../types';

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
      
      // Ensure the API key is accessed safely in browser environments
      // Some environments might not have 'process' defined globally
      const env = (typeof process !== 'undefined') ? process.env : (window as any).process?.env;
      const apiKey = env?.API_KEY;
      
      if (!apiKey) {
        throw new Error("API_KEY is not defined in the environment. Please add it to your Vercel/Deployment settings.");
      }

      // Initialize the SDK as required
      const ai = new GoogleGenAI({ apiKey });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Topic: ${topic}. Task: Generate 5 multiple-choice questions for the Kerala Junior Project Assistant exam.`,
        config: {
          systemInstruction: `You are an expert examiner for the Kerala State Backward Classes Development Corporation (KSBCDC) Junior Project Assistant exam. 
          Your goal is to provide high-quality, high-difficulty questions relevant to the Kerala PSC pattern.
          Return the response as a JSON object with a "questions" array. 
          Each question must have: "question", "options" (array of 4 strings), "answerIndex" (number 0-3), and "explanation" (string).`,
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
                    options: { 
                      type: Type.ARRAY, 
                      items: { type: Type.STRING } 
                    },
                    answerIndex: { 
                      type: Type.INTEGER,
                      description: "Correct option index (0-3)"
                    },
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

      const text = response.text;
      if (!text) {
        throw new Error("The AI returned an empty response. This might be a temporary service glitch.");
      }

      // Clean markdown if the model wrapped the JSON in code blocks
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(cleanJson);
      
      if (!data.questions || !Array.isArray(data.questions)) {
        throw new Error("Invalid question format received. Please try again.");
      }

      setQuestions(data.questions);
      setLoading(false);
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      // Extract as much useful info as possible for the user
      const message = err.message || "An unknown error occurred while connecting to the AI service.";
      setError(message);
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
      <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
        <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <i className="fas fa-brain text-indigo-600 text-xl animate-pulse"></i>
            </div>
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-2">Skyso AI is Thinking...</h3>
        <p className="text-slate-500 font-medium">Preparing questions for: <br/><span className="text-indigo-600 font-bold">{topic}</span></p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center text-3xl mb-6">
            <i className="fas fa-triangle-exclamation"></i>
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-2">Connection Error</h3>
        <p className="text-slate-500 mb-8 max-w-sm font-medium text-sm overflow-hidden text-ellipsis px-4">
          {error}
        </p>
        <div className="flex flex-col w-full max-w-xs gap-3 px-4">
            <button onClick={generateQuestions} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 active:scale-95 transition-all">Retry Generation</button>
            <button onClick={onClose} className="bg-slate-100 text-slate-600 px-8 py-4 rounded-2xl font-black active:scale-95 transition-all">Go Back Home</button>
        </div>
        <p className="mt-8 text-[10px] text-slate-400 font-bold uppercase tracking-widest">Tip: Ensure API_KEY is set in Vercel Settings</p>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
        <div className="w-24 h-24 bg-indigo-600 text-white rounded-[32px] flex items-center justify-center text-4xl mb-8 shadow-2xl shadow-indigo-200 rotate-6">
            <i className="fas fa-trophy"></i>
        </div>
        <h3 className="text-3xl font-black text-slate-900 mb-2">Test Over!</h3>
        <p className="text-xl text-slate-600 mb-10">You scored <span className="font-black text-indigo-600">{score}</span> out of <span className="font-black">{questions.length}</span></p>
        <div className="w-full max-w-sm space-y-3 px-4">
            <button onClick={() => {
                setIsFinished(false);
                setCurrentIndex(0);
                setSelectedAnswer(null);
                setScore(0);
                generateQuestions();
            }} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 active:scale-95 transition-all">Try New Questions</button>
            <button onClick={onClose} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black active:scale-95 transition-all">Finish Session</button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 flex flex-col h-screen md:max-w-2xl md:mx-auto md:shadow-2xl overflow-hidden animate-fadeIn">
      <header className="p-6 bg-white border-b flex items-center justify-between sticky top-0 z-10 pt-[calc(1.5rem+var(--safe-top,0px))]">
        <div className="flex items-center gap-4">
            <button onClick={onClose} className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:text-slate-900 transition-colors">
                <i className="fas fa-arrow-left"></i>
            </button>
            <div>
                <span className="block text-[10px] font-black text-indigo-600 uppercase tracking-widest">Topic Mastery</span>
                <span className="font-bold text-slate-900 truncate max-w-[150px] block">{topic}</span>
            </div>
        </div>
        <div className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black">
            {currentIndex + 1} / {questions.length}
        </div>
      </header>

      <div className="flex-1 p-6 overflow-y-auto space-y-6 pb-40 no-scrollbar">
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
            <h2 className="text-xl font-black text-slate-900 leading-tight">{currentQ.question}</h2>
        </div>

        <div className="grid grid-cols-1 gap-3">
            {currentQ.options.map((opt, i) => (
                <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    disabled={selectedAnswer !== null}
                    className={`w-full p-6 rounded-[24px] text-left border-2 transition-all group relative ${
                        selectedAnswer === null 
                        ? 'bg-white border-slate-100 hover:border-indigo-600 hover:shadow-lg' 
                        : i === currentQ.answerIndex 
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900' 
                            : selectedAnswer === i 
                                ? 'bg-red-50 border-red-500 text-red-900' 
                                : 'bg-white border-slate-100 opacity-60'
                    }`}
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs border transition-colors ${
                            selectedAnswer === null ? 'bg-slate-50 border-slate-200 group-hover:bg-indigo-600 group-hover:text-white' : 
                            i === currentQ.answerIndex ? 'bg-emerald-500 border-emerald-500 text-white' :
                            selectedAnswer === i ? 'bg-red-500 border-red-500 text-white' : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}>
                            {String.fromCharCode(65 + i)}
                        </div>
                        <span className="font-bold text-slate-800 flex-1">{opt}</span>
                    </div>
                </button>
            ))}
        </div>

        {selectedAnswer !== null && (
            <div className="bg-indigo-600 rounded-[32px] p-8 text-white animate-fadeIn shadow-xl shadow-indigo-100 border border-indigo-500">
                <div className="flex items-center gap-2 mb-4">
                    <i className="fas fa-lightbulb"></i>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">Detailed Explanation</p>
                </div>
                <p className="text-base leading-relaxed font-bold">{currentQ.explanation}</p>
            </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t safe-bottom md:max-w-2xl md:mx-auto z-20">
        <button
            onClick={nextQuestion}
            disabled={selectedAnswer === null}
            className={`w-full py-5 rounded-[24px] font-black transition-all shadow-xl text-lg ${
                selectedAnswer === null ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white shadow-indigo-200 active:scale-95'
            }`}
        >
            {currentIndex === questions.length - 1 ? 'See Results' : 'Next Question'}
        </button>
      </div>
    </div>
  );
};
