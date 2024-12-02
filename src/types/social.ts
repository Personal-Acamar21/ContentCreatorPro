export type SocialPlatform = 'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'twitter';

export type MediaType = 'image' | 'video';

export interface ContentIdea {
  title: string;
  description: string;
  suggestedPlatforms: SocialPlatform[];
  type: 'image' | 'video' | 'carousel' | 'text';
  hashtags: string[];
  bestTimeToPost: string;
}

export type BrandPersonality = {
  id: string;
  name: string;
  description: string;
  tone: string;
  traits: string[];
  writingStyle: string;
  emoji: string;
};

export interface SocialPost {
  id: string;
  platform: SocialPlatform;
  content: string;
  caption: string;
  hashtags: string[];
  scheduledDate: string;
  mediaUrl?: string;
  mediaType?: MediaType;
  template?: string;
  status: 'draft' | 'scheduled' | 'published';
  createdAt: string;
  updatedAt: string;
  personality?: string;
  duration?: number; // for videos
}