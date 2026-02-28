import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("fakecasinodb");

  const leaderboard = await db
    .collection("users")
    .find({})
    .sort({ sommewallet: -1 })
    .limit(10)
    .toArray();

  res.status(200).json(leaderboard);
}