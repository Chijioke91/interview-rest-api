require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const helmet = require('helmet');
const xss = require('xss-clean');
const { movieRoutes, commentRoutes, characterRoutes } = require('./routes');

const port = process.env.PORT;

const app = express();

app.set('trust proxy', true);

app.use(express.json());

// Secure headers
app.use(helmet());

// prevent xss attack
app.use(xss());

// set static folder for our documentation
app.use(express.static(path.join(__dirname, '../public')));

// we use morgan to show all the request loggings
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// routes
app.use('/api/v1/movies', movieRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/characters', characterRoutes);

app.listen(port, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${port}`
  );
});
