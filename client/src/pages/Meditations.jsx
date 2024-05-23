import React, { useEffect, useState } from 'react';
import MeditationsCard from '../components/MeditationsCard';
// import meditationsData from '../assets/Meditations.json';
import './Meditations.css';
import './Header.css';
import axios from 'axios';

const Meditations = ( {user} ) => {
  const [meditations, setMeditations] = useState([]);


useEffect(() => {
  const fetchMeditations = async () => {
    try {
      const response = await axios.get('http://localhost:5555/meditations');
      setMeditations(response.data);
    } catch (error) {
      console.error('Error fetching meditations:', error);
    }
  };

  fetchMeditations();
}, []);


return (
  
<div>
<header className="header">
      <h1>Meditations</h1>
    </header>
  {meditations.map(meditation => (
    <MeditationsCard key={meditation.id} meditation={meditation} user={user} />
  ))}
</div>
);
};

export default Meditations;












