import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AnimatedBackground from '../components/AnimatedBackground';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', role: 'student',
    dob: '', sap_id: '', roll_no: '', faculty_id: '', admin_id: '',
    blood_group: '', contact_number: '', address: '',
    course_id: '', class_id: '', subject_id: ''
  });
  const [error, setError] = useState('');
  const [metadata, setMetadata] = useState({ courses: [], classes: [], subjects: [] });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/academic/metadata');
        setMetadata(res.data);
      } catch (err) {
        console.error('Failed to fetch academic metadata');
      }
    };
    fetchMetadata();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation: Email must end in @gmail.com
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.email)) {
      return setError('Email must be a valid @gmail.com address.');
    }

    // Validation: Password must be standard (min 6 chars, uppercase, lowercase, number, special char)
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(formData.password)) {
      return setError('Password must be at least 6 characters and include an uppercase letter, a lowercase letter, a number, and a special character.');
    }

    // Validation: Contact Number must be +91 followed by 10 digits
    if (!/^\+91\d{10}$/.test(formData.contact_number)) {
      return setError('Contact number must begin with +91 followed by exactly 10 digits.');
    }

    // Construct payload
    const payload = { ...formData };
    if (payload.role === 'teacher' && payload.subject_id) {
        payload.taught_subjects = [payload.subject_id];
    }

    try {
      await axios.post('http://localhost:5000/api/auth/signup', payload);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed.');
    }
  };

  return (
    <div style={{ position: 'relative', overflowX: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'var(--bg-color)', padding: '2rem 1rem' }}>
      <AnimatedBackground />
      <div className="card" style={{ width: '100%', maxWidth: '500px', position: 'relative', zIndex: 1, animation: 'fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Create Account</h2>
        {error && <div style={{ color: 'var(--error-color)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Role</label>
              <select name="role" value={formData.role} onChange={handleChange} required>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Username</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} required />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Date of Birth</label>
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Blood Group</label>
              <select name="blood_group" value={formData.blood_group} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="A+">A+</option><option value="A-">A-</option>
                <option value="B+">B+</option><option value="B-">B-</option>
                <option value="AB+">AB+</option><option value="AB-">AB-</option>
                <option value="O+">O+</option><option value="O-">O-</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Contact Number</label>
              <input type="tel" name="contact_number" value={formData.contact_number} onChange={handleChange} placeholder="+91" required />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Residential Address</label>
              <textarea name="address" value={formData.address} onChange={handleChange} required rows="3" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}></textarea>
            </div>

            {/* Conditional fields based on role */}
            {formData.role === 'student' && (
              <>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Course Enrolled</label>
                  <select name="course_id" value={formData.course_id} onChange={handleChange} required>
                    <option value="">Select Course</option>
                    {metadata.courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Batch/Class</label>
                  <select name="class_id" value={formData.class_id} onChange={handleChange} required>
                    <option value="">Select Class</option>
                    {metadata.classes
                      .filter(cls => !formData.course_id || cls.course_id?._id === formData.course_id || cls.course_id === formData.course_id)
                      .map(cls => <option key={cls._id} value={cls._id}>{cls.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>SAP ID (ID Card Info)</label>
                  <input type="text" name="sap_id" value={formData.sap_id} onChange={handleChange} required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Roll No</label>
                  <input type="text" name="roll_no" value={formData.roll_no} onChange={handleChange} required />
                </div>
              </>
            )}
            {formData.role === 'teacher' && (
              <>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Faculty ID</label>
                  <input type="text" name="faculty_id" value={formData.faculty_id} onChange={handleChange} required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Primary Course</label>
                  <select name="course_id" value={formData.course_id} onChange={handleChange} required>
                    <option value="">Select Course</option>
                    {metadata.courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Subject Administered</label>
                  <select name="subject_id" value={formData.subject_id} onChange={handleChange} required>
                    <option value="">Select Subject</option>
                    {metadata.subjects.map(sub => <option key={sub._id} value={sub._id}>{sub.name} (Class {sub.class_id?.name})</option>)}
                  </select>
                </div>
              </>
            )}
            {formData.role === 'admin' && (
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Admin ID</label>
                <input type="text" name="admin_id" value={formData.admin_id} onChange={handleChange} required />
              </div>
            )}
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>Sign Up</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
