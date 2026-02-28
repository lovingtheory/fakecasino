// /lib/mongodb.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {};

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local or Vercel Environment Variables");
}

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // En développement : réutiliser la connexion entre hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // En production (Vercel) : créer une seule connexion serverless
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;