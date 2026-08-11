require('dotenv').config();

const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3002;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    await sequelize.sync();
    console.log('Menu table synchronized');

    app.listen(PORT, () => {
      console.log(`Menu Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start Menu Service:', error);
  }
}

startServer();