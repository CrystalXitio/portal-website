import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setError('Failed to process request.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    try {
      await axios.post('http://localhost:5000/api/auth/reset-password', { email, otp, newPassword });
      setMessage('Password reset successful. Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'var(--bg-color)', padding: '2rem 1rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Reset Password</h2>
        
        {error && <div style={{ color: 'var(--error-color)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        {message && <div style={{ color: 'var(--accent-color)', marginBottom: '1rem', textAlign: 'center' }}>{message}</div>}

        {step === 1 ? (
          <form onSubmit={handleSendOtp}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email associated with your account" />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Send OTP</button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>OTP Received in Email</label>
              <input type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit OTP" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>New Password</label>
              <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>Reset Password</button>
            <button type="button" onClick={handleSendOtp} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', display: 'block', margin: '0 auto' }}>
              Resend OTP
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          <Link to="/login" style={{ fontWeight: 600 }}>Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
