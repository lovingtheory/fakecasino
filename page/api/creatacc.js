// pages/api/createAccount.js
import { v4 as uuidv4 } from 'uuid';
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const key = uuidv4().replace(/-/g, '') + uuidv4().replace(/-/g, '');

      const client = await clientPromise;
      const db = client.db('fakecasinodb'); // nom de ta DB
      const collection = db.collection('users'); // nom de la collection

      await collection.insertOne({ key, createdAt: new Date() });

      res.status(200).json({ key });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}