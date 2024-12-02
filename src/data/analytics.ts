import type { SocialPlatform } from '../types/social';

export interface Competitor {
  name: string;
  followers: number;
  engagement: number;
  postFrequency: number;
  topContent: string[];
  strengths: string[];
  weaknesses: string[];
}

export interface Campaign {
  campaign: string;
  platform: SocialPlatform;
  spend: number;
  revenue: number;
  roi: number;
  status: 'active' | 'completed' | 'planned';
}

export interface SentimentData {
  positive: number;
  neutral: number;
  negative: number;
  keywords: {
    positive: string[];
    negative: string[];
  };
  trends: {
    label: string;
    value: number;
    change: number;
  }[];
}

export const competitors: Competitor[] = [
  {
    name: 'Competitor A',
    followers: 25000,
    engagement: 4.5,
    postFrequency: 14,
    topContent: ['Product Reviews', 'How-to Guides', 'Industry News'],
    strengths: ['Visual Content', 'Community Engagement', 'Consistent Posting'],
    weaknesses: ['Limited Platform Presence', 'Low Video Content', 'Generic Responses']
  },
  {
    name: 'Competitor B',
    followers: 18000,
    engagement: 3.8,
    postFrequency: 10,
    topContent: ['Behind the Scenes', 'Customer Stories', 'Tips & Tricks'],
    strengths: ['Authentic Voice', 'User-Generated Content', 'Strong Branding'],
    weaknesses: ['Irregular Posting', 'Limited Engagement', 'Poor Cross-Platform Integration']
  },
  {
    name: 'Competitor C',
    followers: 32000,
    engagement: 5.2,
    postFrequency: 18,
    topContent: ['Tutorials', 'Industry Insights', 'Company Culture'],
    strengths: ['High-Quality Content', 'Influencer Partnerships', 'Multi-Platform Strategy'],
    weaknesses: ['Slow Response Time', 'Inconsistent Messaging', 'Limited Original Content']
  }
];

export const roiData: Campaign[] = [
  {
    campaign: 'Summer Sale Promotion',
    platform: 'instagram',
    spend: 1200,
    revenue: 4800,
    roi: 300,
    status: 'completed'
  },
  {
    campaign: 'Product Launch',
    platform: 'facebook',
    spend: 2000,
    revenue: 7500,
    roi: 275,
    status: 'active'
  },
  {
    campaign: 'Brand Awareness',
    platform: 'linkedin',
    spend: 1500,
    revenue: 4500,
    roi: 200,
    status: 'active'
  },
  {
    campaign: 'Holiday Campaign',
    platform: 'instagram',
    spend: 3000,
    revenue: 12000,
    roi: 300,
    status: 'planned'
  }
];

export const sentimentData: SentimentData = {
  positive: 65,
  neutral: 25,
  negative: 10,
  keywords: {
    positive: ['helpful', 'great', 'amazing', 'love', 'excellent'],
    negative: ['slow', 'expensive', 'difficult', 'confusing']
  },
  trends: [
    {
      label: 'Customer Service',
      value: 85,
      change: 5
    },
    {
      label: 'Product Quality',
      value: 78,
      change: 3
    },
    {
      label: 'User Experience',
      value: 72,
      change: -2
    },
    {
      label: 'Value for Money',
      value: 68,
      change: 4
    }
  ]
};