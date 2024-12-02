import React, { useEffect, useState } from 'react';
import { BarChart2, TrendingUp, Eye, Users, ArrowUp, ArrowDown } from 'lucide-react';
import { 
  getPostEngagement, 
  getAudienceGrowth,
  getRealTimeMetrics,
  getCompetitorMetrics 
} from '../../services/social/metrics';
import { competitors, roiData, sentimentData } from '../../data/analytics';
import type { SocialPost } from '../../types/social';
import { useAuthStore } from '../../store/authStore';

interface SocialAnalyticsProps {
  posts: SocialPost[];
}

interface Metrics {
  totalEngagement: number;
  averageReach: number;
  conversionRate: number;
  growthRate: number;
}

export default function SocialAnalytics({ posts }: SocialAnalyticsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'competitors' | 'sentiment' | 'roi'>('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<Metrics>({
    totalEngagement: 0,
    averageReach: 0,
    conversionRate: 0,
    growthRate: 0
  });

  const { isLocalMode } = useAuthStore();

  // Calculate metrics from engagement data
  const calculateTotalEngagement = (engagementData: any[]) => {
    return engagementData.reduce((total, data) => total + (data.views || 0) + (data.likes || 0) + (data.shares || 0), 0);
  };

  const calculateAverageReach = (engagementData: any[]) => {
    return Math.floor(calculateTotalEngagement(engagementData) * 2.5);
  };

  const calculateConversionRate = (engagementData: any[]) => {
    const totalClicks = engagementData.reduce((total, data) => total + (data.clicks || 0), 0);
    const totalViews = engagementData.reduce((total, data) => total + (data.views || 0), 0);
    return totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;
  };

  const calculateGrowthRate = (audienceData: any[]) => {
    if (audienceData.length < 2) return 0;
    const latest = audienceData[0].followers;
    const oldest = audienceData[audienceData.length - 1].followers;
    return oldest > 0 ? ((latest - oldest) / oldest) * 100 : 0;
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch metrics for each post
        const engagementPromises = posts.map(post => getPostEngagement(post.id));
        const engagementData = await Promise.all(engagementPromises);

        // Fetch audience growth
        const audienceData = await getAudienceGrowth('all', 30);

        // Update metrics state
        setMetrics({
          totalEngagement: calculateTotalEngagement(engagementData),
          averageReach: calculateAverageReach(engagementData),
          conversionRate: calculateConversionRate(engagementData),
          growthRate: calculateGrowthRate(audienceData)
        });

      } catch (error) {
        console.error('Error fetching analytics:', error);
        setError('Unable to load analytics data. Using sample data instead.');
        
        // Set fallback metrics
        setMetrics({
          totalEngagement: 1250,
          averageReach: 3125,
          conversionRate: 2.8,
          growthRate: 12.5
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [posts, selectedTimeRange]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Analytics Dashboard</h3>
          <p className="text-sm text-gray-500">
            {isLocalMode ? 'Viewing sample data (offline mode)' : 'Track your social media performance'}
          </p>
        </div>
        <select
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {error && (
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <BarChart2 className="w-12 h-12 text-gray-400 animate-pulse mx-auto mb-4" />
          <p className="text-gray-500">Loading analytics data...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Engagement</p>
                  <p className="text-2xl font-semibold">{metrics.totalEngagement.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-primary-50 rounded-full">
                  <TrendingUp className="w-6 h-6 text-primary-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm text-green-600">
                <ArrowUp className="w-4 h-4 mr-1" />
                <span>8.2% vs previous period</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Average Reach</p>
                  <p className="text-2xl font-semibold">{metrics.averageReach.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-primary-50 rounded-full">
                  <Eye className="w-6 h-6 text-primary-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm text-green-600">
                <ArrowUp className="w-4 h-4 mr-1" />
                <span>12.5% vs previous period</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Conversion Rate</p>
                  <p className="text-2xl font-semibold">{metrics.conversionRate.toFixed(1)}%</p>
                </div>
                <div className="p-3 bg-primary-50 rounded-full">
                  <BarChart2 className="w-6 h-6 text-primary-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm text-red-600">
                <ArrowDown className="w-4 h-4 mr-1" />
                <span>2.1% vs previous period</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Growth Rate</p>
                  <p className="text-2xl font-semibold">{metrics.growthRate.toFixed(1)}%</p>
                </div>
                <div className="p-3 bg-primary-50 rounded-full">
                  <Users className="w-6 h-6 text-primary-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm text-green-600">
                <ArrowUp className="w-4 h-4 mr-1" />
                <span>5.3% vs previous period</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border">
            <div className="border-b px-4 py-3">
              <div className="flex gap-4">
                {(['overview', 'competitors', 'sentiment', 'roi'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg ${
                      activeTab === tab
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4">
              {activeTab === 'competitors' && (
                <div className="space-y-6">
                  {competitors.map((competitor) => (
                    <div key={competitor.name} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{competitor.name}</h4>
                          <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Followers</p>
                              <p className="font-medium">{competitor.followers.toLocaleString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Engagement Rate</p>
                              <p className="font-medium">{competitor.engagement}%</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Posts/Month</p>
                              <p className="font-medium">{competitor.postFrequency}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'sentiment' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">Sentiment Distribution</h4>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Positive</span>
                            <span>{sentimentData.positive}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full">
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${sentimentData.positive}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Neutral</span>
                            <span>{sentimentData.neutral}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full">
                            <div
                              className="h-full bg-yellow-500 rounded-full"
                              style={{ width: `${sentimentData.neutral}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Negative</span>
                            <span>{sentimentData.negative}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full">
                            <div
                              className="h-full bg-red-500 rounded-full"
                              style={{ width: `${sentimentData.negative}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'roi' && (
                <div className="space-y-6">
                  {roiData.map((campaign) => (
                    <div key={campaign.campaign} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{campaign.campaign}</h4>
                          <p className="text-sm text-gray-500 mt-1">Platform: {campaign.platform}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          campaign.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : campaign.status === 'completed'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {campaign.status}
                        </span>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Spend</p>
                          <p className="font-medium">${campaign.spend.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Revenue</p>
                          <p className="font-medium">${campaign.revenue.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">ROI</p>
                          <p className="font-medium">{campaign.roi}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}