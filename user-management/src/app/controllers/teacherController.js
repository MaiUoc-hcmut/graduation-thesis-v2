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

const axios = require('axios');
require('dotenv').config();

initializeApp(firebaseConfig);
const storage = getStorage();


class TeacherController {

    getAllTeacher = async (_req, res, _next) => {
        try {
            const teachers = await Teacher.findAll();
            res.status(200).json(teachers);
        } catch (error) {
            console.log(error.message);
            res.status(400).json({ error: error.message });
        }
    }

    getTeacherById = async (req, res, _next) => {
        try {
            const id_teacher = req.params.teacherId;
            const teacher = await Teacher.findByPk(id_teacher);

            if (!teacher) return res.status(404).json({ message: "Teacher not found!" });

            res.status(200).json(teacher);
        } catch (error) {
            console.log(error.message);
            res.status(400).json(error.message);
        }
    }

    getFilteredTeacher = async (req, res, _next) => {
        try {
            const categories = [];

            const { class: _class, subject } = req.query;

            if (!_class) {
                
            } else if (Array.isArray(_class)) {
                categories.push(..._class)
            } else {
                categories.push(_class)
            }

            if (!subject) {

            } else if (Array.isArray(subject)) {
                categories.push(...subject)
            } else {
                categories.push(subject)
            }

            const currentPage = +req.params.page;
            
            const pageSize = parseInt(process.env.SIZE_OF_PAGE || '10');

            const queryOption = {
                include: [
                    {
                        model: Category,
                        through: {
                            attributes: [],
                        },
                    },
                ],
                group: ['Teacher.id']
            }

            if (categories.length > 0) {
                queryOption.include[0].where = {
                    id: {
                        [Op.in]: categories,
                    },
                }
                queryOption.having = sequelize.literal("COUNT(DISTINCT "+`Categories`+"."+`id`+`) = ${categories.length}`)
            }

            const count = await Teacher.count({
                ...queryOption,
                distinct: true
            });

            const teachers = await Teacher.findAll({
                ...queryOption,
                limit: pageSize,
                offset: pageSize * (currentPage - 1),
                subQuery: false
            });

            const response = [];

            for (const teacher of teachers) {
                const courseServiceInformation = await axios.get(`${process.env.BASE_URL_COURSE_LOCAL}/informations/teacher/${teacher.id}`);
                const examServiceInformation = await axios.get(`${process.env.BASE_URL_EXAM_LOCAL}/informations/teacher/${teacher.id}`);

                response.push({
                    ...teacher.dataValues,
                    ...courseServiceInformation.data,
                    exam_quantity: examServiceInformation.data
                });
            }

            res.status(200).json({
                count,
                response
            });
        } catch (error) {
            console.log(error.message);
            res.status(500).json({
                error,
                message: error.message
            });
        }
    }

    getProfileTeacher = async (req, res, _next) => {
        try {
            const id_teacher = req.params.teacherId;
            const teacher = await Teacher.findByPk(id_teacher);

            if (!teacher) return res.status(404).json({ message: "Teacher not found!" });

            const courseServiceInformation = await axios.get(`${process.env.BASE_URL_COURSE_LOCAL}/informations/teacher/${id_teacher}`);
            const examServiceInformation = await axios.get(`${process.env.BASE_URL_EXAM_LOCAL}/informations/teacher/${id_teacher}`);

            const response = {
                ...teacher.dataValues,
                ...courseServiceInformation.data,
                exam_quantity: examServiceInformation.data
            }

            res.status(200).json(response);
        } catch (error) {
            console.log(error.message);
            res.status(400).json(error.message);
        }
    }

    getTeacherByEmail = async (req, res, _next) => {
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

    updateTeacher = async (req, res, _next) => {
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

    uploadAvatar = async (req, res, _next) => {
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

    changePassword = async (req, res, _next) => {
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

    forgotPassword = async (req, res, _next) => {
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
    
        const message = `<p>Nhập mật khẩu mới và xác nhận mật khẩu tại đường dẫn sau: ${resetURL}\n</p>`;

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

    resetPassword = async (req, res, _next) => {
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