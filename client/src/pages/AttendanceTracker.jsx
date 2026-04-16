import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AttendanceTracker = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/academic/student/attendance/all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setAttendanceData(res.data.stats);
            }
        } catch (error) {
            console.error('Failed to fetch attendance:', error);
        } finally {
            setLoading(false);
        }
    };
    fetchStats();
  }, []);

  const downloadReport = () => {
    if (attendanceData.length === 0) {
        alert("No attendance data to download!");
        return;
    }
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Subject,Attended,Total Classes,Percentage,Status\r\n";
    attendanceData.forEach(row => {
        csvContent += `"${row.subject}",${row.attended},${row.total},${row.percentage}%,${row.status}\r\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "student_attendance_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ marginBottom: '0.25rem' }}>Attendance Tracker</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Review your overall subject attendance metrics.</p>
        </div>
        <button onClick={downloadReport} className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
          Download Report
        </button>
      </div>

      <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading attendance data...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '1rem' }}>Subject</th>
                <th style={{ padding: '1rem' }}>Attended</th>
                <th style={{ padding: '1rem' }}>Total Classes</th>
                <th style={{ padding: '1rem' }}>Percentage</th>
                <th style={{ padding: '1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.length === 0 ? (
                <tr>
                   <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No attendance records found.</td>
                </tr>
              ) : (
                attendanceData.map((data, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', fontWeight: 500 }}>{data.subject}</td>
                    <td style={{ padding: '1rem' }}>{data.attended}</td>
                    <td style={{ padding: '1rem' }}>{data.total}</td>
                    <td style={{ padding: '1rem', fontWeight: 600, color: data.percentage < 75 ? 'var(--error-color)' : 'var(--text-primary)' }}>
                      {data.percentage}%
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '4px', 
                        fontSize: '0.85rem',
                        backgroundColor: data.percentage < 75 ? '#fee2e2' : '#dcfce7',
                        color: data.percentage < 75 ? '#991b1b' : '#166534'
                      }}>
                        {data.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AttendanceTracker;
