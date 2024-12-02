import React, { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface SchedulerProps {
  onSchedule: (date: string) => void;
  scheduledDate?: string;
}

export default function Scheduler({ onSchedule, scheduledDate }: SchedulerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    scheduledDate || new Date().toISOString()
  );

  const handleSchedule = () => {
    onSchedule(selectedDate);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
      >
        <Calendar className="w-4 h-4" />
        <span>
          {scheduledDate
            ? `Scheduled: ${format(new Date(scheduledDate), 'PPp')}`
            : 'Schedule Post'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border p-4 z-10">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Publication Date & Time
                <input
                  type="datetime-local"
                  value={selectedDate.slice(0, 16)}
                  onChange={(e) => setSelectedDate(new Date(e.target.value).toISOString())}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min={new Date().toISOString().slice(0, 16)}
                />
              </label>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSchedule}
                className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}