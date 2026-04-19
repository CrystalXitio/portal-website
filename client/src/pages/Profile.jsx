import React, { useContext, useState, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loadingObj, setLoadingObj] = useState({ photo: false, profile: false });
  const [errorObj, setErrorObj] = useState('');
  
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Profile form state
  const [formData, setFormData] = useState({
    email: user?.email || '',
    dob: user?.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
    blood_group: user?.blood_group || '',
    contact_number: user?.contact_number || '',
    address: user?.address || ''
  });

  const fileInputRef = useRef(null);

  if (!user) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form data to original state
      setFormData({
        email: user.email || '',
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
        blood_group: user.blood_group || '',
        contact_number: user.contact_number || '',
        address: user.address || ''
      });
    }
    setIsEditing(!isEditing);
    setErrorObj('');
  };

  const handleProfileSubmit = async () => {
    setLoadingObj({ ...loadingObj, profile: true });
    setErrorObj('');
    try {
      const response = await axios.put('http://localhost:5000/api/user/profile', formData);
      // Update local session state
      const updatedUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      setErrorObj(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoadingObj({ ...loadingObj, profile: false });
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorObj('New passwords do not match');
      return;
    }
    setLoadingObj({ ...loadingObj, password: true });
    setErrorObj('');
    try {
      await axios.put('http://localhost:5000/api/user/password', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      setIsChangingPassword(false);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      alert('Password successfully updated!');
    } catch (err) {
      setErrorObj(err.response?.data?.error || 'Failed to change password');
    } finally {
      setLoadingObj({ ...loadingObj, password: false });
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Process image file
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      const base64Image = reader.result;
      setLoadingObj({ ...loadingObj, photo: true });
      setErrorObj('');
      try {
        const response = await axios.post('http://localhost:5000/api/user/photo', { base64Image });
        const newPhotoUrl = response.data.profile_photo;
        
        const updatedUser = { ...user, profile_photo: newPhotoUrl };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      } catch (err) {
        setErrorObj(err.response?.data?.error || 'Failed to upload photo');
      } finally {
        setLoadingObj({ ...loadingObj, photo: false });
      }
    };
  };

  const renderField = (label, name, value, isImmutable = false, type = "text", isTextArea = false) => {
    if (!isEditing || isImmutable) {
      return (
        <div style={{ gridColumn: isTextArea ? '1 / -1' : 'auto' }}>
          <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{label}</span>
          <strong style={{ fontSize: '1.1rem', whiteSpace: isTextArea ? 'pre-wrap' : 'normal' }}>{value || 'Not Provided'}</strong>
        </div>
      );
    }

    return (
      <div style={{ gridColumn: isTextArea ? '1 / -1' : 'auto' }}>
        <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{label}</span>
        {isTextArea ? (
           <textarea 
             name={name} value={formData[name]} onChange={handleChange} rows="3"
             style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--accent-color)' }}
           />
        ) : type === "select" ? (
           <select name={name} value={formData[name]} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--accent-color)' }}>
             <option value="">Select</option>
             <option value="A+">A+</option><option value="A-">A-</option>
             <option value="B+">B+</option><option value="B-">B-</option>
             <option value="AB+">AB+</option><option value="AB-">AB-</option>
             <option value="O+">O+</option><option value="O-">O-</option>
           </select>
        ) : (
           <input 
             type={type} name={name} value={formData[name]} onChange={handleChange}
             style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--accent-color)' }}
           />
        )}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '2rem' }}>
      <h2 style={{ marginBottom: '2rem' }}>Your Profile</h2>
      {errorObj && <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '6px', marginBottom: '1.5rem', fontWeight: 500 }}>{errorObj}</div>}
      
      <div className="card" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', width: '150px', height: '150px', margin: '0 auto 1rem auto' }}>
            <img 
              src={user.profile_photo || 'https://placehold.co/150x150'} 
              alt="Profile" 
              style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--border-color)', backgroundColor: 'var(--bg-color)' }}
            />
            {loadingObj.photo && (
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <strong>Loading...</strong>
              </div>
            )}
          </div>
          
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handlePhotoUpload} 
            style={{ display: 'none' }} 
          />
          <button onClick={() => fileInputRef.current.click()} className="btn-primary" style={{ width: '100%', padding: '0.5rem', fontSize: '0.9rem' }} disabled={loadingObj.photo}>
            Change Photo
          </button>
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <h3 style={{ margin: 0 }}>Personal Details</h3>
             {loadingObj.profile && <span style={{ fontSize: '0.85rem', color: 'var(--accent-color)', fontWeight: 'bold' }}>Saving...</span>}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Immutables */}
            {renderField('Username', 'username', user.username, true)}
            {renderField('Role', 'role', user.role.toUpperCase(), true)}
            
            {/* Academic Info */}
            {user.role === 'student' && (
              <>
                {user.course && renderField('Course Enrolled', 'course', user.course, true)}
                {user.class && renderField('Batch/Class', 'class', user.class, true)}
                {user.sap_id && renderField('SAP ID', 'sap_id', user.sap_id, true)}
                {user.roll_no && renderField('Roll No', 'roll_no', user.roll_no, true)}
              </>
            )}
            
            {user.role === 'teacher' && (
              <>
                {user.course && renderField('Department/Course', 'course', user.course, true)}
                {user.taught_subjects && user.taught_subjects.length > 0 && renderField('Subjects Administered', 'taught_subjects', [...new Set(user.taught_subjects)].join(', '), true)}
                {user.faculty_id && renderField('Faculty ID', 'faculty_id', user.faculty_id, true)}
              </>
            )}
            
            {user.admin_id && renderField('Admin ID', 'admin_id', user.admin_id, true)}
            
            {/* Mutables */}
            {renderField('Email Address', 'email', isEditing ? formData.email : user.email, false, 'email')}
            {renderField('Date of Birth', 'dob', isEditing ? formData.dob : (user.dob ? new Date(user.dob).toISOString().split('T')[0] : ''), false, 'date')}
            {renderField('Blood Group', 'blood_group', isEditing ? formData.blood_group : user.blood_group, false, 'select')}
            {renderField('Contact Number', 'contact_number', isEditing ? formData.contact_number : user.contact_number, false, 'tel')}
            {renderField('Residential Address', 'address', isEditing ? formData.address : user.address, false, 'text', true)}

          </div>
          
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            {isEditing ? (
              <>
                 <button onClick={handleEditToggle} style={{ padding: '0.75rem 1.5rem', cursor: 'pointer', background: 'none', border: '1px solid var(--text-secondary)', borderRadius: '6px' }} disabled={loadingObj.profile}>Cancel</button>
                 <button onClick={handleProfileSubmit} className="btn-primary" disabled={loadingObj.profile}>Save Changes</button>
              </>
            ) : (
                 <button onClick={handleEditToggle} className="btn-primary">Edit</button>
            )}
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <h3 style={{ margin: 0 }}>Security Settings</h3>
        </div>
        
        {!isChangingPassword ? (
          <div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Ensure your account is using a long, random password to stay secure.</p>
            <button onClick={() => setIsChangingPassword(true)} style={{ padding: '0.5rem 1rem', cursor: 'pointer', background: 'none', border: '1px solid var(--accent-color)', color: 'var(--accent-color)', borderRadius: '6px', fontWeight: 500 }}>
              Change Password
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Current Password</label>
              <input type="password" name="oldPassword" value={passwordData.oldPassword} onChange={handlePasswordChange} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--accent-color)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>New Password</label>
              <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--accent-color)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Confirm New Password</label>
              <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--accent-color)' }} />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button onClick={() => { setIsChangingPassword(false); setErrorObj(''); setPasswordData({oldPassword:'', newPassword:'', confirmPassword:''}); }} style={{ padding: '0.5rem 1rem', cursor: 'pointer', background: 'none', border: '1px solid var(--text-secondary)', borderRadius: '6px' }} disabled={loadingObj.password}>Cancel</button>
              <button onClick={handlePasswordSubmit} className="btn-primary" style={{ padding: '0.5rem 1rem' }} disabled={loadingObj.password}>
                {loadingObj.password ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
