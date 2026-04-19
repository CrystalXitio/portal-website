import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import AnimatedBackground from '../components/AnimatedBackground';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed.');
    }
  };

  return (
    <div style={{ position: 'relative', overflowX: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      <AnimatedBackground />
      <div className="card" style={{ width: '100%', maxWidth: '400px', position: 'relative', zIndex: 1, animation: 'fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Sign In</h2>
        {error && <div style={{ color: 'var(--error-color)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Username</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" style={{ width: 'auto', marginBottom: 0 }} /> Remember me
            </label>
            <Link to="/forgot-password" style={{ color: 'var(--accent-color)' }}>Forgot Password?</Link>
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>Login</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          Don't have an account? <Link to="/signup" style={{ fontWeight: 600 }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
