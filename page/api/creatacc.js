// /pages/api/createAccount.js
import clientPromise from '../../lib/mongodb';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    try {
      const client = await clientPromise;
      const db = client.db('fakecasinodb'); // ta DB existante
      const collection = db.collection('users');

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await collection.findOne({ user: username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }

      // Générer un token de 64 caractères
      const token = crypto.randomBytes(32).toString("hex");

      const newUser = {
        user: username,
        token,
        wallet: 0,
        createdAt: new Date()
      };

      await collection.insertOne(newUser);

      res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}