import React from 'react';
import { useParams } from 'react-router-dom';
import meditationsData from '../assets/Meditations.json';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const MeditationDetail = () => {
  const { id } = useParams();
  const meditation = meditationsData.find(med => med.id === parseInt(id));

  if (!meditation) {
    return <div>Meditation not found</div>;
  }

  return (
    <div className="meditation-detail">
      <h2>{meditation.title}</h2>
      <p>{meditation.description}</p>
      <p>Duration: {meditation.duration}</p>
      <AudioPlayer src={meditation.audio_url} />
    </div>
  );
};

export default MeditationDetail;