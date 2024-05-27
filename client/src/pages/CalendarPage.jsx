import React from 'react';
import { useParams } from 'react-router-dom';
import UserCalendar from '../components/UserCalendar';

const CalendarPage = ({ user, streak }) => {
  return user ? <UserCalendar user={user} streak={streak} /> : null;
};

export default CalendarPage;