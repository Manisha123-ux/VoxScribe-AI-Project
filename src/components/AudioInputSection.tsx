import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Mic,
  Square,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  FileAudio,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Layers,
  Sliders,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { formatDuration, formatFileSize, blobToBase64 } from '../utils/audio';

interface AudioInputSectionProps {
  onProcessAudio: (params: {
    audioData?: string;
    mimeType?: string;
    sampleId?: string;
    fileName?: string;
    customPrompt?: string;
    audioUrl?: string;
  }) => Promise<void>;
  isProcessing: boolean;
  onCancel?: () => void;
}

export const AudioInputSection: React.FC<AudioInputSectionProps> = ({
  onProcessAudio,
  isProcessing,
  onCancel,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'record' | 'demos'>('upload');

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [dragActive, setDragActive] = useState(false);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Microphone recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedBase64, setRecordedBase64] = useState<string | null>(null);
  const [micPermissionError, setMicPermissionError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Preloaded demos
  const [selectedDemo, setSelectedDemo] = useState<string>('capstone-ai');

  // Advanced options
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  // Clean up audio objects on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, []);

  // Handle file selection
  const handleFile = async (file: File) => {
    if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|wav|m4a|ogg|webm|flac|aac)$/i)) {
      alert('Please upload an audio file (MP3, WAV, M4A, OGG, WEBM, FLAC).');
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setAudioUrl(url);

    // Read base64
    const base64 = await blobToBase64(file);
    setFileBase64(base64);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Live Canvas Waveform Drawing
  const drawWaveform = () => {
    if (!analyserRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = (dataArray[i] / 255) * canvas.height;
      const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
      gradient.addColorStop(0, '#06b6d4'); // cyan
      gradient.addColorStop(1, '#6366f1'); // indigo

      ctx.fillStyle = gradient;
      ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
      x += barWidth + 1;
    }

    animFrameRef.current = requestAnimationFrame(drawWaveform);
  };

  // Start Mic Recording
  const startRecording = async () => {
    setMicPermissionError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      // Audio Analyser Setup for visualizer
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 128;
      source.connect(analyser);
      analyserRef.current = analyser;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const mime = mediaRecorder.mimeType || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: mime });
        setRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        const base64 = await blobToBase64(blob);
        setRecordedBase64(base64);

        // stop all tracks
        stream.getTracks().forEach((track) => track.stop());
        if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setIsPaused(false);
      setRecordSeconds(0);

      // Start waveform loop
      drawWaveform();

      // Timer
      timerRef.current = window.setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone access denied:', err);
      setMicPermissionError(
        err?.message || 'Microphone access denied. Check your browser permissions.'
      );
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        timerRef.current = window.setInterval(() => {
          setRecordSeconds((prev) => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const resetRecording = () => {
    if (isRecording) stopRecording();
    setRecordedBlob(null);
    setRecordedBase64(null);
    setRecordSeconds(0);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
  };

  // Submit Handler
  const handleSubmit = async () => {
    if (activeTab === 'upload') {
      if (!fileBase64 || !selectedFile) {
        alert('Please choose or drop an audio file first.');
        return;
      }
      await onProcessAudio({
        audioData: fileBase64,
        mimeType: selectedFile.type,
        fileName: selectedFile.name,
        customPrompt,
        audioUrl: audioUrl || undefined,
      });
    } else if (activeTab === 'record') {
      if (!recordedBase64 || !recordedBlob) {
        alert('Please record some audio first.');
        return;
      }
      await onProcessAudio({
        audioData: recordedBase64,
        mimeType: recordedBlob.type,
        fileName: `voice_memo_${new Date().toISOString().slice(0, 16).replace('T', '_')}.webm`,
        customPrompt,
        audioUrl: audioUrl || undefined,
      });
    } else if (activeTab === 'demos') {
      await onProcessAudio({
        sampleId: selectedDemo,
        customPrompt,
      });
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Background Accent glow */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header text */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight font-serif sm:font-sans">
            Convert Voice to Structured Notes
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Upload an audio recording, speak into your microphone, or test with curated college demos.
          </p>
        </div>

        {/* Segmented input mode tabs */}
        <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'upload'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Upload File</span>
          </button>
          <button
            onClick={() => setActiveTab('record')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'record'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-rose-400" />
            <span>Record Mic</span>
          </button>
          <button
            onClick={() => setActiveTab('demos')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'demos'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Academic Demos</span>
          </button>
        </div>
      </div>

      {/* TAB 1: UPLOAD AUDIO FILE */}
      {activeTab === 'upload' && (
        <div className="space-y-4">
          <div
            onDragEnter={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setDragActive(false);
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-cyan-400 bg-cyan-950/20'
                : selectedFile
                ? 'border-slate-700 bg-slate-950/40 hover:border-slate-600'
                : 'border-slate-800 bg-slate-950/30 hover:border-slate-700 hover:bg-slate-950/50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              accept="audio/*,.mp3,.wav,.m4a,.ogg,.webm,.flac,.aac"
              className="hidden"
            />

            {selectedFile ? (
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-cyan-950/60 border border-cyan-800/80 flex items-center justify-center text-cyan-400 mb-3 shadow-inner">
                  <FileAudio className="w-7 h-7" />
                </div>
                <h4 className="font-semibold text-slate-100 text-base">{selectedFile.name}</h4>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <span>{formatFileSize(selectedFile.size)}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedFile.type || 'audio/unknown'}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-cyan-400 font-medium">Ready for processing</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    setFileBase64(null);
                    if (audioUrl) URL.revokeObjectURL(audioUrl);
                    setAudioUrl(null);
                  }}
                  className="mt-3 text-xs text-slate-500 hover:text-rose-400 underline underline-offset-2"
                >
                  Choose a different file
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-300 mb-3">
                  <Upload className="w-6 h-6 text-cyan-400" />
                </div>
                <h4 className="font-semibold text-slate-200 text-base">
                  Drag and drop your audio file here
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Supports MP3, WAV, M4A, OGG, WEBM, FLAC, AAC up to 50MB. Recorded lectures,
                  interviews, student team syncs, and voice memos.
                </p>
                <div className="mt-4 px-4 py-1.5 rounded-lg bg-slate-800 text-xs font-medium text-slate-300 border border-slate-700">
                  Browse Audio File
                </div>
              </div>
            )}
          </div>

          {/* Audio player preview if file selected */}
          {audioUrl && (
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                  <FileAudio className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-200">Audio Preview</div>
                  <div className="text-[11px] text-slate-400">
                    Verify recording before sending to Gemini speech engine
                  </div>
                </div>
              </div>
              <audio
                ref={audioPreviewRef}
                src={audioUrl}
                controls
                className="h-9 max-w-[280px] sm:max-w-xs filter invert contrast-125"
              />
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MICROPHONE RECORDER */}
      {activeTab === 'record' && (
        <div className="space-y-4">
          <div className="border border-slate-800 bg-slate-950/60 rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center">
            {/* Live Audio Visualizer Canvas */}
            <div className="w-full max-w-md h-24 mb-4 bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden flex items-center justify-center p-2 relative">
              <canvas
                ref={canvasRef}
                width={360}
                height={80}
                className="w-full h-full object-contain"
              />
              {!isRecording && !recordedBlob && (
                <span className="absolute text-xs text-slate-500 font-mono">
                  Waveform visualizer ready. Press record to capture.
                </span>
              )}
            </div>

            {/* Timer Display */}
            <div className="font-mono text-3xl font-bold tracking-wider text-slate-100 mb-4 tabular-nums">
              {formatDuration(recordSeconds)}
            </div>

            {micPermissionError && (
              <div className="mb-4 text-xs text-rose-400 bg-rose-950/40 border border-rose-900/60 px-3 py-2 rounded-lg flex items-center gap-2 max-w-md text-left">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{micPermissionError}</span>
              </div>
            )}

            {/* Recording Controls */}
            <div className="flex items-center gap-3">
              {!isRecording && !recordedBlob && (
                <button
                  type="button"
                  onClick={startRecording}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs shadow-lg shadow-rose-600/25 transition-all"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                  <span>Start Recording</span>
                </button>
              )}

              {isRecording && (
                <>
                  <button
                    type="button"
                    onClick={pauseRecording}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all"
                  >
                    {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                    <span>{isPaused ? 'Resume' : 'Pause'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={stopRecording}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-600/30 transition-all"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Finish Recording</span>
                  </button>
                </>
              )}

              {recordedBlob && !isRecording && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={resetRecording}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Record Again</span>
                  </button>
                  <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Audio captured ({formatDuration(recordSeconds)})
                  </span>
                </div>
              )}
            </div>

            {/* Playback preview for recorded clip */}
            {audioUrl && !isRecording && (
              <div className="mt-5 w-full max-w-sm pt-4 border-t border-slate-800 flex justify-center">
                <audio src={audioUrl} controls className="h-8 w-full filter invert contrast-125" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ACADEMIC & TEAM DEMOS */}
      {activeTab === 'demos' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-400 mb-2">
            Instant evaluation presets. Experience speech transcription, summary synthesis, and
            structured action item extraction without needing an external audio file:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Demo 1 */}
            <div
              onClick={() => setSelectedDemo('capstone-ai')}
              className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                selectedDemo === 'capstone-ai'
                  ? 'bg-slate-800/80 border-cyan-500 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-800 px-2 py-0.5 rounded">
                  01:45 min
                </span>
                <span className="text-[11px] text-slate-400">Lecture & Lab</span>
              </div>
              <h4 className="font-semibold text-sm text-slate-100">
                AI Capstone: Vision Transformer & Latency
              </h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Professor Vance and students review INT8 quantization, FlashAttention profiling, and
                IEEE deadline.
              </p>
            </div>

            {/* Demo 2 */}
            <div
              onClick={() => setSelectedDemo('ml-lecture')}
              className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                selectedDemo === 'ml-lecture'
                  ? 'bg-slate-800/80 border-cyan-500 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950/80 border border-indigo-800 px-2 py-0.5 rounded">
                  02:10 min
                </span>
                <span className="text-[11px] text-slate-400">Class Lecture</span>
              </div>
              <h4 className="font-semibold text-sm text-slate-100">
                CS 482: Self-Attention & Pretraining
              </h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Professor Gupta breaks down scaled dot-product attention mathematics and homework
                milestones.
              </p>
            </div>

            {/* Demo 3 */}
            <div
              onClick={() => setSelectedDemo('startup-standup')}
              className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                selectedDemo === 'startup-standup'
                  ? 'bg-slate-800/80 border-cyan-500 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded">
                  01:30 min
                </span>
                <span className="text-[11px] text-slate-400">Engineering Sync</span>
              </div>
              <h4 className="font-semibold text-sm text-slate-100">
                Team Standup: pgvector & Audio Pipeline
              </h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Engineering team discusses hybrid dense vector retrieval, P99 latency, and GCP
                migration deadline.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Prompt Guidance (Collapsible) */}
      <div className="mt-5 pt-4 border-t border-slate-800/80">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <Sliders className="w-3.5 h-3.5 text-indigo-400" />
          <span>Advanced Model Instructions (Optional)</span>
          {showAdvanced ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>

        {showAdvanced && (
          <div className="mt-3">
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g. 'Emphasize any exam hints or grading rubrics', or 'Focus specifically on tasks assigned to backend team'..."
              className="w-full h-20 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
            />
          </div>
        )}
      </div>

      {/* Primary Action Button */}
      <div className="mt-6 flex items-center justify-between gap-4">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="text-xs text-slate-400 hover:text-slate-200 px-4 py-2 rounded-xl transition-colors"
          >
            Cancel
          </button>
        ) : (
          <div className="text-xs text-slate-500 hidden sm:block">
            Powered by multi-modal speech transcription & structured reasoning
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={
            isProcessing ||
            (activeTab === 'upload' && !selectedFile) ||
            (activeTab === 'record' && (!recordedBlob || isRecording))
          }
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold shadow-lg transition-all ${
            isProcessing
              ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-indigo-500/25'
          }`}
        >
          <Sparkles className="w-4 h-4 text-cyan-200" />
          <span>{isProcessing ? 'Processing Speech...' : 'Generate Structured Notes'}</span>
        </button>
      </div>
    </div>
  );
};
