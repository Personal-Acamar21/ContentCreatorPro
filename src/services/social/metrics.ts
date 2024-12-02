import { db } from '../../lib/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit,
  Timestamp,
  addDoc
} from 'firebase/firestore';
import { useAuthStore } from '../../store/authStore';

// Mock data for local/offline mode
const mockEngagementData = {
  views: 1250,
  likes: 430,
  shares: 120,
  clicks: 89
};

const mockAudienceData = {
  followers: 5000,
  engagement: 3.2,
  growth: 12.5
};

// Helper to check if we should use mock data
const shouldUseMockData = () => {
  return useAuthStore.getState().isLocalMode;
};

// Store engagement metrics
export async function storeEngagement(metric: Omit<EngagementMetric, 'timestamp'>) {
  if (shouldUseMockData()) {
    return Promise.resolve();
  }

  try {
    await addDoc(collection(db, 'engagement_metrics'), {
      ...metric,
      timestamp: Timestamp.now()
    });
  } catch (error) {
    console.error('Error storing engagement metric:', error);
    return mockEngagementData;
  }
}

// Get engagement metrics for a specific post
export async function getPostEngagement(postId: string) {
  if (shouldUseMockData()) {
    return Promise.resolve([{
      id: postId,
      ...mockEngagementData,
      timestamp: Timestamp.now()
    }]);
  }

  try {
    const q = query(
      collection(db, 'engagement_metrics'),
      where('postId', '==', postId),
      orderBy('timestamp', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting post engagement:', error);
    return [{
      id: postId,
      ...mockEngagementData,
      timestamp: Timestamp.now()
    }];
  }
}

// Get audience growth metrics
export async function getAudienceGrowth(platform: string, days: number = 30) {
  if (shouldUseMockData()) {
    return Promise.resolve([{
      id: 'mock-audience',
      platform,
      ...mockAudienceData,
      timestamp: Timestamp.now()
    }]);
  }

  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const q = query(
      collection(db, 'audience_metrics'),
      where('platform', '==', platform),
      where('timestamp', '>=', Timestamp.fromDate(startDate)),
      orderBy('timestamp', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting audience growth:', error);
    return [{
      id: 'mock-audience',
      platform,
      ...mockAudienceData,
      timestamp: Timestamp.now()
    }];
  }
}

// Get real-time metrics
export async function getRealTimeMetrics(platform: string) {
  if (shouldUseMockData()) {
    return Promise.resolve([{
      id: 'mock-realtime',
      platform,
      ...mockEngagementData,
      timestamp: Timestamp.now()
    }]);
  }

  try {
    const q = query(
      collection(db, 'engagement_metrics'),
      where('platform', '==', platform),
      where('timestamp', '>=', Timestamp.fromDate(new Date(Date.now() - 3600000))),
      orderBy('timestamp', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting real-time metrics:', error);
    return [{
      id: 'mock-realtime',
      platform,
      ...mockEngagementData,
      timestamp: Timestamp.now()
    }];
  }
}

// Get competitor analysis
export async function getCompetitorMetrics(competitors: string[]) {
  if (shouldUseMockData()) {
    return Promise.resolve(competitors.map(competitor => ({
      id: competitor,
      competitorId: competitor,
      followers: Math.floor(Math.random() * 10000) + 1000,
      engagement: (Math.random() * 5).toFixed(1),
      timestamp: Timestamp.now()
    })));
  }

  try {
    const q = query(
      collection(db, 'competitor_metrics'),
      where('competitorId', 'in', competitors),
      orderBy('timestamp', 'desc'),
      limit(competitors.length)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting competitor metrics:', error);
    return competitors.map(competitor => ({
      id: competitor,
      competitorId: competitor,
      followers: Math.floor(Math.random() * 10000) + 1000,
      engagement: (Math.random() * 5).toFixed(1),
      timestamp: Timestamp.now()
    }));
  }
}