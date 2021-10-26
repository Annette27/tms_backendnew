const coursesController = require('../controllers/courses')
const express = require('express');
const CoursesRouter = express.Router();

CoursesRouter.get('/',coursesController.getCourses);

module.exports = CoursesRouter;