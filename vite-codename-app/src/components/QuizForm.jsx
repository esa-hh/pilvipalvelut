import React, { useState } from "react";
import { RoundResult } from "./RoundResult";

export function QuizForm({
  players,
  currentUserId,
  currentProduct,
  correctPrice,
  onSubmitGuess,
  onNextRound,
}) {
  const [guess, setGuess] = useState("");
  const currentPlayer = players.find((player) => player.uid === currentUserId);
  const hasGuessed = Boolean(currentPlayer && currentPlayer.guess !== null);

  if (!currentProduct) {
    return <p>Odotetaan tuotetta...</p>;
  }

  if (correctPrice !== null) {
    return (
      <RoundResult
        players={players}
        correctPrice={correctPrice}
        onNextRound={onNextRound}
      />
    );
  }

  return (
    <div className="quiz-card" style={{ marginTop: "20px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h2>Arvaa tuotteen hinta</h2>
      <p>Tuote: <strong>{currentProduct.title}</strong></p>
      {currentProduct.thumbnail && (
        <img
          src={currentProduct.thumbnail}
          alt={currentProduct.title}
          width="160"
          style={{ borderRadius: "6px", marginBottom: "15px" }}
        />
      )}

      {hasGuessed ? (
        <p style={{ color: "#0070f3", fontWeight: "bold" }}>
          Olet lähettänyt arvauksen: {currentPlayer?.guess} € (odotetaan muita)
        </p>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmitGuess(Number(guess));
            setGuess("");
          }}
        >
          <input
            type="number"
            min="0"
            step="0.01"
            value={guess}
            onChange={(event) => setGuess(event.target.value)}
            placeholder="Arvaa hinta (€)"
            required
            style={{ padding: "8px", marginRight: "10px", width: "150px" }}
          />
          <button type="submit" style={{ padding: "8px 16px", cursor: "pointer" }}>
            Lähetä arvaus
          </button>
        </form>
      )}
    </div>
  );
}
export default QuizForm;