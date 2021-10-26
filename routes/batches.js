const batchesController = require('../controllers/batches')
const express = require('express');
const BatchesRouter = express.Router();

BatchesRouter.get('/',batchesController.getBatches);

module.exports = BatchesRouter;