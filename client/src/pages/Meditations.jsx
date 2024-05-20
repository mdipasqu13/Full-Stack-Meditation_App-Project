import React, { useEffect, useState } from 'react';
import MeditationsCard from '../components/MeditationsCard';
import meditationsData from '../assets/Meditations.json';
import './Meditations.css';

const Meditations = () => {
  const [meditations, setMeditations] = useState([]);

  useEffect(() => {
    // Simulate fetching data from a JSON file
    setMeditations(meditationsData);
  }, []);

  return (
    <div className="meditations-page">
      <h1>Meditations</h1>
      <div className="meditations-list">
        {meditations.map((meditation, index) => (
          <MeditationsCard key={index} meditation={meditation} />
        ))}
      </div>
    </div>
  );
};

export default Meditations;