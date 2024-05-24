import React from 'react';
import { useParams } from 'react-router-dom';
import JournalEntries from '../components/JournalEntries';
// import JournalPageModal from '../components/JournalPageModal';
// import JournalEntry from '../components/JournalEntry';



const JournalPage = ({ user }) => {
  return user ? <JournalEntries user={user} /> : null;
};

export default JournalPage;