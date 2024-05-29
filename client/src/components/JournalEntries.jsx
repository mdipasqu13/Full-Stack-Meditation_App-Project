// JournalEntries.jsx
import React, { useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { JournalContext } from './JournalContext';
import './JournalEntries.css';

const JournalEntries = () => {
  const {
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
  } = useContext(JournalContext);

  return (
    <div className="journal-entries-container">
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
            <li key={entry.id} className="journal-entry-box">
              <p><strong>Date:</strong> {convertToEasternTime(entry.created_at)}</p>
              <p><strong>Entry:</strong> {entry.journal_entry}</p>
              {editingEntryId === entry.id ? (
                <>
                  <textarea value={journalEntry} onChange={handleJournalEntryChange} />
                  <button onClick={() => handleSave(entry)}>Save</button>
                </>
              ) : (
                <>
                  <button onClick={() => handleEdit(entry)}>Edit</button>
                  <button onClick={() => handleDelete(entry.id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JournalEntries;
