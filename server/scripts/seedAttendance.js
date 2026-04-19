require('dotenv').config();
const mongoose = require('mongoose');

const Subject = require('../models/Subject');
const User = require('../models/User');
const Attendance = require('../models/Attendance');

const seedAttendance = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
        await mongoose.connect(mongoUri, { dbName: 'college-portal' });
        console.log('Connected to MongoDB.');

        // Clear existing attendance
        await Attendance.deleteMany({});
        console.log('Cleared existing attendance data.');

        const subjects = await Subject.find();
        let totalCount = 0;

        for (const subject of subjects) {
            // Find the teacher that teaches this exact subject
            // Teacher's username was teacher_<subject.name> in seed
            const teacher = await User.findOne({ role: 'teacher', username: `teacher_${subject.name}` }) 
                         || await User.findOne({ role: 'teacher', taught_subjects: subject._id });

            if (!teacher) continue;

            const students = await User.find({ role: 'student', class_id: subject.class_id });
            if (students.length === 0) continue;

            // Generate dates from March 1, 2026 to March 31, 2026
            const startDate = new Date('2026-03-01T00:00:00Z');
            const endDate = new Date('2026-03-31T00:00:00Z');

            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                // Skip weekends (0 = Sunday, 6 = Saturday)
                if (d.getDay() === 0 || d.getDay() === 6) continue;

                const records = students.map(student => {
                    // Random attendance (85% chance of being present)
                    const isPresent = Math.random() < 0.85;
                    return {
                        student_id: student._id,
                        status: isPresent ? 'Present' : 'Absent'
                    };
                });

                const newAttendance = new Attendance({
                    subject_id: subject._id,
                    date: new Date(d).toISOString().split('T')[0],
                    teacher_id: teacher._id,
                    records: records
                });

                await newAttendance.save();
                totalCount++;
            }
        }

        console.log(`Successfully seeded ${totalCount} attendance documents across all classes in March 2026.`);
        process.exit(0);

    } catch (error) {
        console.error('Error seeding attendance:', error);
        process.exit(1);
    }
};

seedAttendance();
