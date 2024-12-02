import { BrandPersonality } from '../types/social';

export const brandPersonalities: BrandPersonality[] = [
  {
    id: 'professional',
    name: 'Professional Expert',
    description: 'Authoritative, knowledgeable, and trustworthy',
    tone: 'formal',
    traits: ['credible', 'analytical', 'informative'],
    writingStyle: 'Clear, well-researched content with industry insights',
    emoji: '👔'
  },
  {
    id: 'friendly',
    name: 'Friendly Coach',
    description: 'Supportive, encouraging, and approachable',
    tone: 'conversational',
    traits: ['helpful', 'positive', 'motivating'],
    writingStyle: 'Warm, engaging content with practical advice',
    emoji: '🤝'
  },
  {
    id: 'trendy',
    name: 'Trendy Influencer',
    description: 'Fashion-forward, up-to-date, and engaging',
    tone: 'casual',
    traits: ['trendy', 'energetic', 'social'],
    writingStyle: 'Fun, trendy content with pop culture references',
    emoji: '✨'
  },
  {
    id: 'creative',
    name: 'Creative Artist',
    description: 'Artistic, innovative, and expressive',
    tone: 'artistic',
    traits: ['creative', 'unique', 'inspiring'],
    writingStyle: 'Imaginative content with artistic flair',
    emoji: '🎨'
  },
  {
    id: 'tech',
    name: 'Tech Innovator',
    description: 'Forward-thinking, tech-savvy, and innovative',
    tone: 'technical',
    traits: ['innovative', 'precise', 'futuristic'],
    writingStyle: 'Technical content with cutting-edge insights',
    emoji: '💻'
  },
  {
    id: 'wellness',
    name: 'Wellness Guide',
    description: 'Nurturing, balanced, and health-focused',
    tone: 'mindful',
    traits: ['holistic', 'nurturing', 'balanced'],
    writingStyle: 'Mindful content focused on wellbeing',
    emoji: '🌱'
  },
  {
    id: 'entertainer',
    name: 'Fun Entertainer',
    description: 'Humorous, engaging, and entertaining',
    tone: 'playful',
    traits: ['funny', 'entertaining', 'engaging'],
    writingStyle: 'Fun, entertaining content with humor',
    emoji: '🎭'
  },
  {
    id: 'educator',
    name: 'Educational Leader',
    description: 'Educational, insightful, and thorough',
    tone: 'academic',
    traits: ['educational', 'thorough', 'structured'],
    writingStyle: 'Detailed, educational content with clear explanations',
    emoji: '📚'
  }
];