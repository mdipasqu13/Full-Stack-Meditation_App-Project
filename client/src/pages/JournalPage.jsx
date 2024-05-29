// JournalPage.jsx
import React from 'react';
import { JournalProvider } from '../components/JournalContext';
import JournalEntries from '../components/JournalEntries';

const JournalPage = ({ user }) => {
  return user ? (
    <JournalProvider user={user}>
      <JournalEntries />
    </JournalProvider>
  ) : null;
};

export default JournalPage;
