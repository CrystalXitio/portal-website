import React from 'react';

const ExamResults = () => {
  const semesters = [
    { title: 'Semester 1', sgpa: '8.4', result: 'Pass', link: '#' },
    { title: 'Semester 2', sgpa: '8.8', result: 'Pass', link: '#' },
    { title: 'Semester 3', sgpa: '9.2', result: 'Pass', link: '#' },
    { title: 'Semester 4', sgpa: 'Pending', result: '-', link: '#' }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '0.25rem' }}>Exam Results</h2>
        <p style={{ color: 'var(--text-secondary)' }}>View your semester-wise academic records.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="card" style={{ textAlign: 'center', borderColor: 'var(--accent-color)' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Overall CGPA</h3>
          <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--accent-color)' }}>8.80</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Total Credits</h3>
          <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--text-primary)' }}>64</div>
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '2px solid var(--border-color)' }}>
              <th style={{ padding: '1rem' }}>Semester</th>
              <th style={{ padding: '1rem' }}>SGPA</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {semesters.map((sem, index) => (
              <tr key={index} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem', fontWeight: 500 }}>{sem.title}</td>
                <td style={{ padding: '1rem', fontWeight: 600 }}>{sem.sgpa}</td>
                <td style={{ padding: '1rem', color: sem.result === 'Pass' ? '#10b981' : 'var(--text-secondary)' }}>{sem.result}</td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <button onClick={() => window.print()} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} disabled={sem.result === '-'}>
                    Download PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExamResults;
