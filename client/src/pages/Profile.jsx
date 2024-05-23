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

    if (user?.id) {
      fetchRecentMeditations();
    }
  }, [user?.id]);


  const handleDeleteUser = () => {
    const confirmed = window.confirm("Are you sure you want to delete your profile?"); //display popup prompt to confirm delete profile
    if (confirmed) {
      fetch(`http://localhost:5555/users/${user.id}`, {
        method: 'DELETE',
     })
        .then((res) => {
         if (res.ok) {
            console.log('User deleted successfully');
            fetch('http://localhost:5555/logout')
		          .then(res => res.json())
		          .then(data => updateUser(null)) // Update user state to null after logout
                navigate('/signin', { relative: 'path' }); // Navigate to signin page after logout
          } else {
            console.error('Failed to delete user');
          }
        })
        .catch((error) => console.error('Error deleting user:', error));
    };
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

// return (
//   <div>
//     <h1>My Profile</h1>
    
//     <button onClick={handleDeleteUser}>Delete Profile</button>
//     <h2>My Recent Meditations</h2>
//     <div className="meditations-list">
//       {recentMeditations.length > 0 && (
//         <ProfileMeditationsCard key={recentMeditations[currentIndex].id} meditation={recentMeditations[currentIndex]} user={user} />
//       )}
//       <div className="carousel-controls" style={{ display: 'flex', justifyContent: 'center' }}>
//         <button onClick={handlePrev}>Previous</button>
//         <button onClick={handleNext}>Next</button>
//       </div>
//     </div>
//   </div>
// );
// }