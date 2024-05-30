import React from 'react';
import { JournalProvider } from '../components/JournalContext';
import JournalEntries from '../components/JournalEntries';

const JournalPage = ({ user }) => {
  return user ? (
    // Wrap JournalEntries in JournalProvider and pass user as prop
    <JournalProvider user={user}>
      <JournalEntries />
    </JournalProvider>
  ) : null;
};

export default JournalPage;
