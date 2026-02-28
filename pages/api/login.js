// /pages/api/login.js
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, token } = req.body;

    if (!username || !token) {
      return res.status(400).json({ message: "Username and token required" });
    }

    try {
      const client = await clientPromise;
      const db = client.db("fakecasinodb");
      const user = await db.collection("users").findOne({ user: username, token });

      if (user) {
        res.status(200).json({ success: true, user });
      } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}