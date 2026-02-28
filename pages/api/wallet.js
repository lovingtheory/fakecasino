import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("fakecasinodb");

  const userId = req.query.id; // ou depuis ton session JWT

  if (!userId) return res.status(400).json({ error: "User ID missing" });

  const user = await db.collection("users").findOne(
    { _id: userId },
    { projection: { username: 1, sommewallet: 1 } }
  );

  if (!user) return res.status(404).json({ error: "User not found" });

  res.status(200).json({ username: user.username, sommewallet: user.sommewallet || 0 });
}