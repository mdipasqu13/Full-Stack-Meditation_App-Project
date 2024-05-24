import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './UserCalendar.css';
import JournalModal from './JournalModal';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const UserCalendar = ({ user }) => {
    const [sessions, setSessions] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        console.log('User ID:', user.id);
        const fetchSessions = async () => {
            try {
                const response = await axios.get(`http://localhost:5555/users/${user.id}/sessions`);
                const sessions = response.data.map(session => ({
                        id: session.id, // Ensure the id is included
                        title: `Meditation Session ${session.id}`,
                        start: new Date(session.created_at),
                        end: new Date(session.created_at),
                        journal_entry: session.journal_entry,
                    }));
                setSessions(sessions);
                console.log(sessions);
            } catch (error) {
                console.error('Error fetching sessions:', error);
            }
        };

        fetchSessions();
    }, [user.id]);

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
        <div>
            <Calendar
                localizer={localizer} 
                events={sessions}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                onSelectEvent={handleEventClick}
            />
            {isModalOpen && (
                <JournalModal
                    event={selectedEvent}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
};

export default UserCalendar;