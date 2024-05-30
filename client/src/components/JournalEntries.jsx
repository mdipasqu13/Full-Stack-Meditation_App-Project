import React, { useContext } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { JournalContext } from './JournalContext';
import './JournalEntries.css';

//Destructures the values and functions from JournalContext file
const JournalEntries = () => {
  const {
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
  } = useContext(JournalContext);

  return (
    <div>
      <h2 className="journal-entries-heading">Journal Entries</h2>
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
        <div className="journal-entries-container">
          {filteredEntries.map(entry => (
            <div key={entry.id} className="journal-entry-box">
              <p><strong>Date:</strong> {convertToEasternTime(entry.created_at)}</p>
              <p><strong>Entry:</strong> {entry.journal_entry}</p>
              {editingEntryId === entry.id ? (
                <>
                  <textarea value={journalEntry} onChange={handleJournalEntryChange} />
                  <button onClick={() => handleSave(entry)}>Save</button>
                  <button onClick={handleCancel}>Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => handleEdit(entry)}>Edit</button>
                  <button onClick={() => handleDelete(entry.id)}>Delete</button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JournalEntries;
