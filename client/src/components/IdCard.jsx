import React, { useState } from 'react';

const IdCard = ({ user }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Fallbacks if data isn't in user model yet
  const dobFormat = user.dob ? new Date(user.dob).toLocaleDateString('en-GB').replace(/\//g, '.') : '18.03.2006';
  const sapId = user.sap_id || user.faculty_id || user.admin_id || '70472400005';
  const roleName = user.role === 'teacher' ? 'FACULTY' : 'MBA (Tech) (Computer)';

  const cardStyle = {
    width: '450px',
    height: '280px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
    position: 'absolute',
    backfaceVisibility: 'hidden',
    overflow: 'hidden',
    color: '#000000',
    fontFamily: "'Inter', 'Roboto', sans-serif"
  };

  return (
    <div 
      style={{ 
        width: '450px', 
        height: '280px', 
        perspective: '1000px',
        margin: '0 auto',
        transform: 'scale(0.85)',
        transformOrigin: 'top center',
        cursor: 'pointer'
      }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div style={{
        width: '100%', height: '100%',
        transition: 'transform 0.6s',
        transformStyle: 'preserve-3d',
        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        position: 'relative'
      }}>
        {/* Front of Card */}
        <div style={{ ...cardStyle }}>
          {/* Top Red Bar */}
          <div style={{ backgroundColor: '#cc0000', height: '35px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingRight: '1.5rem', color: '#ffffff', fontWeight: 'bold', fontSize: '0.9rem' }}>
            2024-2029
          </div>
          
          <div style={{ display: 'flex', padding: '1rem', height: 'calc(100% - 50px)' }}>
            {/* Left Column: Logo and Photo */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '120px', marginRight: '1rem', justifyContent: 'center' }}>
              {/* College Logo */}
              <img src="/logo-square.jpg" alt="NMIMS" style={{ width: '100%', height: '85px', objectFit: 'contain', marginBottom: '0.25rem', borderRadius: '4px' }} onError={(e) => e.target.style.display = 'none'} />
              
              {/* Profile Photo */}
              <img 
                src={user.profile_photo || 'https://placehold.co/100x120'} 
                alt="Profile" 
                style={{ width: '85px', height: '100px', border: '1.5px solid #000', objectFit: 'cover', marginTop: '0.25rem' }}
              />
            </div>

            {/* Right Column: Details */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', paddingTop: '0.2rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: '1.2', letterSpacing: '0.5px', color: '#000000' }}>
                MUKESH PATEL SCHOOL OF<br/>TECHNOLOGY MANAGEMENT<br/>& ENGINEERING
              </div>
              
              <div style={{ fontWeight: 600, fontSize: '1.1rem', marginTop: '1rem', textTransform: 'uppercase', color: '#000000' }}>
                {user.username || 'AGRIM ARYA'}
              </div>
              
              <div style={{ 
                backgroundColor: '#007acc', 
                color: '#ffffff', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '0.25rem 0.5rem', 
                fontWeight: 600, 
                fontSize: '0.85rem', 
                marginTop: '0.5rem' 
              }}>
                <span>{roleName}</span>
                <span>{sapId}</span>
              </div>
              
              <div style={{ fontSize: '0.85rem', marginTop: '0.5rem', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.25rem', color: '#000000' }}>
                <span style={{ color: '#000000' }}><strong style={{ color: '#000000' }}>DOB :</strong>&nbsp;&nbsp;{dobFormat}</span>
                <span style={{ color: '#000000' }}><strong style={{ color: '#000000' }}>Blood Group :</strong>&nbsp;&nbsp;{user.blood_group || 'O+'}</span>
                <span style={{ gridColumn: '1 / -1', marginTop: '0.1rem', color: '#000000' }}><strong style={{ color: '#000000' }}>Contact :</strong>&nbsp;&nbsp;{user.contact_number || '9819293034'}</span>
              </div>
            </div>
          </div>

          {/* Bottom Red Bar */}
          <div style={{ backgroundColor: '#cc0000', height: '15px', position: 'absolute', bottom: 0, width: '100%' }}></div>
        </div>

        {/* Back of Card */}
        <div style={{
          ...cardStyle,
          transform: 'rotateY(180deg)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          color: '#000000',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ width: '150px', textAlign: 'center', color: '#000000' }}>
              <img src={`https://barcodeapi.org/api/128/${sapId}`} alt="Barcode" style={{ width: '100%', height: '40px', objectFit: 'fill' }} />
              <div style={{ fontWeight: 600, fontSize: '0.9rem', marginTop: '0.25rem', color: '#000000' }}>{sapId}</div>
            </div>
            <div style={{ flex: 1, paddingLeft: '1.5rem', fontSize: '0.75rem', lineHeight: '1.3', color: '#000000' }}>
              <strong style={{ color: '#000000' }}>{user.role === 'teacher' ? 'Faculty Address :' : 'Student Address :'}</strong><br/>
              {user.address ? (
                <span style={{ whiteSpace: 'pre-wrap', color: '#000000' }}>{user.address}</span>
              ) : (
                <>
                  AA6 Flat No 502 Siddharth Nagar Complex<br/>
                  Borivali East Mumbai<br/>
                  Mumbai Suburban - 400066
                </>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', marginTop: '1rem', borderTop: '1px solid #000', borderLeft: '1px solid #000', borderRight: '1px solid #000' }}>
            {['I Year', 'II Year', 'III Year', 'IV Year', 'V Year', 'VI Year'].map((yr, i) => (
              <div key={yr} style={{ flex: 1, textAlign: 'center', borderRight: i < 5 ? '1px solid #000' : 'none' }}>
                <div style={{ borderBottom: '1px solid #000', padding: '0.25rem 0', fontSize: '0.7rem', fontWeight: 600, color: '#000000' }}>{yr}</div>
                <div style={{ height: '35px', borderBottom: '1px solid #000' }}></div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', alignItems: 'flex-end' }}>
            <div style={{ fontSize: '0.65rem', lineHeight: '1.3', maxWidth: '300px', color: '#000000' }}>
              <strong style={{ color: '#000000' }}>If found, please return to:</strong><br/>
              Mukesh Patel School Of Technology Mgmt. & Engineering<br/>
              Bhakti Vedant Swami Marg, Nr. Cooper Hospital,<br/>
              JVPD Scheme, Vile Parle - (West), Mumbai - 400 056,<br/>
              T. +91 22 4233 4000. E. enquiry.mpstme@nmims.edu<br/>
              W. https://engineering.nmims.edu
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, marginTop: '20px', color: '#000000' }}>Addl. Registrar</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdCard;
