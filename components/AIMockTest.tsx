
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
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
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate 5 high-quality multiple choice questions in English for the Kerala Junior Project Assistant competitive exam specifically on the topic: "${topic}". 
        Include options, the correct answer index (0-3), and a brief explanation for each. 
        Focus on previous PSC exam patterns.`,
        config: {
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
                    answerIndex: { type: Type.NUMBER },
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

      const data = JSON.parse(response.text);
      setQuestions(data.questions);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to generate AI questions. Check your connection.");
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
      <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Skyso AI Preparing Test</h3>
        <p className="text-slate-500">Crafting challenging questions for {topic}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-8 text-center">
        <i className="fas fa-triangle-exclamation text-5xl text-red-500 mb-6"></i>
        <h3 className="text-2xl font-bold text-slate-800 mb-2">Oops!</h3>
        <p className="text-slate-500 mb-8">{error}</p>
        <button onClick={onClose} className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold">Go Back</button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-8 text-center">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mb-8">
            <i className="fas fa-trophy"></i>
        </div>
        <h3 className="text-3xl font-black text-slate-800 mb-2">Test Completed!</h3>
        <p className="text-xl text-slate-600 mb-8">Your score: <span className="font-bold text-indigo-600">{score} / {questions.length}</span></p>
        <div className="w-full max-w-sm space-y-3">
            <button onClick={() => {
                setIsFinished(false);
                setCurrentIndex(0);
                setSelectedAnswer(null);
                setScore(0);
                generateQuestions();
            }} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200">Retake New Test</button>
            <button onClick={onClose} className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold">Close Session</button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 flex flex-col h-screen md:max-w-2xl md:mx-auto md:shadow-2xl">
      <header className="p-6 bg-white border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><i className="fas fa-xmark text-xl"></i></button>
            <span className="font-bold text-slate-800">AI Quiz: {topic}</span>
        </div>
        <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold uppercase">
            Q {currentIndex + 1}/{questions.length}
        </div>
      </header>

      <div className="flex-1 p-6 overflow-y-auto space-y-6 pb-32">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 leading-snug">{currentQ.question}</h2>
        </div>

        <div className="space-y-3">
            {currentQ.options.map((opt, i) => (
                <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    className={`w-full p-5 rounded-2xl text-left border-2 transition-all font-medium ${
                        selectedAnswer === null 
                        ? 'bg-white border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30' 
                        : i === currentQ.answerIndex 
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900' 
                            : selectedAnswer === i 
                                ? 'bg-red-50 border-red-500 text-red-900' 
                                : 'bg-white border-slate-100 opacity-60'
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span>{opt}</span>
                        {selectedAnswer !== null && i === currentQ.answerIndex && <i className="fas fa-check-circle text-emerald-500"></i>}
                        {selectedAnswer === i && i !== currentQ.answerIndex && <i className="fas fa-times-circle text-red-500"></i>}
                    </div>
                </button>
            ))}
        </div>

        {selectedAnswer !== null && (
            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl animate-fadeIn">
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">Explanation</p>
                <p className="text-sm text-indigo-900/80 leading-relaxed font-medium">{currentQ.explanation}</p>
            </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t safe-bottom md:max-w-2xl md:mx-auto">
        <button
            onClick={nextQuestion}
            disabled={selectedAnswer === null}
            className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg ${
                selectedAnswer === null ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white shadow-indigo-200'
            }`}
        >
            {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
        </button>
      </div>
    </div>
  );
};
