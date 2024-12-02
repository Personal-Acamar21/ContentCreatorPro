import React, { useState } from 'react';
import { Calendar, BarChart2, Users, ArrowRight, Instagram, Facebook, Linkedin, Twitter, Music2, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useSocialStore } from '../../store/socialStore';
import type { SocialPlatform, SocialPost } from '../../types/social';
import SocialPostEditor from './SocialPostEditor';
import SocialContentIdeas from './SocialContentIdeas';
import SocialCalendar from './SocialCalendar';
import SocialAnalytics from './SocialAnalytics';
import SocialAudience from './SocialAudience';

const platformIcons: Record<SocialPlatform, React.ReactNode> = {
  instagram: <Instagram className="w-5 h-5 text-pink-600" />,
  facebook: <Facebook className="w-5 h-5 text-blue-600" />,
  linkedin: <Linkedin className="w-5 h-5 text-blue-700" />,
  twitter: <Twitter className="w-5 h-5 text-blue-400" />,
  tiktok: <Music2 className="w-5 h-5 text-black" />,
};

export default function SocialMediaDashboard() {
  const { posts, addPost, updatePost } = useSocialStore();
  const [activeView, setActiveView] = useState<'calendar' | 'analytics' | 'audience' | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<SocialPost | undefined>();

  const handleQuickAction = (view: 'calendar' | 'analytics' | 'audience') => {
    setActiveView(view === activeView ? null : view);
  };

  const handleSavePost = (post: SocialPost) => {
    if (post.id && posts.some(p => p.id === post.id)) {
      updatePost(post.id, post);
    } else {
      addPost(post);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Social Media Dashboard</h2>
        <button
          onClick={() => {
            setEditingPost(undefined);
            setShowEditor(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="w-5 h-5" />
          Create Post
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => handleQuickAction('calendar')}
              className={`w-full flex items-center justify-between p-3 border rounded-lg transition-colors duration-200 ${
                activeView === 'calendar'
                  ? 'bg-primary-50 border-primary-200 text-primary-700'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <Calendar className={`w-5 h-5 mr-3 ${
                  activeView === 'calendar' ? 'text-primary-600' : 'text-gray-500'
                }`} />
                <span>Content Calendar</span>
              </div>
              <ArrowRight className={`w-4 h-4 ${
                activeView === 'calendar' ? 'text-primary-600' : 'text-gray-400'
              }`} />
            </button>
            
            <button 
              onClick={() => handleQuickAction('analytics')}
              className={`w-full flex items-center justify-between p-3 border rounded-lg transition-colors duration-200 ${
                activeView === 'analytics'
                  ? 'bg-primary-50 border-primary-200 text-primary-700'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <BarChart2 className={`w-5 h-5 mr-3 ${
                  activeView === 'analytics' ? 'text-primary-600' : 'text-gray-500'
                }`} />
                <span>Analytics Overview</span>
              </div>
              <ArrowRight className={`w-4 h-4 ${
                activeView === 'analytics' ? 'text-primary-600' : 'text-gray-400'
              }`} />
            </button>
            
            <button 
              onClick={() => handleQuickAction('audience')}
              className={`w-full flex items-center justify-between p-3 border rounded-lg transition-colors duration-200 ${
                activeView === 'audience'
                  ? 'bg-primary-50 border-primary-200 text-primary-700'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <Users className={`w-5 h-5 mr-3 ${
                  activeView === 'audience' ? 'text-primary-600' : 'text-gray-500'
                }`} />
                <span>Audience Insights</span>
              </div>
              <ArrowRight className={`w-4 h-4 ${
                activeView === 'audience' ? 'text-primary-600' : 'text-gray-400'
              }`} />
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Upcoming Posts</h3>
          <div className="space-y-4">
            {posts
              .filter(p => p.status === 'scheduled')
              .slice(0, 3)
              .map(post => (
                <div key={post.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    {platformIcons[post.platform]}
                    <span className="ml-2 text-sm text-gray-600">
                      {format(new Date(post.scheduledDate), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  <button 
                    onClick={() => {
                      setEditingPost(post);
                      setShowEditor(true);
                    }}
                    className="text-primary-600 hover:text-primary-700 text-sm"
                  >
                    View
                  </button>
                </div>
              ))}
            {posts.filter(p => p.status === 'scheduled').length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No upcoming posts scheduled
              </p>
            )}
          </div>
        </div>
      </div>

      {activeView === 'calendar' && <SocialCalendar posts={posts} onEditPost={(post) => {
        setEditingPost(post);
        setShowEditor(true);
      }} />}
      
      {activeView === 'analytics' && <SocialAnalytics posts={posts} />}
      
      {activeView === 'audience' && <SocialAudience />}

      <SocialContentIdeas 
        onUseIdea={(idea) => {
          setEditingPost({
            platform: idea.suggestedPlatforms[0],
            caption: idea.description,
            hashtags: idea.hashtags,
            scheduledDate: new Date().toISOString(),
            status: 'draft'
          });
          setShowEditor(true);
        }} 
      />

      {showEditor && (
        <SocialPostEditor
          post={editingPost}
          onSave={handleSavePost}
          onClose={() => {
            setShowEditor(false);
            setEditingPost(undefined);
          }}
        />
      )}
    </div>
  );
}