const express = require('express');
const projectsRouter = require('./projects/projectsRouter');
const actionsRouter = require('./actions/actionsRouter');

const router = express.Router();

router.use('/projects', projectsRouter);
router.use('/actions', actionsRouter);

module.exports = router;
