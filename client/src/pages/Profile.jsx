import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import './Profile.css';

// Define the Profile functional component with 'user' as a prop
function Profile({ user, updateUser }) {
    // useState hook to manage the favorites state, initialized as an empty array
    const navigate = useNavigate()

  const handleDeleteUser = () => {
    const confirmed = window.confirm("Are you sure you want to delete your profile?"); //display popup prompt to confirm delete profile
    if (confirmed) {
      fetch(`http://localhost:8080/users/${user.id}`, {
        method: 'DELETE',
     })
        .then((res) => {
         if (res.ok) {
            console.log('User deleted successfully');
            fetch('http://localhost:5173/logout')
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


  // Render the Profile component
  return (
    <div>
      <h1>Your Profile</h1>

    <button onClick={handleDeleteUser}>Delete Profile</button>
    </div>
  );
}

// Export the Profile component for use in other parts of the application
export default Profile;