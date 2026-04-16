require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Course = require('../models/Course');
const Class = require('../models/Class');
const Subject = require('../models/Subject');
const User = require('../models/User');
const Announcement = require('../models/Announcement');
const Ticket = require('../models/Ticket');
const ICA = require('../models/ICA');
const Attendance = require('../models/Attendance');
const Assignment = require('../models/Assignment');

// User specs
// Course: BTECH CE, IT, AI and MBA Tech CE, IT, DS, AI.
const courseNames = [
  'BTECH CE', 'BTECH IT', 'BTECH AI', 'MBA Tech CE', 'MBA Tech IT', 'MBA Tech DS', 'MBA Tech AI'
];

// Classes spec
const classMapping = {
  'BTECH CE': ['A1', 'A2'],
  'BTECH IT': ['B1', 'B2'],
  'BTECH AI': ['C1', 'C2'],
  'MBA Tech CE': ['D1', 'D2'],
  'MBA Tech IT': ['E1', 'E2'],
  'MBA Tech DS': ['F1', 'F2'],
  'MBA Tech AI': ['G1', 'G2'],
};

// Subjects from Timetable
const subjectCodes = ["CVT", "COA", "TCS", "MPMC", "WP", "DAA", "DBMS", "MAE", "OOPJ"];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student-portal', {
            dbName: process.env.DB_NAME || 'college-portal'
        });
        console.log('Connected to MongoDB');

        // Clear existing data (optional, but good for pure seed)
        await Course.deleteMany({});
        await Class.deleteMany({});
        await Subject.deleteMany({});
        await User.deleteMany({});
        await Announcement.deleteMany({});
        await Ticket.deleteMany({});
        await ICA.deleteMany({});
        await Attendance.deleteMany({});
        await Assignment.deleteMany({});
        
        console.log('Cleared existing data.');

        // 1. Create Courses
        const courses = [];
        for (const c of courseNames) {
            const newCourse = await Course.create({ name: c, duration_years: 4 });
            courses.push(newCourse);
        }
        
        // 2. Create Classes
        const classes = [];
        for (const course of courses) {
            const classList = classMapping[course.name];
            for (const cls of classList) {
                const newClass = await Class.create({ 
                    name: cls, 
                    course_id: course._id, 
                    semester: 4 
                });
                classes.push({ ...newClass._doc, courseName: course.name });
            }
        }

        // 3. Create Teachers & Subjects
        const passwordHash = await bcrypt.hash('password123', 10);
        
        const teacherMap = {}; // mapping subjectCode -> teacher_id
        for (const sub of subjectCodes) {
            const teacher = await User.create({
                username: `teacher_${sub.toLowerCase()}`,
                email: `teacher_${sub.toLowerCase()}@portal.com`,
                password: passwordHash,
                role: 'teacher',
                faculty_id: `FAC-${sub}`,
                profile_photo: `https://ui-avatars.com/api/?name=Teacher+${sub}`
            });
            teacherMap[sub] = teacher._id;
        }

        // Admins
        for(let i=1; i<=5; i++) {
            await User.create({
                username: `admin${i}`,
                email: `admin${i}@portal.com`,
                password: passwordHash,
                role: 'admin',
                admin_id: `ADM-00${i}`,
                profile_photo: `https://ui-avatars.com/api/?name=Admin+${i}`
            });
        }

        // Create Subjects for each class and update teacher's taught_subjects
        for (const cls of classes) {
            // Assign subjects to this class
            for (const sub of subjectCodes) {
                const newSub = await Subject.create({
                    name: sub,
                    class_id: cls._id,
                    teacher_id: teacherMap[sub],
                    credits: 3
                });
                // Link taught subject to Teacher profile
                await User.findByIdAndUpdate(teacherMap[sub], {
                    $addToSet: { taught_subjects: newSub._id }
                });
            }
        }

        // Add course context to teachers (assuming they just teach the first generic course for demo purposes)
        for (const sub of subjectCodes) {
             await User.findByIdAndUpdate(teacherMap[sub], {
                 course_id: courses[0]._id
             });
        }

        // 4. Create Students (Random assignment)
        for (let i = 1; i <= 50; i++) {
            // Pick random class
            const randomClass = classes[Math.floor(Math.random() * classes.length)];
            const courseObj = courses.find(c => c.name === randomClass.courseName);

            await User.create({
                username: `student${i}`,
                email: `student${i}@portal.com`,
                password: passwordHash,
                role: 'student',
                roll_no: `ROLL-${randomClass.name}-${i}`,
                course_id: courseObj._id,
                class_id: randomClass._id,
                profile_photo: `https://ui-avatars.com/api/?name=Student+${i}`
            });
        }

        // 5. Create Announcements
        await Announcement.create([
            {
               title: "Upcoming Spring Hackathon 2026",
               message: "Get ready for the 48-hour coding sprint. Registration closes this Friday!",
               author_id: teacherMap['OOPJ'], // Generic owner
            },
            {
                title: "Guest IT Seminar",
                message: "Industry experts will be discussing AI integration in modern stacks next Thursday in Hall B.",
                author_id: teacherMap['CVT'],
            }
        ]);

        console.log('Database seeded successfully!');
        
        // Output test users
        console.log('\n--- Test Accounts (Password: password123) ---');
        console.log('Teacher: teacher_oopj@portal.com');
        console.log(`Student: student1@portal.com`);
        console.log('Admin: admin1@portal.com');
        
        process.exit(0);
    } catch (err) {
        console.error('Seed Error:', err);
        process.exit(1);
    }
};

seedDatabase();
