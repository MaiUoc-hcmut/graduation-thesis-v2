const Photo = require('../../config/firebase/photo');
const { firebaseConfig } = require('../../config/firebase/firebase');
const admin = require('firebase-admin');
const { ref, getDownloadURL, uploadBytesResumable, getStorage } = require('firebase/storage');
const { initializeApp } = require('firebase/app');

const Teacher = require('../models/teacher');
const createError = require('http-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SignToken = require('../../utils/jwt');
const transporter = require('../../utils/sendEmail');


initializeApp(firebaseConfig);
const storage = getStorage();


class TeacherController {
    getAllTeacher = async (req, res, next) => {
        try {
            const teachers = await Teacher.findAll();
            res.status(200).json(teachers);
        } catch (error) {
            console.log(error.message);
            res.status(400).json({ error: error.message });
        }
    }

    getTeacherById = async (req, res, next) => {
        try {
            const teacher = await Teacher.findOne({
                where: { id: req.params.id }
            })

            if (!teacher) return res.status(404).json({ message: "Teacher not found!" });

            res.status(200).json(teacher);
        } catch (error) {
            console.log(error.message);
            res.status(400).json(error.message);
        }
    }

    getTeacherByEmail = async (req, res, next) => {
        try {
            const teacher = await Teacher.findOne({
                where: { email: req.body.email }
            })

            if (!teacher) return res.status(404).json({ message: "Teacher not found!" });

            res.status(200).json(teacher);
        } catch (error) {
            console.log(error.message);
            res.status(400).json(error.message);
        }
    }

    updateTeacher = async (req, res, next) => {
        try {
            const teacher = Teacher.findOne({
                where: {
                    id: req.body.id
                }
            })
            if (!teacher) return res.status(404).send({ error: "Teacher not found!" });

            await teacher.update(req.body);
            res.status(200).send({
                updated: true,
                teacher
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    uploadAvatar = async (req, res, next) => {
        try {
            const teacherId = req.params.teacherId;
            if (req.teacher.dataValues.id !== teacherId) return res.status(401).json(createError.Unauthorized('You do not have permission to do this action!'));
            const teacher = await Teacher.findOne({
                where: {
                    id: teacherId
                }
            })

            if (!teacher) return res.status(404).json(createError.NotFound("teacher doesn't exist"));

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

            teacher.update({
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

            const verifyTeacher = jwt.verify(accessToken, accessTokenSecretKey);

            const teacher = Teacher.findOne({
                where: { id: verifyTeacher.id }
            });

            const verifyPassword = await bcrypt.compare(oldPassword, teacher.password);
            if (verifyPassword) {
                const hashPassword = await bcrypt.hash(newPassword, 12);
                await teacher.update({ password: hashPassword });
            }

            res.status(200).json({
                message: "Password updated!",
                teacher
            })

        } catch (error) {
            console.log(error.message);
        }
    }

    forgotPassword = async (req, res, next) => {
        // 1. Find teacher
        const teacher = await Teacher.findOne({
            where: { email: req.body.email }
        })

        if (!teacher) return res.status(404).json({ message: "Teacher not found!" });

        // 2. Generate reset token and store to database
        const resetToken = SignToken.generateResetToken();
        await teacher.update({
            resetToken,
            resetTokenExpiry: Date.now() + 900000
        })

        // 3. Send the link to reset the password to user's email
        const resetURL = `${req.protocol}://${req.get(
            'host'
        )}/api/v1/teacher/reset-password/${resetToken}`;
    
        const message = `<p>Quên mật khẩu của bạn? Nhập mật khẩu mới và xác nhận mật khẩu tại đường dẫn sau: ${resetURL}\n</p>`;

        try {
            await transporter.sendMail({
                from: 'Study365 system',
                to: teacher.email,
                subject: 'LINK TO RESET PASSWORD',
                html: message
            })

            res.status(200).json({
                resetToken
            })  
        } catch (error) {
            console.log(error.message);
            teacher.resetToken = undefined;
            teacher.resetTokenExpiry = undefined;
        }
    }

    resetPassword = async (req, res, next) => {
        try {
            const teacher = Teacher.findOne({
                where: {
                    resetToken: req.params.resetToken,
                    resetTokenExpiry: { $gt: Date.now() }
                }
            });
    
            if (!teacher) return res.status(400).json({ error: "Invalid or expired reset token!" });
    
            teacher.password = await bcrypt.hash(req.body.password, 12);
            teacher.resetToken = undefined;
            teacher.resetTokenExpiry = undefined;
    
            const accessToken = SignToken.signAccessToken(teacher.id);
            const refreshToken = SignToken.signRefreshToken(teacher.id);
    
            res.status(200).json({
                accessToken,
                refreshToken,
                teacher
            })
        } catch (error) {
            console.log(error.message);
        }
    }

}

module.exports = new TeacherController();