const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });

  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    req.user = decoded; // Contains id and role
    next();
  });
};
const {
    getMetadata,
    getClassStudents,
    saveAttendance,
    getAttendanceDate,
    saveICA,
    getICAMarks,
    getStudentStats,
    getAllStudentStats,
    createAssignment,
    getAssignments
} = require('../controllers/academicController');

// Public route for signup dropdowns
router.get('/metadata', getMetadata);

// Protected routes
router.use(verifyToken);

router.get('/class/:subjectCode/:batchCode', getClassStudents);
router.post('/attendance', saveAttendance);
router.get('/attendance/:subjectId/:date', getAttendanceDate);
router.post('/ica', saveICA);
router.get('/ica/:subjectId', getICAMarks);
router.get('/student/attendance/all', getAllStudentStats);
router.get('/student/stats/:subjectCode/:batchCode', getStudentStats);
router.post('/assignment', createAssignment);
router.get('/assignment/:subjectId', getAssignments);

module.exports = router;
