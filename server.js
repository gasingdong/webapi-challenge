const express = require('express');
const apiRouter = require('./api/apiRouter');

const server = express();

server.use('/api', apiRouter);

module.exports = server;
