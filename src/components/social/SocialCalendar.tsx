import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isSameMonth } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar, Copy, Plus, Filter } from 'lucide-react';
import type { SocialPost } from '../../types/social';
import { holidays } from '../../data/holidays';

interface SocialCalendarProps {
  posts: SocialPost[];
  onEditPost: (post: SocialPost) => void;
}

export default function SocialCalendar({ posts, onEditPost }: SocialCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [draggedPost, setDraggedPost] = useState<SocialPost | null>(null);
  const [showBulkScheduler, setShowBulkScheduler] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [showHolidayFilter, setShowHolidayFilter] = useState(false);
  const [selectedHolidayTypes, setSelectedHolidayTypes] = useState<string[]>(['holiday', 'event', 'awareness']);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getPostsForDay = (date: Date) => {
    return posts.filter(post => isSameDay(new Date(post.scheduledDate), date));
  };

  const getHolidaysForDay = (date: Date) => {
    return holidays.filter(holiday => 
      isSameDay(new Date(holiday.date), date) && 
      selectedHolidayTypes.includes(holiday.type)
    );
  };

  const handleDragStart = (post: SocialPost) => {
    setDraggedPost(post);
  };

  const handleDrop = (date: Date) => {
    if (draggedPost) {
      onEditPost({
        ...draggedPost,
        scheduledDate: date.toISOString()
      });
      setDraggedPost(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDateClick = (date: Date) => {
    if (selectedDates.some(d => isSameDay(d, date))) {
      setSelectedDates(selectedDates.filter(d => !isSameDay(d, date)));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  const getHolidayColor = (type: string) => {
    switch (type) {
      case 'holiday':
        return 'bg-red-100 text-red-600';
      case 'event':
        return 'bg-blue-100 text-blue-600';
      case 'awareness':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">Content Calendar</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-lg font-medium">
              {format(currentDate, 'MMMM yyyy')}
            </span>
            <button
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <button
              onClick={() => setShowHolidayFilter(!showHolidayFilter)}
              className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              Holiday Types
            </button>
            {showHolidayFilter && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                <div className="p-2 space-y-2">
                  {['holiday', 'event', 'awareness'].map(type => (
                    <label key={type} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedHolidayTypes.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedHolidayTypes([...selectedHolidayTypes, type]);
                          } else {
                            setSelectedHolidayTypes(selectedHolidayTypes.filter(t => t !== type));
                          }
                        }}
                        className="rounded text-primary-600 focus:ring-primary-500"
                      />
                      <span className="capitalize">{type}s</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => setShowBulkScheduler(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-4 h-4" />
            Bulk Schedule
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
        {days.map(day => {
          const dayPosts = getPostsForDay(day);
          const dayHolidays = getHolidaysForDay(day);
          const isToday = isSameDay(day, new Date());
          const isSelected = selectedDates.some(d => isSameDay(d, day));
          const isCurrentMonth = isSameMonth(day, currentDate);
          
          return (
            <div
              key={day.toString()}
              onClick={() => handleDateClick(day)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(day)}
              className={`min-h-[120px] p-2 border rounded-lg cursor-pointer transition-colors duration-200 ${
                !isCurrentMonth ? 'bg-gray-50 opacity-50' : ''
              } ${
                isToday ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
              } ${isSelected ? 'ring-2 ring-primary-500' : ''}`}
            >
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium">
                  {format(day, 'd')}
                </span>
              </div>
              
              {dayHolidays.length > 0 && (
                <div className="mt-1 space-y-1">
                  {dayHolidays.map((holiday, index) => (
                    <span
                      key={index}
                      className={`block text-xs px-1.5 py-0.5 rounded-full ${getHolidayColor(holiday.type)}`}
                      title={`${holiday.name} (${holiday.type})`}
                    >
                      {holiday.name}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="mt-1 space-y-1">
                {dayPosts.map(post => (
                  <div
                    key={post.id}
                    draggable
                    onDragStart={() => handleDragStart(post)}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditPost(post);
                    }}
                    className="text-xs p-1.5 rounded bg-primary-100 text-primary-700 cursor-move hover:bg-primary-200 group"
                  >
                    <div className="flex items-center justify-between">
                      <span>{format(new Date(post.scheduledDate), 'h:mm a')}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditPost({
                            ...post,
                            id: crypto.randomUUID(),
                            scheduledDate: new Date().toISOString()
                          });
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-primary-300 rounded"
                        title="Duplicate post"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="mt-0.5 truncate">{post.platform}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {showBulkScheduler && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full">
            <h3 className="text-lg font-semibold mb-4">Bulk Schedule Posts</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Selected Dates ({selectedDates.length})
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedDates.map(date => (
                    <span
                      key={date.toString()}
                      className="px-2 py-1 text-sm bg-primary-100 text-primary-700 rounded"
                    >
                      {format(date, 'MMM d')}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => {
                    setShowBulkScheduler(false);
                    setSelectedDates([]);
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowBulkScheduler(false);
                    setSelectedDates([]);
                  }}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Schedule Posts
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}