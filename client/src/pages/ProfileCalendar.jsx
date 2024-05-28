import moment from 'moment';
import axios from 'axios';

export const fetchSessions = async (userId) => {
    try {
        const response = await axios.get(`http://localhost:5555/users/${userId}/sessions`);
        const sessions = response.data.map(session => ({
            id: session.id,
            createdAt: moment(session.created_at).subtract(4, 'hours').toDate(),
            original_created_at: session.created_at,
        }));
        console.log('Fetched sessions:', sessions);
        return sessions;
    } catch (error) {
        console.error('Error fetching sessions:', error);
        return [];
    }
};

export const calculateDailyActivity = (sessions) => {
    const activity = {};
    sessions.forEach(session => {
        const day = moment(session.original_created_at).format('YYYY-MM-DD');
        if (!activity[day]) {
            activity[day] = 0;
        }
        activity[day]++;
    });
    console.log('Daily activity:', activity); // Debugging log
    return activity;
};
