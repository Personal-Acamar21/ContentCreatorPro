import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, AlertTriangle } from 'lucide-react';
import WaveSurfer from 'wavesurfer.js';

interface AudioPlayerProps {
  url: string;
  onError: (error: string) => void;
  onPlaybackStart: () => void;
  onPlaybackEnd: () => void;
}

export default function AudioPlayer({ url, onError, onPlaybackStart, onPlaybackEnd }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  // Initialize WaveSurfer
  useEffect(() => {
    if (!waveformRef.current) return;

    const initWaveSurfer = async () => {
      try {
        const wavesurfer = WaveSurfer.create({
          container: waveformRef.current!,
          waveColor: '#4F46E5',
          progressColor: '#818CF8',
          cursorColor: '#4F46E5',
          barWidth: 2,
          barGap: 1,
          height: 60,
          normalize: true,
          responsive: true
        });

        wavesurfer.on('ready', () => {
          setLoadError(null);
        });

        wavesurfer.on('error', () => {
          const errorMessage = 'Failed to load audio file. Please try another track.';
          setLoadError(errorMessage);
          onError(errorMessage);
        });

        wavesurfer.on('finish', () => {
          setIsPlaying(false);
          onPlaybackEnd();
        });

        await wavesurfer.load(url);
        wavesurferRef.current = wavesurfer;
      } catch (error) {
        console.error('WaveSurfer initialization error:', error);
        const errorMessage = 'Failed to initialize audio player. Please try again.';
        setLoadError(errorMessage);
        onError(errorMessage);
      }
    };

    initWaveSurfer();

    // Cleanup
    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, [url]);

  const handlePlayPause = async () => {
    if (!wavesurferRef.current) return;

    try {
      if (isPlaying) {
        wavesurferRef.current.pause();
      } else {
        await wavesurferRef.current.play();
        onPlaybackStart();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Playback error:', error);
      const errorMessage = 'Failed to play audio. Please try again.';
      setLoadError(errorMessage);
      onError(errorMessage);
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!wavesurferRef.current) return;
    
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    wavesurferRef.current.setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (!wavesurferRef.current) return;
    
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    wavesurferRef.current.setVolume(newMuted ? 0 : volume);
  };

  return (
    <div className="bg-white rounded-lg border p-4">
      {loadError && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <p className="text-sm">{loadError}</p>
        </div>
      )}

      <div ref={waveformRef} className="mb-4" />

      <div className="flex items-center gap-4">
        <button
          onClick={handlePlayPause}
          className="p-2 rounded-full hover:bg-gray-100"
          disabled={!!loadError}
        >
          {isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6" />
          )}
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-2 rounded-full hover:bg-gray-100"
            disabled={!!loadError}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24"
            disabled={!!loadError}
          />
        </div>
      </div>
    </div>
  );
}