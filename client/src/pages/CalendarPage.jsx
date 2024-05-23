import React from 'react';
import { useParams } from 'react-router-dom';
import UserCalendar from '../components/UserCalendar';

const CalendarPage = ({user}) => {
  // const { userId } = useParams();
  // console.log('CalendarPage userId:', user.id);

  return <UserCalendar user={user} />;
};

export default CalendarPage;