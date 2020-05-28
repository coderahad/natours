const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, Please try again in an hour.'
});
app.use('/api', limiter);

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  // req.requestTime =new Date().toISOString();
  req.requestTime = new Date().toUTCString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(`Couldn't find ${req.originalUrl} on this server `);
  // err.statusCode = 404;
  // err.status = 'Fail';
  // res.status(404).json({
  //   status: 'Fail',
  //   message: `Couldn't find ${req.originalUrl} on this server `
  // });
  next(new AppError(`Couldn't find ${req.originalUrl} on this server `, 404));
});

app.use(globalErrorHandler);
module.exports = app;
