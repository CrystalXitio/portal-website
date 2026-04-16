import React from 'react';

const Fees = () => {
  const feeRecords = [
    { semester: 'Semester 1', amount: '₹ 85,000', status: 'Paid', date: '10 Aug 2024' },
    { semester: 'Semester 2', amount: '₹ 85,000', status: 'Paid', date: '14 Jan 2025' },
    { semester: 'Semester 3', amount: '₹ 90,000', status: 'Pending', date: '-' }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '0.25rem' }}>Fee Records</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Track your tuition and general fee submissions.</p>
      </div>

      <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '2px solid var(--border-color)' }}>
              <th style={{ padding: '1rem' }}>Semester</th>
              <th style={{ padding: '1rem' }}>Amount</th>
              <th style={{ padding: '1rem' }}>Date of Payment</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'right' }}>Receipt</th>
            </tr>
          </thead>
          <tbody>
            {feeRecords.map((record, index) => (
              <tr key={index} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem', fontWeight: 500 }}>{record.semester}</td>
                <td style={{ padding: '1rem', fontWeight: 600 }}>{record.amount}</td>
                <td style={{ padding: '1rem' }}>{record.date}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem',
                    backgroundColor: record.status === 'Paid' ? '#dcfce7' : '#fef08a',
                    color: record.status === 'Paid' ? '#166534' : '#854d0e'
                  }}>
                    {record.status}
                  </span>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  {record.status === 'Paid' ? (
                    <button onClick={() => window.print()} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                      Download PDF
                    </button>
                  ) : (
                    <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', backgroundColor: '#eab308' }}>
                      Pay Now
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Fees;
