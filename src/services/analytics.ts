import { analytics } from '../lib/firebase';
import { logEvent } from 'firebase/analytics';
import type { SocialPost } from '../types/social';

// Track post engagement
export async function trackPostEngagement(post: SocialPost, action: 'view' | 'like' | 'share' | 'click') {
  if (!analytics) return;

  logEvent(analytics, 'social_engagement', {
    post_id: post.id,
    platform: post.platform,
    action,
    timestamp: new Date().toISOString()
  });
}

// Track audience metrics
export async function trackAudienceMetric(metric: {
  platform: string;
  type: 'follower' | 'view' | 'engagement';
  value: number;
}) {
  if (!analytics) return;

  logEvent(analytics, 'audience_metric', {
    ...metric,
    timestamp: new Date().toISOString()
  });
}

// Track ROI metrics
export async function trackCampaignMetrics(campaign: {
  id: string;
  platform: string;
  spend: number;
  revenue: number;
}) {
  if (!analytics) return;

  logEvent(analytics, 'campaign_metric', {
    ...campaign,
    roi: (campaign.revenue - campaign.spend) / campaign.spend * 100,
    timestamp: new Date().toISOString()
  });
}