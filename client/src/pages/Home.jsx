import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import affirmations from '../assets/Affirmations.json';
import HomeMeditationsCard from '../components/HomeMeditationsCard';

function Home(user, updateUser) {
  const [affirmation, setAffirmation] = useState('');
  const [recentSession, setRecentSession] = useState([]);

  // Function to get a random affirmation
  const getRandomAffirmation = () => {
    const randomIndex = Math.floor(Math.random() * affirmations.affirmations.length);
    return affirmations.affirmations[randomIndex];
  };

  // Function to fetch the most recent session
  
  

  useEffect(() => {
    const fetchRecentSession = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/users/${user.id}/recent_session`);
        setRecentSession(response.data);
      } catch (error) {
        console.error('Error fetching recent session:', error);
      }
    };
    setAffirmation(getRandomAffirmation());
    if (user?.id) {
    fetchRecentSession();}
  }, [user?.id]);

  return (
    <div className='home-page'>
      <div className='banner'>
        <img 
          src="https://static.vecteezy.com/system/resources/previews/023/521/423/non_2x/find-your-inner-peace-with-our-calming-meditation-logo-design-this-elegant-illustration-is-perfect-for-wellness-and-mindfulness-brands-vector.jpg" 
          alt="Meditation Logo" 
          style={{ width: '450px', height: '450px', marginTop: '60px' }} 
        />
        <h1 style={{ fontFamily: 'Dancing Script, cursive' }}>{affirmation}</h1>
        {recentSession.map(meditation => (
            <HomeMeditationsCard key={meditation.id} meditation={meditation} user={user} />
          ))
}
      </div>
    </div>
  );
}

export default Home;

