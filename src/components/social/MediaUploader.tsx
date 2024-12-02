import React, { useState, useRef } from 'react';
import { 
  Image as ImageIcon, Video, Upload, X, Scissors, 
  Crop, RotateCw, Play, Pause, Edit2, Search 
} from 'lucide-react';
import type { MediaType } from '../../types/social';
import ImageEditor from './ImageEditor';
import VideoEditor from './VideoEditor';

interface MediaUploaderProps {
  onMediaSelect: (url: string, type: MediaType) => void;
  currentMediaUrl?: string;
  currentMediaType?: MediaType;
}

const sampleImages = [
  'https://images.unsplash.com/photo-1611162616474-5b21e879e113?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1496449903678-68ddcb189a24?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop'
];

const sampleVideos = [
  'https://static.videezy.com/system/resources/previews/000/005/529/original/Reaviling_Sjusj%C3%B8en_Ski_Senter.mp4',
  'https://static.videezy.com/system/resources/previews/000/007/536/original/rockybeach.mp4',
  'https://static.videezy.com/system/resources/previews/000/004/944/original/Mountains_1.mp4'
];

export default function MediaUploader({ 
  onMediaSelect, 
  currentMediaUrl,
  currentMediaType 
}: MediaUploaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [showVideoEditor, setShowVideoEditor] = useState(false);
  const [activeTab, setActiveTab] = useState<'images' | 'videos'>('images');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (urlInput) {
      try {
        new URL(urlInput);
        if (activeTab === 'images') {
          setSelectedMedia(urlInput);
          setShowImageEditor(true);
        } else {
          setSelectedMedia(urlInput);
          setShowVideoEditor(true);
        }
        setUrlInput('');
        setShowUrlInput(false);
        setIsOpen(false);
      } catch (error) {
        alert('Please enter a valid URL');
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const type = file.type.startsWith('image/') ? 'image' : 'video';
    const url = URL.createObjectURL(file);
    
    if (type === 'image') {
      setSelectedMedia(url);
      setShowImageEditor(true);
    } else {
      setSelectedMedia(url);
      setShowVideoEditor(true);
    }
    setIsOpen(false);
  };

  const handleMediaSelect = (url: string, type: MediaType) => {
    setSelectedMedia(url);
    if (type === 'image') {
      setShowImageEditor(true);
    } else {
      setShowVideoEditor(true);
    }
    setIsOpen(false);
  };

  const handleEditMedia = () => {
    if (!currentMediaUrl || !currentMediaType) return;
    
    setSelectedMedia(currentMediaUrl);
    if (currentMediaType === 'image') {
      setShowImageEditor(true);
    } else {
      setShowVideoEditor(true);
    }
  };

  const toggleVideoPlay = (videoElement: HTMLVideoElement) => {
    if (videoElement.paused) {
      videoElement.play();
      setIsVideoPlaying(true);
    } else {
      videoElement.pause();
      setIsVideoPlaying(false);
    }
  };

  return (
    <div className="space-y-2">
      {currentMediaUrl ? (
        <div className="relative">
          {currentMediaType === 'video' ? (
            <div className="relative group">
              <video
                src={currentMediaUrl}
                className="w-full h-48 object-cover rounded-lg"
                onClick={(e) => toggleVideoPlay(e.currentTarget)}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button
                  onClick={handleEditMedia}
                  className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {!isVideoPlaying && (
                  <Play className="w-12 h-12 text-white opacity-70" />
                )}
              </div>
            </div>
          ) : (
            <div className="relative group">
              <img
                src={currentMediaUrl}
                alt="Selected media"
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button
                  onClick={handleEditMedia}
                  className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          <button
            onClick={() => onMediaSelect('', 'image')}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200"
        >
          <Upload className="w-6 h-6 text-gray-400" />
          <span className="text-sm text-gray-500">Click to upload media</span>
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={activeTab === 'images' ? 'image/*' : 'video/*'}
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Media Library Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Media Library</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => setActiveTab('images')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    activeTab === 'images'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Images
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('videos')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    activeTab === 'videos'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Videos
                  </div>
                </button>
              </div>

              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${activeTab}...`}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                {activeTab === 'images' ? (
                  sampleImages.map((url, index) => (
                    <div
                      key={index}
                      onClick={() => handleMediaSelect(url, 'image')}
                      className="relative aspect-video cursor-pointer group rounded-lg overflow-hidden"
                    >
                      <img
                        src={url}
                        alt={`Sample ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200" />
                    </div>
                  ))
                ) : (
                  sampleVideos.map((url, index) => (
                    <div
                      key={index}
                      onClick={() => handleMediaSelect(url, 'video')}
                      className="relative aspect-video cursor-pointer group rounded-lg overflow-hidden"
                    >
                      <video
                        src={url}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="w-12 h-12 text-white opacity-70 group-hover:opacity-100 transition-opacity duration-200" />
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200" />
                    </div>
                  ))
                )}
              </div>

              {showUrlInput ? (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <form onSubmit={handleUrlSubmit} className="flex gap-2">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder={`Enter ${activeTab === 'images' ? 'image' : 'video'} URL`}
                      className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      Add
                    </button>
                  </form>
                </div>
              ) : (
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => setShowUrlInput(true)}
                    className="px-4 py-2 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50"
                  >
                    Add from URL
                  </button>
                </div>
              )}

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Upload from your device
                  </span>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload {activeTab === 'images' ? 'Image' : 'Video'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showImageEditor && selectedMedia && (
        <ImageEditor
          imageUrl={selectedMedia}
          onSave={(editedUrl) => {
            onMediaSelect(editedUrl, 'image');
            setShowImageEditor(false);
            setSelectedMedia('');
          }}
          onClose={() => {
            setShowImageEditor(false);
            setSelectedMedia('');
          }}
        />
      )}

      {showVideoEditor && selectedMedia && (
        <VideoEditor
          videoUrl={selectedMedia}
          onSave={(editedUrl) => {
            onMediaSelect(editedUrl, 'video');
            setShowVideoEditor(false);
            setSelectedMedia('');
          }}
          onClose={() => {
            setShowVideoEditor(false);
            setSelectedMedia('');
          }}
        />
      )}
    </div>
  );
}