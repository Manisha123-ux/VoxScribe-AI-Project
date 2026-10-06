import React from 'react';
import { Mic, FileText, Cpu, Sparkles, BookOpen } from 'lucide-react';

interface HeaderProps {
  totalNotes: number;
  onOpenArchitecture: () => void;
  onNewNote: () => void;
  isCreating: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  totalNotes,
  onOpenArchitecture,
  onNewNote,
  isCreating,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-100 tracking-tight font-serif sm:font-sans">
                VoxScribe<span className="text-cyan-400">.ai</span>
              </span>
              <span className="text-[11px] font-mono tracking-wide text-cyan-400/90 bg-cyan-950/80 border border-cyan-800/60 px-2 py-0.5 rounded">
                AI / ML Lab
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Voice-to-Notes Intelligence & Action Item Extraction
            </p>
          </div>
        </div>

        {/* Actions & Info */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenArchitecture}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-800 transition-colors"
            title="View AI/ML Project Architecture"
          >
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">Model Pipeline & Specs</span>
          </button>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          <button
            onClick={onNewNote}
            disabled={isCreating}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all ${
              isCreating
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-cyan-500/20'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>New Voice Note</span>
          </button>
        </div>
      </div>
    </header>
  );
};
