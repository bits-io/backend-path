const mongoose = require('mongoose');
const logger = require('../middleware/winston.logger');

const connectionString = `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const connectDatabase = async () => {
  try {
    await mongoose
      .connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        logger.info('Connection establish to MongoDB database successful!');
      })
      .catch((error) => {
        console.log(error);
        logger.error('Error connecting to MongoDB: ', error.message);
      });
  } catch (error) {
    logger.error('Database connection error: ', error.message);
  }
};

module.exports = connectDatabase;
