import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const JournalModal = ({ event, onClose, onSave, onDelete }) => {
  const [journalEntry, setJournalEntry] = useState(event.journal_entry || '');

  // Function to convert date to Eastern Time
  const convertToEasternTime = (dateString) => {
    const date = moment(dateString).subtract(4, 'hours').toDate();
    return moment(date).format('YYYY/MM/DD hh:mm A');
  };

  // Format the date to Eastern Time
  const formattedDateTime = convertToEasternTime(event.original_created_at);

  useEffect(() => {
    setJournalEntry(event.journal_entry || '');
  }, [event]);

  const handleSave = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5555/update_session/${event.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ journal_entry: journalEntry }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      onSave(journalEntry);
      console.log(journalEntry);

    } catch (error) {
      console.error('Error updating session:', error);
      alert('Failed to update session. Please try again.');
    }
  };

  const handleDelete = () => {
    const confirmed = window.confirm('Are you sure you want to delete this session?');
    if (confirmed) {
    fetch(`http://localhost:5555/sessions/${event.id}`, {
      method: 'DELETE',
    })
      .then(() => onDelete(event.id))
      .catch(error => console.error('Error deleting session:', error));
  }};

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Journal Entry</h2>
        <textarea
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
        />
        <div className="button-container">
          <button onClick={handleSave}>Save</button>
          <button onClick={handleDelete}>Delete</button>
          <button onClick={onClose}>Close</button>
        </div>
        <p style={{ textAlign: 'center', marginTop: '20px' }}><strong>Created At:</strong> {formattedDateTime}</p>
      </div>
    </div>
  );
};

export default JournalModal;
