const express = require('express');
const cors = require('cors');
const apiRouter = require('./api/apiRouter');

const server = express();

server.use(cors());
server.use('/api', apiRouter);

module.exports = server;
