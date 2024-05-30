import React from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import axios from 'axios';

const ProfileMeditationsCard = ({ meditation, user }) => {
  const handlePlay = async () => {
    try {
      console.log(meditation.id, user.id);
      const response = await axios.post('http://localhost:5555/sessions', {
        user_id: user.id,
        meditation_id: meditation.id,
      });
      console.log('Session created:', response.data);
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };
  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <div className="profile-meditation-card">
      <img src={meditation.image} alt={meditation.title} />
      <h2>{meditation.title}</h2>
      <p>{meditation.description}</p>
      <p>Duration: {meditation.duration}</p>
      <AudioPlayer
        src={meditation.audio_url}
        onPlay={handlePlay}
      />
    </div>
  );
};

export default ProfileMeditationsCard;