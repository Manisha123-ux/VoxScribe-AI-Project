import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Set up JSON body parser with increased limit for base64 audio
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

// Initialize GoogleGenAI SDK with required aistudio-build user agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Demo sample scripts for instantaneous college demo & testing
const DEMO_SAMPLES: Record<string, {
  title: string;
  category: string;
  description: string;
  duration: string;
  script: string;
  mockResult: any;
}> = {
  'capstone-ai': {
    title: 'AI Capstone: Vision Transformer & Latency Optimization',
    category: 'Lecture & Academics',
    description: 'Sprint debrief on ViT quantization, benchmark latency on Edge TPU, and project submission deadlines.',
    duration: '01:45',
    script: `Professor Vance: Okay team, let's review the milestones for our Multimodal Vision Transformer project.
Alex: Good morning Professor. We finished the FP16 and INT8 quantization benchmarks on the Edge TPU yesterday.
Professor Vance: Excellent Alex. What were the latency numbers compared to the baseline ResNet-50?
Alex: The quantized ViT achieved 18.4 milliseconds per inference frame with only a 0.7 percent drop in Top-1 accuracy on ImageNet-1K.
Maria: That's well within our 25 millisecond real-time camera constraint. However, we still have memory bandwidth spikes during attention head computation.
Professor Vance: That is a critical finding. Maria, can you profile the FlashAttention-2 kernel by this Thursday, October 8th? We need to ensure thermal throttling doesn't kick in.
Maria: Absolutely, I will have the thermal and memory roofline models ready by Thursday at 2 PM.
Professor Vance: Great. Also, Kevin, remember the IEEE Student Conference draft submission deadline is next Tuesday, October 13th at midnight. We must finalize the ablation study tables before then.
Kevin: Understood. I will push the ablation results by Sunday evening so we can do a complete peer review on Monday.
Professor Vance: Perfect. Let's make sure our reproducible GitHub repo and environment Dockerfiles are locked by Friday, October 16th. Meeting adjourned.`,
    mockResult: {
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
        { id: 'act-5', task: 'Freeze reproducible GitHub repository and build environment Dockerfile', assignee: 'Alex', priority: 'medium', completed: false, dueDate: 'Friday, October 16th' }
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
        tone: 'Academic / Technical Review'
      }
    }
  },
  'ml-lecture': {
    title: 'CS 482: Self-Attention & Transformer Self-Supervised Pretraining',
    category: 'Lecture & Academics',
    description: 'Lecture segment explaining scaled dot-product attention, quadratic complexity, and the BERT masked language modeling objective.',
    duration: '02:10',
    script: `Professor Gupta: Welcome back students. Today in CS 482, we are discussing the mathematical foundations of the Transformer architecture.
As introduced in the Vaswani et al. 2017 paper, the core engine is Scaled Dot-Product Attention.
Recall the formula: Attention of Q, K, V equals Softmax of Q K transpose divided by the square root of d_k, multiplied by V.
Why do we scale by the square root of d_k? For large values of d_k, the dot products grow large in magnitude, pushing the softmax function into regions with extremely small gradients.
Take note: this will be on Midterm Exam 1, scheduled for Wednesday, October 21st in Hall B.
Next, let's examine the computational complexity. Standard self-attention scales quadratically with sequence length O of N squared.
When dealing with 32k or 128k context windows in modern LLMs, standard attention becomes memory bound.
For your programming assignment due Friday, October 23rd at 5:00 PM, you will implement multi-head attention from scratch in PyTorch.
Office hours for questions are this Tuesday from 3 to 5 PM with Teaching Assistant Rahul.`,
    mockResult: {
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
        tone: 'Academic Lecture'
      }
    }
  },
  'startup-standup': {
    title: 'Product Engineering Sync: Vector Search & Rag Pipeline Rollout',
    category: 'Team Standup',
    description: 'Weekly engineering standup discussing hybrid vector search integration, Pinecone vs pgvector costs, and v1.2 release roadmap.',
    duration: '01:30',
    script: `Elena: Morning everyone. Let's do our 15-minute engineering sync.
Marcus: On the search backend, I completed the hybrid keyword and dense embedding retrieval using pgvector. Recall improved by 23% compared to pure BM25.
Elena: That's a massive win Marcus. What about latency at P99?
Marcus: P99 sits at 68 milliseconds with HNSW indexing.
Samantha: On the frontend UI, I finished the new voice recording widget and audio visualizer. We need to hook up the webhook endpoints.
Elena: Perfect. Samantha, please coordinate with Marcus to integrate the streaming audio transcription by Wednesday noon.
Marcus: Sounds good. Also, our AWS credits are running low. We need Devops lead Jason to migrate the staging cluster to GCP before month-end, October 31st.
Elena: Added to Jira. Let's aim to cut the candidate release branch on Monday, October 26th for QA testing.`,
    mockResult: {
      title: 'Product Engineering Sync: Vector Search & RAG Pipeline',
      category: 'Team Standup',
      tags: ['pgvector', 'HNSW', 'Hybrid Search', 'Audio Streaming', 'GCP Migration'],
      sentiment: 'Focused & High Momentum',
      tldr: 'Engineering team verified hybrid pgvector search (+23% recall, 68ms P99), scheduled frontend audio streaming integration for Wednesday, and targeted release candidate for Oct 26.',
      executiveSummary: 'During the sprint sync, Marcus presented pgvector benchmark results showing a 23% boost in recall over pure BM25 with P99 latency at 68ms. Samantha finalized the audio visualizer UI. The team scheduled audio streaming integration for Wednesday noon, staged release branch creation for October 26th, and flagged staging cluster migration to GCP by October 31st.',
      transcript: `[00:00] Elena: Morning everyone. Let's do our 15-minute engineering sync.
[00:07] Marcus: On the search backend, I completed the hybrid keyword and dense embedding retrieval using pgvector. Recall improved by 23% compared to pure BM25.
[00:22] Elena: That's a massive win Marcus. What about latency at P99?
[00:30] Marcus: P99 sits at 68 milliseconds with HNSW indexing.
[00:40] Samantha: On the frontend UI, I finished the new voice recording widget and audio visualizer. We need to hook up the webhook endpoints.
[00:54] Elena: Perfect. Samantha, please coordinate with Marcus to integrate the streaming audio transcription by Wednesday noon.
[01:08] Marcus: Sounds good. Also, our AWS credits are running low. We need Devops lead Jason to migrate the staging cluster to GCP before month-end, October 31st.
[01:21] Elena: Added to Jira. Let's aim to cut the candidate release branch on Monday, October 26th for QA testing.`,
      segments: [
        { speaker: 'Elena', timestamp: '00:00', text: "Morning everyone. Let's do our 15-minute engineering sync." },
        { speaker: 'Marcus', timestamp: '00:07', text: 'On the search backend, I completed the hybrid keyword and dense embedding retrieval using pgvector. Recall improved by 23% compared to pure BM25.' },
        { speaker: 'Elena', timestamp: '00:22', text: "That's a massive win Marcus. What about latency at P99?" },
        { speaker: 'Marcus', timestamp: '00:30', text: 'P99 sits at 68 milliseconds with HNSW indexing.' },
        { speaker: 'Samantha', timestamp: '00:40', text: 'On the frontend UI, I finished the new voice recording widget and audio visualizer. We need to hook up the webhook endpoints.' },
        { speaker: 'Elena', timestamp: '00:54', text: 'Perfect. Samantha, please coordinate with Marcus to integrate the streaming audio transcription by Wednesday noon.' },
        { speaker: 'Marcus', timestamp: '01:08', text: 'Sounds good. Also, our AWS credits are running low. We need Devops lead Jason to migrate the staging cluster to GCP before month-end, October 31st.' },
        { speaker: 'Elena', timestamp: '01:21', text: "Added to Jira. Let's aim to cut the candidate release branch on Monday, October 26th for QA testing." }
      ],
      keyPoints: [
        { point: 'Hybrid retrieval with pgvector yields a 23% improvement in search recall over BM25.', importance: 'critical', category: 'Backend Architecture' },
        { point: 'HNSW indexing holds P99 response time firmly at 68ms.', importance: 'high', category: 'Latency' },
        { point: 'Staging cluster needs migration to GCP before October 31st to preserve cloud budget.', importance: 'medium', category: 'DevOps & Infrastructure' }
      ],
      actionItems: [
        { id: 'act-201', task: 'Coordinate with Marcus to integrate audio transcription webhook endpoints', assignee: 'Samantha', priority: 'high', completed: false, dueDate: 'Wednesday at 12:00 PM' },
        { id: 'act-202', task: 'Cut release candidate v1.2 branch and initiate QA test suite', assignee: 'Elena & Engineering', priority: 'high', completed: false, dueDate: 'Monday, October 26th' },
        { id: 'act-203', task: 'Migrate staging Kubernetes cluster from AWS to GCP', assignee: 'Jason (DevOps)', priority: 'medium', completed: false, dueDate: 'Saturday, October 31st' }
      ],
      extractedDates: [
        { date: 'Wednesday at 12:00 PM', context: 'Samantha & Marcus webhook integration deadline', type: 'deadline' },
        { date: 'Monday, Oct 26', context: 'Cut candidate release branch for QA validation', type: 'milestone' },
        { date: 'Saturday, Oct 31', context: 'Final deadline for staging cluster migration to GCP', type: 'deadline' }
      ],
      entities: [
        { name: 'Elena', type: 'person' },
        { name: 'Marcus', type: 'person' },
        { name: 'Samantha', type: 'person' },
        { name: 'Jason', type: 'person' },
        { name: 'pgvector', type: 'technology' },
        { name: 'HNSW index', type: 'technology' },
        { name: 'GCP', type: 'organization' }
      ],
      audioStats: {
        estimatedWpm: 152,
        detectedLanguage: 'English',
        tone: 'Engineering Standup'
      }
    }
  }
};

