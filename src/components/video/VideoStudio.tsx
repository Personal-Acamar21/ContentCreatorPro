import React, { useState, useRef } from 'react';
import { Video, Upload, Settings2, Image, Plus, Trash2, Edit2, Play, Download, X } from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import VideoEditor from './VideoEditor';

// Sample video URLs that are guaranteed to work
const SAMPLE_VIDEOS = {
  showcase: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  tutorial: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  short: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
};

interface VideoProject {
  id: string;
  title: string;
  url?: string;
  thumbnail?: string;
  duration?: number;
  status: 'draft' | 'processing' | 'completed';
  type: 'short' | 'tutorial' | 'showcase';
  createdAt: string;
}

interface TemplateOption {
  type: VideoProject['type'];
  title: string;
  description: string;
  icon: React.ReactNode;
}

const TEMPLATES: TemplateOption[] = [
  {
    type: 'short',
    title: 'YouTube Short',
    description: 'Create engaging vertical videos optimized for short-form content',
    icon: <Video className="w-6 h-6 text-primary-600" />
  },
  {
    type: 'tutorial',
    title: 'Tutorial Video',
    description: 'Create step-by-step educational content with clear instructions',
    icon: <Settings2 className="w-6 h-6 text-primary-600" />
  },
  {
    type: 'showcase',
    title: 'Product Showcase',
    description: 'Highlight features and benefits of your products',
    icon: <Image className="w-6 h-6 text-primary-600" />
  }
];

export default function VideoStudio() {
  const [projects, setProjects] = useState<VideoProject[]>([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showVideoEditor, setShowVideoEditor] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoProject | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateNew = (type: VideoProject['type']) => {
    const newProject: VideoProject = {
      id: crypto.randomUUID(),
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      url: SAMPLE_VIDEOS[type],
      status: 'completed',
      type,
      createdAt: new Date().toISOString()
    };
    setProjects([newProject, ...projects]);
    setShowTemplateModal(false);
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // For demo, we'll use a sample video URL
    setTimeout(() => {
      const newProject: VideoProject = {
        id: crypto.randomUUID(),
        title: file.name.replace(/\.[^/.]+$/, ''),
        url: SAMPLE_VIDEOS.showcase,
        status: 'processing',
        type: 'short',
        createdAt: new Date().toISOString()
      };
      setProjects([newProject, ...projects]);
      setIsUploading(false);

      // Simulate processing completion
      setTimeout(() => {
        setProjects(current =>
          current.map(p =>
            p.id === newProject.id ? { ...p, status: 'completed' } : p
          )
        );
      }, 3000);
    }, 1500);
  };

  const handleEdit = (project: VideoProject) => {
    setSelectedVideo(project);
    setShowVideoEditor(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const handleSaveEdit = (url: string) => {
    if (selectedVideo) {
      setProjects(current =>
        current.map(p =>
          p.id === selectedVideo.id
            ? { ...p, url, status: 'completed' }
            : p
        )
      );
    }
    setShowVideoEditor(false);
    setSelectedVideo(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Video Studio</h2>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            {isUploading ? 'Uploading...' : 'Import Video'}
          </button>
          <button
            onClick={() => setShowTemplateModal(true)}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create New
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Tools</h3>
          <div className="space-y-4">
            {TEMPLATES.map((template) => (
              <button
                key={template.type}
                onClick={() => handleCreateNew(template.type)}
                className="w-full px-4 py-3 text-left border rounded-lg hover:bg-gray-50 flex items-center gap-3"
              >
                {template.icon}
                <div>
                  <div className="font-medium">{template.title}</div>
                  <div className="text-sm text-gray-500">{template.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Projects</h3>
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:border-primary-300 transition-all duration-200"
                >
                  <div className="flex items-center gap-4 flex-1">
                    {project.url ? (
                      <div className="w-32 h-20 relative rounded-lg overflow-hidden bg-gray-100">
                        <VideoPlayer
                          url={project.url}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Video className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900">{project.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          project.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : project.status === 'processing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-2 text-gray-400 hover:text-primary-600 rounded-full hover:bg-gray-100"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    {project.status === 'completed' && (
                      <button
                        onClick={() => {
                          // Handle download
                          const link = document.createElement('a');
                          link.href = project.url || '';
                          link.download = `${project.title}.mp4`;
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
              ))}

              {projects.length === 0 && (
                <div className="text-center py-12">
                  <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No projects yet. Create a new project or import a video to get started.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Choose Template</h3>
                <p className="text-sm text-gray-500 mt-1">Select a template to get started</p>
              </div>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {TEMPLATES.map((template) => (
                <button
                  key={template.type}
                  onClick={() => handleCreateNew(template.type)}
                  className="p-4 border rounded-lg text-left hover:border-primary-300 hover:bg-primary-50 transition-all duration-200"
                >
                  <div className="flex items-center gap-3 mb-2">
                    {template.icon}
                    <h4 className="font-medium text-gray-900">{template.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t flex justify-end">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Editor Modal */}
      {showVideoEditor && selectedVideo && (
        <VideoEditor
          videoUrl={selectedVideo.url || ''}
          onSave={handleSaveEdit}
          onClose={() => {
            setShowVideoEditor(false);
            setSelectedVideo(null);
          }}
        />
      )}
    </div>
  );
}