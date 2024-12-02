import React, { useState } from 'react';
import { Lightbulb, ArrowRight } from 'lucide-react';
import type { ContentIdea, SocialPlatform } from '../../types/social';

interface SocialContentIdeasProps {
  onUseIdea: (idea: ContentIdea) => void;
}

const defaultIdeas: ContentIdea[] = [
  {
    title: "Behind the Scenes",
    description: "Share a glimpse of your work process or team culture",
    suggestedPlatforms: ['instagram', 'linkedin'],
    type: 'image',
    hashtags: ['behindthescenes', 'worklife', 'company'],
    bestTimeToPost: "Tuesday 10:00 AM"
  },
  {
    title: "Industry Tips",
    description: "Share quick, actionable tips related to your industry",
    suggestedPlatforms: ['linkedin', 'twitter'],
    type: 'carousel',
    hashtags: ['tips', 'industry', 'learning'],
    bestTimeToPost: "Wednesday 2:00 PM"
  },
  {
    title: "Product Showcase",
    description: "Highlight a product feature or use case",
    suggestedPlatforms: ['instagram', 'facebook'],
    type: 'video',
    hashtags: ['product', 'feature', 'showcase'],
    bestTimeToPost: "Thursday 1:00 PM"
  }
];

export default function SocialContentIdeas({ onUseIdea }: SocialContentIdeasProps) {
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<ContentIdea[]>(defaultIdeas);

  const generateIdeas = async () => {
    setLoading(true);
    try {
      // Simulate API call for new ideas
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newIdeas: ContentIdea[] = [
        {
          title: "Customer Success Story",
          description: "Share a testimonial or case study from a satisfied customer",
          suggestedPlatforms: ['linkedin', 'facebook'],
          type: 'carousel',
          hashtags: ['success', 'testimonial', 'customer'],
          bestTimeToPost: "Monday 11:00 AM"
        },
        {
          title: "Quick Tutorial",
          description: "Create a short how-to video demonstrating a useful feature",
          suggestedPlatforms: ['instagram', 'tiktok'],
          type: 'video',
          hashtags: ['tutorial', 'howto', 'tips'],
          bestTimeToPost: "Friday 2:00 PM"
        },
        {
          title: "Industry News Update",
          description: "Share your perspective on recent industry developments",
          suggestedPlatforms: ['twitter', 'linkedin'],
          type: 'text',
          hashtags: ['news', 'industry', 'update'],
          bestTimeToPost: "Wednesday 9:00 AM"
        }
      ];
      
      setIdeas(newIdeas);
    } catch (error) {
      console.error('Failed to generate ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Content Ideas</h3>
            <p className="text-sm text-gray-500">
              AI-generated content ideas for your social media posts
            </p>
          </div>
          <button
            onClick={generateIdeas}
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 flex items-center space-x-2"
          >
            <Lightbulb className="w-4 h-4" />
            <span>{loading ? 'Generating...' : 'Generate Ideas'}</span>
          </button>
        </div>

        <div className="grid gap-4">
          {ideas.map((idea, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 hover:border-primary-300 transition-colors duration-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">{idea.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {idea.description}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {idea.hashtags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Best time to post: {idea.bestTimeToPost}
                  </div>
                </div>
                <button
                  onClick={() => onUseIdea(idea)}
                  className="flex items-center space-x-1 text-primary-600 hover:text-primary-700"
                >
                  <span className="text-sm">Use Idea</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {idea.suggestedPlatforms.map((platform) => (
                  <span
                    key={platform}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}