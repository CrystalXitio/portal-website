require('dotenv').config();
const mongoose = require('mongoose');

const Subject = require('../models/Subject');
const User = require('../models/User');
const ICA = require('../models/ICA');

const seedICA = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
        await mongoose.connect(mongoUri, { dbName: 'college-portal' });
        console.log('Connected to MongoDB.');

        // Clear existing ICA records
        await ICA.deleteMany({});
        console.log('Cleared existing ICA marks data.');

        const subjects = await Subject.find();
        let totalCount = 0;

        for (const subject of subjects) {
            // Find the teacher that teaches this exact subject
            const teacher = await User.findOne({ role: 'teacher', username: `teacher_${subject.name}` }) 
                         || await User.findOne({ role: 'teacher', taught_subjects: subject._id });

            if (!teacher) continue;

            const students = await User.find({ role: 'student', class_id: subject.class_id });
            if (students.length === 0) continue;

            for (const student of students) {
                // Generate realistic marks
                // M1 out of 10 (range: 5-10)
                const m1 = Math.floor(Math.random() * 6) + 5; 
                // M2 out of 10 (range: 5-10)
                const m2 = Math.floor(Math.random() * 6) + 5; 
                // Assessment out of 30 (range: 15-30)
                const assessment = Math.floor(Math.random() * 16) + 15;

                const newICA = new ICA({
                    subject_id: subject._id,
                    student_id: student._id,
                    teacher_id: teacher._id,
                    marks: { m1, m2, assessment }
                });

                await newICA.save();
                totalCount++;
            }
        }

        console.log(`Successfully seeded ${totalCount} ICA documents across all classes.`);
        process.exit(0);

    } catch (error) {
        console.error('Error seeding ICA marks:', error);
        process.exit(1);
    }
};

seedICA();
