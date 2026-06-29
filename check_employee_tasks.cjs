const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8']);
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, 'backend', '.env') });

const mongoURI = process.env.MONGODB_URI;

async function checkTasks() {
  try {
    await mongoose.connect(mongoURI);
    const employees = await mongoose.connection.db.collection('employees').find({}).toArray();
    console.log('--- EMPLOYEES AND TASKS IN DATABASE ---');
    employees.forEach(emp => {
      console.log(`Name: ${emp.name}, Email: ${emp.email}, Tasks Count: ${emp.tasks?.length || 0}`);
      console.log('Tasks:', JSON.stringify(emp.tasks, null, 2));
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkTasks();
