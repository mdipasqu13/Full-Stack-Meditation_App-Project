// JournalEntries.jsx
import React, { useState, useEffect } from 'react';

const JournalEntries = ({ user }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch(`http://localhost:5555/users/${user.id}/sessions`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setEntries(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [user.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h2>Journal Entries</h2>
      <ul>
        {entries.map(entry => (
          <li key={entry.id}>
            <p><strong>Date:</strong> {new Date(entry.created_at).toLocaleString()}</p>
            <p><strong>Entry:</strong> {entry.journal_entry}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JournalEntries;