// /pages/api/createAccount.js
import clientPromise from '../../lib/mongodb';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Vérification du body
    const { username } = req.body;
    if (!username || typeof username !== 'string' || username.trim() === '') {
      return res.status(400).json({ message: 'Username is required' });
    }

    const client = await clientPromise;
    const db = client.db('fakecasinodb');
    const collection = db.collection('users');

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await collection.findOne({ user: username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Générer un token sécurisé
    const token = crypto.randomBytes(32).toString('hex');

    const newUser = {
      user: username,
      token,
      wallet: 0,
      createdAt: new Date()
    };

    await collection.insertOne(newUser);

    res.status(201).json(newUser);

  } catch (error) {
    console.error('Erreur API /createAccount:', error);
    res.status(500).json({ message: 'Server error' });
  }
}