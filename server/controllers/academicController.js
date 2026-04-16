const Course = require('../models/Course');
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const ICA = require('../models/ICA');
const Assignment = require('../models/Assignment');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// @desc    Get metadata for dropdowns (Courses, Classes, Subjects)
// @route   GET /api/academic/metadata
// @access  Public
exports.getMetadata = async (req, res) => {
    try {
        const courses = await Course.find();
        const classes = await Class.find().populate('course_id');
        const subjects = await Subject.find().populate('class_id');

        res.json({ success: true, courses, classes, subjects });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error fetching metadata' });
    }
};

// @desc    Get students for a specific subject and batch
// @route   GET /api/academic/class/:subjectCode/:batchCode
// @access  Private (Teacher)
exports.getClassStudents = async (req, res) => {
    try {
        const { subjectCode, batchCode } = req.params;
        
        // Find class by batchCode
        const targetClass = await Class.findOne({ name: batchCode });
        if (!targetClass) return res.status(404).json({ success: false, message: 'Class not found' });
        
        // Find subject mapped to this class
        const targetSubject = await Subject.findOne({ name: subjectCode, class_id: targetClass._id });
        if (!targetSubject) return res.status(404).json({ success: false, message: 'Subject not found for this class' });

        // Find students in this class
        const students = await User.find({ class_id: targetClass._id, role: 'student' }).select('-password');
        
        res.json({ success: true, class: targetClass, subject: targetSubject, students });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Save/Update Attendance
// @route   POST /api/academic/attendance
// @access  Private (Teacher)
exports.saveAttendance = async (req, res) => {
    try {
        const { subject_id, date, records } = req.body;
        
        // Format date strictly to YYYY-MM-DD to avoid timezone duplicate issues
        const formattedDate = new Date(date).toISOString().split('T')[0];
        
        let attendance = await Attendance.findOne({ 
            subject_id, 
            teacher_id: req.user.id,
            date: new Date(formattedDate)
        });

        if (attendance) {
            // Update existing
            attendance.records = records;
            await attendance.save();
        } else {
            // Create new
            attendance = await Attendance.create({
                subject_id,
                date: new Date(formattedDate),
                teacher_id: req.user.id,
                records
            });
        }

        res.json({ success: true, attendance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to save attendance' });
    }
};

// @desc    Get Attendance for a specific date
// @route   GET /api/academic/attendance/:subjectId/:date
// @access  Private (Teacher)
exports.getAttendanceDate = async (req, res) => {
    try {
        const { subjectId, date } = req.params;
        const formattedDate = new Date(date).toISOString().split('T')[0];
        
        const attendance = await Attendance.findOne({ 
            subject_id: subjectId, 
            date: new Date(formattedDate)
        });
        
        res.json({ success: true, attendance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};


// @desc    Save/Update ICA Marks for a single student
// @route   POST /api/academic/ica
// @access  Private (Teacher)
exports.saveICA = async (req, res) => {
    try {
        const { subject_id, student_id, m1, m2, assessment } = req.body;
        
        let ica = await ICA.findOne({ subject_id, student_id });
        if (ica) {
            ica.marks = { m1, m2, assessment };
            await ica.save();
        } else {
            ica = await ICA.create({
                subject_id,
                student_id,
                teacher_id: req.user.id,
                marks: { m1, m2, assessment }
            });
        }
        res.json({ success: true, ica });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to save ICA marks' });
    }
};

// @desc    Get all ICA records for a subject class
// @route   GET /api/academic/ica/:subjectId
// @access  Private (Teacher)
exports.getICAMarks = async (req, res) => {
    try {
        const icas = await ICA.find({ subject_id: req.params.subjectId });
        res.json({ success: true, icas });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get specific student stats for UI rendering
// @route   GET /api/academic/student/stats/:subjectCode/:batchCode
// @access  Private (Student)
exports.getStudentStats = async (req, res) => {
    try {
        const { subjectCode, batchCode } = req.params;
        const targetClass = await Class.findOne({ name: batchCode });
        if(!targetClass) return res.status(404).json({ success: false, message: 'Class not found' });
        
        const targetSubject = await Subject.findOne({ name: subjectCode, class_id: targetClass._id });
        if(!targetSubject) return res.status(404).json({ success: false, message: 'Subject not found' });

        // Calculate attendance stats
        const allAttendances = await Attendance.find({ subject_id: targetSubject._id });
        const totalConducted = allAttendances.length;
        let totalAttended = 0;
        
        for (const att of allAttendances) {
            // Check if student was marked present
            const record = att.records.find(r => r.student_id.toString() === req.user.id.toString());
            if (record && record.status === 'Present') {
                totalAttended += 1;
            }
        }
        
        // Fetch ICA marks
        const ica = await ICA.findOne({ subject_id: targetSubject._id, student_id: req.user.id });
        
        res.json({ 
            success: true, 
            subject: targetSubject,
             stats: {
                 attendance: {
                     totalConducted,
                     totalAttended,
                     percentage: totalConducted > 0 ? Math.round((totalAttended/totalConducted)*100) : 0
                 },
                 ica: ica || { marks: { m1: 0, m2: 0, assessment: 0 }, total: 0 }
             }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get grouped aggregate attendance for all subjects
// @route   GET /api/academic/student/attendance/all
// @access  Private (Student)
exports.getAllStudentStats = async (req, res) => {
    try {
        const student = await User.findById(req.user.id);
        if (!student || !student.class_id) {
             return res.json({ success: true, stats: [] });
        }

        const allSubjects = await Subject.find({ class_id: student.class_id });
        const statsRaw = [];

        for (const sub of allSubjects) {
            const allAtt = await Attendance.find({ subject_id: sub._id });
            let totalConducted = allAtt.length;
            let totalAttended = 0;

            for (const att of allAtt) {
                const record = att.records.find(r => r.student_id.toString() === req.user.id.toString());
                if (record && record.status === 'Present') {
                    totalAttended++;
                }
            }

            statsRaw.push({
                subject: sub.name,
                attended: totalAttended,
                total: totalConducted
            });
        }

        // Group explicitly by Subject name as requested by User
        const clubbedStats = {};
        for (let s of statsRaw) {
            if (!clubbedStats[s.subject]) {
                clubbedStats[s.subject] = { subject: s.subject, attended: 0, total: 0 };
            }
            clubbedStats[s.subject].attended += s.attended;
            clubbedStats[s.subject].total += s.total;
        }

        const finalStats = Object.values(clubbedStats).map(c => {
            const percentage = c.total > 0 ? Math.round((c.attended / c.total) * 100) : 0;
            return {
                ...c,
                percentage,
                status: percentage >= 75 ? 'Good' : 'Warning'
            };
        });

        res.json({ success: true, stats: finalStats });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error fetching aggregated stats' });
    }
};


// @desc    Create a new assignment
// @route   POST /api/academic/assignment
// @access  Private (Teacher)
exports.createAssignment = async (req, res) => {
    try {
        const { subject_id, title, description, due_date, base64File } = req.body;
        
        let question_file_url = '';
        if (base64File) {
            const uploadResponse = await cloudinary.uploader.upload(base64File, {
                folder: 'academic_portal/assignments',
                resource_type: 'auto'
            });
            question_file_url = uploadResponse.secure_url;
        }

        const assignment = await Assignment.create({
            subject_id,
            teacher_id: req.user.id,
            title,
            description,
            due_date: due_date ? new Date(due_date) : undefined,
            question_file_url
        });

        res.json({ success: true, assignment });
    } catch (error) {
        console.error('Error creating assignment', error);
        res.status(500).json({ success: false, message: 'Server Error creating assignment' });
    }
};

// @desc    Get assignments for a subject
// @route   GET /api/academic/assignment/:subjectId
// @access  Private (Teacher & Student)
exports.getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({ subject_id: req.params.subjectId }).sort({ createdAt: -1 });
        res.json({ success: true, assignments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error fetching assignments' });
    }
};
