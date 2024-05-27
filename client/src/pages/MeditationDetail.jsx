import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const MeditationDetail = ({ id }) => {
  const [meditation, setMeditation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeditation = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/meditations/${id}`);
        setMeditation(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching meditation details');
        setLoading(false);
      }
    };

    fetchMeditation();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!meditation) {
    return <div>No meditation found</div>;
  }

  return (
    <div className="meditation-detail">
      <img src={meditation.image} alt={meditation.title} />
      <h2>{meditation.title}</h2>
      <p>{meditation.description}</p>
      <p>Duration: {meditation.duration}</p>
      <AudioPlayer src={meditation.audio_url} />
    </div>
  );
};

export default MeditationDetail;
