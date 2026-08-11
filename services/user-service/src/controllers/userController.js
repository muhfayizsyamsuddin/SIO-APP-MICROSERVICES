const { User, UserProfile } = require('../models');

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
    const {
      username,
      email,
      password,
      role,
      photoUrl,
      address
    } = req.body;

    const user = await User.create({
      username,
      email,
      password,
      role
    });

    const userProfile = await UserProfile.create({
      photoUrl,
      address,
      UserId: user.id
    });

    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(201).json({
      ...userResponse,
      profile: userProfile
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: error.message
    });
  }
}

async function getUserById(req, res) {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        {
          model: UserProfile,
          attributes: ['id', 'photoUrl', 'address', 'UserId']
        }
      ]
    });

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const userResponse = user.toJSON();
    delete userResponse.password;

    res.json(userResponse);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message
    });
  }
}

module.exports = {
  getUsers,
  createUser,
  getUserById
};