export interface Segment {
  speaker?: string;
  timestamp?: string;
  text: string;
}

export interface KeyPoint {
  point: string;
  importance: 'critical' | 'high' | 'medium' | 'low';
  category?: string;
}

export interface ActionItem {
  id: string;
  task: string;
  assignee?: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  dueDate?: string;
}

export interface ExtractedDate {
  date: string;
  context: string;
  type: 'deadline' | 'meeting' | 'milestone' | 'reference';
}

export interface Entity {
  name: string;
  type: 'person' | 'technology' | 'organization' | 'metric' | 'date' | 'reference';
}

export interface AudioStats {
  estimatedWpm?: number;
  detectedLanguage?: string;
  tone?: string;
  fileSize?: string;
  fileName?: string;
  duration?: string;
}

export interface Note {
  id: string;
  createdAt: string; // ISO string
  updatedAt?: string;
  title: string;
  category: string;
  tags: string[];
  sentiment: string;
  tldr: string;
  executiveSummary: string;
  transcript: string;
  segments: Segment[];
  keyPoints: KeyPoint[];
  actionItems: ActionItem[];
  extractedDates: ExtractedDate[];
  entities?: Entity[];
  audioStats: AudioStats;
  isPinned?: boolean;
  audioUrl?: string; // base64 or blob URL if stored for session
}

export type CategoryOption = 
  | 'All'
  | 'Lecture & Academics'
  | 'Research & Lab'
  | 'Team Standup'
  | 'Project Review'
  | 'Technical Interview'
  | 'Personal Memo';
