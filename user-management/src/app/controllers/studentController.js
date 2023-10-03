const Photo = require('../../config/firebase/photo');
const { firebaseConfig } = require('../../config/firebase/firebase');
const admin = require('firebase-admin');
const { ref, getDownloadURL, uploadBytesResumable, getStorage } = require('firebase/storage');
const { initializeApp } = require('firebase/app');

const Student = require('../models/student');
const createError = require('http-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SignToken = require('../../utils/jwt');
const transporter = require('../../utils/sendEmail');


initializeApp(firebaseConfig);
const storage = getStorage();


class StudentController {
    getAllStudent = async (req, res, next) => {
        try {
            const students = await Student.findAll();
            res.status(200).json(students);
        } catch (error) {
            console.log(error.message);
            res.status(400).json({ error: error.message });
        }
    }

    getStudentById = async (req, res, next) => {
        try {
            const student = await Student.findOne({
                where: { id: req.params.studentId }
            })

            if (!student) return res.status(404).json({ message: "Student not found!" });

            res.status(200).json(student);
        } catch (error) {
            console.log(error.message);
            res.status(400).json(error.message);
        }
    }

    getStudentByEmail = async (req, res, next) => {
        try {
            const student = await Student.findOne({
                where: { email: req.body.email }
            })

            if (!student) return res.status(404).json({ message: "Student not found!" });

            res.status(200).json(student);
        } catch (error) {
            console.log(error.message);
            res.status(400).json(error.message);
        }
    }

    updateStudent = async (req, res, next) => {
        try {
            const studentId = req.params.studentId;

            if (studentId != req.student.dataValues.id)
                return res.status(401).json({ message: "You do not have permission to do this action!" });

            const student = await Student.findOne({
                where: { id: studentId }
            });

            await student.update(req.body);
            res.status(200).send({
                updated: true,
                student
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    uploadAvatar = async (req, res, next) => {
        try {
            const studentId = req.params.studentId;
            if (req.student.dataValues.id != studentId) 
                return res.status(401).json(createError.Unauthorized('You do not have permission to do this action!'));
            const student = await Student.findOne({
                where: {
                    id: studentId
                }
            })

            if (!student) return res.status(404).json(createError.NotFound("Student doesn't exist"));

            const dateTime = Photo.giveCurrentDateTime();

            const storageRef = ref(storage, `files/${req.file.originalname + "       " + dateTime}`);

            // Create file metadata including the content type
            const metadata = {
                contentType: req.file.mimetype,
            };

            // Upload the file in the bucket storage
            const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);
            //by using uploadBytesResumable we can control the progress of uploading like pause, resume, cancel

            // Grab the public url
            const downloadURL = await getDownloadURL(snapshot.ref);

            student.update({
                avatar: downloadURL
            })

            res.status(200).json({
                avatar: downloadURL
            })
            
        } catch (error) {
            console.log(error.message);
            res.json(error.message);
        }
    }

    changePassword = async (req, res, next) => {
        try {
            const { oldPassword, newPassword, confirmPassword } = req.body;
            if (newPassword !== confirmPassword) return res.status(400).json({ message: 'Your new password does not match!' });

            const accessToken = req.headers.authorization;
            const accessTokenSecretKey = process.env.ACCESS_TOKEN_SECRET;

            const verifyStudent = jwt.verify(accessToken, accessTokenSecretKey);

            const student = Student.findOne({
                where: { id: verifyStudent.id }
            });

            const verifyPassword = await bcrypt.compare(oldPassword, student.password);
            if (verifyPassword) {
                const hashPassword = await bcrypt.hash(newPassword, 12);
                await student.update({ password: hashPassword });
            }

            res.status(200).json({
                message: "Password updated!",
                student
            })

        } catch (error) {
            console.log(error.message);
        }
    }

    forgotPassword = async (req, res, next) => {
        // 1. Find student
        const student = await Student.findOne({
            where: { email: req.body.email }
        })

        if (!student) return res.status(404).json({ message: "Student not found!" });

        // 2. Generate reset token and store to database
        const resetToken = SignToken.generateResetToken();
        await student.update({
            resetToken,
            resetTokenExpiry: Date.now() + 900000
        })

        // 3. Send the link to reset the password to user's email
        const resetURL = `${req.protocol}://${req.get(
            'host'
        )}/api/v1/student/reset-password/${resetToken}`;
    
        const message = `<p>Quên mật khẩu của bạn? Nhập mật khẩu mới và xác nhận mật khẩu tại đường dẫn sau: ${resetURL}\n</p>`;

        try {
            await transporter.sendMail({
                from: 'Study365 system',
                to: student.email,
                subject: 'LINK TO RESET PASSWORD',
                html: message
            })

            res.status(200).json({
                resetToken
            })  
        } catch (error) {
            console.log(error.message);
            student.resetToken = undefined;
            student.resetTokenExpiry = undefined;
        }
    }

    resetPassword = async (req, res, next) => {
        try {
            const student = Student.findOne({
                where: {
                    resetToken: req.params.resetToken,
                    resetTokenExpiry: { $gt: Date.now() }
                }
            });
    
            if (!student) return res.status(400).json({ error: "Invalid or expired reset token!" });
    
            student.password = await bcrypt.hash(req.body.password, 12);
            student.resetToken = undefined;
            student.resetTokenExpiry = undefined;
    
            const accessToken = SignToken.signAccessToken(student.id);
            const refreshToken = SignToken.signRefreshToken(student.id);
    
            res.status(200).json({
                accessToken,
                refreshToken,
                student
            })
        } catch (error) {
            console.log(error.message);
        }
    }

}

module.exports = new StudentController();