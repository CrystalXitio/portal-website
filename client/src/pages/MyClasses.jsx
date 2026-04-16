import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const MyClasses = () => {
  const { user } = useContext(AuthContext);
  const [taughtSubjects, setTaughtSubjects] = useState([]);
  const [course, setCourse] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await axios.get('http://localhost:5000/api/user/me', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        // We expect the backend to return strings if populated.
        // user.taught_subjects from backend is array of subject names.
        setTaughtSubjects(res.data.user.taught_subjects || []);
        setCourse(res.data.user.course || 'Unassigned Course');
      } catch (err) {
        console.error('Failed to fetch user classes metadata');
      }
    };
    fetchUserData();
  }, []);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '0.25rem' }}>Classes Teaching:</h2>
        <p style={{ color: 'var(--text-secondary)' }}>An overview of the subjects you administer.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        {taughtSubjects.length > 0 ? (
          <div 
            className="card hover-elegant" 
            style={{ 
              borderLeft: '4px solid var(--accent-color)', 
              cursor: 'default',
              padding: '1.5rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ fontWeight: 700, color: 'var(--accent-color)', fontSize: '1.2rem' }}>
                {taughtSubjects.join(', ')}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', padding: '0.2rem 0.6rem', backgroundColor: 'var(--bg-color)', borderRadius: '12px' }}>Assigned</span>
            </div>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>{course}</h3>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Primary Department mapping for your active instructional tenure.
            </div>
          </div>
        ) : (
          <div style={{ color: 'var(--text-secondary)' }}>You currently have no assigned subjects.</div>
        )}
      </div>
    </div>
  );
};

export default MyClasses;
