import { jsPDF } from 'jspdf';
import { Note } from '../types/note';

const STORAGE_KEY = 'voxscribe_notes_history_v1';

export const INITIAL_SEED_NOTES: Note[] = [
  {
    id: 'seed-capstone-vit',
    createdAt: '2026-10-02T14:30:00.000Z',
    title: 'AI Capstone: Vision Transformer & Latency Optimization',
    category: 'Lecture & Academics',
    tags: ['Vision Transformers', 'Edge TPU', 'Quantization', 'FlashAttention', 'IEEE Paper'],
    sentiment: 'Collaborative & Productive',
    tldr: 'Team reviewed INT8 ViT benchmarks achieving 18.4ms latency; Maria is profiling FlashAttention by Oct 8, and Kevin is finalizing IEEE conference paper submission for Oct 13.',
    executiveSummary: 'The capstone research team led by Professor Vance reviewed latency benchmarks for their quantized Vision Transformer on Edge TPU hardware. INT8 quantization reached 18.4ms per frame, well below the 25ms requirement with negligible accuracy loss. Team assigned FlashAttention profiling to Maria for Thursday and IEEE paper drafting to Kevin ahead of the October 13th deadline.',
    transcript: `[00:00] Professor Vance: Okay team, let's review the milestones for our Multimodal Vision Transformer project.
[00:06] Alex: Good morning Professor. We finished the FP16 and INT8 quantization benchmarks on the Edge TPU yesterday.
[00:15] Professor Vance: Excellent Alex. What were the latency numbers compared to the baseline ResNet-50?
[00:23] Alex: The quantized ViT achieved 18.4 milliseconds per inference frame with only a 0.7 percent drop in Top-1 accuracy on ImageNet-1K.
[00:36] Maria: That's well within our 25 millisecond real-time camera constraint. However, we still have memory bandwidth spikes during attention head computation.
[00:48] Professor Vance: That is a critical finding. Maria, can you profile the FlashAttention-2 kernel by this Thursday, October 8th? We need to ensure thermal throttling doesn't kick in.
[01:03] Maria: Absolutely, I will have the thermal and memory roofline models ready by Thursday at 2 PM.
[01:14] Professor Vance: Great. Also, Kevin, remember the IEEE Student Conference draft submission deadline is next Tuesday, October 13th at midnight. We must finalize the ablation study tables before then.
[01:29] Kevin: Understood. I will push the ablation results by Sunday evening so we can do a complete peer review on Monday.
[01:38] Professor Vance: Perfect. Let's make sure our reproducible GitHub repo and environment Dockerfiles are locked by Friday, October 16th. Meeting adjourned.`,
    segments: [
      { speaker: 'Professor Vance', timestamp: '00:00', text: "Okay team, let's review the milestones for our Multimodal Vision Transformer project." },
      { speaker: 'Alex', timestamp: '00:06', text: "Good morning Professor. We finished the FP16 and INT8 quantization benchmarks on the Edge TPU yesterday." },
      { speaker: 'Professor Vance', timestamp: '00:15', text: "Excellent Alex. What were the latency numbers compared to the baseline ResNet-50?" },
      { speaker: 'Alex', timestamp: '00:23', text: "The quantized ViT achieved 18.4 milliseconds per inference frame with only a 0.7 percent drop in Top-1 accuracy on ImageNet-1K." },
      { speaker: 'Maria', timestamp: '00:36', text: "That's well within our 25 millisecond real-time camera constraint. However, we still have memory bandwidth spikes during attention head computation." },
      { speaker: 'Professor Vance', timestamp: '00:48', text: "That is a critical finding. Maria, can you profile the FlashAttention-2 kernel by this Thursday, October 8th? We need to ensure thermal throttling doesn't kick in." },
      { speaker: 'Maria', timestamp: '01:03', text: "Absolutely, I will have the thermal and memory roofline models ready by Thursday at 2 PM." },
      { speaker: 'Professor Vance', timestamp: '01:14', text: "Great. Also, Kevin, remember the IEEE Student Conference draft submission deadline is next Tuesday, October 13th at midnight. We must finalize the ablation study tables before then." },
      { speaker: 'Kevin', timestamp: '01:29', text: "Understood. I will push the ablation results by Sunday evening so we can do a complete peer review on Monday." },
      { speaker: 'Professor Vance', timestamp: '01:38', text: "Perfect. Let's make sure our reproducible GitHub repo and environment Dockerfiles are locked by Friday, October 16th. Meeting adjourned." }
    ],
    keyPoints: [
      { point: 'Quantized INT8 ViT reached 18.4ms inference time, beating the 25ms real-time latency target.', importance: 'critical', category: 'Performance' },
      { point: 'Top-1 accuracy on ImageNet-1K experienced only a minimal 0.7% degradation.', importance: 'high', category: 'Model Accuracy' },
      { point: 'Memory bandwidth spikes during attention computation require FlashAttention-2 optimization.', importance: 'high', category: 'Optimization' },
      { point: 'IEEE conference draft must include comprehensive ablation study tables.', importance: 'medium', category: 'Academic Publication' }
    ],
    actionItems: [
      { id: 'act-1', task: 'Profile FlashAttention-2 kernel and generate roofline models', assignee: 'Maria', priority: 'high', completed: false, dueDate: 'Thursday, October 8th (2:00 PM)' },
      { id: 'act-2', task: 'Push ablation study results to team repository', assignee: 'Kevin', priority: 'high', completed: false, dueDate: 'Sunday, October 11th' },
      { id: 'act-3', task: 'Conduct peer review of IEEE conference paper draft', assignee: 'Team & Prof. Vance', priority: 'high', completed: false, dueDate: 'Monday, October 12th' },
      { id: 'act-4', task: 'Submit draft to IEEE Student Conference portal', assignee: 'Kevin', priority: 'high', completed: false, dueDate: 'Tuesday, October 13th (Midnight)' },
      { id: 'act-5', task: 'Freeze reproducible GitHub repository and build environment Dockerfile', assignee: 'Alex', priority: 'medium', completed: true, dueDate: 'Friday, October 16th' }
    ],
    extractedDates: [
      { date: 'Thursday, Oct 8 at 2:00 PM', context: 'Maria to deliver FlashAttention-2 kernel profile and roofline models', type: 'deadline' },
      { date: 'Sunday, Oct 11', context: 'Kevin to push ablation study tables', type: 'milestone' },
      { date: 'Monday, Oct 12', context: 'Comprehensive team peer review of research paper', type: 'meeting' },
      { date: 'Tuesday, Oct 13 at 11:59 PM', context: 'IEEE Student Conference paper submission cutoff', type: 'deadline' },
      { date: 'Friday, Oct 16', context: 'Repository lock and Dockerfile packaging', type: 'milestone' }
    ],
    entities: [
      { name: 'Professor Vance', type: 'person' },
      { name: 'Maria', type: 'person' },
      { name: 'Alex', type: 'person' },
      { name: 'Kevin', type: 'person' },
      { name: 'Edge TPU', type: 'technology' },
      { name: 'Vision Transformer (ViT)', type: 'technology' },
      { name: 'FlashAttention-2', type: 'technology' },
      { name: 'ImageNet-1K', type: 'technology' },
      { name: 'IEEE Student Conference', type: 'organization' }
    ],
    audioStats: {
      estimatedWpm: 148,
      detectedLanguage: 'English (US)',
      tone: 'Academic / Technical Review',
      duration: '01:45',
      fileName: 'vit_quantization_capstone_review.wav',
      fileSize: '3.4 MB'
    },
    isPinned: true
  },
  {
    id: 'seed-lecture-attention',
    createdAt: '2026-10-01T10:15:00.000Z',
    title: 'CS 482: Self-Attention & Transformer Pretraining',
    category: 'Lecture & Academics',
    tags: ['Transformers', 'Attention Mechanism', 'PyTorch', 'Exam Prep', 'Complexity'],
    sentiment: 'Instructional & Academic',
    tldr: 'Prof. Gupta explains scaled dot-product attention mathematics, gradient vanishing mitigation, and assigns PyTorch programming homework due Oct 23rd.',
    executiveSummary: 'In CS 482, Professor Gupta analyzed the mechanics of Scaled Dot-Product Attention from Vaswani et al. (2017). Scaling by sqrt(d_k) prevents softmax gradient vanishing at large dimensions. He highlighted the O(N^2) quadratic complexity bottleneck in long-context models and announced Midterm Exam 1 for October 21st alongside a PyTorch coding assignment due October 23rd.',
    transcript: `[00:00] Professor Gupta: Welcome back students. Today in CS 482, we are discussing the mathematical foundations of the Transformer architecture.
[00:10] As introduced in the Vaswani et al. 2017 paper, the core engine is Scaled Dot-Product Attention.
[00:24] Recall the formula: Attention of Q, K, V equals Softmax of Q K transpose divided by the square root of d_k, multiplied by V.
[00:41] Why do we scale by the square root of d_k? For large values of d_k, the dot products grow large in magnitude, pushing the softmax function into regions with extremely small gradients.
[01:05] Take note: this will be on Midterm Exam 1, scheduled for Wednesday, October 21st in Hall B.
[01:19] Next, let's examine the computational complexity. Standard self-attention scales quadratically with sequence length O of N squared.
[01:34] When dealing with 32k or 128k context windows in modern LLMs, standard attention becomes memory bound.
[01:48] For your programming assignment due Friday, October 23rd at 5:00 PM, you will implement multi-head attention from scratch in PyTorch.
[02:02] Office hours for questions are this Tuesday from 3 to 5 PM with Teaching Assistant Rahul.`,
    segments: [
      { speaker: 'Professor Gupta', timestamp: '00:00', text: 'Welcome back students. Today in CS 482, we are discussing the mathematical foundations of the Transformer architecture.' },
      { speaker: 'Professor Gupta', timestamp: '00:10', text: 'As introduced in the Vaswani et al. 2017 paper, the core engine is Scaled Dot-Product Attention.' },
      { speaker: 'Professor Gupta', timestamp: '00:24', text: 'Recall the formula: Attention of Q, K, V equals Softmax of Q K transpose divided by the square root of d_k, multiplied by V.' },
      { speaker: 'Professor Gupta', timestamp: '00:41', text: 'Why do we scale by the square root of d_k? For large values of d_k, the dot products grow large in magnitude, pushing the softmax function into regions with extremely small gradients.' },
      { speaker: 'Professor Gupta', timestamp: '01:05', text: 'Take note: this will be on Midterm Exam 1, scheduled for Wednesday, October 21st in Hall B.' },
      { speaker: 'Professor Gupta', timestamp: '01:19', text: "Next, let's examine the computational complexity. Standard self-attention scales quadratically with sequence length O of N squared." },
      { speaker: 'Professor Gupta', timestamp: '01:34', text: 'When dealing with 32k or 128k context windows in modern LLMs, standard attention becomes memory bound.' },
      { speaker: 'Professor Gupta', timestamp: '01:48', text: 'For your programming assignment due Friday, October 23rd at 5:00 PM, you will implement multi-head attention from scratch in PyTorch.' },
      { speaker: 'Professor Gupta', timestamp: '02:02', text: 'Office hours for questions are this Tuesday from 3 to 5 PM with Teaching Assistant Rahul.' }
    ],
    keyPoints: [
      { point: 'Attention formula: Softmax(Q K^T / sqrt(d_k)) * V is the foundational equation.', importance: 'critical', category: 'Mathematical Formula' },
      { point: 'Dividing by sqrt(d_k) counteracts vanishing gradients caused by exploding dot product magnitudes.', importance: 'high', category: 'Optimization' },
      { point: 'Standard self-attention suffers from O(N^2) quadratic memory and computational complexity.', importance: 'high', category: 'Computational Complexity' },
      { point: 'Midterm Exam 1 covers Transformer derivations on Wednesday, October 21st.', importance: 'critical', category: 'Examination' }
    ],
    actionItems: [
      { id: 'act-101', task: 'Attend TA office hours for PyTorch tensor manipulation guidance', assignee: 'Students', priority: 'medium', completed: false, dueDate: 'Tuesday, October 20th (3:00 - 5:00 PM)' },
      { id: 'act-102', task: 'Study attention gradient derivations for Midterm Exam 1', assignee: 'Students', priority: 'high', completed: false, dueDate: 'Wednesday, October 21st (Hall B)' },
      { id: 'act-103', task: 'Complete and submit Programming Assignment 2 (Multi-Head Attention in PyTorch)', assignee: 'Students', priority: 'high', completed: false, dueDate: 'Friday, October 23rd at 5:00 PM' }
    ],
    extractedDates: [
      { date: 'Tuesday, Oct 20 (3:00 PM - 5:00 PM)', context: 'Rahul TA Office Hours', type: 'meeting' },
      { date: 'Wednesday, Oct 21', context: 'CS 482 Midterm Exam 1 in Hall B', type: 'deadline' },
      { date: 'Friday, Oct 23 at 5:00 PM', context: 'Programming Assignment 2 PyTorch Multi-Head Attention Due', type: 'deadline' }
    ],
    entities: [
      { name: 'Professor Gupta', type: 'person' },
      { name: 'Rahul (TA)', type: 'person' },
      { name: 'Vaswani et al. (2017)', type: 'reference' },
      { name: 'Scaled Dot-Product Attention', type: 'technology' },
      { name: 'PyTorch', type: 'technology' },
      { name: 'Midterm Exam 1', type: 'date' }
    ],
    audioStats: {
      estimatedWpm: 135,
      detectedLanguage: 'English',
      tone: 'Academic Lecture',
      duration: '02:10',
      fileName: 'cs482_lecture08_attention.mp3',
      fileSize: '4.8 MB'
    },
    isPinned: false
  }
];

