const appssController = require('../controllers/apps')
const express = require('express');
const AppsRouter = express.Router();

AppsRouter.get('/',appssController.getApps);

module.exports = AppsRouter;