const User = require('../models/userModel');
const JWT = require('jsonwebtoken');
const AppError = require('../utils/appError');

const SECRET = process.env.JWT_SECRET;
const JWTEXPIRESIN = process.env.JWT_EXPIRES_IN;

/*
Generate JWT tokens 
*/

const generateToken = (user) => {
  return JWT.sign({ id: user._id }, SECRET, { expiresIn: JWTEXPIRESIN });
};

/*
The user signin controller
Creates the user and sends a valid new token
*/
exports.register = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    });
    const token = generateToken(newUser);
    res.status(201).json({
      status: 'success',
      token,
      user: { newUser },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      error: err,
    });
  }
};

/*Check if email and password is provided, send an error if either is empty
find the email on the database and check if the password is correct. Send token  
*/
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Email or password empty', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Email or password incorrect', 400));
  }
  const token = generateToken(user);
  res.status(200).json({
    status: 'success',
    token,
    data: { user },
  });
};
