import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layouts
import PortalLayout from './layouts/PortalLayout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import SubjectDetails from './pages/SubjectDetails';
import AttendanceTracker from './pages/AttendanceTracker';
import ExamResults from './pages/ExamResults';
import AcademicCalendar from './pages/Calendar';
import Fees from './pages/Fees';
import HelpDesk from './pages/HelpDesk';
import MyClasses from './pages/MyClasses';
import LORTracker from './pages/LORTracker';
import AdminManage from './pages/AdminManage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Landing page — shown at root for unauthenticated users */}
            <Route path="/" element={<Landing />} />

            {/* Auth pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Portal — authenticated app */}
            <Route path="/dashboard" element={<PortalLayout />}>
              <Route index element={<Dashboard />} />
            </Route>
            <Route path="/" element={<PortalLayout />}>
              <Route path="profile" element={<Profile />} />
              <Route path="subject/:id" element={<SubjectDetails />} />
              <Route path="attendance" element={<AttendanceTracker />} />
              <Route path="results" element={<ExamResults />} />
              <Route path="calendar" element={<AcademicCalendar />} />
              <Route path="fees" element={<Fees />} />
              <Route path="helpdesk" element={<HelpDesk />} />
              <Route path="classes" element={<MyClasses />} />
              <Route path="lor" element={<LORTracker />} />
              <Route path="admin/*" element={<AdminManage />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

