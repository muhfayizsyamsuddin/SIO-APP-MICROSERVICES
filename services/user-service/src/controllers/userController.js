const { User } = require('../models');

async function getUsers(req, res) {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ['password']
      }
    });

    res.status(200).json(users);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Internal server error'
    });
  }
}

async function createUser(req, res) {
  try {
    const { username, email, password, role } = req.body;

    const user = await User.create({
      username,
      email,
      password,
      role
    });

    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message
    });
  }
}

module.exports = {
  getUsers,
  createUser
};