import supertest from 'supertest';
const app = require('../index');

describe('teacher', () => {
    describe('get list teacher', () => {
        it('should return a list of teacher', async () => {
            await supertest(app).get('/page/1').expect([]);
        });
    });
});