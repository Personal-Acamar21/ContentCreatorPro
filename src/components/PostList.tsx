import { format } from 'date-fns';
import { Edit, Trash2, Eye, EyeOff, PenSquare } from 'lucide-react';
import { BlogPost } from '../types/blog';

interface PostListProps {
  posts: BlogPost[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string, published: boolean) => void;
}

export default function PostList({ 
  posts, 
  onEdit, 
  onDelete, 
  onTogglePublish 
}: PostListProps) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white rounded-lg shadow-md border border-primary-100 p-6 hover:shadow-lg transition-all duration-200 group"
        >
          <div className="flex items-center justify-between">
            <div 
              className="flex-1 cursor-pointer"
              onClick={() => onEdit(post.id)}
            >
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                {post.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {format(new Date(post.updatedAt), 'PPP')}
              </p>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {post.excerpt}
              </p>
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePublish(post.id, !post.published);
                }}
                className={`p-2 rounded-full transition-colors duration-200 ${
                  post.published
                    ? 'text-green-600 hover:bg-green-50'
                    : 'text-gray-400 hover:bg-gray-50'
                }`}
                title={post.published ? 'Unpublish' : 'Publish'}
              >
                {post.published ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(post.id);
                }}
                className="p-2 text-primary-600 hover:bg-primary-50 rounded-full transition-colors duration-200"
                title="Edit"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(post.id);
                }}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                title="Delete"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
      {posts.length === 0 && (
        <div 
          onClick={() => onEdit('')}
          className="text-center py-12 cursor-pointer group"
        >
          <div className="bg-white rounded-lg shadow-md border border-primary-100 p-8 transition-all duration-200 hover:shadow-lg hover:border-primary-300">
            <div className="flex flex-col items-center">
              <PenSquare className="w-12 h-12 text-primary-400 mb-4 group-hover:text-primary-600 transition-colors duration-200" />
              <p className="text-gray-500 text-lg">No posts yet.</p>
              <p className="text-primary-600 mt-2 font-medium group-hover:text-primary-700">Create your first post!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}