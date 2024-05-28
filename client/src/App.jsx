import './App.css';
import { Route, Routes } from "react-router-dom";
import { useState, useEffect, useCallback } from 'react';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import Meditations from './pages/Meditations';
import CalendarPage from './pages/CalendarPage';
import JournalPage from './pages/JournalPage';
import Resources from './pages/Resources';
import About from './pages/About';
import MeditationDetail from './pages/MeditationDetail';

function App() {
  // State hook to manage user state
  const [user, setUser] = useState(null);

  // Effect hook to fetch user data on component mount
  useEffect(() => {
    fetch('http://localhost:5555/authenticate-session', {
      method: 'POST',
      body: JSON.stringify({ currentSession: localStorage.getItem('user') }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        if (res.ok) {
          return res.json(); // Parse JSON data if response is OK
        } else {
          // Handle non-OK responses
          throw new Error('Failed to authenticate');
        }
      })
      .then((data) => setUser(data)) // Update user state with fetched data
      .catch((error) => {
        console.error('Error:', error);
        // Handle the error, e.g., show an error message to the user
      });
  }, []);

  // Function to update user state, wrapped with useCallback to avoid unnecessary re-renders
  const updateUser = useCallback((user) => {
    setUser(user);
  }, []);

  return (
    <>
      <div className="app">
        <NavBar user={user} updateUser={updateUser} />

        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/profile" element={<Profile user={user} updateUser={updateUser} />} />
          <Route path="/signin" element={<SignIn updateUser={updateUser} />} />
          <Route path="/meditations" element={<Meditations user={user} />} />
          {/* <Route path="/calendar/:userId" element={<CalendarPage />} /> */}
          <Route path="/calendar" element={<CalendarPage user={user} />} />
          <Route path="/journal" element={<JournalPage user={user} />} />
          <Route path="/resources" element={<Resources user={user} />} />
          <Route path="/about" element={<About user={user} />} />
          <Route path="/meditations/:id" element={<MeditationDetail user={user} />} />
        </Routes>
      </div>
    </>
  );
}

export default App;