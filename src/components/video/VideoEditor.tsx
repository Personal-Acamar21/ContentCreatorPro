import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Scissors, Clock, X, RotateCw, Save } from 'lucide-react';
import VideoPlayer from './VideoPlayer';

interface VideoEditorProps {
  videoUrl: string;
  onSave: (url: string) => void;
  onClose: () => void;
}

interface VideoEffects {
  brightness: number;
  contrast: number;
  saturation: number;
  rotation: number;
}

export default function VideoEditor({ videoUrl, onSave, onClose }: VideoEditorProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [startTrim, setStartTrim] = useState(0);
  const [endTrim, setEndTrim] = useState(0);
  const [effects, setEffects] = useState<VideoEffects>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    rotation: 0
  });

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    setCurrentTime(state.playedSeconds);
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
    setEndTrim(duration);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleRotate = (value: number) => {
    setEffects(prev => ({ ...prev, rotation: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center flex-shrink-0">
          <h3 className="text-lg font-semibold">Edit Video</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Video Player */}
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <VideoPlayer
                url={videoUrl}
                onProgress={handleProgress}
                onDuration={handleDuration}
                effects={effects}
                className="w-full h-full"
              />
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Trim Controls */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Scissors className="w-4 h-4" />
                  Trim Video
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Start Time</label>
                    <input
                      type="range"
                      min={0}
                      max={duration}
                      value={startTrim}
                      onChange={(e) => setStartTrim(parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-sm text-gray-600 mt-1">{formatTime(startTrim)}</div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">End Time</label>
                    <input
                      type="range"
                      min={0}
                      max={duration}
                      value={endTrim}
                      onChange={(e) => setEndTrim(parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-sm text-gray-600 mt-1">{formatTime(endTrim)}</div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Duration</label>
                    <div className="text-sm text-gray-600">
                      {formatTime(endTrim - startTrim)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Effects Controls */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <RotateCw className="w-4 h-4" />
                  Effects
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Brightness</label>
                    <input
                      type="range"
                      min={0}
                      max={200}
                      value={effects.brightness}
                      onChange={(e) => setEffects(prev => ({ ...prev, brightness: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Contrast</label>
                    <input
                      type="range"
                      min={0}
                      max={200}
                      value={effects.contrast}
                      onChange={(e) => setEffects(prev => ({ ...prev, contrast: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Saturation</label>
                    <input
                      type="range"
                      min={0}
                      max={200}
                      value={effects.saturation}
                      onChange={(e) => setEffects(prev => ({ ...prev, saturation: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Rotation</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min={0}
                        max={360}
                        step={90}
                        value={effects.rotation}
                        onChange={(e) => handleRotate(parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <div className="flex gap-2">
                        {[0, 90, 180, 270].map((angle) => (
                          <button
                            key={angle}
                            onClick={() => handleRotate(angle)}
                            className={`w-8 h-8 flex items-center justify-center rounded-full border ${
                              effects.rotation === angle
                                ? 'bg-primary-50 border-primary-600 text-primary-600'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <RotateCw
                              className="w-4 h-4"
                              style={{ transform: `rotate(${angle}deg)` }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Action Buttons */}
        <div className="p-4 border-t flex justify-end gap-2 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(videoUrl);
              onClose();
            }}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}