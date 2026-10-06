/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AudioInputSection } from './components/AudioInputSection';
import { NoteDetailView } from './components/NoteDetailView';
import { NoteHistorySidebar } from './components/NoteHistorySidebar';
import { ProcessingIndicator } from './components/ProcessingIndicator';
import { ArchitectureModal } from './components/ArchitectureModal';
import { Note } from './types/note';
import { loadNotes, saveNotes } from './utils/storage';
import { AlertCircle, Plus, Mic, Sparkles, Layers } from 'lucide-react';

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingFileName, setProcessingFileName] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState<boolean>(false);

  // Load notes on mount
  useEffect(() => {
    const loaded = loadNotes();
    setNotes(loaded);
    if (loaded.length > 0) {
      setSelectedNoteId(loaded[0].id);
    }
  }, []);

  // Save notes whenever they change
  const handleUpdateNotesList = (updatedNotes: Note[]) => {
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  // Process audio submission (uploaded file, live mic recording, or academic demo)
  const handleProcessAudio = async (params: {
    audioData?: string;
    mimeType?: string;
    sampleId?: string;
    fileName?: string;
    customPrompt?: string;
    audioUrl?: string;
  }) => {
    setIsProcessing(true);
    setErrorMessage(null);
    setProcessingFileName(params.fileName || (params.sampleId ? `Demo: ${params.sampleId}` : 'Voice Recording'));

    try {
      const response = await fetch('/api/process-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || data.details || 'Failed to process audio recording');
      }

      const res = data.result;

      // Construct a new structured note object
      const newNote: Note = {
        id: `note-${Date.now()}`,
        createdAt: new Date().toISOString(),
        title: res.title || params.fileName || 'Untitled Voice Note',
        category: res.category || 'Lecture & Academics',
        tags: res.tags || ['Speech-to-Text'],
        sentiment: res.sentiment || 'Constructive',
        tldr: res.tldr || '',
        executiveSummary: res.executiveSummary || '',
        transcript: res.transcript || '',
        segments: res.segments || [],
        keyPoints: res.keyPoints || [],
        actionItems: res.actionItems || [],
        extractedDates: res.extractedDates || [],
        entities: res.entities || [],
        audioStats: {
          ...res.audioStats,
          fileName: params.fileName,
          duration: res.audioStats?.duration || 'Recorded audio',
        },
        audioUrl: params.audioUrl,
        isPinned: false,
      };

      const updated = [newNote, ...notes];
      handleUpdateNotesList(updated);
      setSelectedNoteId(newNote.id);
      setIsCreatingNew(false);
    } catch (err: any) {
      console.error('Processing error:', err);
      setErrorMessage(err?.message || 'Failed to transcribe and analyze audio. Please check network connection.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Update a single note
  const handleUpdateNote = (updatedNote: Note) => {
    const updated = notes.map((n) => (n.id === updatedNote.id ? updatedNote : n));
    handleUpdateNotesList(updated);
  };

  // Delete a note
  const handleDeleteNote = (noteId: string) => {
    const updated = notes.filter((n) => n.id !== noteId);
    handleUpdateNotesList(updated);
    if (selectedNoteId === noteId) {
      setSelectedNoteId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header */}
      <Header
        totalNotes={notes.length}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        onNewNote={() => {
          setIsCreatingNew(true);
          setErrorMessage(null);
        }}
        isCreating={isCreatingNew}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Error notification banner if any */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-white underline text-xs shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* When Processing is Active */}
        {isProcessing ? (
          <ProcessingIndicator fileName={processingFileName} />
        ) : isCreatingNew ? (
          /* Creating New Note View */
          <div className="max-w-4xl mx-auto space-y-4">
            <AudioInputSection
              onProcessAudio={handleProcessAudio}
              isProcessing={isProcessing}
              onCancel={notes.length > 0 ? () => setIsCreatingNew(false) : undefined}
            />
          </div>
        ) : (
          /* Main Workspace View: Left Sidebar + Right Note Details */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Notes Archive Sidebar */}
            <div className="lg:col-span-4 xl:col-span-4">
              <NoteHistorySidebar
                notes={notes}
                selectedNoteId={selectedNoteId}
                onSelectNote={(id) => {
                  setSelectedNoteId(id);
                  setIsCreatingNew(false);
                }}
                onNewNote={() => setIsCreatingNew(true)}
              />
            </div>

            {/* Right: Selected Note Detail View or Empty State */}
            <div className="lg:col-span-8 xl:col-span-8">
              {selectedNote ? (
                <NoteDetailView
                  note={selectedNote}
                  onUpdateNote={handleUpdateNote}
                  onDeleteNote={handleDeleteNote}
                />
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center shadow-xl">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-4">
                    <Mic className="w-7 h-7 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-100">No Note Selected</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Record a new voice memo, upload an audio file, or select a note from the archive.
                  </p>
                  <button
                    onClick={() => setIsCreatingNew(true)}
                    className="mt-5 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md transition-all inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Voice Note</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* College AI/ML Pipeline Specifications Modal */}
      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />
    </div>
  );
}
