import React, { useState, useEffect } from 'react';
import { Cpu, Mic, Brain, Sparkles, FileText, CheckCircle2 } from 'lucide-react';

interface ProcessingIndicatorProps {
  fileName?: string;
}

export const ProcessingIndicator: React.FC<ProcessingIndicatorProps> = ({ fileName }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Acoustic Signal Processing',
      desc: 'Decoding audio stream, normalising sample rate, and buffering frequency frames...',
      icon: Mic,
    },
    {
      title: 'Speech-to-Text Transcription',
      desc: 'Multi-modal acoustic feature mapping and speaker turn diarization with Gemini 3.8...',
      icon: Cpu,
    },
    {
      title: 'NLP Information Extraction',
      desc: 'Synthesizing executive summary, identifying core technical themes and sentiment...',
      icon: Brain,
    },
    {
      title: 'Structuring Action Items & Deadlines',
      desc: 'Constrained JSON schema validation for tasks, assignees, dates, and entities...',
      icon: Sparkles,
    },
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 1800);
    const timer2 = setTimeout(() => setCurrentStep(2), 3800);
    const timer3 = setTimeout(() => setCurrentStep(3), 5800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-10 shadow-2xl max-w-2xl mx-auto my-8 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-950/60 border border-cyan-800/80 text-cyan-400 mb-4 shadow-lg animate-pulse">
          <Cpu className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-slate-100 tracking-tight">
          AI Pipeline Active
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          {fileName ? `Processing "${fileName}"` : 'Analyzing speech input and generating structured intelligence...'}
        </p>
      </div>

      {/* Steps List */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isDone = index < currentStep;
          const isActive = index === currentStep;

          return (
            <div
              key={index}
              className={`p-3.5 rounded-xl border transition-all flex items-start gap-3.5 ${
                isActive
                  ? 'bg-slate-800/80 border-cyan-500/80 shadow-md shadow-cyan-500/10'
                  : isDone
                  ? 'bg-slate-950/40 border-slate-800/60 opacity-80'
                  : 'bg-slate-950/20 border-slate-800/30 opacity-40'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-400 animate-pulse'
                    : isDone
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4
                    className={`text-xs font-semibold ${
                      isActive ? 'text-slate-100' : isDone ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {step.title}
                  </h4>
                  {isActive && (
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider animate-pulse">
                      In Progress
                    </span>
                  )}
                  {isDone && (
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                      Done
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>Model: Gemini 3.8 Flash</span>
        <span>Output: Structured Schema (Type.OBJECT)</span>
      </div>
    </div>
  );
};
