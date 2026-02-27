import clientPromise from "../../lib/mongodb";

export async function updateUserWallet(userId, montant) {
  const client = await clientPromise;
  const db = client.db("fakecasinodb");

  // On ajoute le montant au wallet
  const result = await db.collection("users").updateOne(
    { _id: userId },
    { $inc: { sommewallet: montant } } // crée le champ s'il n'existe pas
  );

  return result;
}