import React from 'react';

const AcademicCalendar = () => {
  const events = [
    { date: '01 Aug 2024', event: 'Fall Semester Begins', type: 'Academic' },
    { date: '15 Aug 2024', event: 'Independence Day', type: 'Holiday' },
    { date: '21 Sep 2024', event: 'Mid Term 1 (M1) Exams Start', type: 'Exam' },
    { date: '02 Oct 2024', event: 'Gandhi Jayanti', type: 'Holiday' },
    { date: '18 Nov 2024', event: 'Mid Term 2 (M2) Exams Start', type: 'Exam' },
    { date: '15 Dec 2024', event: 'Term End Exams (TEE)', type: 'Exam' }
  ];

  const getTypeStyle = (type) => {
    switch(type) {
      case 'Holiday': return { bg: '#fee2e2', color: '#991b1b' }; // Red
      case 'Exam': return { bg: '#fef08a', color: '#854d0e' }; // Yellow
      default: return { bg: '#e0e7ff', color: '#3730a3' }; // Blue
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '0.25rem' }}>Academic Calendar</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Important dates, holidays, and examination schedules.</p>
      </div>

      <div className="card" style={{ padding: '0' }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {events.map((ev, i) => {
            const style = getTypeStyle(ev.type);
            return (
              <li key={i} style={{ display: 'flex', alignItems: 'center', padding: '1.5rem', borderBottom: i !== events.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                <div style={{ minWidth: '120px', fontWeight: 600 }}>{ev.date}</div>
                <div style={{ flex: 1, fontSize: '1.1rem' }}>{ev.event}</div>
                <div>
                  <span style={{ backgroundColor: style.bg, color: style.color, padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 500 }}>
                    {ev.type}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default AcademicCalendar;
