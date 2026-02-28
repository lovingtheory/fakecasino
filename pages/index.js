// pages/index.js
import { useState, useEffect } from "react";
import Leaderboard from "./components/leaderboard";

export default function Home() {
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [wallet, setWallet] = useState(null);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null); // stocke l’ID MongoDB de l’utilisateur

  // Créer un nouveau compte
  const handleCreateAccount = async () => {
    if (!username) {
      setMessage("Please enter a username");
      return;
    }

    try {
      const res = await fetch("/api/creatacc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();

      if (res.ok) {
        setToken(data.token);
        setWallet(data.wallet);
        setUserId(data.userId); // récupère l’ID de l’utilisateur
        setMessage(`Account created successfully! Welcome, ${data.user}`);
        console.log("Compte créé:", data); // log côté front-end
      } else {
        console.warn("Erreur serveur:", data.message);
        setMessage(data.message || "Server error. Please try again.");
      }
    } catch (error) {
      console.error("Erreur fetch createAccount:", error);
      setMessage("Server error. Please try again.");
    }
  };

  // Login avec username + token
  const handleLogin = async () => {
    if (!username || !token) {
      setMessage("Please enter username and token to login");
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, token }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setWallet(data.user.wallet);
        setUserId(data.user._id); // récupère l’ID MongoDB
        setMessage(
          `Welcome back, ${data.user.username}! Your wallet balance is ${data.user.wallet}`
        );
        console.log("Login réussi:", data); // log côté front-end
      } else {
        setMessage(data.message || "Invalid credentials");
        console.warn("Login échoué:", data);
      }
    } catch (error) {
      console.error("Erreur fetch login:", error);
      setMessage("Server error. Please try again.");
    }
  };

  // Fetch wallet en temps réel (toutes les 5 secondes)
  useEffect(() => {
    if (!userId) return;

    const fetchWallet = async () => {
      try {
        const res = await fetch(`/api/wallet?id=${userId}`);
        const data = await res.json();
        setWallet(data.sommewallet);
      } catch (err) {
        console.error("Erreur fetch wallet:", err);
      }
    };

    fetchWallet();
    const interval = setInterval(fetchWallet, 5000);
    return () => clearInterval(interval);
  }, [userId]);

  const contentMarginTop = 60; // espace pour le bandeau fixe

  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      {/* Bandeau fixe en haut */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          backgroundColor: "#222",
          color: "#fff",
          padding: "10px 20px",
          textAlign: "center",
          fontWeight: "bold",
          zIndex: 1000,
        }}
      >
        {wallet !== null
          ? `Current Balance: ${wallet} coins`
          : "Please login to see your balance"}
      </div>

      {/* Contenu principal */}
      <div style={{ marginTop: `${contentMarginTop}px` }}>
        <h1>🎰 Casino App</h1>

        {/* Formulaire création compte */}
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ padding: "8px", fontSize: "16px", width: "250px", marginRight: "10px" }}
          />
          <button onClick={handleCreateAccount} style={{ padding: "8px 16px", fontSize: "16px" }}>
            Create Account
          </button>
        </div>

        {/* Formulaire login */}
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Enter token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            style={{ padding: "8px", fontSize: "16px", width: "250px", marginRight: "10px" }}
          />
          <button onClick={handleLogin} style={{ padding: "8px 16px", fontSize: "16px" }}>
            Login
          </button>
        </div>

        {message && (
          <p style={{ marginTop: "20px", fontWeight: "bold", color: "blue" }}>{message}</p>
        )}

        {wallet !== null && (
          <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc", width: "300px" }}>
            <p><strong>Username:</strong> {username}</p>
            <p><strong>Token:</strong> {token}</p>
            <p><strong>Wallet:</strong> {wallet}</p>
          </div>
        )}

        {/* Leaderboard global */}
        {wallet !== null && <Leaderboard />}
      </div>
    </div>
  );
}