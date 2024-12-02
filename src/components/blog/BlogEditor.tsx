import React, { useState } from 'react';
import { PenSquare, Plus, Save, ArrowLeft, Trash2, Wand2, Sparkles, Loader2, X } from 'lucide-react';
import Editor from '../Editor';
import { useBlogStore } from '../../store/blogStore';
import { useAuthStore } from '../../store/authStore';
import { createBlogPost, updateBlogPost, deleteBlogPost } from '../../services/firebase/blog';
import { generateBlogPost, improveContent } from '../../services/openai';
import { templates } from '../../data/templates';
import type { BlogPost, BlogTemplate } from '../../types/blog';
import BlogSEO from './BlogSEO';
import BlogSettings from './BlogSettings';

interface AIGenerateModalProps {
  onClose: () => void;
  onGenerate: (topic: string) => void;
  isGenerating: boolean;
}

function AIGenerateModal({ onClose, onGenerate, isGenerating }: AIGenerateModalProps) {
  const [topic, setTopic] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onGenerate(topic.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Generate Blog Post</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              What would you like to write about?
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter your topic..."
              disabled={isGenerating}
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={isGenerating}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!topic.trim() || isGenerating}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Generate
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function BlogEditor() {
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<BlogPost>>({
    title: '',
    content: '',
    excerpt: '',
    published: false,
    categories: []
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingNew, setIsGeneratingNew] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const { posts, addPost, updatePost, deletePost } = useBlogStore();
  const { user, isLocalMode } = useAuthStore();

  const handleCreateNew = () => {
    setCurrentPost({
      title: '',
      content: '',
      excerpt: '',
      published: false,
      categories: []
    });
    setIsEditing(true);
    setShowTemplateSelector(true);
  };

  const handleGenerateContent = async (topic: string, template?: BlogTemplate) => {
    setIsGeneratingNew(true);
    try {
      const content = await generateBlogPost(topic, template?.type || 'general');
      setCurrentPost(prev => ({
        ...prev,
        title: topic,
        content,
        template: template?.id
      }));
    } catch (error) {
      console.error('Failed to generate content:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setIsGeneratingNew(false);
      setShowGenerateModal(false);
    }
  };

  const handleTemplateSelect = async (template: BlogTemplate) => {
    setShowTemplateSelector(false);
    setShowGenerateModal(true);
  };

  const handleSave = async () => {
    if (!currentPost.title || !currentPost.content) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      const now = new Date().toISOString();
      if (currentPost.id) {
        if (!isLocalMode) {
          await updateBlogPost(currentPost.id, {
            ...currentPost,
            updatedAt: now
          });
        }
        updatePost(currentPost.id, { ...currentPost, updatedAt: now });
      } else {
        const newPost = {
          ...currentPost,
          createdAt: now,
          updatedAt: now
        } as BlogPost;
        
        if (!isLocalMode) {
          const id = await createBlogPost(newPost);
          newPost.id = id;
        } else {
          newPost.id = crypto.randomUUID();
        }
        
        addPost(newPost);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      if (!isLocalMode) {
        await deleteBlogPost(id);
      }
      deletePost(id);
      if (currentPost.id === id) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  const handleAIImprove = async () => {
    if (!currentPost.content) {
      alert('Please add some content first');
      return;
    }

    setIsImproving(true);
    try {
      const improvedContent = await improveContent(currentPost.content);
      setCurrentPost(prev => ({
        ...prev,
        content: improvedContent
      }));
    } catch (error) {
      console.error('Failed to improve content:', error);
      alert('Failed to improve content. Please try again.');
    } finally {
      setIsImproving(false);
    }
  };

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsEditing(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={currentPost.title || ''}
              onChange={(e) => setCurrentPost(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Post title"
              className="text-2xl font-bold bg-transparent border-none focus:outline-none focus:ring-0"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGenerateModal(true)}
              disabled={isGeneratingNew || isImproving}
              className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 flex items-center gap-2 disabled:opacity-50"
            >
              {isGeneratingNew ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Wand2 className="w-5 h-5" />
              )}
              {isGeneratingNew ? 'Generating...' : 'AI Generate'}
            </button>
            <button
              onClick={handleAIImprove}
              disabled={isGeneratingNew || isImproving || !currentPost.content}
              className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 flex items-center gap-2 disabled:opacity-50"
            >
              {isImproving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              {isImproving ? 'Improving...' : 'AI Improve'}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {isSaving ? 'Saving...' : 'Save Post'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <Editor
              content={currentPost.content || ''}
              onChange={(content) => setCurrentPost(prev => ({ ...prev, content }))}
              placeholder="Start writing or use AI to generate content..."
            />
          </div>
          <div className="space-y-6">
            <BlogSEO
              title={currentPost.title || ''}
              content={currentPost.content || ''}
              onUpdate={(updates) => setCurrentPost(prev => ({ ...prev, ...updates }))}
            />
            <BlogSettings
              published={currentPost.published || false}
              scheduledDate={currentPost.scheduledDate}
              categories={currentPost.categories || []}
              onUpdate={(updates) => setCurrentPost(prev => ({ ...prev, ...updates }))}
            />
          </div>
        </div>

        {showGenerateModal && (
          <AIGenerateModal
            onClose={() => setShowGenerateModal(false)}
            onGenerate={handleGenerateContent}
            isGenerating={isGeneratingNew}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Blog Editor</h2>
        <button
          onClick={handleCreateNew}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Post
        </button>
      </div>

      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="flex justify-between items-start">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => {
                    setCurrentPost(post);
                    setIsEditing(true);
                  }}
                >
                  <h3 className="text-lg font-semibold text-gray-900">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {post.excerpt || post.content.replace(/<[^>]*>/g, '').slice(0, 150) + '...'}
                  </p>
                  {post.categories?.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {post.categories.map(category => (
                        <span
                          key={category}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 ml-4"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div
            onClick={handleCreateNew}
            className="text-center py-12 cursor-pointer group"
          >
            <div className="bg-white rounded-lg shadow-sm border p-8 hover:shadow-md transition-all duration-200">
              <div className="flex flex-col items-center">
                <PenSquare className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-500 text-lg">No posts yet.</p>
                <p className="text-primary-600 mt-2 font-medium group-hover:text-primary-700">
                  Create your first post!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {showTemplateSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Choose a Template</h3>
              <button
                onClick={() => setShowTemplateSelector(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  disabled={isGeneratingNew}
                  className="p-4 border rounded-lg text-left hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 disabled:opacity-50"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-primary-600" />
                    <h4 className="font-medium">{template.name}</h4>
                  </div>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}