import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Timetable = ({ role, user }) => {
  const navigate = useNavigate();

  const handleCellClick = (subjectId) => {
    navigate(`/subject/${subjectId}`);
  };

  return (
    <div style={{ overflowX: 'auto', marginTop: '2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ marginBottom: '0.25rem' }}>Weekly Timetable</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Click on any lecture to view the subject dashboard.</p>
      </div>
      
      <table className="timetable-table" style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px', backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
        <thead>
          <tr>
            <th style={{ width: '10%', ...thStyle }}>Time/Day</th>
            <th colSpan="2" style={{ width: '18%', ...thStyle }}>Monday</th>
            <th colSpan="2" style={{ width: '18%', ...thStyle }}>Tuesday</th>
            <th colSpan="2" style={{ width: '18%', ...thStyle }}>Wednesday</th>
            <th colSpan="2" style={{ width: '18%', ...thStyle }}>Thursday</th>
            <th colSpan="2" style={{ width: '18%', ...thStyle }}>Friday</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={tdStyleTime}>8:00-9:00</td>
            <td colSpan="2" style={tdStyleGrey}>
              <LectureBtn subject="TCS" teacher="PCH" room="D2 CR-407" onClick={() => handleCellClick('TCS-D2')} />
            </td>
            <td colSpan="2" style={tdStyle}></td>
            <td colSpan="2" style={tdStyle}></td>
            <td colSpan="2" style={tdStyle}></td>
            <td colSpan="2" style={tdStyleGrey}>
              <LectureBtn subject="CVT" teacher="MKA" room="D1 CR-503" onClick={() => handleCellClick('CVT-D1')} />
            </td>
          </tr>
          <tr>
            <td style={tdStyleTime}>9:00-10:00</td>
            <td colSpan="2" style={tdStyleGrey}>
              <LectureBtn subject="CVT" teacher="MKA" room="D2 CR-402" onClick={() => handleCellClick('CVT-D2')} />
            </td>
            <td colSpan="2" style={tdStyle}>
              <LectureBtn subject="TCS" teacher="JAU" room="CR-107" onClick={() => handleCellClick('TCS')} />
            </td>
            <td colSpan="2" style={tdStyle}>
              <LectureBtn subject="MPMC" teacher="MRE" room="CR-503" onClick={() => handleCellClick('MPMC')} />
            </td>
            <td colSpan="2" style={tdStyle}>
              <LectureBtn subject="MPMC" teacher="MRE" room="CR-404" onClick={() => handleCellClick('MPMC')} />
            </td>
            <td colSpan="2" style={tdStyle}>
              <LectureBtn subject="COA" teacher="DSA" room="CR-503" onClick={() => handleCellClick('COA')} />
            </td>
          </tr>
          <tr>
            <td style={tdStyleTime}>10:00-11:00</td>
            <td rowSpan="2" style={tdStyleGrey}>
              <LectureBtn subject="WP" teacher="ANN" room="D2 CL-102" onClick={() => handleCellClick('WP-D2')} />
            </td>
            <td rowSpan="2" style={tdStyleGrey}>
              <LectureBtn subject="MPMC" teacher="MRE" room="D1 HCL-ES" onClick={() => handleCellClick('MPMC-D1')} />
            </td>
            <td rowSpan="2" style={tdStyleGrey}>
              <LectureBtn subject="DAA" teacher="PDA" room="D1 CL-102" onClick={() => handleCellClick('DAA-D1')} />
            </td>
            <td rowSpan="2" style={tdStyleGrey}>
              <LectureBtn subject="MPMC" teacher="MRE" room="D2 HCL-ES" onClick={() => handleCellClick('MPMC-D2')} />
            </td>
            <td rowSpan="2" style={tdStyleGrey}>
              <LectureBtn subject="DBMS" teacher="MMA" room="D1 CL-101" onClick={() => handleCellClick('DBMS-D1')} />
            </td>
            <td rowSpan="2" style={tdStyleGrey}>
              <LectureBtn subject="DAA" teacher="PDA" room="D2 CL-102" onClick={() => handleCellClick('DAA-D2')} />
            </td>
            <td rowSpan="2" style={tdStyleGrey}>
              <LectureBtn subject="DBMS" teacher="MMA" room="D2 CL-101" onClick={() => handleCellClick('DBMS-D2')} />
            </td>
            <td rowSpan="2" style={tdStyleGrey}>
              <LectureBtn subject="WP" teacher="ANN" room="D1 CL-102" onClick={() => handleCellClick('WP-D1')} />
            </td>
            <td colSpan="2" style={tdStyle}>
              <LectureBtn subject="TCS" teacher="JAU" room="CR-503" onClick={() => handleCellClick('TCS')} />
            </td>
          </tr>
          <tr>
            <td style={tdStyleTime}>11:00-12:00</td>
            <td colSpan="2" style={{...tdStyle, fontWeight: 'bold'}}>BREAK</td>
          </tr>
          <tr>
            <td style={tdStyleTime}>12:00-1:00</td>
            <td colSpan="2" style={{...tdStyle, fontWeight: 'bold'}}>BREAK</td>
            <td colSpan="2" style={{...tdStyle, fontWeight: 'bold'}}>BREAK</td>
            <td colSpan="2" style={tdStyle}>
              <LectureBtn subject="DAA" teacher="PDA" room="CR-503" onClick={() => handleCellClick('DAA')} />
            </td>
            <td colSpan="2" style={tdStyle}>
              <LectureBtn subject="CVT" teacher="MKA" room="CR-403" onClick={() => handleCellClick('CVT')} />
            </td>
            <td colSpan="2" style={tdStyle}>
              <LectureBtn subject="DBMS" teacher="MMA" room="CR-503" onClick={() => handleCellClick('DBMS')} />
            </td>
          </tr>
          <tr>
            <td style={tdStyleTime}>1:00-2:00</td>
            <td colSpan="2" style={tdStyle}>
              <LectureBtn subject="MPMC" teacher="MRE" room="CR-503" onClick={() => handleCellClick('MPMC')} />
            </td>
            <td colSpan="2" style={tdStyle}>
              <LectureBtn subject="CVT" teacher="MKA" room="CR-503" onClick={() => handleCellClick('CVT')} />
            </td>
            <td colSpan="2" style={tdStyleGrey}>
              <LectureBtn subject="TCS" teacher="PCH" room="D1 CR-605" onClick={() => handleCellClick('TCS-D1')} />
            </td>
            <td colSpan="2" style={{...tdStyle, fontWeight: 'bold'}}>BREAK</td>
            <td colSpan="2" style={tdStyle}>
              <LectureBtn subject="DAA" teacher="PDA" room="CR-503" onClick={() => handleCellClick('DAA')} />
            </td>
          </tr>
          <tr>
            <td style={tdStyleTime}>2:00-3:00</td>
            <td colSpan="2" style={tdStyle}>
              <LectureBtn subject="DBMS" teacher="MMA" room="CR-503" onClick={() => handleCellClick('DBMS')} />
            </td>
            <td colSpan="2" style={tdStyle}>
              <LectureBtn subject="COA" teacher="DSA" room="CR-503" onClick={() => handleCellClick('COA')} />
            </td>
            <td colSpan="2" rowSpan="2" style={tdStyle}>
              <LectureBtn subject="*MAE" teacher="VSP" room="CR-104" onClick={() => handleCellClick('MAE')} />
            </td>
            <td colSpan="2" style={tdStyle}>
              <LectureBtn subject="CVT" teacher="MKA" room="CR-508" onClick={() => handleCellClick('CVT')} />
            </td>
            <td rowSpan="2" style={tdStyleGrey}>
              <LectureBtn subject="OOPJ" teacher="RPA" room="D1 CL-503" onClick={() => handleCellClick('OOPJ-D1')} />
            </td>
            <td rowSpan="2" style={tdStyleGrey}>
              <LectureBtn subject="OOPJ" teacher="ANN" room="D2 CL-102" onClick={() => handleCellClick('OOPJ-D2')} />
            </td>
          </tr>
          <tr>
            <td style={tdStyleTime}>3:00-4:00</td>
            <td colSpan="2" style={tdStyle}>
              <LectureBtn subject="WP" teacher="ANN" room="CR-403" onClick={() => handleCellClick('WP')} />
            </td>
            <td colSpan="2" style={tdStyle}>
              <LectureBtn subject="WP" teacher="ANN" room="CR-503" onClick={() => handleCellClick('WP')} />
            </td>
            <td colSpan="2" style={tdStyle}>
              <LectureBtn subject="COA" teacher="DSA" room="CR-503" onClick={() => handleCellClick('COA')} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// Reusable inline styles and sub-components mimicking the reference HTML tables

const thStyle = {
  border: '2px solid var(--border-color)',
  padding: '1rem',
  backgroundColor: 'var(--bg-color)',
  textAlign: 'center',
  fontWeight: 600,
};

const tdStyleTime = {
  border: '2px solid var(--border-color)',
  padding: '1rem',
  backgroundColor: 'var(--bg-color)',
  textAlign: 'center',
  fontWeight: 500,
  whiteSpace: 'nowrap',
};

const tdStyle = {
  border: '2px solid var(--border-color)',
  padding: '0.25rem',
  textAlign: 'center',
};

const tdStyleGrey = {
  ...tdStyle,
  backgroundColor: 'var(--surface-raised)', // theme-aware, replaces hardcoded rgba
};

const LectureBtn = ({ subject, teacher, room, onClick }) => {
  const { user } = useContext(AuthContext);

  if (user?.role === 'teacher') {
    const cleanSub = subject.replace('*', '');
    const hasSubject = user?.taught_subjects?.includes(subject) || user?.taught_subjects?.includes(cleanSub);
    if (!hasSubject) return null;
  }

  return (
    <button 
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: '80px',
        background: 'transparent',
        border: '2px solid transparent',
        borderRadius: '8px',
        padding: '0.5rem',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--surface-color)';
        e.currentTarget.style.transform = 'scale(1.05) translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
        e.currentTarget.style.borderColor = 'var(--accent-color)';
        e.currentTarget.style.zIndex = '10';
        e.currentTarget.style.position = 'relative';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'transparent';
        e.currentTarget.style.zIndex = '1';
        e.currentTarget.style.position = 'static';
      }}
    >
      <strong style={{ fontSize: '1rem', color: 'var(--accent-color)', marginBottom: '0.25rem' }}>{subject}</strong>
      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>[{teacher}]</span>
      <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>{room}</span>
    </button>
  );
};

export default Timetable;
