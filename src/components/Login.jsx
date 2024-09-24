// src/components/Login.jsx
import React, { useState } from 'react';
import './Login.css';


const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const reader = new FileReader();
    reader.onloadend = () => {
      // Save user data to localStorage
      localStorage.setItem('name', username);
      localStorage.setItem('email', email);
      localStorage.setItem('image', reader.result);
      
      // Call the onLogin function passed from App component
      onLogin();
    };

    if (profilePhoto) {
      reader.readAsDataURL(profilePhoto);
    }
  };

  return (
    <div className="container" id="loginFormContainer">
      <img src="company.jpg" alt="CropAI Logo" className="logo" />
      <h2>Crop AI</h2>
      <form id="loginForm" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="input-group">
          <label htmlFor="profilePhoto">Upload Profile Photo</label>
          <input type="file" id="profilePhoto" accept="image/*" onChange={(e) => setProfilePhoto(e.target.files[0])} required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
