import './App.css';
import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from 'react';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
// import Meditations from './pages/Meditations';
// import Calendar from './pages/Calendar';

function App() {
  // State hook to manage user state
  const [user, setUser] = useState(null);

  // Effect hook to fetch user data on component mount
  useEffect(() => {
    fetch('http://localhost:5173/authenticate-session')
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

  // Function to update user state
  const updateUser = (user) => {
    setUser(user);
  };

  return (
    <>
      <NavBar />
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile user={user} updateUser={updateUser} />} />
          <Route path="/signin" element={<SignIn updateUser={updateUser} />} />
        </Routes>
      </div>
    </>
  );
}

export default App;