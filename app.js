const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./utils/config');

const app = express();

const notesRouter = require('./controllers/notes');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');

mongoose.set('strictQuery', false);

const url = config.MONGODB_URL;

logger.info('connecting to MongoDB');

mongoose.connect(url)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/notes', notesRouter);

app.use(middleware.unknownEndpoint);
// this has to be the last loaded middleware
app.use(middleware.errorHandler);

module.exports = app;
