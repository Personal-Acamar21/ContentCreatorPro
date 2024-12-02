import React, { useState } from 'react';
import { 
  Wand2, Hash, Clock, 
  Instagram, Facebook, Linkedin, Twitter, Music2, X 
} from 'lucide-react';
import { format } from 'date-fns';
import type { SocialPost, SocialPlatform, BrandPersonality, MediaType } from '../../types/social';
import PersonalitySelector from './PersonalitySelector';
import MediaUploader from './MediaUploader';

interface SocialPostEditorProps {
  post?: Partial<SocialPost>;
  onSave: (post: SocialPost) => void;
  onClose: () => void;
}

const platformIcons: Record<SocialPlatform, React.ReactNode> = {
  instagram: <Instagram className="w-5 h-5 text-pink-600" />,
  facebook: <Facebook className="w-5 h-5 text-blue-600" />,
  linkedin: <Linkedin className="w-5 h-5 text-blue-700" />,
  twitter: <Twitter className="w-5 h-5 text-blue-400" />,
  tiktok: <Music2 className="w-5 h-5 text-black" />,
};

export default function SocialPostEditor({ post, onSave, onClose }: SocialPostEditorProps) {
  const [currentPost, setCurrentPost] = useState<Partial<SocialPost>>(post || {
    platform: 'instagram',
    content: '',
    caption: '',
    hashtags: [],
    scheduledDate: new Date().toISOString(),
    status: 'draft'
  });

  const [showScheduler, setShowScheduler] = useState(false);
  const [hashtagInput, setHashtagInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSave = () => {
    if (!currentPost.caption || !currentPost.platform) {
      alert('Please fill in all required fields');
      return;
    }

    const now = new Date().toISOString();
    const finalPost: SocialPost = {
      id: currentPost.id || crypto.randomUUID(),
      platform: currentPost.platform as SocialPlatform,
      content: currentPost.content || '',
      caption: currentPost.caption,
      hashtags: currentPost.hashtags || [],
      scheduledDate: currentPost.scheduledDate || now,
      mediaUrl: currentPost.mediaUrl,
      mediaType: currentPost.mediaType,
      status: currentPost.status || 'draft',
      createdAt: currentPost.createdAt || now,
      updatedAt: now,
      personality: currentPost.personality,
      duration: currentPost.duration
    };

    onSave(finalPost);
    onClose();
  };

  const addHashtag = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!hashtagInput.trim()) return;
    
    const tag = hashtagInput.trim().replace(/^#/, '');
    if (tag && !currentPost.hashtags?.includes(tag)) {
      setCurrentPost(prev => ({
        ...prev,
        hashtags: [...(prev.hashtags || []), tag]
      }));
    }
    setHashtagInput('');
  };

  const removeHashtag = (tag: string) => {
    setCurrentPost(prev => ({
      ...prev,
      hashtags: (prev.hashtags || []).filter(t => t !== tag)
    }));
  };

  const handlePersonalitySelect = (personality: BrandPersonality) => {
    setCurrentPost(prev => ({ ...prev, personality: personality.id }));
    
    setIsGenerating(true);
    setTimeout(() => {
      const newCaption = `[${personality.emoji}] ${currentPost.caption}`;
      setCurrentPost(prev => ({ ...prev, caption: newCaption }));
      setIsGenerating(false);
    }, 1000);
  };

  const handleMediaSelect = (url: string, type: MediaType) => {
    setCurrentPost(prev => ({
      ...prev,
      mediaUrl: url,
      mediaType: type
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {post?.id ? 'Edit Post' : 'Create New Post'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Platform
              </label>
              <div className="flex gap-2">
                {Object.entries(platformIcons).map(([platform, icon]) => (
                  <button
                    key={platform}
                    onClick={() => setCurrentPost(prev => ({ ...prev, platform }))}
                    className={`p-3 rounded-lg border transition-colors duration-200 ${
                      currentPost.platform === platform
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-200'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                AI Personality
              </label>
              <PersonalitySelector
                selectedId={currentPost.personality}
                onSelect={handlePersonalitySelect}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Caption
              </label>
              <div className="relative">
                <textarea
                  value={currentPost.caption || ''}
                  onChange={e => setCurrentPost(prev => ({ ...prev, caption: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  rows={4}
                  placeholder="Write your post caption..."
                  disabled={isGenerating}
                />
                {isGenerating && (
                  <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
                    <div className="flex items-center space-x-2">
                      <Wand2 className="w-5 h-5 text-primary-500 animate-spin" />
                      <span className="text-primary-600">Generating...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Media
              </label>
              <MediaUploader
                onMediaSelect={handleMediaSelect}
                currentMediaUrl={currentPost.mediaUrl}
                currentMediaType={currentPost.mediaType}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hashtags
              </label>
              <div className="flex gap-2 mb-2 flex-wrap">
                {currentPost.hashtags?.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-gray-100"
                  >
                    #{tag}
                    <button
                      onClick={() => removeHashtag(tag)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={hashtagInput}
                  onChange={e => setHashtagInput(e.target.value)}
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addHashtag();
                    }
                  }}
                  placeholder="Add hashtag..."
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <button
                  onClick={() => addHashtag()}
                  type="button"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
                >
                  <Hash className="w-5 h-5" />
                  Add
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowScheduler(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Clock className="w-5 h-5" />
                Schedule Post
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                {post?.id ? 'Update Post' : 'Create Post'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showScheduler && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Schedule Post</h3>
            <input
              type="datetime-local"
              value={currentPost.scheduledDate?.slice(0, 16)}
              onChange={e => setCurrentPost(prev => ({
                ...prev,
                scheduledDate: new Date(e.target.value).toISOString(),
                status: 'scheduled'
              }))}
              className="w-full px-3 py-2 border rounded-lg mb-4"
              min={new Date().toISOString().slice(0, 16)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowScheduler(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowScheduler(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Set Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}