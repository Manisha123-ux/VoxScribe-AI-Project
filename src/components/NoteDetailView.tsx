import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  CheckSquare,
  Calendar,
  Mic,
  MessageSquare,
  Sparkles,
  Volume2,
  VolumeX,
  Download,
  Copy,
  Trash2,
  Bookmark,
  BookmarkCheck,
  Search,
  Plus,
  Clock,
  CheckCircle,
  Tag,
  Send,
  Loader2,
  User,
  Edit2,
  Check,
  Filter
} from 'lucide-react';
import { Note, ActionItem, CategoryOption } from '../types/note';
import {
  exportToMarkdown,
  exportToText,
  exportToJSON,
  exportToICS,
  exportToPDF,
  downloadFile
} from '../utils/storage';
import { speakText } from '../utils/audio';

interface NoteDetailViewProps {
  note: Note;
  onUpdateNote: (updated: Note) => void;
  onDeleteNote: (noteId: string) => void;
}

export const NoteDetailView: React.FC<NoteDetailViewProps> = ({
  note,
  onUpdateNote,
  onDeleteNote,
}) => {
  // Default to overview so Summary, Action Items, Dates & Deadlines, and Export are all immediately visible
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'dates' | 'export' | 'transcript' | 'ask'>(
    'overview'
  );

  // Editable title
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(note.title);

  // Copy confirmation
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Audio Playback
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playbackRate, setPlaybackRate] = useState<number>(1);

  // Text to Speech playback
  const [isSpeaking, setIsSpeaking] = useState(false);
  const stopSpeakRef = useRef<(() => void) | null>(null);

  // Transcript search
  const [transcriptSearch, setTranscriptSearch] = useState('');

  // Task filter (all, pending, completed)
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Add Task Form
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');

  // Ask AI Chat
  const [chatQuestion, setChatQuestion] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: 'user' | 'assistant'; text: string }>
  >([
    {
      role: 'assistant',
      text: `Hello! I've analyzed "${note.title}". You can ask me anything about the discussion, specific technical equations, who is assigned to what, or upcoming milestones.`,
    },
  ]);

  // Sync title when note prop changes
  useEffect(() => {
    setEditedTitle(note.title);
    setIsEditingTitle(false);
  }, [note.id]);

  // Handle Title Save
  const handleSaveTitle = () => {
    if (editedTitle.trim()) {
      onUpdateNote({ ...note, title: editedTitle.trim() });
    }
    setIsEditingTitle(false);
  };

  // Handle Pin Toggle
  const handleTogglePin = () => {
    onUpdateNote({ ...note, isPinned: !note.isPinned });
  };

  // Handle Action Item Toggle (dynamically updates the note in state & localStorage)
  const handleToggleActionItem = (itemId: string) => {
    const updatedItems = note.actionItems.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    onUpdateNote({ ...note, actionItems: updatedItems });
  };

  // Handle Add New Action Item
  const handleAddActionItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newItem: ActionItem = {
      id: `task-${Date.now()}`,
      task: newTaskTitle.trim(),
      assignee: newTaskAssignee.trim() || undefined,
      priority: newTaskPriority,
      completed: false,
      dueDate: newTaskDueDate.trim() || undefined,
    };

    onUpdateNote({ ...note, actionItems: [...note.actionItems, newItem] });
    setNewTaskTitle('');
    setNewTaskAssignee('');
    setNewTaskDueDate('');
    setShowAddTask(false);
  };

  // Handle Copy to Clipboard
  const handleCopy = (type: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  // Handle Text to Speech
  const toggleTTS = async () => {
    if (isSpeaking) {
      if (stopSpeakRef.current) stopSpeakRef.current();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    try {
      const res = await fetch('/api/tts-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: note.executiveSummary }),
      });
      const data = await res.json();
      if (data.audioBase64) {
        const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
        audio.onended = () => setIsSpeaking(false);
        audio.onerror = () => {
          fallbackSpeech();
        };
        audio.play();
        stopSpeakRef.current = () => {
          audio.pause();
          setIsSpeaking(false);
        };
        return;
      }
    } catch (e) {
      console.warn('Server TTS unavailable, falling back to browser TTS:', e);
    }
    fallbackSpeech();

    function fallbackSpeech() {
      const cancel = speakText(note.executiveSummary, () => setIsSpeaking(false));
      stopSpeakRef.current = cancel;
    }
  };

  // Handle Ask AI
  const handleSendQuestion = async (qText?: string) => {
    const question = qText || chatQuestion;
    if (!question.trim()) return;

    setChatMessages((prev) => [...prev, { role: 'user', text: question }]);
    setChatQuestion('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/chat-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          noteContext: note,
        }),
      });

      const data = await res.json();
      const answer = data.answer || 'I could not find an answer in the transcript context.';
      setChatMessages((prev) => [...prev, { role: 'assistant', text: answer }]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Encountered an error while querying the note context. Please try again.',
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  // Stats calculation
  const totalTasks = note.actionItems?.length || 0;
  const completedTasks = note.actionItems?.filter((i) => i.completed).length || 0;
  const pendingTasks = totalTasks - completedTasks;
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

  // Filter tasks based on taskFilter state
  const displayedTasks = note.actionItems?.filter((item) => {
    if (taskFilter === 'pending') return !item.completed;
    if (taskFilter === 'completed') return item.completed;
    return true;
  }) || [];

  // Filter transcript segments
  const filteredSegments = note.segments?.filter(
    (seg) =>
      !transcriptSearch.trim() ||
      seg.text.toLowerCase().includes(transcriptSearch.toLowerCase()) ||
      (seg.speaker && seg.speaker.toLowerCase().includes(transcriptSearch.toLowerCase()))
  ) || [];

  // Reusable Action Items UI Section
  const renderActionItemsSection = () => (
    <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <CheckSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-100 tracking-tight">
                Action Items & Deliverables
              </h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 font-semibold">
                {pendingTasks} pending
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Tasks and commitments dynamically extracted from this recording
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-full transition-all duration-300"
                style={{ width: `${taskProgress}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-slate-400 font-medium">
              {completedTasks}/{totalTasks}
            </span>
          </div>

          <button
            onClick={() => setShowAddTask(!showAddTask)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Task Filters (All, Pending, Completed) */}
      <div className="flex items-center gap-1.5 mb-3.5">
        <button
          onClick={() => setTaskFilter('all')}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
            taskFilter === 'all'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
          }`}
        >
          All Tasks ({totalTasks})
        </button>
        <button
          onClick={() => setTaskFilter('pending')}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
            taskFilter === 'pending'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
          }`}
        >
          Pending ({pendingTasks})
        </button>
        <button
          onClick={() => setTaskFilter('completed')}
          className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
            taskFilter === 'completed'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800'
          }`}
        >
          Completed ({completedTasks})
        </button>
      </div>

      {/* Inline Add Task Form */}
      {showAddTask && (
        <form
          onSubmit={handleAddActionItem}
          className="p-4 mb-3.5 rounded-xl bg-slate-900 border border-cyan-800/80 space-y-3"
        >
          <div className="text-xs font-semibold text-cyan-400">Add New Action Item</div>
          <input
            type="text"
            placeholder="Task description..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            autoFocus
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Responsible Person (e.g. Maria)"
              value={newTaskAssignee}
              onChange={(e) => setNewTaskAssignee(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500"
            />
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value as any)}
              className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200"
            >
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <input
              type="text"
              placeholder="Deadline (e.g. Thursday, Oct 8 at 2 PM)"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddTask(false)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
            >
              Save Item
            </button>
          </div>
        </form>
      )}

      {/* List of Tasks - Display every extracted task as a separate checkbox item */}
      <div className="space-y-2.5">
        {displayedTasks.map((item) => (
          <div
            key={item.id}
            className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
              item.completed
                ? 'bg-slate-950/20 border-slate-900 opacity-70'
                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 shadow-sm'
            }`}
          >
            <div className="flex items-start gap-3.5">
              {/* Checkbox item */}
              <input
                type="checkbox"
                id={`task-item-${item.id}`}
                checked={item.completed}
                onChange={() => handleToggleActionItem(item.id)}
                className="mt-1 h-4 w-4 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 bg-slate-900 cursor-pointer shrink-0"
              />

              <div className="flex-1 min-w-0">
                {/* Task description */}
                <label
                  htmlFor={`task-item-${item.id}`}
                  className={`text-xs sm:text-sm font-medium leading-relaxed block cursor-pointer select-none ${
                    item.completed
                      ? 'line-through text-slate-500'
                      : 'text-slate-100 hover:text-cyan-200'
                  }`}
                >
                  {item.task}
                </label>

                {/* Metadata details: Responsible Person, Deadline, Priority */}
                <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-slate-800/60 text-xs">
                  {/* Responsible Person if available */}
                  {item.assignee && (
                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-cyan-950/70 border border-cyan-800/70 text-cyan-300 font-medium text-[11px]">
                      <User className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span>Responsible: <strong className="text-cyan-200">{item.assignee}</strong></span>
                    </span>
                  )}

                  {/* Deadline if available */}
                  {item.dueDate && (
                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-rose-950/70 border border-rose-800/70 text-rose-300 font-medium text-[11px]">
                      <Calendar className="w-3 h-3 text-rose-400 shrink-0" />
                      <span>Deadline: <strong className="text-rose-200">{item.dueDate}</strong></span>
                    </span>
                  )}

                  {/* Priority */}
                  {item.priority && (
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border font-semibold ${
                        item.priority === 'high'
                          ? 'bg-rose-950/80 border-rose-800 text-rose-300'
                          : item.priority === 'medium'
                          ? 'bg-amber-950/80 border-amber-800 text-amber-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      {item.priority} Priority
                    </span>
                  )}

                  {/* Completed status indicator */}
                  <span
                    className={`ml-auto text-[11px] font-mono ${
                      item.completed ? 'text-emerald-400 font-medium' : 'text-amber-400/90'
                    }`}
                  >
                    {item.completed ? '✓ Completed' : '○ Pending'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {displayedTasks.length === 0 && (
          <div className="text-center py-6 text-xs text-slate-500 bg-slate-900/30 rounded-xl border border-slate-800/60">
            {taskFilter !== 'all'
              ? `No ${taskFilter} action items found.`
              : 'No action items identified in this recording. Click "Add Task" to create one.'}
          </div>
        )}
      </div>
    </div>
  );

  // Reusable Dates & Deadlines UI Section
  const renderDatesSection = () => (
    <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-100 tracking-tight">
                Dates, Deadlines & Milestones
              </h3>
              {note.extractedDates?.length > 0 && (
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-rose-950 border border-rose-800 text-rose-300 font-semibold">
                  {note.extractedDates.length} recognized
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Schedule references and milestones extracted from speech
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            downloadFile(
              exportToICS(note),
              `${note.title.toLowerCase().replace(/\s+/g, '_')}_deadlines.ics`,
              'text/calendar'
            )
          }
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all shadow-sm self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Download .ics Calendar</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {note.extractedDates?.map((item, idx) => {
          const isDeadline = item.type === 'deadline';
          const isMeeting = item.type === 'meeting';

          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3.5 hover:border-slate-700 transition-colors"
            >
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  isDeadline
                    ? 'bg-rose-950/80 border border-rose-800/80 text-rose-400'
                    : isMeeting
                    ? 'bg-cyan-950/80 border border-cyan-800/80 text-cyan-400'
                    : 'bg-indigo-950/80 border border-indigo-800/80 text-indigo-400'
                }`}
              >
                <Calendar className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold text-xs sm:text-sm text-slate-100 font-mono">
                    {item.date}
                  </span>
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                      isDeadline
                        ? 'bg-rose-950/80 border-rose-800 text-rose-300'
                        : isMeeting
                        ? 'bg-cyan-950/80 border-cyan-800 text-cyan-300'
                        : 'bg-indigo-950/80 border-indigo-800 text-indigo-300'
                    }`}
                  >
                    {item.type}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.context}</p>
              </div>
            </div>
          );
        })}

        {(!note.extractedDates || note.extractedDates.length === 0) && (
          <div className="text-center py-6 text-xs text-slate-500 bg-slate-900/30 rounded-xl border border-slate-800/60">
            No calendar dates or deadlines were mentioned in this recording.
          </div>
        )}
      </div>
    </div>
  );

  // Reusable Export UI Section
  const renderExportSection = () => {
    const safeTitle = note.title.toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const wordCount = note.transcript
      ? note.transcript.split(/\s+/).filter(Boolean).length
      : 0;

    return (
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-100 tracking-tight">
                  Export Note Documents
                </h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-800 text-indigo-300 font-semibold">
                  PDF & TXT
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Download the complete note including title, category, executive summary, key points, action items with deadlines, dates & deadlines, and transcript.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-900/60 px-2.5 py-1 rounded-lg self-start sm:self-auto">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Dynamic Export Ready</span>
          </div>
        </div>

        {/* Primary Export Action Cards: PDF & TXT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {/* Download Complete PDF */}
          <button
            onClick={() => exportToPDF(note)}
            className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/80 hover:bg-slate-900 transition-all text-left flex items-start gap-3.5 group shadow-sm cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-rose-950/80 border border-rose-800/80 text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-100 group-hover:text-rose-300 transition-colors">
                  Download PDF File
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-300 font-semibold">
                  .PDF
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Formatted multi-page document with headers, checkboxes, deadlines, and verbatim transcript.
              </p>
            </div>
          </button>

          {/* Download Complete TXT */}
          <button
            onClick={() =>
              downloadFile(
                exportToText(note),
                `${safeTitle}.txt`,
                'text/plain'
              )
            }
            className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/80 hover:bg-slate-900 transition-all text-left flex items-start gap-3.5 group shadow-sm cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-800/80 text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-inner">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors">
                  Download TXT File
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-semibold">
                  .TXT
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Clean universal plain-text file containing all sections, action items, and timestamps.
              </p>
            </div>
          </button>
        </div>

        {/* Dynamic Content Details & Additional Formats */}
        <div className="pt-3 border-t border-slate-800/60 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
            <span className="text-slate-300 font-medium">Dynamically Included:</span>
            <span>• Title & Category ({note.category})</span>
            <span>• Executive Summary</span>
            <span>• {note.keyPoints?.length || 0} Key Points</span>
            <span>• {note.actionItems?.length || 0} Action Items with Deadlines</span>
            <span>• {note.extractedDates?.length || 0} Dates & Deadlines</span>
            <span>• Complete Transcript ({wordCount} words)</span>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-auto shrink-0">
            <span className="text-[11px] text-slate-500 hidden sm:inline">Also available:</span>
            <button
              onClick={() =>
                downloadFile(
                  exportToMarkdown(note),
                  `${safeTitle}.md`,
                  'text/markdown'
                )
              }
              className="text-[11px] font-medium text-slate-300 hover:text-white px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              Markdown (.md)
            </button>
            <button
              onClick={() =>
                downloadFile(
                  exportToJSON(note),
                  `${safeTitle}.json`,
                  'application/json'
                )
              }
              className="text-[11px] font-medium text-slate-300 hover:text-white px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              JSON (.json)
            </button>
            <button
              onClick={() =>
                downloadFile(
                  exportToICS(note),
                  `${safeTitle}_deadlines.ics`,
                  'text/calendar'
                )
              }
              className="text-[11px] font-medium text-slate-300 hover:text-white px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              Calendar (.ics)
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col">
      {/* Top Banner & Title Area */}
      <div className="p-6 sm:p-8 border-b border-slate-800 bg-slate-950/60">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Metadata Line */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-2.5">
              <span className="font-semibold text-cyan-400 tracking-wide uppercase text-[11px]">
                {note.category}
              </span>
              <span aria-hidden="true" className="text-slate-600">
                ·
              </span>
              <span>
                {new Date(note.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              {note.audioStats?.duration && (
                <>
                  <span aria-hidden="true" className="text-slate-600">
                    ·
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {note.audioStats.duration}
                  </span>
                </>
              )}
              {note.audioStats?.tone && (
                <>
                  <span aria-hidden="true" className="text-slate-600">
                    ·
                  </span>
                  <span className="text-slate-400">{note.audioStats.tone}</span>
                </>
              )}
            </div>

            {/* Title with edit capability */}
            {isEditingTitle ? (
              <div className="flex items-center gap-2 max-w-xl">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                  className="bg-slate-900 border border-cyan-500 rounded-lg px-3 py-1.5 text-lg font-bold text-slate-100 w-full focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={handleSaveTitle}
                  className="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white"
                  title="Save"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight leading-snug">
                  {note.title}
                </h1>
                <button
                  onClick={() => setIsEditingTitle(true)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-cyan-400 transition-opacity p-1"
                  title="Edit Title"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Tags row */}
            {note.tags && note.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                {note.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-mono text-slate-300 bg-slate-800/80 border border-slate-700/60 px-2 py-0.5 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 shrink-0 self-start">
            <button
              onClick={handleTogglePin}
              className={`p-2 rounded-xl border transition-all ${
                note.isPinned
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
              title={note.isPinned ? 'Unpin note' : 'Pin note to top'}
            >
              {note.isPinned ? (
                <BookmarkCheck className="w-4 h-4" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>

            {/* Quick Export Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-medium transition-all"
                title="Export Options"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export</span>
              </button>
              <div className="absolute right-0 top-full mt-1 w-48 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl py-1 z-20 hidden group-hover:block">
                <button
                  onClick={() => exportToPDF(note)}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5 text-rose-400" />
                  <span>PDF Document (.pdf)</span>
                </button>
                <button
                  onClick={() =>
                    downloadFile(
                      exportToText(note),
                      `${note.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.txt`,
                      'text/plain'
                    )
                  }
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Plain Text (.txt)</span>
                </button>
                <button
                  onClick={() =>
                    downloadFile(
                      exportToMarkdown(note),
                      `${note.title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.md`,
                      'text/markdown'
                    )
                  }
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Markdown (.md)</span>
                </button>
                <button
                  onClick={() =>
                    downloadFile(
                      exportToJSON(note),
                      `${note.title.toLowerCase().replace(/\s+/g, '_')}.json`,
                      'application/json'
                    )
                  }
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Structured JSON</span>
                </button>
                <button
                  onClick={() =>
                    downloadFile(
                      exportToICS(note),
                      `${note.title.toLowerCase().replace(/\s+/g, '_')}_deadlines.ics`,
                      'text/calendar'
                    )
                  }
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5 text-rose-400" />
                  <span>iCalendar (.ics)</span>
                </button>
              </div>
            </div>

            {/* Copy All */}
            <button
              onClick={() => handleCopy('all', exportToMarkdown(note))}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-medium transition-all"
              title="Copy formatted note to clipboard"
            >
              {copiedType === 'all' ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy</span>
                </>
              )}
            </button>

            {/* Delete */}
            <button
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete "${note.title}"?`)) {
                  onDeleteNote(note.id);
                }
              }}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 hover:text-rose-400 hover:border-rose-900/60 transition-all"
              title="Delete Note"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Audio Player if present */}
        {note.audioUrl && (
          <div className="mt-5 p-3 bg-slate-900/90 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-cyan-950 flex items-center justify-center text-cyan-400">
                <Mic className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs text-slate-300 font-medium">Recording Audio Playback</span>
            </div>
            <div className="flex items-center gap-2">
              <audio
                ref={audioRef}
                src={note.audioUrl}
                controls
                className="h-8 max-w-[260px] filter invert contrast-125"
              />
              <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400">
                <span>Speed:</span>
                {[1, 1.25, 1.5].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => {
                      if (audioRef.current) {
                        audioRef.current.playbackRate = rate;
                        setPlaybackRate(rate);
                      }
                    }}
                    className={`px-1.5 py-0.5 rounded ${
                      playbackRate === rate
                        ? 'bg-cyan-500/20 text-cyan-400 font-bold'
                        : 'hover:text-slate-200'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Segmented Tab Navigation */}
      <div className="px-6 border-b border-slate-800 bg-slate-950/40 flex items-center overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 py-3 px-3.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Note Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center gap-2 py-3 px-3.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'tasks'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span>Action Items</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 font-semibold">
            {pendingTasks} pending
          </span>
        </button>

        <button
          onClick={() => setActiveTab('dates')}
          className={`flex items-center gap-2 py-3 px-3.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'dates'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Dates & Deadlines</span>
          {note.extractedDates?.length > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-rose-950/80 border border-rose-900/60 text-rose-300">
              {note.extractedDates.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('export')}
          className={`flex items-center gap-2 py-3 px-3.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'export'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Download className="w-3.5 h-3.5 text-indigo-400" />
          <span>Export Note</span>
        </button>

        <button
          onClick={() => setActiveTab('transcript')}
          className={`flex items-center gap-2 py-3 px-3.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'transcript'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Mic className="w-3.5 h-3.5" />
          <span>Full Transcript</span>
        </button>

        <button
          onClick={() => setActiveTab('ask')}
          className={`flex items-center gap-2 py-3 px-3.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'ask'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
          <span>Ask Note AI</span>
        </button>
      </div>

      {/* TAB CONTENT AREA */}
      <div className="p-6 sm:p-8 flex-1 overflow-y-auto">
        {/* TAB: OVERVIEW (Summary, Action Items & Deadlines all clearly visible together!) */}
        {activeTab === 'overview' && (
          <div className="space-y-6 max-w-4xl">
            {/* TL;DR Highlight Card */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-800/40 relative">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                    Core TL;DR Takeaway
                  </div>
                  <p className="text-sm font-medium text-slate-100 mt-1 leading-relaxed">
                    {note.tldr}
                  </p>
                </div>
              </div>
            </div>

            {/* Executive Summary Block */}
            <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-200 tracking-tight flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Executive Summary</span>
                </h3>

                {/* Listen Aloud Button */}
                <button
                  onClick={toggleTTS}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    isSpeaking
                      ? 'bg-rose-950/60 border-rose-800 text-rose-300'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                      <span>Stop Listening</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Listen to Summary</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line font-normal">
                {note.executiveSummary}
              </p>
            </div>

            {/* CLEARLY VISIBLE ACTION ITEMS SECTION (Visible alongside Summary and Dates) */}
            {renderActionItemsSection()}

            {/* CLEARLY VISIBLE DATES & DEADLINES SECTION (Visible alongside Summary and Action Items) */}
            {renderDatesSection()}

            {/* CLEARLY VISIBLE EXPORT SECTION (Download complete note as TXT or PDF) */}
            {renderExportSection()}

            {/* Key Points & Takeaways */}
            <div className="bg-slate-950/30 border border-slate-800/80 rounded-xl p-5">
              <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Key Points & Conceptual Decisions</span>
              </h3>

              <div className="grid grid-cols-1 gap-2.5">
                {note.keyPoints?.map((kp, idx) => {
                  const isCrit = kp.importance === 'critical';
                  const isHigh = kp.importance === 'high';

                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/90 flex items-start gap-3 hover:border-slate-700/80 transition-colors"
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                          isCrit
                            ? 'bg-rose-500 shadow-sm shadow-rose-500'
                            : isHigh
                            ? 'bg-amber-400'
                            : 'bg-cyan-400'
                        }`}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-xs text-slate-400 mb-0.5">
                          {kp.category && (
                            <span className="font-semibold text-slate-300">{kp.category}</span>
                          )}
                          {kp.importance && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span
                                className={`uppercase text-[10px] font-mono tracking-wider ${
                                  isCrit
                                    ? 'text-rose-400'
                                    : isHigh
                                    ? 'text-amber-400'
                                    : 'text-slate-400'
                                }`}
                              >
                                {kp.importance} Priority
                              </span>
                            </>
                          )}
                        </div>
                        <p className="text-sm text-slate-200 leading-normal">{kp.point}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mentioned Entities, People, Tech */}
            {note.entities && note.entities.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-slate-200 mb-2.5 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-cyan-400" />
                  <span>Identified Entities & Technologies</span>
                </h3>

                <div className="flex flex-wrap gap-2">
                  {note.entities.map((ent, i) => (
                    <div
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5"
                    >
                      <span className="text-[10px] uppercase font-mono text-cyan-400/80">
                        {ent.type}:
                      </span>
                      <span className="font-medium text-slate-200">{ent.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: FOCUSED ACTION ITEMS ONLY */}
        {activeTab === 'tasks' && (
          <div className="space-y-6 max-w-4xl">
            {renderActionItemsSection()}
          </div>
        )}

        {/* TAB: FOCUSED DATES & DEADLINES ONLY */}
        {activeTab === 'dates' && (
          <div className="space-y-6 max-w-4xl">
            {renderDatesSection()}
          </div>
        )}

        {/* TAB: FOCUSED EXPORT ONLY */}
        {activeTab === 'export' && (
          <div className="space-y-6 max-w-4xl">
            {renderExportSection()}
          </div>
        )}

        {/* TAB: FULL TRANSCRIPT */}
        {activeTab === 'transcript' && (
          <div className="space-y-4 max-w-4xl">
            {/* Search within transcript */}
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search keywords in transcript..."
                  value={transcriptSearch}
                  onChange={(e) => setTranscriptSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                onClick={() => handleCopy('transcript', note.transcript)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium"
              >
                {copiedType === 'transcript' ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Transcript</span>
                  </>
                )}
              </button>
            </div>

            {/* Turn by turn segments */}
            <div className="space-y-3 pt-2">
              {filteredSegments.map((seg, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950/30 border border-slate-800/80 hover:border-slate-700/80 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    {seg.speaker && (
                      <span className="text-xs font-semibold text-cyan-400 font-mono">
                        {seg.speaker}
                      </span>
                    )}
                    {seg.timestamp && (
                      <span className="text-[11px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                        {seg.timestamp}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed font-normal">
                    {seg.text}
                  </p>
                </div>
              ))}

              {filteredSegments.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-500">
                  No transcript segments match "{transcriptSearch}".
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: ASK NOTE AI (INTERACTIVE Q&A) */}
        {activeTab === 'ask' && (
          <div className="space-y-4 max-w-4xl flex flex-col h-[520px]">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Interactive Note Copilot</h4>
                  <p className="text-[11px] text-slate-400">
                    Query decisions, numbers, and deadlines grounded strictly in this note's audio.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick suggested prompt questions */}
            <div className="flex flex-wrap gap-1.5">
              {[
                'What are all the deadlines mentioned?',
                'Who has the highest priority tasks?',
                'Summarize the core technical decision in 3 bullets',
                'What numbers or benchmark metrics were discussed?',
              ].map((suggestion, sIdx) => (
                <button
                  key={sIdx}
                  onClick={() => handleSendQuestion(suggestion)}
                  disabled={chatLoading}
                  className="text-[11px] text-slate-400 hover:text-cyan-300 bg-slate-950 border border-slate-800 hover:border-slate-700 px-2.5 py-1 rounded-lg transition-colors text-left"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
              {chatMessages.map((msg, mIdx) => (
                <div
                  key={mIdx}
                  className={`flex flex-col ${
                    msg.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-cyan-600 text-white font-medium'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 whitespace-pre-line'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                  <span>Thinking with note context...</span>
                </div>
              )}
            </div>

            {/* Input bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendQuestion();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={chatQuestion}
                onChange={(e) => setChatQuestion(e.target.value)}
                placeholder="Ask anything about this recording..."
                disabled={chatLoading}
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                disabled={chatLoading || !chatQuestion.trim()}
                className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-40 transition-all shadow-md shadow-purple-600/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
