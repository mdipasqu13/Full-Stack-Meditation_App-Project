import React, { useState, useEffect } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import axios from 'axios';
import './MeditationsCard.css'; 

const MeditationsCard = ({ meditation, user }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  //useEffect to check if meditation is favorited
  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/favorites/${user.id}`);
        const favoriteMeditations = response.data.map(fav => fav.meditation_id);
        setIsFavorite(favoriteMeditations.includes(meditation.id));
      } catch (error) {
        console.error('Error checking favorite:', error);
      }
    };

    checkFavorite();
  }, [user.id, meditation.id]);

  //function to handle favorite button click. If meditation is favorited, delete from favorites, else add to favorites. 
  const handleFavorite = async () => {
    try {
      if (isFavorite) {
        await axios.delete(`http://localhost:5555/favorites/${user.id}/${meditation.id}`);
      } else {
        await axios.post('http://localhost:5555/favorites', {
          user_id: user.id,
          meditation_id: meditation.id,
        });
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };
  //function to handle play button click
  const handlePlay = async () => {
    try {
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
    <div className="meditation-card">
      <div className="image-container">
        <img src={meditation.image} alt={meditation.title} />
        <button onClick={handleFavorite} className="favorite-button">
          {isFavorite ? '⭐' : '☆'}
        </button>
      </div>
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

export default MeditationsCard;