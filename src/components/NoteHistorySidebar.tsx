import React, { useState, useMemo } from 'react';
import {
  Search,
  Bookmark,
  Calendar,
  Clock,
  CheckSquare,
  Filter,
  Plus,
  ArrowUpDown,
  Tag,
  Mic,
  ChevronRight
} from 'lucide-react';
import { Note, CategoryOption } from '../types/note';

interface NoteHistorySidebarProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (noteId: string) => void;
  onNewNote: () => void;
}

const CATEGORY_FILTERS: CategoryOption[] = [
  'All',
  'Lecture & Academics',
  'Research & Lab',
  'Team Standup',
  'Project Review',
  'Technical Interview',
];

export const NoteHistorySidebar: React.FC<NoteHistorySidebarProps> = ({
  notes,
  selectedNoteId,
  onSelectNote,
  onNewNote,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryOption>('All');
  const [filterPendingOnly, setFilterPendingOnly] = useState(false);
  const [filterPinnedOnly, setFilterPinnedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title' | 'tasks'>('newest');

  // Filter and sort notes
  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = note.title.toLowerCase().includes(q);
          const matchSummary = note.executiveSummary.toLowerCase().includes(q);
          const matchTranscript = note.transcript.toLowerCase().includes(q);
          const matchTags = note.tags?.some((t) => t.toLowerCase().includes(q));
          const matchTasks = note.actionItems?.some((a) => a.task.toLowerCase().includes(q));
          if (!matchTitle && !matchSummary && !matchTranscript && !matchTags && !matchTasks) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory !== 'All' && note.category !== selectedCategory) {
          return false;
        }

        // Pinned only
        if (filterPinnedOnly && !note.isPinned) {
          return false;
        }

        // Pending tasks only
        if (filterPendingOnly) {
          const hasPending = note.actionItems?.some((a) => !a.completed);
          if (!hasPending) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Pinned items bubble to top by default
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;

        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'tasks') {
          const pendingA = a.actionItems.filter((i) => !i.completed).length;
          const pendingB = b.actionItems.filter((i) => !i.completed).length;
          return pendingB - pendingA;
        }
        return 0;
      });
  }, [notes, searchQuery, selectedCategory, filterPinnedOnly, filterPendingOnly, sortBy]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col h-[750px] overflow-hidden">
      {/* Top Search & Filter Bar */}
      <div className="p-4 border-b border-slate-800 space-y-3 bg-slate-950/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-200">Notes Archive</h3>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-800/80 px-2 py-0.5 rounded-full">
              {filteredNotes.length}
            </span>
          </div>

          <button
            onClick={onNewNote}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-sm transition-all"
            title="Create new voice note"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search titles, summaries, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Category Pills (Interactive Filter Controls) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-lg whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Secondary Filters & Sort */}
        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/60">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFilterPinnedOnly(!filterPinnedOnly)}
              className={`px-2 py-1 rounded-md text-[11px] flex items-center gap-1 transition-all ${
                filterPinnedOnly
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bookmark className="w-3 h-3" />
              <span>Pinned</span>
            </button>

            <button
              onClick={() => setFilterPendingOnly(!filterPendingOnly)}
              className={`px-2 py-1 rounded-md text-[11px] flex items-center gap-1 transition-all ${
                filterPendingOnly
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckSquare className="w-3 h-3" />
              <span>Has Tasks</span>
            </button>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <ArrowUpDown className="w-3 h-3 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-300 text-[11px] focus:outline-none cursor-pointer"
            >
              <option value="newest" className="bg-slate-900">Newest</option>
              <option value="oldest" className="bg-slate-900">Oldest</option>
              <option value="tasks" className="bg-slate-900">Pending Tasks</option>
              <option value="title" className="bg-slate-900">Title A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredNotes.map((note) => {
          const isSelected = note.id === selectedNoteId;
          const pendingCount = note.actionItems?.filter((a) => !a.completed).length || 0;

          return (
            <div
              key={note.id}
              onClick={() => onSelectNote(note.id)}
              className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all relative group ${
                isSelected
                  ? 'bg-slate-800/90 border-cyan-500 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950/70'
              }`}
            >
              {/* Header line with zero-pill discipline */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                <span className="font-semibold text-cyan-400/90 truncate max-w-[130px]">
                  {note.category}
                </span>

                <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px]">
                  {note.isPinned && <Bookmark className="w-3 h-3 text-amber-400 fill-amber-400" />}
                  <span>{new Date(note.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>

              {/* Title */}
              <h4
                className={`text-xs font-semibold line-clamp-2 leading-snug transition-colors ${
                  isSelected ? 'text-white' : 'text-slate-200 group-hover:text-cyan-300'
                }`}
              >
                {note.title}
              </h4>

              {/* TL;DR or Summary Snippet */}
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {note.tldr || note.executiveSummary}
              </p>

              {/* Footer row with status counters */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2.5 pt-2 border-t border-slate-800/60 font-mono">
                <div className="flex items-center gap-2">
                  {note.audioStats?.duration && (
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-2.5 h-2.5" />
                      {note.audioStats.duration}
                    </span>
                  )}
                  {pendingCount > 0 && (
                    <span className="text-amber-400 font-medium">
                      {pendingCount} task{pendingCount > 1 ? 's' : ''} pending
                    </span>
                  )}
                </div>

                <ChevronRight
                  className={`w-3 h-3 transition-transform ${
                    isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-slate-600'
                  }`}
                />
              </div>
            </div>
          );
        })}

        {filteredNotes.length === 0 && (
          <div className="text-center py-12 px-4">
            <Mic className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <h5 className="text-xs font-semibold text-slate-300">No notes found</h5>
            <p className="text-[11px] text-slate-500 mt-1">
              Try adjusting your search query or record a new voice memo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
