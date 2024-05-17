App.jsx

// Import necessary styles and components
import './App.css';
import { Route, Routes } from "react-router-dom";
// import { useState, useEffect } from 'react';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
// import Meditations from './pages/Meditations';
// import Calendar from './pages/Calendar';


function App() {
  // State hook to manage user state
  // const [user, setUser] = useState(null)

  // // Effect hook to fetch user data on component mount
  // useEffect(() => {
  //   fetch('http://localhost:5173//authenticate-session')
  //   .then((res) => {
  //     if (res.ok){
  //       return res.json() // Parse JSON data if response is OK
  //     }else{
  //       console.error('user not found') // Log error if user not found
  //     }
  //   })
  //   .then(data => setUser(data)) // Update user state with fetched data
  // }, [])

  // // Function to update user state
  // const updateUser = (user) => {
  //   setUser(user)
  // } 
  
  return (
    <>
     <NavBar /> 
      <div className="app">
        
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/profile" element={<Profile user={user} updateUser={updateUser}/>} /> */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/signin" element={<SignIn/> } />
        </Routes>
      </div>
    </>
  );
}

export default App;
