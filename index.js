const morgan = require('morgan');
const express = require('express');
const app = express();
require('dotenv').config({ path: './config.env' });
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controlllers/error')
// Logger
app.use(morgan('dev'));
// BodyParser
app.use(express.json({limit: '10kb'}))

app.use('/api/v1/users', userRouter)

app.get('/', (req, res, next) => {
  res.send('SHIT IS WORKING...');
});

// 404 error handler
app.all('*', (req, res, next) => {
  next(new AppError(`Sorry, ${req.originalUrl} is not found on this server`, 404))
})

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
