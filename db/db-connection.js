import { config } from 'dotenv'
config()


import mongoose from 'mongoose'


const uri = `mongodb+srv://publinovva:${process.env.MONGODB_PASSWORD}@publinovva.nbzocvm.mongodb.net/?retryWrites=true&w=majority`

console.log(uri)

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