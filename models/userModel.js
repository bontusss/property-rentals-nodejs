const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const confirmPassword = function (el) {
  return el === this.password;
};

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      minLength: [2, 'Your name cannot be one character'],
      lowercase: true,
      trim: true,
    },
    businessName: {
      type: String,
      minLength: [2, 'Your name cannot be one character'],
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: [true, 'Please provide your email'],
      min: [2, 'Your name cannot be one character'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    role: {
      type: String,
      enum: ['renter', 'rentee', 'admin'],
      default: 'rentee',
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minLength: [4, 'Password cannot be less tha 4 characters'],
    },
    confirmPassword: {
      type: String,
      required: [true, 'Please conirm your password'],
      minLength: [4, 'Password cannot be less tha 4 characters'],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: 'Password and confirm password are not the same',
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/* Tis database middleware hashes the password and 
removes the confirmPassword if the database notices any change in password
*/
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
});


/* Database method that checks if the password entered by the user
is the same with the encrypted password on the database.
*/
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword)
};

const User = mongoose.model('User', userSchema);

module.exports = User;
