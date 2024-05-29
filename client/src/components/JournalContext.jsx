// JournalContext.js
import React, { createContext, useState, useEffect } from 'react';
import moment from 'moment';
import axios from 'axios';

const JournalContext = createContext();

const JournalProvider = ({ children, user }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [journalEntry, setJournalEntry] = useState('');
  const [editingEntryId, setEditingEntryId] = useState(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get(`http://localhost:5555/users/${user.id}/sessions`);
        setEntries(response.data);
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
      const response = await axios.patch(`http://127.0.0.1:5555/sessions/${entry.id}`, {
        journal_entry: journalEntry,
      });
      const updatedEntry = response.data;
      setEntries(entries.map(e => (e.id === updatedEntry.id ? updatedEntry : e)));
      setEditingEntryId(null);
      setJournalEntry('');
    } catch (error) {
      console.error('Error updating session:', error);
      alert('Failed to update session. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this session?');
    if (confirmed) {
      try {
        await axios.delete(`http://127.0.0.1:5555/sessions/${id}`);
        setEntries(entries.filter(entry => entry.id !== id));
      } catch (error) {
        console.error('Error deleting session:', error);
        alert('Failed to delete session. Please try again.');
      }
    }
  };

  const filteredEntries = entries.filter(entry => {
    const entryDate = moment(entry.created_at).subtract(4, 'hours').toDate();
    return entryDate.toDateString() === selectedDate.toDateString();
  });

  const convertToEasternTime = (dateString) => {
    const date = moment(dateString).subtract(4, 'hours').toDate();
    return moment(date).format('YYYY/MM/DD hh:mm A');
  };

  return (
    <JournalContext.Provider
      value={{
        entries,
        loading,
        error,
        selectedDate,
        journalEntry,
        editingEntryId,
        setSelectedDate,
        handleJournalEntryChange,
        handleEdit,
        handleSave,
        handleDelete,
        filteredEntries,
        convertToEasternTime,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
};

export { JournalContext, JournalProvider };
