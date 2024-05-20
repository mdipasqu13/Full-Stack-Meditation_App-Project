import React from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

const MeditationsCard = ({ meditation }) => {
  return (
    <div className="meditation-card">
      <h2>{meditation.title}</h2>
      <p>{meditation.description}</p>
      <p>Duration: {meditation.duration}</p>
      <AudioPlayer
        src={meditation.audio_url}
        onPlay={e => console.log("Playing")}
      />
    </div>
  );
};

export default MeditationsCard;