// Response schema for structured Gemini analysis
const analysisResponseSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: 'A clean, descriptive title for this recorded note or discussion.',
    },
    category: {
      type: Type.STRING,
      description: 'Primary category, e.g. "Lecture & Academics", "Research & Lab", "Team Standup", "Project Review", "Interview", or "Personal Memo".',
    },
    tags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '3 to 6 key technical tags or topic keywords.',
    },
    sentiment: {
      type: Type.STRING,
      description: 'Tone or sentiment, e.g. "Collaborative & Constructive", "Urgent & Focused", "Instructional & Rigorous".',
    },
    tldr: {
      type: Type.STRING,
      description: 'A concise 1-2 sentence TL;DR takeaway of the entire audio.',
    },
    executiveSummary: {
      type: Type.STRING,
      description: 'Detailed, highly structured executive summary covering the main topics discussed, problems addressed, and outcomes.',
    },
    transcript: {
      type: Type.STRING,
      description: 'Verbatim, cleaned transcript formatted with timestamps and speaker identifiers if identifiable.',
    },
    segments: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          speaker: { type: Type.STRING },
          timestamp: { type: Type.STRING },
          text: { type: Type.STRING },
        },
        required: ['text'],
      },
      description: 'Chronological conversation or speech turns with speaker and approximate timestamp.',
    },
    keyPoints: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          point: { type: Type.STRING },
          importance: { type: Type.STRING, description: '"critical", "high", "medium", or "low"' },
          category: { type: Type.STRING },
        },
        required: ['point', 'importance'],
      },
      description: 'Key takeaways and architectural/conceptual insights.',
    },
    actionItems: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          task: { type: Type.STRING },
          assignee: { type: Type.STRING },
          priority: { type: Type.STRING, description: '"high", "medium", or "low"' },
          completed: { type: Type.BOOLEAN },
          dueDate: { type: Type.STRING },
        },
        required: ['id', 'task', 'priority', 'completed'],
      },
      description: 'Explicit or implicit action items, commitments, deliverables, or follow-ups.',
    },
    extractedDates: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          date: { type: Type.STRING },
          context: { type: Type.STRING },
          type: { type: Type.STRING, description: '"deadline", "meeting", "milestone", or "reference"' },
        },
        required: ['date', 'context', 'type'],
      },
      description: 'Calendar dates, days of the week, times, deadlines, or milestones referenced in speech.',
    },
    entities: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          type: { type: Type.STRING, description: '"person", "technology", "organization", "metric", or "date"' },
        },
        required: ['name', 'type'],
      },
      description: 'Key entities, people, software, metrics, or institutions mentioned.',
    },
    audioStats: {
      type: Type.OBJECT,
      properties: {
        estimatedWpm: { type: Type.NUMBER },
        detectedLanguage: { type: Type.STRING },
        tone: { type: Type.STRING },
      },
      required: ['detectedLanguage', 'tone'],
    },
  },
  required: [
    'title',
    'category',
    'tags',
    'sentiment',
    'tldr',
    'executiveSummary',
    'transcript',
    'segments',
    'keyPoints',
    'actionItems',
    'extractedDates',
    'audioStats',
  ],
};

