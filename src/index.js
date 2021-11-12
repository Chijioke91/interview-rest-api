require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { movieRoutes, commentRoutes, characterRoutes } = require('./routes');

const port = process.env.PORT;

const app = express();

app.set('trust proxy', true);

app.use(express.json());

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
