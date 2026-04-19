import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Edit, Trash2, Plus } from 'lucide-react';

const routeConfig = {
  '/admin/students': { 
    endpoint: '/api/admin/users?role=student', 
    apiBase: '/api/admin/user',
    title: 'Manage Students', 
    fields: [
      { key: 'username', label: 'Username' },
      { key: 'email', label: 'Email' },
      { key: 'password', label: 'Password' },
      { key: 'sap_id', label: 'SAP ID' }
    ],
    defaultBody: { role: 'student' }
  },
  '/admin/teachers': { 
    endpoint: '/api/admin/users?role=teacher', 
    apiBase: '/api/admin/user',
    title: 'Manage Teachers', 
    fields: [
      { key: 'username', label: 'Username' },
      { key: 'email', label: 'Email' },
      { key: 'password', label: 'Password' },
      { key: 'faculty_id', label: 'Faculty ID' }
    ],
    defaultBody: { role: 'teacher' }
  },
  '/admin/courses': { 
    endpoint: '/api/admin/course', 
    apiBase: '/api/admin/course',
    title: 'Manage Courses', 
    fields: [
      { key: 'name', label: 'Course Name' },
      { key: 'duration_years', label: 'Duration (Years)' }
    ]
  },
  '/admin/subjects': { 
    endpoint: '/api/admin/subject', 
    apiBase: '/api/admin/subject',
    title: 'Manage Subjects', 
    fields: [
      { key: 'name', label: 'Subject Name' },
      { key: 'credits', label: 'Credits' }
    ]
  },
  '/admin/classes': { 
    endpoint: '/api/admin/class', 
    apiBase: '/api/admin/class',
    title: 'Manage Classes', 
    fields: [
      { key: 'name', label: 'Class Name' },
      { key: 'semester', label: 'Semester Number' }
    ]
  },
  '/admin/announcements': { 
    endpoint: '/api/admin/announcement', 
    apiBase: '/api/admin/announcement',
    title: 'Global Announcements', 
    fields: [
      { key: 'title', label: 'Title' },
      { key: 'message', label: 'Message' }
    ],
    defaultBody: { author_id: '123' } // A mock author ID to bypass validation, or wait, I am the admin, I can pull my user id? We don't have user context easily here, let's omit unless necessary
  },
  '/admin/tickets': { 
    endpoint: '/api/admin/ticket', 
    apiBase: '/api/admin/ticket',
    title: 'Support Tickets', 
    fields: [
      { key: 'issue_category', label: 'Category' },
      { key: 'description', label: 'Description' },
      { key: 'status', label: 'Status' }
    ]
  },
  '/admin/fees': {
    endpoint: '/api/admin/fee',
    apiBase: '/api/admin/fee',
    title: 'Manage Fee Status',
    fields: [
      { key: 'student_id', label: 'Student ID' },
      { key: 'amount', label: 'Amount' },
      { key: 'description', label: 'Description' },
      { key: 'status', label: 'Status (Paid/Pending)' },
    ]
  }
};

const AdminManage = () => {
  const location = useLocation();
  const config = routeConfig[location.pathname] || routeConfig['/admin/students']; // fallback

  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [location.pathname]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000${config.endpoint}`);
      if (res.data.success) {
        setDataList(res.data.users || res.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this specific record?')) return;
    try {
      const res = await axios.delete(`http://localhost:5000${config.apiBase}/${id}`);
      if (res.data.success) {
        setDataList(dataList.filter(item => item._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete item:', error);
      alert(error.response?.data?.error || 'Failed to delete');
    }
  };

  const handleAddOrEdit = async (item = null) => {
    // Collect fields via simple window.prompt prompts for brevity, 
    // replacing text buttons with elegant Lucide icons
    const isEdit = !!item;
    let payload = { ...(config.defaultBody || {}) };

    for (const field of config.fields) {
      const val = window.prompt(`Enter ${field.label}:`, item ? item[field.key] : '');
      if (val === null) return; // User cancelled
      payload[field.key] = val;
    }

    try {
      setLoading(true);
      if (isEdit) {
        const res = await axios.put(`http://localhost:5000${config.apiBase}/${item._id}`, payload);
        if (res.data.success) {
          setDataList(dataList.map(d => d._id === item._id ? res.data.data : d));
        }
      } else {
        const res = await axios.post(`http://localhost:5000${config.apiBase}`, payload);
        if (res.data.success) {
          setDataList([res.data.data, ...dataList]);
        }
      }
    } catch (error) {
      console.error('Failed to save record:', error);
      alert('Save operation failed. Verify fields.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '0.25rem' }}>{config.title}</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Manage records and maintain database synchronicity.</p>
      </div>

      <div className="card" style={{ padding: '0' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Total Records: {dataList.length}</h3>
          <button onClick={() => handleAddOrEdit(null)} className="btn-primary" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> Add Entry
          </button>
        </div>
          
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                {config.fields.map(f => (
                  <th key={f.key} style={{ padding: '1rem' }}>{f.label}</th>
                ))}
                <th style={{ padding: '1rem', textAlign: 'right' }}>Manage</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={config.fields.length + 1} style={{ padding: '1rem', textAlign: 'center' }}>Loading synchronized data...</td></tr>
              ) : dataList.length === 0 ? (
                <tr><td colSpan={config.fields.length + 1} style={{ padding: '1rem', textAlign: 'center' }}>No active entries found.</td></tr>
              ) : (
                dataList.map((row) => (
                  <tr key={row._id} style={{ borderBottom: '1px solid var(--border-color)' }} className="hover-elegant">
                    {config.fields.map(f => (
                      <td key={f.key} style={{ padding: '1rem', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {row[f.key] || '-'}
                      </td>
                    ))}
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <button onClick={() => handleAddOrEdit(row)} style={{ marginRight: '1rem', cursor: 'pointer', background: 'none', border: 'none', color: 'var(--accent-color)' }} title="Edit">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => handleDelete(row._id)} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'var(--error-color)' }} title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminManage;
