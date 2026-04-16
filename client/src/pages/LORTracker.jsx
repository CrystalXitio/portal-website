import React, { useState } from 'react';

const LORTracker = () => {
  const [issued, setIssued] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIssued(true);
    setTimeout(() => setIssued(false), 3000);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '0.25rem' }}>Issue Letter of Recommendation</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Select a student from your active classes to generate and issue a LOR.</p>
      </div>

      <div className="card">
        {issued && (
          <div style={{ padding: '1rem', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '6px', marginBottom: '1.5rem', textAlign: 'center', fontWeight: 500 }}>
            LOR generated and successfully sent to the student!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Select Student (SAP ID - Name)</label>
            <select required>
              <option value="">Search student directory...</option>
              <option value="1">702011 - John Doe</option>
              <option value="2">702012 - Amanda Smith</option>
              <option value="3">702015 - Michael Ross</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Performance Remark</label>
            <textarea required rows="6" placeholder="Enter custom remarks highlighting the student's involvement and project work..."></textarea>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%' }}>Generate & Issue LOR</button>
        </form>
      </div>
    </div>
  );
};

export default LORTracker;
