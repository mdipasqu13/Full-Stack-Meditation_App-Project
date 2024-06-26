import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './NavBar.css';

const NavBar = ({ user, updateUser }) => {
  const navigate = useNavigate();

  //handles user logout, sets state to null, removes user from local storage, and navigates to signin page
  const handleLogout = () => {
    fetch('http://localhost:5555/logout')
      .then(res => res.json())
      .then(() => {
        updateUser(null);
        localStorage.removeItem('user');
        navigate('/signin', { relative: 'path' });
      });
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-logo">
          <img
            src="https://t4.ftcdn.net/jpg/00/94/47/49/360_F_94474956_W52G8K09v1SjZiAx7j3u6zjrrdPUGCPd.jpg"
            alt="Meditation Logo"
            className="navbar-logo-img"
          />
          <span style={{ fontFamily: 'Dancing Script, cursive, bold' }}>Calm-Space</span>
        </NavLink>
        <div className="navbar-links">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'navbar-link active' : 'navbar-link')}
          >
            Home
          </NavLink>

          <NavLink to="/about" className={({ isActive }) => (isActive ? 'navbar-link active' : 'navbar-link')}>
            About
          </NavLink>

          <NavLink to="/resources" className={({ isActive }) => (isActive ? 'navbar-link active' : 'navbar-link')}>
            Resources
          </NavLink>
      
          {user ? ( //conditional rendering based on user state
            <>
              <NavLink
                to="/profile"
                className={({ isActive }) => (isActive ? 'navbar-link active' : 'navbar-link')}
              >
                Profile
              </NavLink>
              <NavLink
                to="/meditations"
                className={({ isActive }) => (isActive ? 'navbar-link active' : 'navbar-link')}
              >
                Meditations
              </NavLink>
              <NavLink
                to="/calendar"
                className={({ isActive }) => (isActive ? 'navbar-link active' : 'navbar-link')}
              >
                Calendar
              </NavLink>
              <NavLink
                to={`/journal`}
                className={({ isActive }) => (isActive ? 'navbar-link active' : 'navbar-link')}
              >
                Journal Entries
              </NavLink>
             
              <button onClick={handleLogout} className="navbar-link">
                Logout
              </button>
            </>
          ) : (
            <NavLink
              to="/signin"
              className={({ isActive }) => (isActive ? 'navbar-link active' : 'navbar-link')}
            >
              Sign In
            </NavLink>
          )}
          
        </div>
      </div>
    </nav>
  );
};

export default NavBar;