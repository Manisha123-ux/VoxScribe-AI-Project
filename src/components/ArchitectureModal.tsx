import React from 'react';
import { X, Cpu, Brain, Sparkles, CheckCircle2, Layers, GitBranch, ArrowRight } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative p-6 sm:p-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-800 text-cyan-400 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 font-serif sm:font-sans">
              AI/ML System Architecture & Model Pipeline
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-Modal Speech-to-Text, Structured Information Extraction & Temporal NER
            </p>
          </div>
        </div>

        {/* Pipeline Diagram */}
        <div className="mb-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-cyan-400" />
            <span>End-to-End Processing Pipeline</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="font-mono text-cyan-400 block font-semibold mb-1">01. Signal</span>
              <p className="text-[11px] text-slate-300 font-medium">Acoustic Ingestion</p>
              <p className="text-[10px] text-slate-500 mt-1">PCM / WebM / MP3 stream normalization</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="font-mono text-indigo-400 block font-semibold mb-1">02. Foundation</span>
              <p className="text-[11px] text-slate-300 font-medium">Gemini 3.8 Flash</p>
              <p className="text-[10px] text-slate-500 mt-1">Native audio token embedding & diarization</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="font-mono text-purple-400 block font-semibold mb-1">03. Grammar</span>
              <p className="text-[11px] text-slate-300 font-medium">Constrained Schema</p>
              <p className="text-[10px] text-slate-500 mt-1">JSON Type.OBJECT validation & zero hallucinations</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
              <span className="font-mono text-emerald-400 block font-semibold mb-1">04. Delivery</span>
              <p className="text-[11px] text-slate-300 font-medium">Actionable Note</p>
              <p className="text-[10px] text-slate-500 mt-1">Checklist, iCal export, TTS playback</p>
            </div>
          </div>
        </div>

        {/* Technical Highlights */}
        <div className="space-y-4 text-xs text-slate-300 leading-relaxed mb-6">
          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800">
            <h4 className="font-bold text-slate-100 text-sm mb-1.5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>1. Direct Multi-Modal Audio Ingestion vs. Legacy Two-Stage</span>
            </h4>
            <p className="text-slate-400">
              Traditional speech solutions chain a separate ASR model (e.g. Whisper) to an LLM. This leads to
              cascading errors where acoustic mishearings corrupt reasoning downstream. VoxScribe uses
              Gemini 3.8 Flash's native multi-modal audio encoder, allowing the neural network to reason over
              vocal inflections, pacing, tone, and spoken nuances directly without intermediary text truncation.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800">
            <h4 className="font-bold text-slate-100 text-sm mb-1.5 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>2. Constrained Decoding & Grammar Schema Validation</span>
            </h4>
            <p className="text-slate-400">
              To guarantee that extracted dates, action items, assignees, and summaries are 100% syntactically
              sound, the inference pass enforces an explicit JSON Schema via the Gemini SDK. Output tokens are
              constrained to structured types (<code className="text-cyan-300 font-mono">Type.OBJECT</code>, <code className="text-cyan-300 font-mono">Type.ARRAY</code>), preventing markdown breakdown and hallucinated syntax.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800">
            <h4 className="font-bold text-slate-100 text-sm mb-1.5 flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <span>3. Temporal & Commitment NER (Named Entity Recognition)</span>
            </h4>
            <p className="text-slate-400">
              Natural conversational speech refers to deadlines informally (e.g. "by this Thursday at 2 PM",
              "before next sprint", "Oct 13th midnight"). The system extracts both the relative linguistic
              expression and links it to calendar metadata, generating standard <code className="text-purple-300 font-mono">.ics</code> files compatible with Google Calendar, Apple Calendar, and Outlook.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400">
          <span className="font-mono text-[11px]">Academic Capstone & Laboratory Demonstration</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Close Pipeline Specs
          </button>
        </div>
      </div>
    </div>
  );
};
