import React, { useState } from 'react';

const HelpDesk = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '0.25rem' }}>Help Desk & Support</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Raise support tickets for technical or administrative issues.</p>
      </div>

      <div className="card">
        {submitted && (
          <div style={{ padding: '1rem', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '6px', marginBottom: '1.5rem', textAlign: 'center', fontWeight: 500 }}>
            Ticket submitted successfully! Administration will review it shortly.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Issue Category</label>
            <select required>
              <option value="">Select a category</option>
              <option value="technical">Technical Support</option>
              <option value="academic">Academic Queries</option>
              <option value="fee">Fee/Payment Issue</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Subject</label>
            <input type="text" required placeholder="Brief summary of the issue" />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Description</label>
            <textarea required rows="6" placeholder="Please provide detailed information about your issue..."></textarea>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%' }}>Submit Ticket</button>
        </form>
      </div>
    </div>
  );
};

export default HelpDesk;
