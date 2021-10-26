const trainerController = require('../controllers/trainers')
const express = require('express');
const TrainerRouter = express.Router();

TrainerRouter.get('/',trainerController.getTrainers);

module.exports = TrainerRouter;