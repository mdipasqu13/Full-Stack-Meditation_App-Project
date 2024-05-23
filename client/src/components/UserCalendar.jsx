import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
// import { localizer } from './UserCalendar'; // Import the localizer variable

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

    useEffect(() => {
        console.log('User ID:', user.id);
        const fetchSessions = async () => {
            try {
                const response = await axios.get(`http://localhost:5555/users/${user.id}/sessions`);
                const sessions = response.data.map(session => ({
                        title: `Meditation Session ${session.id}`,
                        start: new Date(session.created_at),
                        end: new Date(session.created_at),
                    }));
                setSessions(sessions);
                console.log(sessions);
            } catch (error) {
                console.error('Error fetching sessions:', error);
            }
        };

        fetchSessions();
    }, []);

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
            />
        </div>
    );
};

export default UserCalendar;