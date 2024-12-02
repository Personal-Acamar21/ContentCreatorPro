import React, { useState, useRef } from 'react';
import { Music, Upload, Mic, StopCircle, Loader2, Trash2, Download, Play, Pause } from 'lucide-react';
import SimpleAudioPlayer from './SimpleAudioPlayer';
import AIGenerator from './AIGenerator';
import type { MusicGenerationParams } from '../../services/ai/musicGeneration';
import { generateMusicPrompt } from '../../services/ai/musicGeneration';

// Sample tracks that are guaranteed to work
const SAMPLE_TRACKS = [
  {
    id: 'sample-1',
    title: 'Ambient Piano',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 180
  },
  {
    id: 'sample-2',
    title: 'Peaceful Meditation',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 240
  }
];

interface Project {
  id: string;
  title: string;
  url: string;
  duration?: number;
  status: 'generating' | 'ready' | 'uploading' | 'processing' | 'completed';
  type: 'generated' | 'uploaded' | 'recorded';
  createdAt: string;
}

export default function MusicGenerator() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimerRef = useRef<number | null>(null);

  const handleGenerate = async (params: MusicGenerationParams) => {
    setIsGenerating(true);
    try {
      // Generate music description using OpenAI
      const description = await generateMusicPrompt(params);
      
      // For demo, we'll use a sample track
      const sampleTrack = SAMPLE_TRACKS[Math.floor(Math.random() * SAMPLE_TRACKS.length)];
      
      const newProject: Project = {
        id: crypto.randomUUID(),
        title: `${params.mood} ${params.genre} track`,
        url: sampleTrack.url,
        duration: params.duration,
        status: 'completed',
        type: 'generated',
        createdAt: new Date().toISOString()
      };
      
      setProjects(prev => [newProject, ...prev]);
      
      // Automatically start playing the generated track
      setPlayingTrackId(newProject.id);
      setPlaybackError(null);
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate music. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      alert('Please select an audio file.');
      return;
    }

    const url = URL.createObjectURL(file);
    const newProject: Project = {
      id: crypto.randomUUID(),
      title: file.name.replace(/\.[^/.]+$/, ''),
      url,
      status: 'completed',
      type: 'uploaded',
      createdAt: new Date().toISOString()
    };

    setProjects(prev => [newProject, ...prev]);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        const newProject: Project = {
          id: crypto.randomUUID(),
          title: `Recording ${projects.length + 1}`,
          url,
          duration: recordingTime,
          status: 'completed',
          type: 'recorded',
          createdAt: new Date().toISOString()
        };
        setProjects(prev => [newProject, ...prev]);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingTimerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Failed to access microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
    setIsRecording(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(prev => prev.filter(p => p.id !== id));
      if (playingTrackId === id) {
        setPlayingTrackId(null);
      }
    }
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        onChange={handleUpload}
        className="hidden"
      />

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Music Studio</h2>
        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Import Audio
          </button>
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              isRecording 
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
            }`}
          >
            {isRecording ? (
              <>
                <StopCircle className="w-5 h-5" />
                Stop Recording ({recordingTime}s)
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                Record Audio
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <AIGenerator 
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
          />
        </div>

        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Your Projects</h3>
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-lg border p-4 hover:border-primary-300 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{project.title}</h3>
                      <div className="text-sm text-gray-500 mt-1">
                        {project.duration ? `${Math.floor(project.duration / 60)}:${(project.duration % 60).toString().padStart(2, '0')}` : 'Unknown duration'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      {project.url && project.status === 'completed' && (
                        <button
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = project.url;
                            link.download = `${project.title}.mp3`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          className="p-2 text-gray-400 hover:text-primary-600 rounded-full hover:bg-gray-100"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {playingTrackId === project.id ? (
                    <SimpleAudioPlayer
                      url={project.url}
                      onError={(error) => {
                        setPlaybackError(error);
                        setPlayingTrackId(null);
                      }}
                      onPlaybackStart={() => setPlaybackError(null)}
                      onPlaybackEnd={() => setPlayingTrackId(null)}
                    />
                  ) : (
                    <button
                      onClick={() => setPlayingTrackId(project.id)}
                      className="w-full px-4 py-2 text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 flex items-center justify-center gap-2"
                    >
                      <Play className="w-5 h-5" />
                      Preview Track
                    </button>
                  )}
                </div>
              ))}

              {projects.length === 0 && (
                <div className="text-center py-12">
                  <Music className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No projects yet. Generate music, import audio, or record your voice to get started.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}