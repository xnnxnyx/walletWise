import { MongoClient } from "mongodb";
import dotenv from "dotenv";

// get serverless db connection string stored in .env file
dotenv.config({ path: "./config.env" });
const db_connection_str = process.env.ATLAS_URI;

const client = new MongoClient(db_connection_str);
 
let db;
const connectToServer = async (callback) => {
    try {
      await client.connect();
      console.log('Successfully connected to MongoDB ... ');
      db = client.db('admin');
      //const collection = db.collection('some_collection in the admin db');
    } catch (err) {
    console.error(err.message);
  }
}

const getDB = () => { return _db };

export const dbo = { connectToServer, getDB }