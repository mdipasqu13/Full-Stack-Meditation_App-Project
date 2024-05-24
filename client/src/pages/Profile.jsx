import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProfileMeditationsCard from '../components/ProfileMeditationsCard';
import './Profile.css';

function Profile({ user, updateUser }) {
  const [recentMeditations, setRecentMeditations] = useState([]);
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

    if (user?.id) {
      fetchRecentMeditations();
    }
  }, [user?.id]);

  const handleDeleteUser = () => {
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
              .then(data => updateUser(null));
            navigate('/signin', { relative: 'path' });
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

  return (
    <div>
      <h1>My Profile</h1>
      <h2>My Recent Meditations</h2>
      <div className="profile-meditations-list">
        {recentMeditations.map(meditation => (
          <ProfileMeditationsCard key={meditation.id} meditation={meditation} user={user} />
        ))}
      </div>
      <button className="delete-button" onClick={handleDeleteUser}>Delete Profile</button>
    </div>
  );
}

export default Profile;