const mongoose = require('mongoose');
const dotenv = require('dotenv');
const users = require('./data/users');
const products = require('./data/products');
const User = require('./models/User');
const Product = require('./models/Product');
const Farmer = require('./models/Farmer');
const Order = require('./models/Order');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await Farmer.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);

    const adminUser = createdUsers.find((user) => user.role === 'admin');
    const farmerUsers = createdUsers.filter((user) => user.role === 'farmer');

    const farmers = farmerUsers.map((farmerUser, index) => {
      return {
        user: farmerUser._id,
        farmName: `Farm ${index + 1}`,
        address: index % 2 === 0 ? 'Andhra Pradesh, India' : 'Telangana, India',
        phone: `123456789${index}`,
      };
    });

    const createdFarmers = await Farmer.insertMany(farmers);

    const sampleProducts = products.map((product, index) => {
      return { ...product, farmer: createdFarmers[index % createdFarmers.length]._id };
    });

    await Product.insertMany(sampleProducts);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await Farmer.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
