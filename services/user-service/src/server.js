require('dotenv').config();

const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await sequelize.authenticate();

    console.log('Database connected');

    await sequelize.sync();

    console.log('User table synchronized');

    app.listen(PORT, () => {
      console.log(`User Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start User Service:', error.message);
    console.error(error);
  }
}

startServer();