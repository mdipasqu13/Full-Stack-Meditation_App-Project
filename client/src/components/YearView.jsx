// import React from 'react';
// import { Calendar, Views, Navigate } from 'react-big-calendar';
// import moment from 'moment';

// const YearView = ({ date, events }) => {
//   const months = moment.months();
//   const year = moment(date).year();

//   const getMonthSessions = (month) => {
//     return events.filter(event => moment(event.start).month() === month && moment(event.start).year() === year);
//   };

//   const getColorIntensity = (sessions) => {
//     const maxSessions = 10; // Define a threshold for maximum sessions
//     const intensity = Math.min(sessions.length / maxSessions, 1);
//     return `rgba(0, 0, 0, ${intensity})`;
//   };

//   return (
//     <div className="year-view">
//       {months.map((month, index) => {
//         const sessions = getMonthSessions(index);
//         const color = getColorIntensity(sessions);
//         return (
//           <div key={index} className="month-block" style={{ backgroundColor: color }}>
//             <h3>{month}</h3>
//             <p>{sessions.length} sessions</p>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// YearView.range = (date) => {
//   const start = moment(date).startOf('year').toDate();
//   const end = moment(date).endOf('year').toDate();
//   return { start, end };
// };

// YearView.navigate = (date, action) => {
//   switch (action) {
//     case Navigate.PREVIOUS:
//       return moment(date).subtract(1, 'year').toDate();
//     case Navigate.NEXT:
//       return moment(date).add(1, 'year').toDate();
//     default:
//       return date;
//   }
// };

// YearView.title = (date) => {
//   return `Year ${moment(date).year()}`;
// };

// export default YearView;
