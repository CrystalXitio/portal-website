import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const SubjectDetails = () => {
  const { user } = useContext(AuthContext);
  const [isAssignmentExpanded, setIsAssignmentExpanded] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'attendance', 'ica', 'assignments'
  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState({ title: '', description: '', due_date: '', base64File: '' });
  const { id } = useParams();
  const navigate = useNavigate();

  // Reference logic for titles
  const subjectNames = {
    "CVT": "Complex Variables and Transforms",
    "COA": "Computer Organization and Architecture",
    "TCS": "Theoretical Computer Science",
    "MPMC": "Microprocessors and Microcontrollers",
    "WP": "Web Programming",
    "DAA": "Design and Analysis of Algorithms",
    "DBMS": "Database Management Systems",
    "MAE": "Management, Accounting, and Economics",
    "OOPJ": "Object Oriented Programming with Java"
  };

  const isLab = id.includes('-D1') || id.includes('-D2');
  const baseSubject = id.split('-')[0];
  const batch = isLab ? id.substring(id.indexOf('-') + 1) : '';
  const fullDesc = (subjectNames[baseSubject] || baseSubject) + (isLab ? " " + batch : "");
  // Default to false if user is unknown for safe rendering
  const isTeacher = user?.role === 'teacher';

  const handleBack = () => {
    if (isTeacher) navigate('/classes');
    else navigate('/dashboard');
  };

  // Mocks for Teacher Features
  const [attendanceDate, setAttendanceDate] = useState('');
  const [academicData, setAcademicData] = useState({ subject: null, classObj: null, students: [], stats: null });
  const [marksState, setMarksState] = useState({});
  const [attendanceState, setAttendanceState] = useState({});
  
  useEffect(() => {
    const fetchAcademicData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        if (isTeacher) {
          const res = await axios.get(`http://localhost:5000/api/academic/class/${baseSubject}/${batch}`, config);
          setAcademicData(prev => ({ ...prev, students: res.data.students || [], subject: res.data.subject, classObj: res.data.class }));
        } else if (user) {
          const res = await axios.get(`http://localhost:5000/api/academic/student/stats/${baseSubject}/${batch}`, config);
          setAcademicData(prev => ({ ...prev, stats: res.data.stats, subject: res.data.subject }));
        }
      } catch (err) {
        console.error('Failed to fetch academic data', err);
      }
    };
    if (user) fetchAcademicData();
  }, [baseSubject, batch, isTeacher, user]);

  useEffect(() => {
    if (academicData?.subject?._id) {
        axios.get(`http://localhost:5000/api/academic/assignment/${academicData.subject._id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }).then(res => {
            if (res.data.success) setAssignments(res.data.assignments);
        }).catch(err => console.error(err));
    }
  }, [academicData?.subject?._id]);

  useEffect(() => {
    if (activeModal === 'attendance' && attendanceDate && academicData?.subject?._id) {
       const fetchDateAtt = async () => {
           try {
               const res = await axios.get(`http://localhost:5000/api/academic/attendance/${academicData.subject._id}/${attendanceDate}`, {
                   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
               });
               if (res.data.success && res.data.attendance) {
                   const newState = {};
                   res.data.attendance.records.forEach(r => {
                       newState[r.student_id] = r.status === 'Present';
                   });
                   setAttendanceState(newState);
               } else {
                   setAttendanceState({});
               }
           } catch(e) { console.error('Failed fetching existing attendance', e); }
       };
       fetchDateAtt();
    }
  }, [attendanceDate, activeModal, academicData?.subject?._id]);

  useEffect(() => {
    if (activeModal === 'ica' && academicData?.subject?._id) {
       const fetchICA = async () => {
           try {
               const res = await axios.get(`http://localhost:5000/api/academic/ica/${academicData.subject._id}`, {
                   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
               });
               if (res.data.success && res.data.icas) {
                   const newState = {};
                   res.data.icas.forEach(ica => {
                       newState[ica.student_id] = ica.marks;
                   });
                   setMarksState(newState);
               }
           } catch(e) { console.error('Failed fetching existing ICA', e); }
       };
       fetchICA();
    }
  }, [activeModal, academicData?.subject?._id]);

  const handleSaveAttendance = async () => {
    try {
      if (!attendanceDate) return alert('Select date');
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const records = academicData.students.map(s => ({
        student_id: s._id,
        status: attendanceState[s._id] !== false ? 'Present' : 'Absent'
      }));

      await axios.post('http://localhost:5000/api/academic/attendance', {
        subject_id: academicData.subject._id,
        date: attendanceDate,
        records
      }, config);
      
      alert(`Attendance saved successfully!`);
      setActiveModal(null);
    } catch (err) {
      console.error(err);
      alert('Error saving attendance');
    }
  };

  const handleSaveICA = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Save all marks
      const promises = Object.keys(marksState).map(student_id => {
         const m = marksState[student_id];
         return axios.post('http://localhost:5000/api/academic/ica', {
            subject_id: academicData.subject._id,
            student_id,
            m1: m.m1 || 0,
            m2: m.m2 || 0,
            assessment: m.assessment || 0
         }, config);
      });
      
      await Promise.all(promises);
      alert(`Marks saved successfully!`);
      setActiveModal(null);
    } catch (err) {
      console.error(err);
      alert('Error saving marks');
    }
  };

  const handleFileConvert = (e) => {
    const file = e.target.files[0];
    if(file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setNewAssignment({...newAssignment, base64File: reader.result});
        };
    }
  };

  const handleSaveAssignment = async () => {
    try {
        if(!newAssignment.title) return alert("Title required");
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        const res = await axios.post('http://localhost:5000/api/academic/assignment', {
            ...newAssignment,
            subject_id: academicData.subject._id
        }, config);
        
        if(res.data.success) {
            setAssignments([res.data.assignment, ...assignments]);
            setActiveModal(null);
            setNewAssignment({ title: '', description: '', due_date: '', base64File: '' });
            alert('Assignment posted successfully!');
        }
    } catch(err) {
        console.error(err);
        alert("Failed to post assignment");
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
      <button 
        onClick={handleBack} 
        style={{ background: 'none', border: 'none', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontWeight: 500 }}
      >
        <ArrowLeft size={18} /> Back to Dashboard
      </button>

      <header style={{ 
        backgroundColor: isLab ? '#475569' : 'var(--accent-color)', 
        color: 'white', 
        padding: '2rem', 
        borderRadius: '12px', 
        marginBottom: '2rem',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: 'white', marginBottom: '0.5rem' }}>{id}</h1>
        <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>{fullDesc}</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        {/* Attendance Card */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Attendance</h3>
          
          {isTeacher ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Manage daily attendance records for this class.</p>
              <button className="btn-primary" onClick={() => setActiveModal('attendance')}>Edit Attendance</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'center' }}>
              <div className="hover-elegant" style={{ backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#10b981' }}>{academicData?.stats?.attendance?.totalAttended || 0}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Attended</div>
              </div>
              <div className="hover-elegant" style={{ backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#ef4444' }}>{(academicData?.stats?.attendance?.totalConducted || 0) - (academicData?.stats?.attendance?.totalAttended || 0)}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Missed</div>
              </div>
              <div className="hover-elegant" style={{ backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{academicData?.stats?.attendance?.totalConducted || 0}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total classes</div>
              </div>
              <div className="hover-elegant" style={{ backgroundColor: 'var(--accent-color)', padding: '1rem', borderRadius: '8px', color: 'white' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{academicData?.stats?.attendance?.percentage || 0}%</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Percentage</div>
              </div>
            </div>
          )}
        </div>

        {/* ICA Marks Card */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>ICA Marks</h3>
          
          {isTeacher ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Assign and update Internal Continuous Assessment marks.</p>
              <button className="btn-primary" onClick={() => setActiveModal('ica')}>Edit ICA Marks</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', textAlign: 'center' }}>
              <div className="hover-elegant" style={{ backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{academicData?.stats?.ica?.marks?.m1 || 0}<span style={{ fontSize:'1rem', color:'var(--text-secondary)', fontWeight:'normal' }}>/10</span></div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>M1</div>
              </div>
              <div className="hover-elegant" style={{ backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{academicData?.stats?.ica?.marks?.m2 || 0}<span style={{ fontSize:'1rem', color:'var(--text-secondary)', fontWeight:'normal' }}>/10</span></div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>M2</div>
              </div>
              <div className="hover-elegant" style={{ backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{academicData?.stats?.ica?.marks?.assessment || 0}<span style={{ fontSize:'1rem', color:'var(--text-secondary)', fontWeight:'normal' }}>/30</span></div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Assessment</div>
              </div>
              <div className="hover-elegant" style={{ backgroundColor: 'var(--accent-color)', padding: '1rem', borderRadius: '8px', color: 'white' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{academicData?.stats?.ica?.total || 0}<span style={{ fontSize:'1rem', opacity:0.8, fontWeight:'normal' }}>/50</span></div>
                <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total</div>
              </div>
            </div>
          )}
        </div>

        {/* Assignments Card */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            <h3 style={{ margin: 0 }}>Assignments</h3>
            {isTeacher && (
              <button className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }} onClick={() => setActiveModal('addAssignment')}>
                + Add New
              </button>
            )}
          </div>

          {assignments.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No assignments yet.</p>
          ) : (
              assignments.map(assign => (
                  <div key={assign._id} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1.5rem', backgroundColor: 'var(--bg-color)', borderRadius: '8px', borderLeft: '4px solid var(--accent-color)', marginBottom: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>{assign.title}</h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{assign.description}</p>
                      
                        {assign.question_file_url && (
                            <a href={assign.question_file_url} target="_blank" rel="noreferrer" className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', textDecoration: 'none', display: 'inline-block', marginBottom: '0.5rem' }}>View Attached File</a>
                        )}

                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                           Due: {assign.due_date ? new Date(assign.due_date).toLocaleDateString() : 'No due date'}
                        </div>
                    </div>
                  </div>
              ))
          )}
        </div>

      </div>

      {/* Teacher Modals */}
      {activeModal === 'attendance' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div className="card" style={{ width: '90%', maxWidth: '500px', backgroundColor: 'var(--surface-color)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Edit Attendance: {id}</h3>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={20} /></button>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Select Date</label>
              <input type="date" value={attendanceDate} onChange={(e) => setAttendanceDate(e.target.value)} className="form-input" />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                    <th style={{ padding: '0.5rem' }}>Roll No</th>
                    <th style={{ padding: '0.5rem' }}>Student Name</th>
                    <th style={{ padding: '0.5rem', textAlign: 'center' }}>Present</th>
                  </tr>
                </thead>
                <tbody>
                  {academicData.students.map(student => (
                    <tr key={student._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.5rem' }}>{student.roll_no}</td>
                      <td style={{ padding: '0.5rem' }}>{student.username}</td>
                      <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                         <button 
                          onClick={() => setAttendanceState({...attendanceState, [student._id]: !(attendanceState[student._id] !== false)})}
                          style={{
                            padding: '0.4rem 1.2rem',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '0.85rem',
                            color: '#ffffff',
                            backgroundColor: attendanceState[student._id] !== false ? '#10b981' : '#ef4444',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            transition: 'background-color 0.2s ease'
                          }}
                        >
                          {attendanceState[student._id] !== false ? 'Present' : 'Absent'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="btn-primary" style={{ width: '100%' }} onClick={handleSaveAttendance}>Save Attendance</button>
          </div>
        </div>
      )}

      {activeModal === 'ica' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div className="card" style={{ width: '90%', maxWidth: '700px', backgroundColor: 'var(--surface-color)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Edit ICA Marks: {id}</h3>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={20} /></button>
            </div>
            <div style={{ marginBottom: '1.5rem', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                    <th style={{ padding: '0.5rem' }}>Roll No</th>
                    <th style={{ padding: '0.5rem' }}>Student Name</th>
                    <th style={{ padding: '0.5rem' }}>M1 (10)</th>
                    <th style={{ padding: '0.5rem' }}>M2 (10)</th>
                    <th style={{ padding: '0.5rem' }}>Assess (30)</th>
                  </tr>
                </thead>
                <tbody>
                  {academicData.students.map(student => (
                    <tr key={student._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.5rem' }}>{student.roll_no}</td>
                      <td style={{ padding: '0.5rem' }}>{student.username}</td>
                      <td style={{ padding: '0.5rem' }}>
                         <input type="number" max="10" placeholder="0" 
                                value={marksState[student._id]?.m1 || ''} 
                                onChange={(e) => setMarksState({...marksState, [student._id]: {...marksState[student._id], m1: Number(e.target.value)}})} 
                                style={{ width: '60px', padding: '0.4rem', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
                      </td>
                      <td style={{ padding: '0.5rem' }}>
                         <input type="number" max="10" placeholder="0" 
                                value={marksState[student._id]?.m2 || ''} 
                                onChange={(e) => setMarksState({...marksState, [student._id]: {...marksState[student._id], m2: Number(e.target.value)}})} 
                                style={{ width: '60px', padding: '0.4rem', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
                      </td>
                      <td style={{ padding: '0.5rem' }}>
                         <input type="number" max="30" placeholder="0" 
                                value={marksState[student._id]?.assessment || ''} 
                                onChange={(e) => setMarksState({...marksState, [student._id]: {...marksState[student._id], assessment: Number(e.target.value)}})} 
                                style={{ width: '60px', padding: '0.4rem', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="btn-primary" style={{ width: '100%' }} onClick={handleSaveICA}>Save Marks</button>
          </div>
        </div>
      )}
      {activeModal === 'addAssignment' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div className="card" style={{ width: '90%', maxWidth: '500px', backgroundColor: 'var(--surface-color)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Create New Assignment</h3>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={20} /></button>
            </div>

            <div style={{ marginBottom: '1rem' }}>
               <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Title</label>
               <input type="text" className="form-input" value={newAssignment.title} onChange={e => setNewAssignment({...newAssignment, title: e.target.value})} />
            </div>

            <div style={{ marginBottom: '1rem' }}>
               <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Description</label>
               <textarea className="form-input" rows="3" value={newAssignment.description} onChange={e => setNewAssignment({...newAssignment, description: e.target.value})}></textarea>
            </div>

            <div style={{ marginBottom: '1rem' }}>
               <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Due Date</label>
               <input type="date" className="form-input" value={newAssignment.due_date} onChange={e => setNewAssignment({...newAssignment, due_date: e.target.value})} />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
               <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Attach File</label>
               <input type="file" onChange={handleFileConvert} />
               {newAssignment.base64File && <p style={{fontSize: '0.8rem', color: 'green', marginTop: '0.5rem'}}>File prepared for upload.</p>}
            </div>

            <button className="btn-primary" style={{ width: '100%' }} onClick={handleSaveAssignment}>Post Assignment</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectDetails;
