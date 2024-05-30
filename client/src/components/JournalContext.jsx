import React, { createContext, useState, useEffect } from 'react';
import moment from 'moment';
import axios from 'axios';

//create a context for journal
const JournalContext = createContext();

const JournalProvider = ({ children, user }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [journalEntry, setJournalEntry] = useState('');
  const [editingEntryId, setEditingEntryId] = useState(null);

  //useEffect to fetch all user's journal entries
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

  //handles changes in the journal entry text area
  const handleJournalEntryChange = (event) => {
    setJournalEntry(event.target.value);
  };
  //handles editing a journal entry
  const handleEdit = (entry) => {
    setEditingEntryId(entry.id);
    setJournalEntry(entry.journal_entry || '');
  };
  //handles saving a journal entry
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
  //handles deleting a journal entry
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
  //handles canceling editing a journal entry
  const handleCancel = () => {
    setEditingEntryId(null);
    setJournalEntry('');
  };
  //filters entries by selected date and sorts them by created_at
  const filteredEntries = entries.filter(entry => {
    const entryDate = moment(entry.created_at).subtract(4, 'hours').toDate();
    return entryDate.toDateString() === selectedDate.toDateString();
  })
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); 
  

  const convertToEasternTime = (dateString) => {
    const date = moment(dateString).subtract(4, 'hours').toDate();
    return moment(date).format('YYYY/MM/DD hh:mm A');
  };

  return (
    <JournalContext.Provider
      value={{
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
        handleCancel,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
};

export { JournalContext, JournalProvider };
