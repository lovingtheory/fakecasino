import clientPromise from '../../lib/mongodb';
import crypto from 'crypto';

export default async function handler(req, res) {

  console.log("Méthode reçue :", req.method);

  if (req.method !== 'POST') {
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const client = await clientPromise;
    const db = client.db("fakecasinodb");
    const collection = db.collection('users');

    const existingUser = await collection.findOne({ user: username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const token = crypto.randomBytes(32).toString('hex');

    const newUser = {
      user: username,
      token,
      wallet: 0,
      createdAt: new Date()
    };

    const result = await collection.insertOne(newUser);

    console.log("Utilisateur créé :", username);

    res.status(201).json({
      ...newUser,
      userId: result.insertedId
    });

  } catch (error) {
    console.error("Erreur API :", error);
    res.status(500).json({ message: "Server error" });
  }
}