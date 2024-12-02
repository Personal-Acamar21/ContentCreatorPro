import React from 'react';
import { Users, MapPin, Clock, TrendingUp } from 'lucide-react';

export default function SocialAudience() {
  // Mock audience data
  const audienceData = {
    demographics: {
      age: [
        { range: '18-24', percentage: 15 },
        { range: '25-34', percentage: 35 },
        { range: '35-44', percentage: 25 },
        { range: '45-54', percentage: 15 },
        { range: '55+', percentage: 10 },
      ],
      gender: [
        { label: 'Male', percentage: 45 },
        { label: 'Female', percentage: 52 },
        { label: 'Other', percentage: 3 },
      ],
    },
    topLocations: [
      { city: 'New York', percentage: 25 },
      { city: 'London', percentage: 20 },
      { city: 'Los Angeles', percentage: 15 },
      { city: 'Toronto', percentage: 10 },
      { city: 'Sydney', percentage: 8 },
    ],
    activeHours: [
      { hour: '9AM-12PM', engagement: 30 },
      { hour: '12PM-3PM', engagement: 25 },
      { hour: '3PM-6PM', engagement: 20 },
      { hour: '6PM-9PM', engagement: 15 },
      { hour: '9PM-12AM', engagement: 10 },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Age Distribution</h3>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {audienceData.demographics.age.map(({ range, percentage }) => (
              <div key={range} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{range}</span>
                  <span>{percentage}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full">
                  <div
                    className="h-full bg-primary-500 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Top Locations</h3>
            <MapPin className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {audienceData.topLocations.map(({ city, percentage }) => (
              <div key={city} className="flex items-center justify-between">
                <span>{city}</span>
                <div className="flex items-center">
                  <div className="w-24 h-2 bg-gray-100 rounded-full mr-2">
                    <div
                      className="h-full bg-primary-500 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500">{percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Peak Activity Hours</h3>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {audienceData.activeHours.map(({ hour, engagement }) => (
              <div key={hour} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{hour}</span>
                  <span>{engagement}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full">
                  <div
                    className="h-full bg-primary-500 rounded-full"
                    style={{ width: `${engagement}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Growth Trends</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>New Followers</span>
              <span className="text-green-600">+245</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Engagement Rate</span>
              <span className="text-green-600">+12.5%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Reach Growth</span>
              <span className="text-green-600">+18.2%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Click-through Rate</span>
              <span className="text-green-600">+8.7%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}