const { default: mongoose } = require('mongoose');
const express = require('express');
const app = require('./index')

require('dotenv').config({ path: './config.env' });

const DB = process.env.DB_URI_LOCAL;
const port = process.env.PORT || 3000;

mongoose
  .connect(DB)
  .then(() => {
    console.log('Database is connected');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });

app.listen(port, '127.0.0.1', () => {
  console.log(`Server is listening on port ${port}`);
});

