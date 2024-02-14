const Review = require('../../db/models/comment');
const Course = require('../../db/models/course');
const Exam = require('../../db/models/exam');

import { Request, Response, NextFunction } from "express";
const createError = require('http-errors');