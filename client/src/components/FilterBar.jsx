import React from 'react';

// FilterBar component to filter meditations by category and duration
const FilterBar = ({ setCategory, setDuration }) => {
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleDurationChange = (event) => {
    setDuration(event.target.value);
  };

  return (
    <div className="filter-bar">
      <select onChange={handleCategoryChange}>
        <option value="">All Categories</option>
        <option value="relaxation">Relaxation</option>
        <option value="affirmations">Affirmation</option>
        <option value="ambient music and sounds">Ambient Music and Sounds</option>
        <option value="vipassana">Vipassana</option>
        <option value="mindfulness">Mindfulness</option>
        <option value="empowerment">Empowerment</option>
        <option value="journey">Journying</option>

      </select>
      <select onChange={handleDurationChange}>
        <option value="">All Durations</option>
        <option value="5 minutes">5 minutes</option>
        <option value="10 minutes">10 minutes</option>
        <option value="20 minutes">20 minutes</option>
      </select>
    </div>
  );
};

export default FilterBar;
