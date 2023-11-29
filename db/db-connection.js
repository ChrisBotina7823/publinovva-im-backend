import { config } from 'dotenv'
config()

// import mysql2 from 'mysql2'

// let db = mysql2.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// })

//export default db

import mongoose from 'mongoose'

const uri = `mongodb+srv://publinovva:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_USER}.nbzocvm.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(uri)

const db = mongoose.connection

db.on('error', (error) => {
  console.error('Error connecting to MongoDB:', error);
});

db.once('open', () => {
  console.log('MongoDB connected successfully');
});

db.on('close', () => {
  console.log('MongoDB connection closed');
});

export default mongoose;