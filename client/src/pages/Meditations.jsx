import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import MeditationsCard from '../components/MeditationsCard';
import FilterBar from '../components/FilterBar'; 
import './Meditations.css';
import './Header.css';
import axios from 'axios';

const Meditations = ({ user }) => {
  const [meditations, setMeditations] = useState([]);
  const [filteredMeditations, setFilteredMeditations] = useState([]);
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState('');
  const location = useLocation();
  const selectedMeditationId = location.state?.meditationId;
  const meditationRefs = useRef({});

  useEffect(() => {
    const fetchMeditations = async () => {
      try {
        const response = await axios.get('http://localhost:5555/meditations');
        setMeditations(response.data);
        setFilteredMeditations(response.data); // Initialize filtered meditations
      } catch (error) {
        console.error('Error fetching meditations:', error);
      }
    };

    fetchMeditations();
  }, []);

  useEffect(() => {
    if (selectedMeditationId && meditationRefs.current[selectedMeditationId]) {
      meditationRefs.current[selectedMeditationId].scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedMeditationId, filteredMeditations]);

  useEffect(() => {
    const filterMeditations = () => {
      let filtered = meditations;
      if (category) {
        filtered = filtered.filter(meditation => meditation.category === category);
      }
      if (duration) {
        filtered = filtered.filter(meditation => meditation.duration === duration);
      }
      setFilteredMeditations(filtered);
    };

    filterMeditations();
  }, [category, duration, meditations]);

  return (
    <div>
      <header className="header">
        <h1>Meditations</h1>
      </header>
      <FilterBar setCategory={setCategory} setDuration={setDuration} />
      {filteredMeditations.map(meditation => (
        <div
          key={meditation.id}
          ref={el => (meditationRefs.current[meditation.id] = el)}
        >
          <MeditationsCard meditation={meditation} user={user} />
        </div>
      ))}
    </div>
  );
};

export default Meditations;
