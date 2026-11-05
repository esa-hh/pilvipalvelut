import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import LoginForm from "./LoginForm";
import { auth, logout } from "./authService";
import "./App.css";

function generateCodename() {
  const adjectives = ["Sneaky", "Electric", "Silent", "Hyper", "Cosmic"];
  const animals = ["Fox", "Panda", "Lizard", "Dragon", "Hawk"];
  const number = Math.floor(Math.random() * 3000);
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${animals[Math.floor(Math.random() * animals.length)]}${number}`;
}

function App() {
  const [user, setUser] = useState(null);
  const [codename, setCodename] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Tehtävä 4.10: Käytetään Firebase UID:tä avaimena Local Storagessa
        const storageKey = `codename_${firebaseUser.uid}`;
        const cachedName = localStorage.getItem(storageKey);

        if (cachedName) {
          setCodename(cachedName);
        } else {
          const newName = generateCodename();
          localStorage.setItem(storageKey, newName);
          setCodename(newName);
        }
      } else {
        setCodename("");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "sans-serif" }}>
      <h1>Firebase Auth + Koodinimi -portaali</h1>

      {user ? (
        <div style={{ background: "#f0f4f8", color: "#333", padding: "20px", display: "inline-block", borderRadius: "8px" }}>
          <h2>👋 Tervetuloa, {codename}</h2>
          <p>Kirjautunut sähköposti: <strong>{user.email}</strong></p>
          <button onClick={logout} style={{ padding: "8px 16px", cursor: "pointer", marginTop: "10px" }}>
            Kirjaudu ulos
          </button>
        </div>
      ) : (
        <LoginForm />
      )}
    </div>
  );
}

export default App;