import React, { useState } from 'react';
import '../../styles/Calendar.css';
import { getAssetPath } from '../../utils/assetUtils';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<Record<string, string[]>>({});
  const [newEvent, setNewEvent] = useState('');
  const [showAddEvent, setShowAddEvent] = useState(false);
  
  // Format date to string key for events object
  const formatDateKey = (date: Date): string => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };
  
  // Get current month days
  const getDaysInMonth = (year: number, month: number): Date[] => {
    const days = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Add previous month days to fill first week
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek; i > 0; i--) {
      const prevDate = new Date(year, month, 1 - i);
      days.push(prevDate);
    }
    
    // Add current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    // Add next month days to fill last week
    const lastDayOfWeek = lastDay.getDay();
    for (let i = 1; i < 7 - lastDayOfWeek; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push(nextDate);
    }
    
    return days;
  };
  
  // Navigate to next/prev month
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };
  
  // Add event to selected date
  const addEvent = () => {
    if (!selectedDate || !newEvent.trim()) return;
    
    const dateKey = formatDateKey(selectedDate);
    const dateEvents = events[dateKey] || [];
    
    setEvents({
      ...events,
      [dateKey]: [...dateEvents, newEvent]
    });
    
    setNewEvent('');
    setShowAddEvent(false);
  };
  
  // Delete event
  const deleteEvent = (dateKey: string, eventIndex: number) => {
    const dateEvents = [...events[dateKey]];
    dateEvents.splice(eventIndex, 1);
    
    setEvents({
      ...events,
      [dateKey]: dateEvents
    });
  };
  
  // Get month name
  const getMonthName = (month: number): string => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month];
  };
  
  // Get day names
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Get calendar days
  const days = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  
  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="calendar-nav">
          <button onClick={() => navigateMonth('prev')} className="calendar-nav-button">
            ◀
          </button>
          <h2>{getMonthName(currentDate.getMonth())} {currentDate.getFullYear()}</h2>
          <button onClick={() => navigateMonth('next')} className="calendar-nav-button">
            ▶
          </button>
        </div>
        <div className="calendar-toolbar">
          <button 
            className="calendar-today-button"
            onClick={() => {
              setCurrentDate(new Date());
              setSelectedDate(new Date());
            }}
          >
            Today
          </button>
          {selectedDate && (
            <button 
              className="calendar-add-event-button"
              onClick={() => setShowAddEvent(!showAddEvent)}
            >
              {showAddEvent ? 'Cancel' : 'Add Event'}
            </button>
          )}
        </div>
      </div>
      
      {showAddEvent && selectedDate && (
        <div className="calendar-add-event">
          <h3>Add event for {selectedDate.toLocaleDateString()}</h3>
          <div className="calendar-event-form">
            <input
              type="text"
              value={newEvent}
              onChange={(e) => setNewEvent(e.target.value)}
              placeholder="Enter event description"
              className="calendar-event-input"
            />
            <button 
              onClick={addEvent}
              className="calendar-event-add-button"
              disabled={!newEvent.trim()}
            >
              Add
            </button>
          </div>
        </div>
      )}
      
      <div className="calendar-grid">
        {/* Day headings */}
        {dayNames.map(day => (
          <div key={day} className="calendar-day-header">{day}</div>
        ))}
        
        {/* Calendar days */}
        {days.map((day, index) => {
          const dateKey = formatDateKey(day);
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = formatDateKey(new Date()) === dateKey;
          const isSelected = selectedDate && formatDateKey(selectedDate) === dateKey;
          const hasEvents = events[dateKey] && events[dateKey].length > 0;
          
          return (
            <div 
              key={index}
              className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => setSelectedDate(day)}
            >
              <div className="calendar-day-number">{day.getDate()}</div>
              {hasEvents && (
                <div className="calendar-day-event-indicator">
                  <span className="calendar-dot"></span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {selectedDate && (
        <div className="calendar-events">
          <h3>Events for {selectedDate.toLocaleDateString()}</h3>
          <div className="calendar-events-list">
            {events[formatDateKey(selectedDate)]?.length > 0 ? (
              events[formatDateKey(selectedDate)].map((event, index) => (
                <div key={index} className="calendar-event-item">
                  <span>{event}</span>
                  <button 
                    className="calendar-event-delete"
                    onClick={() => deleteEvent(formatDateKey(selectedDate), index)}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              <div className="calendar-no-events">No events scheduled</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar; 