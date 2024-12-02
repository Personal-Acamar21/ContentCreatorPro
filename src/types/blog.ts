export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  scheduledDate?: string;
  template?: string;
  keywords?: string[];
  targetAudience?: string;
}

export interface BlogTemplate {
  id: string;
  name: string;
  description: string;
  structure: string;
  type: 'how-to' | 'listicle' | 'opinion' | 'review' | 'news';
  prompt: string;
}

export interface AIGenerationParams {
  topic: string;
  template: BlogTemplate;
  keywords?: string[];
  targetAudience?: string;
  tone?: 'professional' | 'casual' | 'academic' | 'conversational';
  length?: 'short' | 'medium' | 'long';
}