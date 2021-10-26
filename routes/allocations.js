const allocationController = require('../controllers/allocations')
const express = require('express');
const AllocationRouter = express.Router();

AllocationRouter.get('/',allocationController.getAllocations);

module.exports = AllocationRouter;