export function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_NOTES));
      return INITIAL_SEED_NOTES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return INITIAL_SEED_NOTES;
    }
    return parsed;
  } catch (err) {
    console.warn('Failed to load notes from localStorage, using seeds:', err);
    return INITIAL_SEED_NOTES;
  }
}

export function saveNotes(notes: Note[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (err) {
    console.error('Failed to save notes to localStorage:', err);
  }
}

export function exportToMarkdown(note: Note): string {
  const lines: string[] = [];
  lines.push(`# ${note.title}`);
  lines.push(`\n**Category:** ${note.category} | **Recorded:** ${new Date(note.createdAt).toLocaleDateString()} | **Tone:** ${note.sentiment}`);
  lines.push(`\n**Tags:** ${note.tags.join(', ')}`);
  
  lines.push(`\n---\n`);
  lines.push(`## 📌 TL;DR\n${note.tldr}\n`);
  
  lines.push(`## 📝 Executive Summary\n${note.executiveSummary}\n`);

  if (note.keyPoints && note.keyPoints.length > 0) {
    lines.push(`## 💡 Key Points & Takeaways`);
    note.keyPoints.forEach(kp => {
      const importanceTag = kp.importance ? `[${kp.importance.toUpperCase()}] ` : '';
      const cat = kp.category ? `*(${kp.category})* ` : '';
      lines.push(`- ${importanceTag}${cat}${kp.point}`);
    });
    lines.push('');
  }

  if (note.actionItems && note.actionItems.length > 0) {
    lines.push(`## ✅ Action Items & Tasks`);
    note.actionItems.forEach(item => {
      const box = item.completed ? '[x]' : '[ ]';
      const assignee = item.assignee ? `@${item.assignee} ` : '';
      const due = item.dueDate ? `*(Due: ${item.dueDate})* ` : '';
      const prio = item.priority ? `[Priority: ${item.priority}] ` : '';
      lines.push(`- ${box} ${assignee}${item.task} ${due}${prio}`);
    });
    lines.push('');
  }

  if (note.extractedDates && note.extractedDates.length > 0) {
    lines.push(`## 📅 Dates & Deadlines`);
    note.extractedDates.forEach(d => {
      lines.push(`- **${d.date}**: ${d.context} *(Type: ${d.type})*`);
    });
    lines.push('');
  }

  lines.push(`## 🎙️ Transcript`);
  lines.push(note.transcript);

  return lines.join('\n');
}

export function exportToText(note: Note): string {
  const lines: string[] = [];
  lines.push('================================================================================');
  lines.push(`NOTE TITLE: ${note.title}`);
  lines.push(`CATEGORY:   ${note.category}`);
  lines.push(`RECORDED:   ${new Date(note.createdAt).toLocaleString()}`);
  if (note.audioStats?.duration) {
    lines.push(`DURATION:   ${note.audioStats.duration}`);
  }
  if (note.audioStats?.tone) {
    lines.push(`TONE:       ${note.audioStats.tone}`);
  }
  if (note.tags && note.tags.length > 0) {
    lines.push(`TAGS:       ${note.tags.join(', ')}`);
  }
  lines.push('================================================================================\n');

  lines.push('--- [ 1. TL;DR OVERVIEW ] ---');
  lines.push(`${note.tldr || 'No TL;DR available.'}\n`);

  lines.push('--- [ 2. EXECUTIVE SUMMARY ] ---');
  lines.push(`${note.executiveSummary || 'No summary available.'}\n`);

  if (note.keyPoints && note.keyPoints.length > 0) {
    lines.push('--- [ 3. KEY POINTS & TAKEAWAYS ] ---');
    note.keyPoints.forEach((kp, idx) => {
      const importanceTag = kp.importance ? `[${kp.importance.toUpperCase()}] ` : '';
      const cat = kp.category ? `(${kp.category}) ` : '';
      lines.push(`${idx + 1}. ${importanceTag}${cat}${kp.point}`);
    });
    lines.push('');
  }

  if (note.actionItems && note.actionItems.length > 0) {
    lines.push('--- [ 4. ACTION ITEMS & DELIVERABLES ] ---');
    note.actionItems.forEach((item, idx) => {
      const status = item.completed ? '[X] COMPLETED' : '[ ] PENDING';
      const assignee = item.assignee ? ` | Responsible: ${item.assignee}` : '';
      const due = item.dueDate ? ` | Deadline: ${item.dueDate}` : '';
      const prio = item.priority ? ` | Priority: ${item.priority.toUpperCase()}` : '';
      lines.push(`${idx + 1}. ${status}: ${item.task}${assignee}${due}${prio}`);
    });
    lines.push('');
  }

  if (note.extractedDates && note.extractedDates.length > 0) {
    lines.push('--- [ 5. DATES & DEADLINES ] ---');
    note.extractedDates.forEach((d, idx) => {
      lines.push(`${idx + 1}. Date/Time: ${d.date} (Type: ${d.type.toUpperCase()})`);
      lines.push(`   Context:   ${d.context}`);
    });
    lines.push('');
  }

  lines.push('--- [ 6. FULL VERBATIM TRANSCRIPT ] ---');
  lines.push(note.transcript || 'No transcript recorded.');
  lines.push('\n================================================================================');
  lines.push(`Generated by VoxScribe AI Voice-to-Notes Assistant on ${new Date().toLocaleDateString()}`);

  return lines.join('\n');
}

export function exportToPDF(note: Note): void {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPage = (heightNeeded: number) => {
    if (y + heightNeeded > pageHeight - margin - 20) {
      doc.addPage();
      y = margin + 15;
      addHeaderFooter();
    }
  };

  const addHeaderFooter = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(140, 150, 165);
    doc.text(`VoxScribe AI — Voice-to-Notes`, margin, 25);
    doc.text(`Category: ${note.category}`, pageWidth - margin, 25, { align: 'right' });
    doc.setDrawColor(220, 226, 235);
    doc.line(margin, 29, pageWidth - margin, 29);
  };

  // 1. Top Document Header & Brand
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(margin, y, contentWidth, 38, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(6, 182, 212); // cyan-400
  doc.text('VOXSCRIBE AI', margin + 12, y + 18);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text('|  Voice-to-Notes Academic & Team Intelligence Report', margin + 105, y + 18);
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - margin - 12, y + 18, { align: 'right' });
  y += 50;

  // 2. Note Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  const titleLines = doc.splitTextToSize(note.title, contentWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 20 + 6;

  // 3. Metadata Bar (Category, Date, Duration, Tone)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  const metaText = [
    `Category: ${note.category}`,
    `Recorded: ${new Date(note.createdAt).toLocaleDateString()}`,
    note.audioStats?.duration ? `Duration: ${note.audioStats.duration}` : '',
    note.audioStats?.tone ? `Tone: ${note.audioStats.tone}` : '',
  ]
    .filter(Boolean)
    .join('  ·  ');
  doc.text(metaText, margin, y);
  y += 16;

  if (note.tags && note.tags.length > 0) {
    doc.setFontSize(8);
    doc.setTextColor(79, 70, 229); // indigo
    doc.text(`Tags: ${note.tags.map(t => `#${t}`).join('  ')}`, margin, y);
    y += 18;
  }

  doc.setDrawColor(203, 213, 225);
  doc.line(margin, y, pageWidth - margin, y);
  y += 18;

  // Helper for Section Titles
  const printSectionHeader = (title: string, color = [30, 41, 59]) => {
    checkPage(35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(title, margin, y);
    y += 4;
    doc.setDrawColor(203, 213, 225);
    doc.line(margin, y, margin + contentWidth, y);
    y += 14;
  };

  // 4. TL;DR Box
  if (note.tldr) {
    checkPage(45);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    const tldrLines = doc.splitTextToSize(`TL;DR: ${note.tldr}`, contentWidth - 24);
    const boxHeight = tldrLines.length * 13 + 16;
    doc.setFillColor(240, 249, 255); // light cyan
    doc.setDrawColor(186, 230, 253);
    doc.roundedRect(margin, y, contentWidth, boxHeight, 4, 4, 'FD');
    doc.setTextColor(12, 74, 96);
    doc.setFont('helvetica', 'bold');
    doc.text('TL;DR: ', margin + 12, y + 15);
    doc.setFont('helvetica', 'normal');
    doc.text(doc.splitTextToSize(note.tldr, contentWidth - 65), margin + 48, y + 15);
    y += boxHeight + 14;
  }

  // 5. Executive Summary
  printSectionHeader('Executive Summary', [14, 116, 144]);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  const summaryLines = doc.splitTextToSize(note.executiveSummary || 'No summary available.', contentWidth);
  summaryLines.forEach((line: string) => {
    checkPage(14);
    doc.text(line, margin, y);
    y += 13.5;
  });
  y += 14;

  // 6. Action Items (with checkboxes, responsible person, deadlines)
  if (note.actionItems && note.actionItems.length > 0) {
    printSectionHeader(`Action Items & Deliverables (${note.actionItems.length})`, [15, 23, 42]);
    note.actionItems.forEach((item, index) => {
      checkPage(36);
      const isCompleted = item.completed;
      
      // Draw checkbox square
      doc.setDrawColor(148, 163, 184);
      doc.setFillColor(isCompleted ? 220 : 255, isCompleted ? 252 : 255, isCompleted ? 231 : 255);
      doc.rect(margin, y - 9, 10, 10, 'FD');
      if (isCompleted) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(22, 101, 52);
        doc.text('✓', margin + 2, y - 1);
      }

      // Task text
      doc.setFont('helvetica', isCompleted ? 'normal' : 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(isCompleted ? 148 : 30, isCompleted ? 163 : 41, isCompleted ? 184 : 59);
      const taskLines = doc.splitTextToSize(item.task, contentWidth - 20);
      doc.text(taskLines, margin + 16, y);
      y += taskLines.length * 13;

      // Metadata line for item
      const metaParts: string[] = [];
      if (item.assignee) metaParts.push(`Responsible: ${item.assignee}`);
      if (item.dueDate) metaParts.push(`Deadline: ${item.dueDate}`);
      if (item.priority) metaParts.push(`Priority: ${item.priority.toUpperCase()}`);
      metaParts.push(item.completed ? 'Status: Completed' : 'Status: Pending');

      if (metaParts.length > 0) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(71, 85, 105);
        doc.text(metaParts.join('  |  '), margin + 16, y);
        y += 12;
      }
      y += 4;
    });
    y += 10;
  }

  // 7. Dates & Deadlines
  if (note.extractedDates && note.extractedDates.length > 0) {
    printSectionHeader(`Dates, Deadlines & Milestones (${note.extractedDates.length})`, [190, 24, 93]);
    note.extractedDates.forEach((d) => {
      checkPage(30);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(190, 24, 93);
      doc.text(`• ${d.date}`, margin + 5, y);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(`[${d.type.toUpperCase()}]`, margin + 160, y);
      y += 11;

      doc.setTextColor(51, 65, 85);
      doc.setFontSize(8.5);
      const contextLines = doc.splitTextToSize(d.context, contentWidth - 15);
      doc.text(contextLines, margin + 15, y);
      y += contextLines.length * 11 + 6;
    });
    y += 10;
  }

  // 8. Key Points & Conceptual Decisions
  if (note.keyPoints && note.keyPoints.length > 0) {
    printSectionHeader('Key Points & Conceptual Decisions', [67, 56, 202]);
    note.keyPoints.forEach((kp, idx) => {
      checkPage(24);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(67, 56, 202);
      const imp = kp.importance ? `[${kp.importance.toUpperCase()}] ` : '';
      const cat = kp.category ? `(${kp.category}) ` : '';
      doc.text(`${idx + 1}. ${imp}${cat}`, margin + 5, y);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.setFontSize(9);
      const pointLines = doc.splitTextToSize(kp.point, contentWidth - 20);
      doc.text(pointLines, margin + 15, y + 10);
      y += pointLines.length * 12 + 14;
    });
    y += 10;
  }

  // 9. Full Verbatim Transcript
  printSectionHeader('Full Verbatim Transcript', [15, 23, 42]);
  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  const transcriptLines = doc.splitTextToSize(note.transcript || 'No transcript text available.', contentWidth);
  transcriptLines.forEach((tLine: string) => {
    checkPage(11);
    doc.text(tLine, margin, y);
    y += 10.5;
  });

  // 10. Page Numbers on All Pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 30, pageWidth - margin, pageHeight - 30);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 18, { align: 'right' });
    doc.text(`VoxScribe AI — Voice-to-Notes Intelligence`, margin, pageHeight - 18);
  }

  // Save the generated PDF
  const safeTitle = note.title.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  doc.save(`${safeTitle}.pdf`);
}

export function exportToJSON(note: Note): string {
  return JSON.stringify(note, null, 2);
}

// Generates an iCalendar (.ics) file content containing the note's deadlines
export function exportToICS(note: Note): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//VoxScribe AI//Voice-to-Notes Assistant//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ];

  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  note.extractedDates.forEach((item, index) => {
    // Generate simple event for the extracted deadline
    const uid = `${note.id}-event-${index}@voxscribe.ai`;
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${uid}`);
    lines.push(`DTSTAMP:${now}`);
    lines.push(`SUMMARY:${item.context.slice(0, 50)} [${note.title}]`);
    lines.push(`DESCRIPTION:${item.context}\\n\\nReferenced in note: ${note.title}\\nDate/Time: ${item.date}`);
    lines.push(`STATUS:CONFIRMED`);
    lines.push('END:VEVENT');
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export function downloadFile(content: string, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
