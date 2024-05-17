import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css'; 

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-logo">
          <img src="https://t4.ftcdn.net/jpg/00/94/47/49/360_F_94474956_W52G8K09v1SjZiAx7j3u6zjrrdPUGCPd.jpg" alt="Meditation Logo" className="navbar-logo-img" />
          <span>Meditation Site</span>
        </NavLink>
        <div className="navbar-links">
          <NavLink to="/" className="navbar-link" activeClassName="active">Home</NavLink>
          <NavLink to="/profile" className="navbar-link" activeClassName="active">Profile</NavLink>
          <NavLink to="/meditations" className="navbar-link" activeClassName="active">Meditations</NavLink>
          <NavLink to="/calendar" className="navbar-link" activeClassName="active">Calendar</NavLink>
          <NavLink to="/signin" className="navbar-link" activeClassName="active">Sign In</NavLink>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;