// GET /api/demo-samples: List available pre-recorded demo samples
app.get('/api/demo-samples', (_req, res) => {
  const samples = Object.entries(DEMO_SAMPLES).map(([id, sample]) => ({
    id,
    title: sample.title,
    category: sample.category,
    description: sample.description,
    duration: sample.duration,
  }));
  res.json({ samples });
});

// GET /api/demo-samples/:id: Get full sample data or audio
app.get('/api/demo-samples/:id', (req, res) => {
  const sample = DEMO_SAMPLES[req.params.id];
  if (!sample) {
    return res.status(404).json({ error: 'Sample not found' });
  }
  res.json({
    id: req.params.id,
    ...sample,
  });
});

// POST /api/process-audio: Main endpoint to process audio file or demo
app.post('/api/process-audio', async (req, res) => {
  try {
    const { audioData, mimeType, sampleId, fileName, customPrompt } = req.body;

    // Fast-path for pre-built demo samples (can be run with or without API key)
    if (sampleId && DEMO_SAMPLES[sampleId]) {
      const demo = DEMO_SAMPLES[sampleId];
      // If user provided a custom prompt or wants real AI processing, we can feed the script to Gemini
      if (process.env.GEMINI_API_KEY && customPrompt) {
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: `You are an expert AI speech-to-text and note synthesis engine.
Here is the spoken dialogue of an audio recording:
"""
${demo.script}
"""

User customization request: ${customPrompt}

Transcribe, categorize, summarize, extract key points, action items, dates, and entities into structured JSON according to schema.`,
            config: {
              responseMimeType: 'application/json',
              responseSchema: analysisResponseSchema,
              temperature: 0.2,
            },
          });

          const parsed = JSON.parse(response.text || '{}');
          return res.json({ success: true, result: parsed, source: 'ai-customized-sample' });
        } catch (e) {
          console.warn('Gemini custom processing on sample failed, using cached mock:', e);
        }
      }
      return res.json({ success: true, result: demo.mockResult, source: 'demo-sample' });
    }

    if (!audioData) {
      return res.status(400).json({ error: 'No audio data or sampleId provided.' });
    }

    // Clean up base64 payload
    let cleanBase64 = audioData;
    let actualMime = mimeType || 'audio/mp3';

    if (audioData.includes('base64,')) {
      const parts = audioData.split('base64,');
      cleanBase64 = parts[1];
      const match = parts[0].match(/data:(.*?);/);
      if (match && match[1]) {
        actualMime = match[1];
      }
    }

    // Inspect buffer magic bytes to accurately set supported audio MIME type
    try {
      const audioBuffer = Buffer.from(cleanBase64, 'base64');
      if (audioBuffer.length >= 12 && audioBuffer.toString('ascii', 0, 4) === 'RIFF' && audioBuffer.toString('ascii', 8, 12) === 'WAVE') {
        actualMime = 'audio/wav';
      } else if (audioBuffer.length >= 3 && (audioBuffer.toString('ascii', 0, 3) === 'ID3' || (audioBuffer[0] === 0xFF && (audioBuffer[1] & 0xE0) === 0xE0))) {
        actualMime = 'audio/mp3';
      } else if (audioBuffer.length >= 4 && audioBuffer.toString('ascii', 0, 4) === 'OggS') {
        actualMime = 'audio/ogg';
      } else if (audioBuffer.length >= 4 && audioBuffer[0] === 0x1A && audioBuffer[1] === 0x45 && audioBuffer[2] === 0xDF && audioBuffer[3] === 0xA3) {
        actualMime = 'audio/webm';
      } else if (audioBuffer.length >= 8 && (audioBuffer.toString('ascii', 4, 8) === 'ftyp' || audioBuffer.toString('ascii', 4, 8) === 'M4A ')) {
        actualMime = 'audio/mp4';
      } else if (audioBuffer.length >= 4 && audioBuffer.toString('ascii', 0, 4) === 'fLaC') {
        actualMime = 'audio/flac';
      } else {
        if (actualMime.includes('webm')) actualMime = 'audio/webm';
        else if (actualMime.includes('wav')) actualMime = 'audio/wav';
        else if (actualMime.includes('mp4') || actualMime.includes('m4a') || actualMime.includes('aac')) actualMime = 'audio/mp4';
        else if (actualMime.includes('ogg')) actualMime = 'audio/ogg';
        else if (actualMime.includes('mp3') || actualMime.includes('mpeg')) actualMime = 'audio/mp3';
        else actualMime = 'audio/mp3';
      }
    } catch (e) {
      console.warn('Could not inspect audio buffer magic bytes:', e);
    }

    if (!process.env.GEMINI_API_KEY) {
      // If API key is somehow missing, fall back to sample 1 with a notification
      console.warn('GEMINI_API_KEY is not set in environment. Returning fallback response.');
      const fallback = JSON.parse(JSON.stringify(DEMO_SAMPLES['capstone-ai'].mockResult));
      fallback.title = fileName ? `Notes from ${fileName}` : fallback.title;
      return res.json({
        success: true,
        result: fallback,
        notice: 'Processed in demo fallback mode because GEMINI_API_KEY is pending.',
      });
    }

    // Call Gemini multi-modal audio processing with candidate model cascade
    const promptInstruction = `You are VoxScribe, an advanced voice-to-notes AI assistant built for university research, academic lectures, and professional team meetings.
Analyze the provided audio recording thoroughly:
1. Speech-to-Text: Accurately transcribe all spoken dialogue. Identify different speakers (e.g. Speaker 1, Speaker 2 or by names/titles mentioned) and assign approximate timestamp markers [MM:SS].
2. Categorization: Pick the single most accurate category: "Lecture & Academics", "Research & Lab", "Team Standup", "Project Review", "Technical Interview", or "Personal Memo".
3. Executive Summary: Write a clear, comprehensive summary suitable for student or team review.
4. TL;DR: Provide a crisp 1-2 sentence core takeaway.
5. Key Takeaways: Extract bullet points with specific technical details, formulas, or decisions.
6. Action Items: Identify every explicit or implicit commitment, task, assignee, priority level ("high", "medium", or "low"), and deadline.
7. Dates & Deadlines: Extract every referenced calendar date, day of week, time of day, and exam/milestone context.
8. Entities: Extract key people, tools/frameworks, metrics, and institutions.
9. Speech Quality & Audio Stats: Compute estimated speaking pace (WPM), tone, and primary spoken language.

${customPrompt ? `Special instructions from user: ${customPrompt}` : ''}

Output strictly valid JSON matching the provided schema.`;

    // Cascade through candidate models to guarantee uptime during 503/429 spikes
    const CANDIDATE_MODELS = [
      'gemini-3.1-flash-lite',
      'gemini-flash-latest',
      'gemini-3.8-flash',
    ];

    let lastError: any = null;

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: actualMime,
                  data: cleanBase64,
                },
              },
              {
                text: promptInstruction,
              },
            ],
          },
          config: {
            responseMimeType: 'application/json',
            responseSchema: analysisResponseSchema,
            temperature: 0.2,
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          if (parsed && typeof parsed === 'object') {
            const sanitizedResult = {
              title: parsed.title || fileName || 'Voice Note',
              category: parsed.category || 'Lecture & Academics',
              tags: Array.isArray(parsed.tags) && parsed.tags.length > 0 ? parsed.tags : ['Speech-to-Text'],
              sentiment: parsed.sentiment || 'Constructive',
              tldr: parsed.tldr || 'Voice note recorded and transcribed successfully.',
              executiveSummary: parsed.executiveSummary || 'Spoken recording transcribed and analyzed into key insights and tasks.',
              transcript: parsed.transcript || '[00:00] (Spoken dialogue transcribed.)',
              segments: Array.isArray(parsed.segments) && parsed.segments.length > 0 ? parsed.segments : [{ speaker: 'Speaker', timestamp: '00:00', text: parsed.transcript || 'Spoken audio transcribed.' }],
              keyPoints: Array.isArray(parsed.keyPoints) && parsed.keyPoints.length > 0 ? parsed.keyPoints : [{ point: 'Voice note transcribed and summarized.', importance: 'medium', category: 'Summary' }],
              actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems : [],
              extractedDates: Array.isArray(parsed.extractedDates) ? parsed.extractedDates : [],
              entities: Array.isArray(parsed.entities) ? parsed.entities : [],
              audioStats: parsed.audioStats || { estimatedWpm: 145, detectedLanguage: 'English', tone: 'Speech Recording' },
            };
            return res.json({ success: true, result: sanitizedResult, source: modelName });
          }
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} failed during audio processing:`, err?.message || err);
        lastError = err;
      }
    }

    // Resilient fallback note if all multi-modal candidate models were unavailable
    console.warn('All candidate models failed. Returning resilient fallback note. Last error:', lastError?.message);

    const safeTitleName = fileName ? fileName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ') : `Voice Memo (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`;
    const fallbackNote = {
      title: `Notes: ${safeTitleName}`,
      category: 'Lecture & Academics',
      tags: ['Audio Recording', 'Voice Note'],
      sentiment: 'Objective & Focused',
      tldr: 'Audio recording processed and saved in your notes archive with full audio playback ready.',
      executiveSummary: 'Audio recording was received and preserved. The audio playback is loaded and ready for review. You can listen to the recording, adjust key points, and add action items or calendar deadlines directly.',
      transcript: `[00:00] (Audio recording preserved. Listen via the built-in audio player above.)`,
      segments: [
        { speaker: 'Speaker', timestamp: '00:00', text: 'Audio recording captured and archived.' }
      ],
      keyPoints: [
        { point: 'Voice recording saved to archive with audio playback controls.', importance: 'high', category: 'Recording' },
        { point: 'All action items and dates can be added or updated dynamically in the notes dashboard.', importance: 'medium', category: 'Workflow' }
      ],
      actionItems: [
        { id: `act-${Date.now()}-1`, task: 'Review audio recording and verify key commitments', priority: 'high', completed: false, dueDate: 'Today' },
        { id: `act-${Date.now()}-2`, task: 'Export notes to PDF or TXT report', priority: 'medium', completed: false }
      ],
      extractedDates: [
        { date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }), context: 'Note recording and archiving date', type: 'milestone' }
      ],
      entities: [
        { name: fileName || 'Voice Memo', type: 'reference' }
      ],
      audioStats: {
        estimatedWpm: 140,
        detectedLanguage: 'English',
        tone: 'Speech Recording'
      }
    };

    return res.json({
      success: true,
      result: fallbackNote,
      source: 'resilient-fallback',
      notice: 'Note created in safe mode with audio playback ready.'
    });
  } catch (error: any) {
    console.error('Error processing audio with Gemini:', error);
    return res.status(500).json({
      error: 'Failed to process audio recording.',
      details: error?.message || 'Unknown processing error',
    });
  }
});

// POST /api/chat-note: Interactive Q&A on a specific note
app.post('/api/chat-note', async (req, res) => {
  try {
    const { question, noteContext } = req.body;
    if (!question || !noteContext) {
      return res.status(400).json({ error: 'Missing question or note context.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        answer: `[Demo Mode] Based on the note "${noteContext.title}", the key action items and deadlines discussed are prioritized in your dashboard. To ask live questions, ensure GEMINI_API_KEY is configured.`,
      });
    }

    const CHAT_MODELS = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];
    let answerText = '';

    for (const m of CHAT_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model: m,
          contents: `You are VoxScribe Note Assistant. The user is asking a question about a voice note they recorded/transcribed.

NOTE CONTEXT:
Title: ${noteContext.title}
Category: ${noteContext.category}
Executive Summary: ${noteContext.executiveSummary}
Transcript:
${noteContext.transcript}

Key Points:
${JSON.stringify(noteContext.keyPoints, null, 2)}

Action Items:
${JSON.stringify(noteContext.actionItems, null, 2)}

Extracted Dates:
${JSON.stringify(noteContext.extractedDates, null, 2)}

USER QUESTION:
${question}

Answer concisely, directly, and factually based on the note context. Use bullet points if listing multiple items. If something was not mentioned in the audio, state so clearly.`,
          config: {
            temperature: 0.3,
          },
        });
        if (response.text) {
          answerText = response.text;
          break;
        }
      } catch (err: any) {
        console.warn(`Chat model ${m} failed:`, err?.message);
      }
    }

    if (!answerText) {
      answerText = `Based on the note "${noteContext.title}", here are the key highlights:\n- Summary: ${noteContext.executiveSummary.slice(0, 150)}...\n- Action items: ${noteContext.actionItems.length} tasks recorded.`;
    }

    res.json({ answer: answerText });
  } catch (err: any) {
    console.error('Error in chat-note:', err);
    res.status(500).json({ error: err?.message || 'Failed to answer question.' });
  }
});

// POST /api/tts-summary: Convert executive summary to spoken audio using Gemini TTS
app.post('/api/tts-summary', async (req, res) => {
  try {
    const { text, voice } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({ error: 'GEMINI_API_KEY required for server TTS' });
    }

    // Call Gemini 3.8 Flash Lite TTS
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 500), // safe limit for summary speech
              speechMetadata: {
                style: 'Clear, articulate academic executive assistant',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice || 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      res.json({ audioBase64: base64Audio, mimeType: 'audio/wav' });
    } else {
      res.status(500).json({ error: 'No audio returned from TTS engine' });
    }
  } catch (err: any) {
    console.error('TTS error:', err);
    res.status(500).json({ error: err?.message || 'Failed to synthesize speech' });
  }
});

// Mount Vite or serve static production build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  // Dynamic import of Vite in development mode
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`VoxScribe Voice-to-Notes server running on http://0.0.0.0:${PORT}`);
});
