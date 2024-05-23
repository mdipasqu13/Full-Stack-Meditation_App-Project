import React from 'react';
import { useParams } from 'react-router-dom';
import UserCalendar from '../components/UserCalendar';

const CalendarPage = () => {
  const { userId } = useParams();
  console.log('CalendarPage userId:', userId);

  return <UserCalendar userId={userId} />;
};

export default CalendarPage;