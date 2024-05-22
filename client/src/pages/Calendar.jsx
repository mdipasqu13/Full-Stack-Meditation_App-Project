import React from 'react';
import { useParams } from 'react-router-dom';
import UserCalendar from '../components/UserCalendar';

const CalendarPage = () => {
  const { userId } = useParams();

  return <UserCalendar userId={userId} />;
};

export default CalendarPage;