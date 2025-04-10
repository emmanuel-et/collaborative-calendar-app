"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CalendarRole } from '@/models/Calendar'; // Adjust the path as needed
import { momentLocalizer, View } from 'react-big-calendar';
import InviteUserDialog from '@/components/calendar/InviteUserDialog';
import { InviteNotificationInput } from '@/models/Notification';

// Dynamically import the BigCalendar component
const BigCalendar = dynamic(() => import('react-big-calendar').then((mod) => mod.Calendar), { ssr: false });

// Mock data for demonstration
const mockCalendars = {
  [CalendarRole.OWNER]: [
    { _id: '1', name: 'Work Calendar', memberships: ['user1', 'user2'] },
    { _id: '2', name: 'Personal Calendar', memberships: ['user1'] },
  ],
  [CalendarRole.VIEWER]: [
    { _id: '3', name: 'Team Calendar', memberships: ['user3', 'user4'] },
    { _id: '4', name: 'Project Calendar', memberships: ['user5'] },
  ],
  [CalendarRole.EDITOR]: [
    { _id: '5', name: 'Shared Calendar', memberships: ['user6', 'user7'] },
    { _id: '6', name: 'Community Calendar', memberships: ['user8'] },
  ],
};

// Dummy events for testing
const dummyEvents = {
  '1': [{ title: 'Meeting', start: new Date(), end: new Date() }],
  '2': [{ title: 'Gym', start: new Date(), end: new Date() }],
  '3': [{ title: 'Team Sync', start: new Date(), end: new Date() }],
  '4': [{ title: 'Deadline', start: new Date(), end: new Date() }],
  '5': [{ title: 'Workshop', start: new Date(), end: new Date() }],
  '6': [{ title: 'Event', start: new Date(), end: new Date() }],
};

const CalendarPage = () => {
  const [expandedCategories, setExpandedCategories] = useState({
    [CalendarRole.OWNER]: false,
    [CalendarRole.VIEWER]: false,
    [CalendarRole.EDITOR]: false,
  });

  const [visibleCategories, setVisibleCategories] = useState({
    [CalendarRole.OWNER]: true,
    [CalendarRole.VIEWER]: true,
    [CalendarRole.EDITOR]: true,
  });

  const [visibleCalendars, setVisibleCalendars] = useState(
    Object.keys(mockCalendars).reduce((acc, role) => {
      mockCalendars[role].forEach((calendar) => {
        acc[calendar._id] = true;
      });
      return acc;
    }, {} as Record<string, boolean>)
  );

  const [events, setEvents] = useState<Record<string, any[]>>(dummyEvents);
  const [view, setView] = useState<View>('month');
  const [selectedCalendar, setSelectedCalendar] = useState<string | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);

  const localizer = momentLocalizer(moment);

  useEffect(() => {
    // Simulate fetching events for visible calendars
    const fetchEvents = async () => {
      const visibleCalendarIds = Object.keys(visibleCalendars).filter((id) => visibleCalendars[id]);
      const fetchedEvents = visibleCalendarIds.reduce((acc, id) => {
        acc[id] = dummyEvents[id] || []; // Replace with actual API call
        return acc;
      }, {} as Record<string, any[]>);
      setEvents(fetchedEvents);
    };

    fetchEvents();
  }, [visibleCalendars]);

  const toggleCategoryExpand = (role: CalendarRole) => {
    setExpandedCategories((prev) => ({ ...prev, [role]: !prev[role] }));
  };

  const toggleCategoryVisibility = (role: CalendarRole) => {
    const isVisible = !visibleCategories[role];
    setVisibleCategories((prev) => ({ ...prev, [role]: isVisible }));

    // Update visibility of all calendars under the category
    setVisibleCalendars((prev) => {
      const updated = { ...prev };
      mockCalendars[role].forEach((calendar) => {
        updated[calendar._id] = isVisible;
      });
      return updated;
    });
  };

  const toggleCalendarVisibility = (calendarId: string) => {
    setVisibleCalendars((prev) => ({ ...prev, [calendarId]: !prev[calendarId] }));
  };

  const getVisibleEvents = () => {
    return Object.keys(events).flatMap((calendarId) =>
      visibleCalendars[calendarId] ? events[calendarId].map((event) => ({ ...event, calendarId })) : []
    );
  };

  const handleSendInvite = async (inviteData: InviteNotificationInput) => {
    console.log('Invite Data:', inviteData);
    try {
      const response = await fetch('/api/notifications?type=invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inviteData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to send invite notification.');
      }
  
    } catch (error) {
      console.error('Error sending invite:', error);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '7fr 1fr', gap: '20px' }}>
      <div style={{ height: '500px' }}>
        <BigCalendar
          localizer={localizer}
          events={getVisibleEvents()}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={(newView) => setView(newView)}
          style={{ height: '100%' }}
        />
      </div>
      <div>
        <h1>My Calendars</h1>
        {Object.values(CalendarRole).map((role) => (
          <div key={role}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h2 onClick={() => toggleCategoryExpand(role)} style={{ cursor: 'pointer', marginRight: '10px' }}>
                {role} Calendars {expandedCategories[role] ? '▼' : '▶'}
              </h2>
              <label>
                <input
                  type="checkbox"
                  checked={visibleCategories[role]}
                  onChange={() => toggleCategoryVisibility(role)}
                />
                Show
              </label>
            </div>
            {expandedCategories[role] && (
              <ul style={{ paddingLeft: '20px' }}>
                {mockCalendars[role].map((calendar) => (
                  <li
                    key={calendar._id}
                    style={{
                      marginLeft: '20px',
                      fontWeight: hoveredEvent === calendar._id ? 'bold' : 'normal',
                      backgroundColor: selectedCalendar === calendar._id ? '#ffcc00' : 'transparent',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: '10px' }}>{calendar.name}</span>
                      <label>
                        <input
                          type="checkbox"
                          checked={visibleCalendars[calendar._id]}
                          onChange={() => toggleCalendarVisibility(calendar._id)}
                        />
                        Show
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarPage;
