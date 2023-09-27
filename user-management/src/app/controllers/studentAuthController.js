const Student = require('../models/student');
const createError = require('http-errors');
const SignToken = require('../../utils/jwt');
const bcrypt = require('bcryptjs');

class Auth {
    register = async (req, res, next) => {
        try {
            const { email, password, confirmPassword, name, grade, gender, address } = req.body;
            const existedStudent = await Student.findOne({
                where: { email: email }
            });
            if (existedStudent) return res.send(createError.Conflict("The email already exist!"));
            console.log(password);
            console.log(confirmPassword);
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

    login = async (req, res, next) => {
        try {
            const accessToken = SignToken.signAccessToken(req.user.dataValues.id);
            const refreshToken = SignToken.signRefreshToken(req.user.dataValues.id);

            res.status(200).json({
                success: true,
                accessToken,
                refreshToken,
                user: req.user.dataValues
            });
        } catch (error) {
            console.log(error?.message);
        }
    }

    refreshToken = async (req, res, next) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) return next(createError.BadRequest('Refresh token are required'));
            const id = await SignToken.verifyRefreshToken(refreshToken);
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