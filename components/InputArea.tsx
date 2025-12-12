/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useCallback, useState, useEffect, useRef } from 'react';
import { ArrowUpTrayIcon, SparklesIcon, CpuChipIcon, BoltIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface InputAreaProps {
  onGenerate: (prompt: string, file?: File, model?: string) => void;
  isGenerating: boolean;
  disabled?: boolean;
}

const SUGGESTIONS = [
    "Retro Snake Game",
    "Scientific Calculator",
    "Pomodoro Timer",
    "Expense Tracker"
];

const CyclingText = () => {
    const words = [
        "a napkin sketch",
        "a chaotic whiteboard",
        "a game level design",
        "a sci-fi interface",
        "a diagram of a machine",
        "an ancient scroll"
    ];
    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false); // fade out
            setTimeout(() => {
                setIndex(prev => (prev + 1) % words.length);
                setFade(true); // fade in
            }, 500); // Wait for fade out
        }, 3000); // Slower cycle to read longer text
        return () => clearInterval(interval);
    }, [words.length]);

    return (
        <span className={`inline-block whitespace-nowrap transition-all duration-500 transform ${fade ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-2 blur-sm'} text-white font-medium pb-1 border-b-2 border-blue-500/50`}>
            {words[index]}
        </span>
    );
};

export const InputArea: React.FC<InputAreaProps> = ({ onGenerate, isGenerating, disabled = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [useFlash, setUseFlash] = useState(false); // Default to Pro
  const [prompt, setPrompt] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/') || file.type === 'application/pdf') {
      onGenerate(prompt, file, useFlash ? 'gemini-2.5-flash' : 'gemini-3-pro-preview');
      setPrompt(""); // Clear prompt after send
    } else {
      alert("Please upload an image or PDF.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
    }
  };

  const handleTextSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    onGenerate(prompt, undefined, useFlash ? 'gemini-2.5-flash' : 'gemini-3-pro-preview');
    setPrompt("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
    onGenerate(suggestion, undefined, useFlash ? 'gemini-2.5-flash' : 'gemini-3-pro-preview');
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isGenerating) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [disabled, isGenerating, useFlash, prompt]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled && !isGenerating) {
        setIsDragging(true);
    }
  }, [disabled, isGenerating]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleContainerClick = (e: React.MouseEvent) => {
      // Prevent file dialog if clicking textarea or button
      const target = e.target as HTMLElement;
      if (target.tagName === 'TEXTAREA' || target.tagName === 'BUTTON' || target.closest('button') || target.closest('textarea')) {
          return;
      }
      fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-4xl mx-auto perspective-1000 relative">
      {/* Model Toggle Switch */}
      <div className="absolute -top-12 right-0 flex items-center space-x-2 bg-zinc-900/50 backdrop-blur-sm p-1 rounded-full border border-zinc-800 z-20">
            <button
                onClick={() => setUseFlash(false)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${!useFlash ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                title="Best for complex UI and logic"
            >
                <SparklesIcon className="w-3 h-3" />
                <span>Pro 3.0</span>
            </button>
            <button
                onClick={() => setUseFlash(true)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${useFlash ? 'bg-blue-900/30 text-blue-400 border border-blue-500/30 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                title="Best for speed"
            >
                <BoltIcon className="w-3 h-3" />
                <span>Flash 2.5</span>
            </button>
      </div>

      <div 
        className={`relative group transition-all duration-300 ${isDragging ? 'scale-[1.01]' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div
          className={`
            relative flex flex-col items-center justify-between
            min-h-[20rem] md:min-h-[22rem]
            bg-zinc-900/30 
            backdrop-blur-sm
            rounded-xl border border-dashed
            cursor-pointer overflow-hidden
            transition-all duration-300
            ${isDragging 
              ? 'border-blue-500 bg-zinc-900/50 shadow-[inset_0_0_20px_rgba(59,130,246,0.1)]' 
              : 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900/40'
            }
            ${isGenerating ? 'pointer-events-none' : ''}
          `}
          onClick={handleContainerClick}
        >
            {/* Technical Grid Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px'}}>
            </div>
            
            {/* Corner Brackets */}
            <div className={`absolute top-4 left-4 w-4 h-4 border-l-2 border-t-2 transition-colors duration-300 ${isDragging ? 'border-blue-500' : 'border-zinc-600'}`}></div>
            <div className={`absolute top-4 right-4 w-4 h-4 border-r-2 border-t-2 transition-colors duration-300 ${isDragging ? 'border-blue-500' : 'border-zinc-600'}`}></div>
            <div className={`absolute bottom-4 left-4 w-4 h-4 border-l-2 border-b-2 transition-colors duration-300 ${isDragging ? 'border-blue-500' : 'border-zinc-600'}`}></div>
            <div className={`absolute bottom-4 right-4 w-4 h-4 border-r-2 border-b-2 transition-colors duration-300 ${isDragging ? 'border-blue-500' : 'border-zinc-600'}`}></div>

            {/* Visual Content Center (Non-interactive mostly) */}
            <div className="relative z-10 flex flex-col items-center text-center space-y-6 md:space-y-8 p-6 md:p-8 w-full flex-1 justify-center pointer-events-none">
                <div className={`relative w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center transition-transform duration-500 ${isDragging ? 'scale-110' : 'group-hover:-translate-y-1'}`}>
                    <div className={`absolute inset-0 rounded-2xl bg-zinc-800 border border-zinc-700 shadow-xl flex items-center justify-center ${isGenerating ? 'animate-pulse' : ''}`}>
                        {isGenerating ? (
                            <CpuChipIcon className="w-8 h-8 md:w-10 md:h-10 text-blue-400 animate-spin-slow" />
                        ) : (
                            <ArrowUpTrayIcon className={`w-8 h-8 md:w-10 md:h-10 text-zinc-300 transition-all duration-300 ${isDragging ? '-translate-y-1 text-blue-400' : ''}`} />
                        )}
                    </div>
                </div>

                <div className="space-y-2 md:space-y-4 w-full max-w-3xl">
                    <h3 className="flex flex-col items-center justify-center text-xl sm:text-2xl md:text-4xl text-zinc-100 leading-none font-bold tracking-tighter gap-3">
                        <span>Bring</span>
                        <div className="h-8 sm:h-10 md:h-14 flex items-center justify-center w-full">
                           <CyclingText />
                        </div>
                        <span>to life</span>
                    </h3>
                </div>
            </div>

            {/* Input Controls (Bottom - Interactive) */}
            <div className="w-full max-w-2xl px-6 pb-6 relative z-20 pointer-events-auto">
                <div className="relative flex items-center gap-2 group/input">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => { 
                            if(e.key === 'Enter' && !e.shiftKey) { 
                                e.preventDefault(); 
                                handleTextSubmit(); 
                            }
                        }}
                        placeholder="Describe your idea, or drag an image..."
                        className="w-full bg-zinc-950/60 backdrop-blur-xl border border-zinc-700/80 rounded-xl pl-4 pr-12 py-3.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 resize-none h-[52px] min-h-[52px] shadow-lg transition-all"
                        disabled={isGenerating || disabled}
                    />
                    <button
                        onClick={handleTextSubmit}
                        disabled={!prompt.trim() || isGenerating}
                        className={`
                            absolute right-2 top-1/2 -translate-y-1/2 p-2 
                            rounded-lg transition-all duration-200
                            ${prompt.trim() && !isGenerating
                                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md hover:shadow-blue-500/20 translate-x-0 opacity-100'
                                : 'bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-50'
                            }
                        `}
                        title="Generate"
                    >
                        <PaperAirplaneIcon className="w-4 h-4 -rotate-45 relative left-[-1px] top-[1px]" />
                    </button>
                </div>

                {/* Example Prompts / Suggestions */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                    <span className="text-xs text-zinc-500 font-medium hidden sm:inline">Try:</span>
                    {SUGGESTIONS.map((s) => (
                        <button
                            key={s}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSuggestionClick(s);
                            }}
                            disabled={isGenerating || disabled}
                            className="text-xs bg-zinc-800/40 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 border border-zinc-700/50 px-3 py-1.5 rounded-full transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {s}
                        </button>
                    ))}
                </div>

                <p className="text-zinc-500 text-xs text-center mt-3 font-light tracking-wide opacity-60">
                    <span className="hidden md:inline">Drag & Drop</span>
                    <span className="md:hidden">Tap</span> to upload image or PDF
                </p>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                accept="image/*,application/pdf"
                className="hidden"
                onChange={handleFileChange}
                disabled={isGenerating || disabled}
            />
        </div>
      </div>
    </div>
  );
};