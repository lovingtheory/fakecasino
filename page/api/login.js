// Exemple avec MongoDB
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { key } = req.body;
    const client = await clientPromise;
    const db = client.db("fakecasinodb");
    const userExists = await db.collection("users").findOne({ key });

    if (userExists) {
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ success: false, message: "Invalid key" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}