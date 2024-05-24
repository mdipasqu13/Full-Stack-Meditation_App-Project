// // JournalModal.jsx
// import React, { useState, useEffect } from 'react';

// const JournalModal = ({ event, onClose, onSave }) => {
//   const [journalEntry, setJournalEntry] = useState(event.journal_entry || '');

//   useEffect(() => {
//     setJournalEntry(event.journal_entry || '');
//   }, [event]);

//   const handleSave = async () => {
//     try {
//       const response = await fetch(`http://localhost:5555/update_session/${event.id}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ journal_entry: journalEntry }),
//       });
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       const data = await response.json();
//       onSave(data);
//     } catch (error) {
//       console.error('Error updating session:', error);
//       alert('Failed to update session. Please try again.');
//     }
//   };

//   return (
//     <div className="modal">
//       <div className="modal-content">
//         <h2>Edit Journal Entry</h2>
//         <textarea
//           value={journalEntry}
//           onChange={(e) => setJournalEntry(e.target.value)}
//         />
//         <div className="button-container">
//           <button onClick={handleSave}>Save</button>
//           <button onClick={onClose}>Close</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default JournalPageModal;