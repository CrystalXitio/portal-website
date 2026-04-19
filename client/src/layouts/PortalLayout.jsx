import React, { useContext, useState, useRef, useEffect } from 'react';
import { Outlet, Navigate, useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Moon, Sun, Bell, Settings, User as UserIcon, LogOut, Home, Calendar, FileText, HelpCircle, Users, BookOpen } from 'lucide-react';

const PortalLayout = () => {
  const { user, loading, logout } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  // We'll mock a logo for now. 
  // "the filename for logo is 'logo.png'" -> It should be placed in client/public
  const logoUrl = '/logo.png'; 

  const dummyAnnouncements = [
    { id: 1, title: 'Spring Hackathon 2026', date: 'Oct 15, 2026', time: '10:00 AM', details: 'Register now for the 48-hour coding sprint. Prizes worth $5000!' },
    { id: 2, title: 'Guest Seminar on AI', date: 'Oct 18, 2026', time: '02:30 PM', details: 'Industry experts discussing AI integration in modern software stacks. Hall B.' },
    { id: 3, title: 'Campus Maintenance', date: 'Oct 20, 2026', time: '08:00 AM', details: 'Main library will be closed for routine maintenance operations.' }
  ];

  const notificationsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowAnnouncements(false);
      }
    };

    if (showAnnouncements) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAnnouncements]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getPortalName = () => {
    if(user.role === 'student') return "Student Portal";
    if(user.role === 'teacher') return "Teacher Portal";
    if(user.role === 'admin') return "Admin Portal";
    return "Academic Portal";
  };

  const getSidebarLinks = () => {
    const commonLinks = [{ name: 'Home', path: '/dashboard', icon: <Home size={20} /> }];
    
    if (user.role === 'student') {
      return [...commonLinks,
        { name: 'Attendance Tracker', path: '/attendance', icon: <Calendar size={20} /> },
        { name: 'Exam Results', path: '/results', icon: <FileText size={20} /> },
        { name: 'Academic Calendar', path: '/calendar', icon: <Calendar size={20} /> },
        { name: 'Fee Details', path: '/fees', icon: <FileText size={20} /> },
        { name: 'Help Desk', path: '/helpdesk', icon: <HelpCircle size={20} /> },
      ];
    }
    
    if (user.role === 'teacher') {
      return [...commonLinks,
        { name: 'My Classes', path: '/classes', icon: <BookOpen size={20} /> },
        { name: 'LOR', path: '/lor', icon: <FileText size={20} /> },
        { name: 'Help Desk', path: '/helpdesk', icon: <HelpCircle size={20} /> },
      ];
    }
    
    if (user.role === 'admin') {
      return [...commonLinks,
        { name: 'Manage Students', path: '/admin/students', icon: <Users size={20} /> },
        { name: 'Manage Teachers', path: '/admin/teachers', icon: <Users size={20} /> },
        { name: 'Manage Courses', path: '/admin/courses', icon: <BookOpen size={20} /> },
        { name: 'Manage Subjects', path: '/admin/subjects', icon: <BookOpen size={20} /> },
        { name: 'Manage Classes', path: '/admin/classes', icon: <Users size={20} /> },
        { name: 'Fee Status', path: '/admin/fees', icon: <FileText size={20} /> },
        { name: 'Announcements', path: '/admin/announcements', icon: <Bell size={20} /> },
        { name: 'Support Tickets', path: '/admin/tickets', icon: <HelpCircle size={20} /> },
      ];
    }
    return commonLinks;
  };

  return (
    <div className="portal-layout">
      {/* Sidebar */}
      <aside className="portal-sidebar">
        <nav style={{ flex: 1, padding: '1.5rem 0', overflowY: 'auto' }}>
          {getSidebarLinks().map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link 
                key={link.name} 
                to={link.path}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem',
                  fontWeight: 500,
                  color: isActive ? 'var(--accent-color)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--surface-color)' : 'transparent',
                  borderRight: isActive ? '4px solid var(--accent-color)' : '4px solid transparent'
                }}
                onMouseEnter={(e) => { 
                  if(!isActive) {
                    e.currentTarget.style.color = 'var(--accent-color)'; 
                    e.currentTarget.style.backgroundColor = 'var(--surface-color)';
                  }
                }}
                onMouseLeave={(e) => { 
                  if(!isActive) {
                    e.currentTarget.style.color = 'var(--text-secondary)'; 
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {link.icon}
                {link.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="portal-main">
        {/* Top Navbar */}
        <header className="portal-navbar" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div className="logo-container">
              <img src={logoUrl} alt="Logo" style={{ height: '52px', width: 'auto', objectFit: 'contain', display: 'block' }} onError={(e)=>{e.target.src="https://placehold.co/160x52?text=Logo"}} />
            </div>
          </div>

          <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            <h2 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 'bold' }}>{getPortalName()}</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, justifyContent: 'flex-end' }}>
            <button onClick={toggleTheme} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)' }}>
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div style={{ position: 'relative' }} ref={notificationsRef}>
              <button 
                onClick={() => setShowAnnouncements(!showAnnouncements)} 
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', position: 'relative' }}
              >
                <Bell size={20} />
                <span style={{ position: 'absolute', top: -4, right: -4, backgroundColor: '#ef4444', border: '2px solid var(--surface-color)', width: 10, height: 10, borderRadius: '50%' }}></span>
              </button>

              {showAnnouncements && (
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem',
                  width: '320px', backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)',
                  borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 100
                }}>
                  <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Notifications</h3>
                  </div>
                  <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                    {dummyAnnouncements.map(ann => (
                      <div key={ann.id} style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }} className="hover-elegant">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{ann.title}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--accent-color)', fontSize: '0.8rem', marginBottom: '0.5rem', fontWeight: 500 }}>
                          <span>{ann.date}</span> • <span>{ann.time}</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                          {ann.details}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
              <img src={user.profile_photo || "https://placehold.co/32x32"} style={{ width: '32px', height: '32px', borderRadius: '50px' }} alt="Profile" />
            </Link>
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--error-color)' }} title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="portal-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default PortalLayout;
