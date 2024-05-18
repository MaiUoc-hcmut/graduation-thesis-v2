import supertest from 'supertest';
const createServer = require('../utils/server');
const app = createServer();
const SignToken = require('../utils/jwt.js');

const base_endpoint = '/api/v1/student';
const base_endpoint_auth = '/api/v1/auth';

const valid_student_id = "1ed5da0d-1b66-4772-9181-1890ef17c5ef";

describe('register student', () => {
    it('should success', async () => {
        const response = await supertest(app).post(`${base_endpoint_auth}/register`).send({
            name: "Mai Nguyen Uoc",
            email: "test102@gmail.com",
            password: "12345678",
            confirmPassword: "12345678",
            gender: "nam",
            address: "Ky Anh, Ha Tinh",
            grade: 10,
            phone: "0987654321"
        });

        expect(response.status).toBe(201);
    });

    it('miss information, should fail to register', async () => {
        const response = await supertest(app).post(`${base_endpoint_auth}/register`).send({
            name: "Mai Nguyen Uoc",
            password: "12345678",
            confirmPassword: "12345678",
            gender: "nam",
            address: "Ky Anh, Ha Tinh",
            phone: "0987654321"
        });

        expect(response.status).toBe(400 || 500);
    });
});

describe('login student', () => {
    it('all information are correct, should success', async () => {
        const response = await supertest(app).post(`${base_endpoint_auth}/login`).send({
            email: "test101@gmail.com",
            password: "12345678"
        });

        expect(response.status).toBe(200);

        expect(response.body).toHaveProperty('accessToken');
        expect(response.body).toHaveProperty('refreshToken');
        expect(response.body).toHaveProperty('user');

        expect(typeof response.body.accessToken).toBe('string');
        expect(typeof response.body.refreshToken).toBe('string');
        expect(response.body.user).toBeInstanceOf(Object);
    });

    it('wrong credential, should fail', async () => {
        const response = await supertest(app).post(`${base_endpoint_auth}/login`).send({
            email: "test10@gmail.com",
            password: "12345678"
        });

        expect(response.status).toBe(400);
    });
});

describe('get list student', () => {
    it('should return a list of teacher', async () => {
        const response = await supertest(app).get(`${base_endpoint}/page/1`);

        expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object);

        expect(response.body).toHaveProperty('count');
        expect(response.body).toHaveProperty('students');

        expect(typeof response.body.count).toBe('number');
        expect(Array.isArray(response.body.students)).toBe(true);

        expect(response.body.count).toBe(response.body.students.length);
    });
});


describe('change password student', () => {
    it('all information are correct', async () => {
        const id = valid_student_id;
        const token = SignToken.signAccessToken(id);
        const response = await supertest(app).put(`${base_endpoint}/change-password`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                data: {
                    oldPassword: "12345678",
                    newPassword: "12345678",
                    confirmPassword: "12345678"
                }
            });

        expect(response.status).toBe(200);
    });

    it('miss access token', async () => {
        const id = '6af324c7-e933-4952-be37-e6532669d8a7';
        const token = SignToken.signAccessToken(id);
        const response = await supertest(app).put(`${base_endpoint}/change-password`)
            .send({
                data: {
                    oldPassword: "12345678",
                    newPassword: "123456789",
                    confirmPassword: "123456789"
                }
            });

        expect(response.status).toBe(401);
    })

    it('wrong old password', async () => {
        const id = '6af324c7-e933-4952-be37-e6532669d8a7';
        const token = SignToken.signAccessToken(id);
        const response = await supertest(app).put(`${base_endpoint}/change-password`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                data: {
                    oldPassword: "1278",
                    newPassword: "12345678",
                    confirmPassword: "12345678"
                }
            });

        expect(response.status).toBe(401);
    })
})


