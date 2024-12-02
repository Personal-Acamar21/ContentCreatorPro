import React from 'react';
import { format } from 'date-fns';
import { Edit2, Trash2, Clock, Instagram, Facebook, Linkedin, Twitter, Music2 } from 'lucide-react';
import { useSocialStore } from '../../store/socialStore';
import type { SocialPlatform } from '../../types/social';

interface SocialPostListProps {
  onCreateNew: () => void;
}

const platformIcons: Record<SocialPlatform, React.ReactNode> = {
  instagram: <Instagram className="w-5 h-5 text-pink-600" />,
  facebook: <Facebook className="w-5 h-5 text-blue-600" />,
  linkedin: <Linkedin className="w-5 h-5 text-blue-700" />,
  twitter: <Twitter className="w-5 h-5 text-blue-400" />,
  tiktok: <Music2 className="w-5 h-5 text-black" />, // Using Music2 icon for TikTok
};

export default function SocialPostList({ onCreateNew }: SocialPostListProps) {
  const { posts, deletePost } = useSocialStore();

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePost(id);
    }
  };

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="mt-1">{platformIcons[post.platform]}</div>
              <div>
                <p className="font-medium text-gray-900">{post.caption}</p>
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt="Post media"
                    className="mt-2 h-24 rounded-lg object-cover"
                  />
                )}
                <div className="mt-2 flex flex-wrap gap-2">
                  {post.hashtags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  {format(new Date(post.scheduledDate), 'PPp')}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleDelete(post.id)}
                className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors duration-200"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => {/* TODO: Implement edit */}}
                className="p-1 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors duration-200"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}

      {posts.length === 0 && (
        <div
          onClick={onCreateNew}
          className="text-center py-12 cursor-pointer group"
        >
          <div className="bg-white rounded-lg shadow-sm border p-8 hover:shadow-md transition-all duration-200">
            <div className="flex flex-col items-center">
              <div className="p-3 bg-primary-50 rounded-full mb-4">
                <Instagram className="w-8 h-8 text-primary-600" />
              </div>
              <p className="text-gray-500 text-lg">No social media posts yet.</p>
              <p className="text-primary-600 mt-2 font-medium group-hover:text-primary-700">
                Create your first post!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}