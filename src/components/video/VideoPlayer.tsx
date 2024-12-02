import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  onProgress?: (state: { played: number; playedSeconds: number }) => void;
  onDuration?: (duration: number) => void;
  className?: string;
  effects?: {
    brightness: number;
    contrast: number;
    saturation: number;
    rotation: number;
  };
}

export default function VideoPlayer({ 
  url, 
  onProgress, 
  onDuration, 
  className = '',
  effects = { brightness: 100, contrast: 100, saturation: 100, rotation: 0 }
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef<ReactPlayer>(null);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    setCurrentTime(state.playedSeconds);
    onProgress?.(state);
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
    onDuration?.(duration);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`relative group ${className}`}>
      <div
        style={{
          filter: `
            brightness(${effects.brightness}%) 
            contrast(${effects.contrast}%) 
            saturate(${effects.saturation}%)
          `,
          transform: `rotate(${effects.rotation}deg)`,
          width: '100%',
          height: '100%'
        }}
      >
        <ReactPlayer
          ref={playerRef}
          url={url}
          playing={isPlaying}
          volume={volume}
          muted={isMuted}
          width="100%"
          height="100%"
          onProgress={handleProgress}
          onDuration={handleDuration}
          progressInterval={100}
          className="rounded-lg overflow-hidden"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="absolute bottom-0 left-0 right-0 p-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePlayPause}
              className="text-white hover:text-primary-400 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={toggleMute}
                className="text-white hover:text-primary-400 transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-12"
              />
            </div>

            <div className="text-white text-xs">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="relative w-full h-1 bg-gray-600 rounded overflow-hidden mt-1">
            <div
              className="absolute h-full bg-primary-500"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
            <input
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={(e) => {
                const time = parseFloat(e.target.value);
                playerRef.current?.seekTo(time);
              }}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}