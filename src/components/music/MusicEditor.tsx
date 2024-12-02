import React, { useState, useRef } from 'react';
import { 
  X, Save, Sliders, Volume2, Music, Loader2, 
  WaveForm, RotateCw, Mic, Play, Pause, Scissors
} from 'lucide-react';

interface MusicEditorProps {
  trackUrl: string;
  onSave: (url: string) => void;
  onClose: () => void;
}

interface AudioEffects {
  volume: number;
  tempo: number;
  pitch: number;
  reverb: number;
  echo: number;
}

export default function MusicEditor({ trackUrl, onSave, onClose }: MusicEditorProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [startTrim, setStartTrim] = useState(0);
  const [endTrim, setEndTrim] = useState(0);
  const [activeTab, setActiveTab] = useState<'effects' | 'trim'>('effects');
  const [effects, setEffects] = useState<AudioEffects>({
    volume: 100,
    tempo: 100,
    pitch: 100,
    reverb: 0,
    echo: 0
  });

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // If we're trimming, play from the start trim point
      if (activeTab === 'trim') {
        audioRef.current.currentTime = startTrim;
      }
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    
    setCurrentTime(audioRef.current.currentTime);
    
    // Stop playback if we reach the end trim point while trimming
    if (activeTab === 'trim' && audioRef.current.currentTime >= endTrim) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const duration = audioRef.current.duration;
      setDuration(duration);
      setEndTrim(duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSave = async () => {
    setIsProcessing(true);
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      onSave(trackUrl);
    } catch (error) {
      console.error('Failed to process audio:', error);
      alert('Failed to process audio. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">Edit Audio Track</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handlePlayPause}
                className="p-3 rounded-full bg-primary-50 text-primary-600 hover:bg-primary-100"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
              </button>
              <div className="text-sm text-gray-600">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            <div className="relative h-24 bg-gray-200 rounded-lg overflow-hidden">
              {/* Waveform visualization would go here */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Music className="w-8 h-8 text-gray-400" />
              </div>
              {/* Progress bar */}
              <div 
                className="absolute bottom-0 left-0 h-1 bg-primary-600"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>

            <audio
              ref={audioRef}
              src={trackUrl}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
            />
          </div>

          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setActiveTab('effects')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'effects'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                Effects
              </div>
            </button>
            <button
              onClick={() => setActiveTab('trim')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'trim'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <Scissors className="w-4 h-4" />
                Trim Audio
              </div>
            </button>
          </div>

          {activeTab === 'effects' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Volume
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={effects.volume}
                  onChange={(e) => setEffects({ ...effects, volume: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tempo
                </label>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={effects.tempo}
                  onChange={(e) => setEffects({ ...effects, tempo: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pitch
                </label>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={effects.pitch}
                  onChange={(e) => setEffects({ ...effects, pitch: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reverb
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={effects.reverb}
                  onChange={(e) => setEffects({ ...effects, reverb: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Echo
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={effects.echo}
                  onChange={(e) => setEffects({ ...effects, echo: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={startTrim}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (value < endTrim) {
                        setStartTrim(value);
                        if (audioRef.current) {
                          audioRef.current.currentTime = value;
                        }
                      }
                    }}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600 w-16">
                    {formatTime(startTrim)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={endTrim}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (value > startTrim) {
                        setEndTrim(value);
                      }
                    }}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600 w-16">
                    {formatTime(endTrim)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <div className="text-sm text-gray-600">
                  {formatTime(endTrim - startTrim)}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isProcessing}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}