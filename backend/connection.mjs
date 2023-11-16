import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import mongoose from "mongoose";

// get serverless db connection string stored in .env file
dotenv.config({ path: "./config.env" });
const db_connection_str = process.env.ATLAS_URI;

const client = new MongoClient(db_connection_str);
 
let db;
const connectToServer = async (callback) => {
    try {
      await client.connect();
      console.log('Successfully connected to MongoDB ... '); 
      mongoose.connect(db_connection_str);
      console.log('Successfully connected to Mongoose ... '); 
      db = client.db('budgetApp');
    } catch (err) {
    console.error(err.message);
  }
}

const getDB = () => { return _db };

export const dbo = { connectToServer, getDB }