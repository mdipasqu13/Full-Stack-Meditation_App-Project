import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import affirmations from '../assets/Affirmations.json';
import './Home.css';
import moment from 'moment-timezone';

function Home({ user, updateUser }) {
  const [affirmation, setAffirmation] = useState('');
  const [recentMeditations, setRecentMeditations] = useState([]);
  const [streak, setStreak] = useState(0);
  const navigate = useNavigate();

  // Function to get a random affirmation
  const getRandomAffirmation = () => {
    const randomIndex = Math.floor(Math.random() * affirmations.affirmations.length);
    return affirmations.affirmations[randomIndex];
  };

  // Function to calculate streak
  const calculateStreak = (sessions) => {
    const uniqueDates = [...new Set(sessions.map(session => moment(session.created_at).format('YYYY-MM-DD')))];
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
    return maxStreak;
  };

  // Function to fetch the most recent session
  useEffect(() => {
    const fetchRecentMeditations = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/users/${user.id}/sessions`);
        const sessions = response.data.reverse(); // Reverse to get the most recent sessions first

        const uniqueMeditationsMap = new Map();
        for (const session of sessions) {
          if (uniqueMeditationsMap.size >= 1) break;
          if (!uniqueMeditationsMap.has(session.meditation_id)) {
            const meditationResponse = await axios.get(`http://localhost:5555/meditations/${session.meditation_id}`);
            uniqueMeditationsMap.set(session.meditation_id, meditationResponse.data);
          }
        }
        setRecentMeditations(Array.from(uniqueMeditationsMap.values()));
        setStreak(calculateStreak(sessions));
      } catch (error) {
        console.error('Error fetching recent session:', error);
      }
    };
    setAffirmation(getRandomAffirmation());
    if (user?.id) {
      fetchRecentMeditations();
    }
  }, [user?.id]);

  const handleMeditationClick = (meditationId) => {
    navigate('/meditations', { state: { meditationId } });
  };

  return (
    <div className='home-page'>
      <div className='banner'>
        <img 
          src="https://static.vecteezy.com/system/resources/previews/023/521/423/non_2x/find-your-inner-peace-with-our-calming-meditation-logo-design-this-elegant-illustration-is-perfect-for-wellness-and-mindfulness-brands-vector.jpg" 
          alt="Meditation Logo" 
          style={{ width: '450px', height: '450px', marginTop: '300px', scrollMarginTop: '300px'}} 
        />
        <h1 style={{ fontFamily: 'Dancing Script, cursive' }}>{affirmation}</h1>
        <h2>Most Recent Session</h2>
        <div className="home-meditations-list">
          {recentMeditations.map(meditation => (
            <img 
              key={meditation.id} 
              src={meditation.image} 
              alt={meditation.title} 
              style={{ cursor: 'pointer' }} 
              onClick={() => handleMeditationClick(meditation.id)} 
            />
          ))}
        </div>
        <h2>Current Streak: {streak} days</h2>
      </div>
    </div>
  );
}

export default Home;
