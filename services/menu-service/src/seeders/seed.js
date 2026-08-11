require('dotenv').config();

const { sequelize, Menu } = require('../models');

const menus = [
  {
    name: 'Nasi Goreng',
    price: 20000,
    description: 'Nasi goreng dengan telur dan ayam',
    statusMenu: 'Tersedia',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1664391895725-ed1819010135?w=500'
  },
  {
    name: 'Ayam Bakar',
    price: 25000,
    description: 'Ayam bakar manis pedas',
    statusMenu: 'Tersedia',
    imageUrl: 'https://images.unsplash.com/photo-1630315500315-43112e2bfd88?w=500'
  },
  {
    name: 'Kopi Hitam',
    price: 15000,
    description: 'Kopi hitam tanpa gula',
    statusMenu: 'Tersedia',
    imageUrl: 'https://images.unsplash.com/photo-1637634789056-ae4691c813d8?q=80&w=687'
  },
  {
    name: 'Es Kopi Susu',
    price: 18000,
    description: 'Kopi susu dingin segar',
    statusMenu: 'Tidak Tersedia',
    imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=1169'
  }
];

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    await Menu.bulkCreate(menus);

    console.log('Menu seed completed');
  } catch (error) {
    console.error(error);
  } finally {
    await sequelize.close();
  }
}

seed();