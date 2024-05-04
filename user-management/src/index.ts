const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const createError = require('http-errors');

const studentAuthRouter = require('./app/route/studentAuthRoute');
const studentRouter = require('./app/route/studentRoute');
const teacherAuthRouter = require('./app/route/teacherAuthRoute');
const teacherRouter = require('./app/route/teacherRoute');
const adminRouter = require('./app/route/admin');
const reviewRouter = require('./app/route/review');
const commonRouter = require('./app/route/common');

const db = require('./config/db');
db.connect();
console.log(db.connect);


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(express.json());

app.use('/api/v1/auth', studentAuthRouter);
app.use('/api/v1/student', studentRouter);
app.use('/api/v1/auth-teacher', teacherAuthRouter);
app.use('/api/v1/teacher', teacherRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/commons', commonRouter);

// wrong api
app.all('*', 
    (res: any, req: { req: { originalUrl: any; }; }, next: (arg0: any) => any) => {
        return next(createError.NotFound(`Can't find ${req?.req?.originalUrl} on this server`));
});

// middleware that handling error
app.use(
    (err: { message: any; statusCode: number; status: string; }, req: any, res: { status: (arg0: any) => { (): any; new(): any; json: { (arg0: { success: boolean; status: any; message: any; }): void; new(): any; }; }; }, next: () => void) => {
    console.log(err.message)
    
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (!err.message) {
        console.log("next");
        next();
    }
    res.status(err.statusCode).json({
        success: false,
        status: err.status,
        message: err?.message,
    });
});


app.listen(4000, () => {
  console.log('Listenning on port 4000');
});

export {}
