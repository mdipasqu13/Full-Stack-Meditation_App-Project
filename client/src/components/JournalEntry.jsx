// // JournalEntry.jsx
// import React, { useState } from 'react';
// import JournalModal from './JournalModal';

// const JournalEntry = ({ entry, setEntries }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const handleDelete = async () => {
//     try {
//       const response = await fetch(`http://localhost:5555/sessions/${entry.id}`, {
//         method: 'DELETE',
//       });
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       setEntries(prevEntries => prevEntries.filter(e => e.id !== entry.id));
//     } catch (error) {
//       console.error('Error deleting session:', error);
//     }
//   };

//   return (
//     <li className="journal-entry">
//       <p><strong>Date:</strong> {new Date(entry.created_at).toLocaleString()}</p>
//       <p><strong>Entry:</strong> {entry.journal_entry}</p>
//       <button onClick={() => setIsModalOpen(true)}>Edit</button>
//       <button onClick={handleDelete}>Delete</button>
//       {isModalOpen && (
//         <JournalModal
//           event={entry}
//           onClose={() => setIsModalOpen(false)}
//           onSave={(updatedEntry) => {
//             setEntries(prevEntries => prevEntries.map(e => e.id === updatedEntry.id ? updatedEntry : e));
//             setIsModalOpen(false);
//           }}
//         />
//       )}
//     </li>
//   );
// };

// export default JournalEntry;