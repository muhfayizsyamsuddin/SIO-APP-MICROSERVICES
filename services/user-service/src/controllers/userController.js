const { User, UserProfile } = require('../models');

const ORDER_SERVICE_URL =
  process.env.ORDER_SERVICE_URL || 'http://order-service:3003';

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
      photoUrl,
      address
    } = req.body;

    const user = await User.create({
      username,
      email,
      password,
      role: 'customer'
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

async function getMyProfile(req, res) {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: {
        exclude: ['password']
      },
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

    res.status(200).json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Internal server error'
    });
  }
}

async function getAdminUsers(req, res) {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ['password']
      },
      include: [
        {
          model: UserProfile,
          attributes: ['id', 'photoUrl', 'address', 'UserId']
        }
      ]
    });

    const response = await fetch(`${ORDER_SERVICE_URL}/orders/admin`, {
      headers: {
        Authorization: req.headers.authorization
      }
    });

    if (!response.ok) {
      return res.status(502).json({
        message: 'Failed to get orders from Order Service'
      });
    }

    const orders = await response.json();

    const result = users.map(user => ({
      ...user.toJSON(),
      orders: orders.filter(
        order => order.UserId === user.id
      )
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Internal server error'
    });
  }
}

module.exports = {
  getUsers,
  createUser,
  getUserById,
  getMyProfile,
  getAdminUsers
};