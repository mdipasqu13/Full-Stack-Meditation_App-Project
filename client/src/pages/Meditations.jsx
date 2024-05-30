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
  const [favorites, setFavorites] = useState([]);
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState('');
  const location = useLocation();
  const selectedMeditationId = location.state?.meditationId;
  const meditationRefs = useRef({});

  // Fetch meditations and favorites when the app starts or the user changes
  useEffect(() => {
    const fetchMeditations = async () => {
      try {
        const response = await axios.get('http://localhost:5555/meditations');
        setMeditations(response.data);
        setFilteredMeditations(response.data); 
      } catch (error) {
        console.error('Error fetching meditations:', error);
      }
    };

    const fetchFavorites = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/favorites/${user.id}`);
        setFavorites(response.data.map(fav => fav.meditation_id));
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };

    fetchMeditations();
    fetchFavorites();
  }, [user]);
  //useEffect to scroll to selected meditation
  useEffect(() => {
    if (selectedMeditationId && meditationRefs.current[selectedMeditationId]) {
      meditationRefs.current[selectedMeditationId].scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedMeditationId, filteredMeditations]);
  //filter meditations based on selected category and duration
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
//sort meditations to show favorites first
  const sortedMeditations = [
    ...filteredMeditations.filter(meditation => favorites.includes(meditation.id)),
    ...filteredMeditations.filter(meditation => !favorites.includes(meditation.id))
  ];

  return (
    <div>
      <header className="header">
        <h1>Meditations</h1>
      </header>
      <FilterBar setCategory={setCategory} setDuration={setDuration} />
      {sortedMeditations.map(meditation => (
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