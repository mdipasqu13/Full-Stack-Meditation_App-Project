import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProfileMeditationsCard from '../components/ProfileMeditationsCard';
import './Profile.css';

// Define the Profile functional component with 'user' as a prop
function Profile({ user, updateUser }) {
  const [recentMeditations, setRecentMeditations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentMeditations = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/users/${user.id}/sessions`);
        const sessions = response.data;
        const recentSessions = sessions.slice(-3).reverse(); // Get the last 3 sessions
        const meditationPromises = recentSessions.map(session =>
          axios.get(`http://localhost:5555/meditations/${session.meditation_id}`)
        );
        const meditations = await Promise.all(meditationPromises);
        setRecentMeditations(meditations.map(res => res.data));
      } catch (error) {
        console.error('Error fetching recent meditations:', error);
      }
    };

    fetchRecentMeditations();
  }, [user.id]);

  const handleDeleteUser = () => {
    const confirmed = window.confirm("Are you sure you want to delete your profile?");
    if (confirmed) {
      fetch(`http://localhost:5555/users/${user.id}`, {
        method: 'DELETE',
      })
        .then((res) => {
          if (res.ok) {
            console.log('User deleted successfully');
            fetch('http://localhost:5173/logout')
              .then(res => res.json())
              .then(data => updateUser(null)); // Update user state to null after logout
            navigate('/signin', { relative: 'path' }); // Navigate to signin page after logout
          } else {
            console.error('Failed to delete user');
          }
        })
        .catch((error) => console.error('Error deleting user:', error));
    }
  };

  return (
    <div>
      <h1>My Profile</h1>
      
      <button onClick={handleDeleteUser}>Delete Profile</button>
      <h2>My Recent Meditations</h2>
      <div className="profile-meditations-list">
        {recentMeditations.map(meditation => (
          <ProfileMeditationsCard key={meditation.id} meditation={meditation} user={user} />
          
        ))}
      </div>
    </div>
  );
}

export default Profile;