import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProfileMeditationsCard from '../components/ProfileMeditationsCard';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { fetchSessions, calculateDailyActivity } from './ProfileCalendar';
import './Profile.css';
import moment from 'moment';
import { Tooltip as ReactTooltip } from 'react-tooltip';


function Profile({ user, updateUser }) {
  const [recentMeditations, setRecentMeditations] = useState([]);
  const [dailyActivity, setDailyActivity] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentMeditations = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/users/${user.id}/sessions`);
        const sessions = response.data.reverse(); // Reverse to get the most recent sessions first

        const uniqueMeditationsMap = new Map();
        for (const session of sessions) {
          if (uniqueMeditationsMap.size >= 3) break;
          if (!uniqueMeditationsMap.has(session.meditation_id)) {
            const meditationResponse = await axios.get(`http://localhost:5555/meditations/${session.meditation_id}`);
            uniqueMeditationsMap.set(session.meditation_id, meditationResponse.data);
          }
        }

        setRecentMeditations(Array.from(uniqueMeditationsMap.values()));
      } catch (error) {
        console.error('Error fetching recent meditations:', error);
      }
    };

    const fetchActivity = async () => {
      const sessions = await fetchSessions(user.id);
      const activity = calculateDailyActivity(sessions);
      setDailyActivity(activity);
    };

    if (user?.id) {
      fetchRecentMeditations();
      fetchActivity();
    }
  }, [user?.id]);

  const handleDeleteUser = () => {
    console.log(user.id);
    const confirmed = window.confirm("Are you sure you want to delete your profile?");
    if (confirmed) {
        fetch(`http://localhost:5555/users/${user.id}`, {
            method: 'DELETE',
        })
        .then((res) => {
            if (res.ok) {
                console.log('User deleted successfully');
                fetch('http://localhost:5555/logout')
                    .then(res => res.json())
                    .then(() => {
                        updateUser(null);
                        localStorage.removeItem('user');
                        navigate('/signin', { relative: 'path' });
                    });
            } else {
                console.error('Failed to delete user');
            }
        })
        .catch((error) => console.error('Error deleting user:', error));
    }
  }

  if (!user) {
    return null;
  }

  const getHeatmapValues = () => {
    const values = [];
    const startDate = new Date(new Date().getFullYear(), 0, 1);
    const endDate = new Date(new Date().getFullYear(), 11, 31);
    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
      const dayKey = moment(date).format('YYYY-MM-DD');
      values.push({
        date: new Date(date),
        count: dailyActivity[dayKey] || 0,
      });
    }
    console.log('Heatmap values:', values); // Debugging log
    return values;
  };

  return (
    <div>
      <h1>My Profile</h1>
      <h2>My Recent Meditations</h2>
      <div className="profile-meditations-list">
        {recentMeditations.map(meditation => (
          <ProfileMeditationsCard key={meditation.id} meditation={meditation} user={user} />
        ))}
      </div>
      <h2>Yearly Activity</h2>
      <CalendarHeatmap
        startDate={new Date(new Date().getFullYear(), 0, 1)}
        endDate={new Date(new Date().getFullYear(), 11, 31)}
        values={getHeatmapValues()}
        classForValue={(value) => {
          if (!value || value.count === 0) {
            return 'color-empty';
          }
          return `color-scale-${Math.min(value.count, 4)}`;
        }}
        tooltipDataAttrs={(value) => {
          return {
            'data-tooltip-id': 'heatmap-tooltip',
            'data-tooltip-content': value.date ? `${value.date.toDateString()}: ${value.count} sessions` : 'No data',          };
        }}
      />
      <ReactTooltip id="heatmap-tooltip" />
      <button className="delete-button" onClick={handleDeleteUser}>Delete Profile</button>
    </div>
  );
}

export default Profile;
