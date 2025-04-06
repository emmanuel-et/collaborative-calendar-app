"use client";

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { EventInput } from '@/models/Event';

interface EventFormProps {
  onSubmit: (event: EventInput) => void;
  initialData?: Partial<EventInput>;
  isEdit?: boolean;
}

const EventForm: React.FC<EventFormProps> = ({ onSubmit, initialData = {}, isEdit = false }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [startTime, setStartTime] = useState(
    initialData.startTime ? new Date(initialData.startTime).toISOString().slice(0, 16) : ''
  );
  const [endTime, setEndTime] = useState(
    initialData.endTime ? new Date(initialData.endTime).toISOString().slice(0, 16) : ''
  );
  const [location, setLocation] = useState(initialData.location || '');
  const [isAllDay, setIsAllDay] = useState(initialData.isAllDay || false);
  const [color, setColor] = useState(initialData.color || '#9333ea'); // Default purple
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate form
    if (!title) {
      setError('Title is required');
      return;
    }

    if (!startTime) {
      setError('Start time is required');
      return;
    }

    if (!endTime) {
      setError('End time is required');
      return;
    }

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (endDate < startDate) {
      setError('End time must be after start time');
      return;
    }

    // Create event data
    const eventData: EventInput = {
      title,
      description,
      startTime: startDate,
      endTime: endDate,
      location,
      isAllDay,
      color,
      createdBy: user?.uid || '',
      participants: [user?.uid || ''], // Initially just the creator
    };

    onSubmit(eventData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium mb-1">
            Start Time *
          </label>
          <input
            type="datetime-local"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="endTime" className="block text-sm font-medium mb-1">
            End Time *
          </label>
          <input
            type="datetime-local"
            id="endTime"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="location" className="block text-sm font-medium mb-1">
          Location
        </label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isAllDay"
          checked={isAllDay}
          onChange={(e) => setIsAllDay(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="isAllDay" className="text-sm font-medium">
          All Day Event
        </label>
      </div>
      
      <div>
        <label htmlFor="color" className="block text-sm font-medium mb-1">
          Color
        </label>
        <input
          type="color"
          id="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full h-10 p-1 border rounded"
        />
      </div>
      
      <Button
        type="submit"
        className="w-full bg-purple-600 text-white hover:bg-purple-700"
      >
        {isEdit ? 'Update Event' : 'Create Event'}
      </Button>
    </form>
  );
};

export default EventForm; 