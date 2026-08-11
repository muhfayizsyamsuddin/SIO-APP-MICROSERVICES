const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!isValidPassword) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d'
      }
    );

    res.status(200).json({
      message: 'Login successful',
      access_token: token
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Internal server error'
    });
  }
}

module.exports = {
  login
};