import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment-timezone';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './UserCalendar.css';
import JournalModal from './JournalModal';

// Set up the moment localizer
const localizer = momentLocalizer(moment);

const UserCalendar = ({ user }) => {
    const [sessions, setSessions] = useState([]);
    const [streaks, setStreaks] = useState(0);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        console.log('User ID:', user.id);
        const fetchSessions = async () => {
            try {
                const response = await axios.get(`http://localhost:5555/users/${user.id}/sessions`);
                console.log(response);
                const sessions = response.data.map(session => {
                    // Format the date to Eastern Time
                    const createdAt = moment(session.created_at).subtract(4, 'hours').toDate();
    
                    return {
                        id: session.id,
                        title: `Meditation Session ${session.id}`,
                        start: createdAt,
                        end: createdAt,
                        journal_entry: session.journal_entry,
                        original_created_at: session.created_at, 
                    };
                });
                setSessions(sessions);
                calculateStreaks(sessions);
                console.log(sessions);
            } catch (error) {
                console.error('Error fetching sessions:', error);
            }
        };
    
        fetchSessions();
    }, [user.id]);

    const calculateStreaks = (sessions) => {
        // Extract unique dates from sessions using the adjusted createdAt time
        const uniqueDates = [...new Set(sessions.map(session => moment(session.start).format('YYYY-MM-DD')))];
        uniqueDates.sort(); // Sort dates in ascending order

        let streak = 0;
        let maxStreak = 0;
        for (let i = 0; i < uniqueDates.length; i++) {
            if (i === 0 || moment(uniqueDates[i]).diff(moment(uniqueDates[i - 1]), 'days') === 1) {
                streak++;
            } else {
                streak = 1;
            }
            maxStreak = Math.max(maxStreak, streak);
        }
        setStreaks(maxStreak);
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
        console.log(event);
    };

    const handleSave = (updatedEvent) => {
        setSessions(sessions.map(e => e.id === updatedEvent.id ? updatedEvent : e));
        setIsModalOpen(false);
    };

    const handleDelete = (eventId) => {
        setSessions(sessions.filter(e => e.id !== eventId));
        setIsModalOpen(false);
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="calendar-container">
            <div className="calendar">
                <Calendar
                    localizer={localizer}
                    events={sessions}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '70vh', width: '60vw' }} // Set the height and width of the calendar
                    onSelectEvent={handleEventClick}
                    views={['month', 'day']} // Only include month and day views
                    formats={{
                        timeGutterFormat: (date, culture, localizer) =>
                            localizer.format(date, 'hh:mm A', culture),
                        eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
                            `${localizer.format(start, 'hh:mm A', culture)} - ${localizer.format(end, 'hh:mm A', culture)}`,
                    }}
                />
            </div>
            {isModalOpen && (
                <div className="journal-modal">
                    <JournalModal
                        event={selectedEvent}
                        onClose={() => setIsModalOpen(false)}
                        onSave={handleSave}
                        onDelete={handleDelete}
                    />
                </div>
            )}
            <div className="streaks">
                <h3>Current Streak: {streaks} days</h3>
            </div>
        </div>
    );
};

export default UserCalendar;
