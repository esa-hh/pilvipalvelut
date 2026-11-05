import React from "react";

export function RoundResult({ players, correctPrice, onNextRound }) {
  const sortedPlayers = [...players].sort((a, b) => {
    const aDiff = Math.abs((a.guess ?? 0) - correctPrice);
    const bDiff = Math.abs((b.guess ?? 0) - correctPrice);
    return aDiff - bDiff;
  });

  return (
    <div className="result-card" style={{ marginTop: "20px", padding: "15px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>Kierroksen tulos</h2>
      <p>Oikea hinta: <strong>{correctPrice} €</strong></p>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {sortedPlayers.map((player) => (
          <li key={player.uid} style={{ margin: "8px 0" }}>
            <strong>{player.codename}</strong>: {player.guess} € — ero{" "}
            {Math.abs((player.guess ?? 0) - correctPrice)} € — pisteet{" "}
            <strong>{player.score}</strong>
          </li>
        ))}
      </ul>
      <button onClick={onNextRound} style={{ padding: "8px 16px", cursor: "pointer", marginTop: "10px" }}>
        Seuraava kierros
      </button>
    </div>
  );
}