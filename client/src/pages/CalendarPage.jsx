import React from 'react';
import { useParams } from 'react-router-dom';
import UserCalendar from '../components/UserCalendar';

const CalendarPage = ({ user }) => {
  return user ? <UserCalendar user={user} /> : null;
};

export default CalendarPage;