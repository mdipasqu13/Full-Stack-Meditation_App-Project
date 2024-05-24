import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const JournalEntries = ({ user }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [journalEntry, setJournalEntry] = useState('');
  const [editingEntryId, setEditingEntryId] = useState(null);

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

  const handleJournalEntryChange = (event) => {
    setJournalEntry(event.target.value);
  };

  const handleEdit = (entry) => {
    setEditingEntryId(entry.id);
    setJournalEntry(entry.journal_entry || '');
  };

  const handleSave = async (entry) => {
    try {
      const response = await fetch(`http://127.0.0.1:5555/sessions/${entry.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ journal_entry: journalEntry }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const updatedEntry = await response.json();
      setEntries(entries.map(e => (e.id === updatedEntry.id ? updatedEntry : e)));
      setEditingEntryId(null);
      setJournalEntry('');
    } catch (error) {
      console.error('Error updating session:', error);
      alert('Failed to update session. Please try again.');
    }
  };

  const filteredEntries = entries.filter(entry => {
    const entryDate = new Date(entry.created_at);
    return entryDate.toDateString() === selectedDate.toDateString();
  });

  return (
    <div>
      <h2>Journal Entries</h2>
      <DatePicker
        selected={selectedDate}
        onChange={date => setSelectedDate(date)}
        dateFormat="yyyy/MM/dd"
      />
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : (
        <ul>
          {filteredEntries.map(entry => (
            <li key={entry.id}>
              <p><strong>Date:</strong> {new Date(entry.created_at).toLocaleString()}</p>
              <p><strong>Entry:</strong> {entry.journal_entry}</p>
              {editingEntryId === entry.id ? (
                <>
                  <textarea value={journalEntry} onChange={handleJournalEntryChange} />
                  <button onClick={() => handleSave(entry)}>Save</button>
                </>
              ) : (
                <button onClick={() => handleEdit(entry)}>Edit</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JournalEntries;