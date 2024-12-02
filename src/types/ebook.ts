export interface Chapter {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface Ebook {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  chapters: Chapter[];
  template: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published';
  format: 'pdf' | 'epub' | 'mobi';
  style?: {
    fontFamily?: string;
    fontSize?: string;
    lineHeight?: string;
    spacing?: string;
  };
}

export interface EbookTemplate {
  id: string;
  name: string;
  description: string;
  structure: {
    title: string;
    chapters: {
      title: string;
      description: string;
    }[];
  };
}

export interface ContentSuggestion {
  original: string;
  suggestion: string;
  type: string;
  confidence: number;
}

export interface LayoutSuggestion {
  type: 'spacing' | 'typography' | 'hierarchy' | 'color';
  suggestion: string;
  priority: 'high' | 'medium' | 'low';
}

export interface MediaSuggestion {
  type: 'image' | 'video';
  description: string;
  keywords: string[];
  placement: 'header' | 'inline' | 'sidebar';
  confidence: number;
}

export interface ReaderProfile {
  readingLevel: 'beginner' | 'intermediate' | 'advanced';
  preferences: {
    fontSize: string;
    fontFamily: string;
    lineHeight: string;
    theme: 'light' | 'dark' | 'sepia';
    textAlign: 'left' | 'justify';
  };
  accessibility: {
    highContrast: boolean;
    dyslexicFont: boolean;
    lineSpacing: string;
    paragraphSpacing: string;
  };
}