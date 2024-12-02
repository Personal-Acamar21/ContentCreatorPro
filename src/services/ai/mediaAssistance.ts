import { generateContent } from '../openai';

interface MediaSuggestion {
  type: 'image' | 'video';
  description: string;
  keywords: string[];
  placement: 'header' | 'inline' | 'sidebar';
  confidence: number;
}

interface ImageOptimization {
  width: number;
  height: number;
  format: 'jpeg' | 'png' | 'webp';
  quality: number;
}

export async function suggestMedia(content: string): Promise<MediaSuggestion[]> {
  const prompt = `Analyze this content and suggest relevant media:
    "${content}"
    
    Provide suggestions in JSON format with:
    - type (image/video)
    - description
    - keywords
    - placement
    - confidence (0-1)`;

  const response = await generateContent(prompt);
  
  try {
    return JSON.parse(response);
  } catch {
    // Fallback if JSON parsing fails
    return [{
      type: 'image',
      description: 'Relevant illustration for the content',
      keywords: content.split(' ').slice(0, 5),
      placement: 'header',
      confidence: 0.7
    }];
  }
}

export function optimizeImage(
  imageUrl: string,
  targetDevice: 'mobile' | 'tablet' | 'desktop'
): ImageOptimization {
  const optimizations: Record<string, ImageOptimization> = {
    mobile: {
      width: 640,
      height: 360,
      format: 'webp',
      quality: 80
    },
    tablet: {
      width: 1024,
      height: 576,
      format: 'webp',
      quality: 85
    },
    desktop: {
      width: 1920,
      height: 1080,
      format: 'webp',
      quality: 90
    }
  };

  return optimizations[targetDevice];
}

export async function generateAltText(imageUrl: string): Promise<string> {
  const prompt = `Generate a descriptive, SEO-friendly alt text for an image that appears to show: [describe the image]`;
  return generateContent(prompt);
}

export async function suggestImageStyle(content: string): Promise<{
  filter: string;
  overlay?: string;
  effects: string[];
}> {
  // Analyze content tone and suggest image style
  const doc = content.toLowerCase();
  const tone = doc.includes('professional') ? 'corporate' :
               doc.includes('creative') ? 'artistic' :
               'neutral';

  switch (tone) {
    case 'corporate':
      return {
        filter: 'brightness(1.1) contrast(1.1)',
        effects: ['subtle-shadow', 'clean-edges']
      };
    case 'artistic':
      return {
        filter: 'saturate(1.2)',
        overlay: 'linear-gradient(45deg, rgba(0,0,0,0.1), rgba(0,0,0,0))',
        effects: ['soft-glow', 'rounded-corners']
      };
    default:
      return {
        filter: 'none',
        effects: ['standard']
      };
  }
}