const Student = require('../models/student');
const Teacher = require('../models/teacher');
const createError = require('http-errors');
const SignToken = require('../../utils/jwt');
const bcrypt = require('bcryptjs');

const axios = require('axios');

class Auth {
    registerStudent = async (req, res, next) => {
        try {
            const { email, password, confirmPassword, name, grade, gender, address } = req.body;
            const existedStudent = await Student.findOne({
                where: { email: email }
            });
            if (existedStudent) return res.send(createError.Conflict("The email already exist!"));
            if (password !== confirmPassword) return res.send(createError.BadRequest("Password does not match!"));
            const hashPassword = await bcrypt.hash(password, 12);
            const newStudent = await Student.create({
                email,
                password: hashPassword,
                name,
                grade,
                gender,
                address
            })

            const accessToken = SignToken.signAccessToken(newStudent.id);
            const refreshToken = SignToken.signRefreshToken(newStudent.id);

            const cart = await axios.post(`${process.env.BASE_URL_PAYMENT_LOCAL}/cart`, {
                id_user: newStudent.id
            });

            res.status(201).send({
                student: newStudent,
                accessToken,
                refreshToken
            })

        } catch (error) {
            if (error?.code === 11000) {
                return next(createError.BadRequest('Email already exists'));
            }
            console.log(error.message)
            return next(createError.InternalServerError('Server error'));
        }
    }

    registerTeacher = async (req, res, next) => {
        try {
            const { name, email, password, confirmPassword, grade, gender, address, subject, phone } = req.body;
            const existedTeacher = await Teacher.findOne({
                where: { email: email }
            });
            if (existedTeacher) return res.send(createError.Conflict("The email already exist!"));
            if (password !== confirmPassword) return res.send(createError.BadRequest("Password does not match!"));
            const hashPassword = await bcrypt.hash(password, 12);
            const newTeacher = await Teacher.create({
                email,
                password: hashPassword,
                name,
                grade,
                gender,
                address,
                subject,
                phone,
                biostory: '',
                degree: 'bachelor'
            })

            console.log(newTeacher.id);

            const accessToken = SignToken.signAccessToken(newTeacher.id);
            const refreshToken = SignToken.signRefreshToken(newTeacher.id);

            res.status(201).send({
                teacher: newTeacher,
                accessToken,
                refreshToken
            })

        } catch (error) {
            if (error?.code === 11000) {
                return next(createError.BadRequest('Email already exists'));
            }
            console.log(error.message)
            return next(createError.InternalServerError('Server error'));
        }
    }

    loginStudent = async (req, res, next) => {
        try {
            const accessToken = SignToken.signAccessToken(req.student.id);
            const refreshToken = SignToken.signRefreshToken(req.student.id);

            const student = req.student.dataValues;
            const user = {
                ...student,
                role: "student"
            }

            res.status(200).json({
                success: true,
                accessToken,
                refreshToken,
                user
            });
        } catch (error) {
            console.log(error?.message);
            res.status(500).json({
                error,
                message: error.message
            })
        }
    }

    loginTeacher = async (req, res, next) => {
        try {
            const accessToken = SignToken.signAccessToken(req.teacher.id);
            const refreshToken = SignToken.signRefreshToken(req.teacher.id);

            const teacher = req.teacher.dataValues;
            const user = {
                ...teacher,
                role: "teacher"
            }

            res.status(200).json({
                success: true,
                accessToken,
                refreshToken,
                user
            });
        } catch (error) {
            console.log(error?.message);
            res.status(500).json({ error })
        }
    }

    refreshToken = async (req, res, next) => {
        try {
            const { parsedRefreshToken } = req.body;
            if (!parsedRefreshToken) return next(createError.BadRequest('Refresh token are required'));
            const id = await SignToken.verifyRefreshToken(parsedRefreshToken);
            const accessToken = SignToken.signAccessToken(id);
            const refToken = SignToken.signRefreshToken(id);
            res.status(200).json({
                success: true,
                accessToken,
                refreshToken: refToken,
            });
        } catch (error) {
            console.log(error.message);
        }
    }
}

module.exports = new Auth();