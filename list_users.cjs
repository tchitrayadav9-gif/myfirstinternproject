const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8']);
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

const mongoURI = process.env.MONGODB_URI;

async function checkUsers() {
  try {
    await mongoose.connect(mongoURI);
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log('--- USERS IN DATABASE ---');
    console.log(JSON.stringify(users, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkUsers();
