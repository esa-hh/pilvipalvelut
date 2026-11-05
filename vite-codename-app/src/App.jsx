import React, { useState, useEffect } from "react";
import "./App.css";
import LoginForm from "./LoginForm";
import { auth, logout } from "./authService";
import { onAuthStateChanged } from "firebase/auth";
import { getOrCreateCodename } from "./codenameService";
import { QuizForm } from "./components/QuizForm";
import { createSession, joinSession, subscribeSession } from "./gameSessionService";
import {
  resetGame,
  submitGuess,
  startGameIfPossible,
  clearPlayers,
  nextRound,
} from "./gameController";

function App() {
  const [session, setSession] = useState(null);
  const [codename, setCodename] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    let unsubscribeSession = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setCodename("");
        setSession(null);
        if (unsubscribeSession) unsubscribeSession();
        return;
      }

      setUser(firebaseUser);
      const name = getOrCreateCodename(firebaseUser.uid);
      setCodename(name);

      await createSession();

      try {
        await joinSession({
          uid: firebaseUser.uid,
          codename: name,
          score: 0,
          guess: null,
        });
      } catch (err) {
        console.error("Liittyminen epäonnistui:", err);
      }

      unsubscribeSession = subscribeSession((updatedSession) => {
        setSession(updatedSession);
      });
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSession) unsubscribeSession();
    };
  }, []);

  async function handleStartGame() {
    if (!session) return;
    try {
      await startGameIfPossible(session);
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleClearPlayers() {
    if (!confirm("Poistetaanko kaikki pelaajat?")) return;
    try {
      await clearPlayers();
    } catch (err) {
      console.error("Clear players failed:", err);
    }
  }

  async function handleSubmitGuess(guess) {
    if (!user) return;
    try {
      await submitGuess(user.uid, guess);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleNextRound() {
    try {
      await nextRound();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleResetGame() {
    try {
      await resetGame();
    } catch (err) {
      console.error("Reset failed:", err);
    }
  }

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", textAlign: "center", fontFamily: "sans-serif" }}>
      <h1>🎮 Moninpelinä toimiva Hintavisa</h1>

      <div style={{ marginBottom: "20px", padding: "15px", background: "#f5f5f5", borderRadius: "8px" }}>
        {user ? (
          <>
            <p>👋 Tervetuloa, <strong>{codename}</strong></p>
            <button onClick={logout} style={{ padding: "6px 12px", cursor: "pointer" }}>
              Kirjaudu ulos
            </button>
          </>
        ) : (
          <>
            <p>Kirjaudu sisään pelataksesi.</p>
            <LoginForm />
          </>
        )}
      </div>

      {user && (
        <div>
          {!session ? (
            <p>Ladataan pelisessiota...</p>
          ) : (
            <>
              <h2>Sessio: {session.sessionName}</h2>
              <p>Tila: <strong>{session.status}</strong></p>
              <p>Kierros: {session.currentRound} / {session.maxRounds}</p>

              <h3>Pelaajat ({session.players.length} / 4)</h3>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {session.players.map((player) => (
                  <li key={player.uid} style={{ margin: "4px 0" }}>
                    <strong>{player.codename}</strong> — pisteet: {player.score}
                    {player.guess !== null && " (Arvaus lähetetty ✓)"}
                  </li>
                ))}
              </ul>

              {session.status === "waiting" && (
                <div style={{ marginTop: "20px" }}>
                  <p>Odotetaan pelaajia. Peli alkaa, kun mukana on vähintään 2 pelaajaa.</p>
                  <button onClick={handleClearPlayers} style={{ marginRight: "10px", padding: "8px 14px", cursor: "pointer" }}>
                    Tyhjennä pelaajat
                  </button>
                  <button
                    type="button"
                    onClick={handleStartGame}
                    disabled={session.players.length < 2}
                    style={{ padding: "8px 14px", cursor: session.players.length >= 2 ? "pointer" : "not-allowed" }}
                  >
                    Aloita peli
                  </button>
                </div>
              )}

              {session.status === "playing" && (
                <QuizForm
                  players={session.players}
                  currentUserId={user.uid}
                  onSubmitGuess={handleSubmitGuess}
                  currentProduct={session.currentProduct}
                  correctPrice={session.correctPrice}
                  onNextRound={handleNextRound}
                />
              )}

              {session.status === "finished" && (
                <div style={{ marginTop: "20px", padding: "20px", background: "#e6fffa", borderRadius: "8px" }}>
                  <h2>🏆 Peli päättyi!</h2>
                  <p>Voittaja: <strong>{session.winnerCodename}</strong></p>
                  <button onClick={handleResetGame} style={{ padding: "10px 20px", cursor: "pointer" }}>
                    Aloita alusta
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;