import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import IdCard from '../components/IdCard';
import Timetable from '../components/Timetable';

const AdminDashboard = ({ user }) => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    activeCourses: 0,
    openTickets: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/stats');
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      }
    };

    if (user.role === 'admin') {
      fetchStats();
      const interval = setInterval(fetchStats, 5000);
      return () => clearInterval(interval);
    }
  }, [user.role]);

  const displayStats = [
    { title: 'Total Students', value: stats.totalStudents, color: '#3b82f6' },
    { title: 'Total Teachers', value: stats.totalTeachers, color: '#10b981' },
    { title: 'Active Courses', value: stats.activeCourses, color: '#8b5cf6' },
    { title: 'Open Support Tickets', value: stats.openTickets, color: '#ef4444' }
  ];

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2 style={{ marginBottom: '2rem' }}>Institution Overview</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {displayStats.map((stat, i) => (
          <div key={i} className="card" style={{ borderLeft: `4px solid ${stat.color}` }}>
            <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{stat.title}</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {user.role === 'admin' ? (
        <AdminDashboard user={user} />
      ) : (
        <>
          <div style={{ marginBottom: '3rem' }}>
            <IdCard user={user} />
          </div>
          <div>
            <Timetable role={user.role} user={user} />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
