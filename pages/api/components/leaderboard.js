import { useEffect, useState } from "react";

export default function Leaderboard() {
  const [players, setPlayers] = useState([]);

  const fetchLeaderboard = async () => {
    const res = await fetch("/api/leaderboard");
    const data = await res.json();
    setPlayers(data);
  };

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ marginTop: "80px" }}>
      <h2>Leaderboard Global</h2>
      <ol>
        {players.map((p) => (
          <li key={p._id}>
            {p.username} — ${p.sommewallet || 0}
          </li>
        ))}
      </ol>
    </div>
  );
}