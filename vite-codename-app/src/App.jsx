import React, { useState, useEffect } from 'react';
import './App.css';

// 3.3. Funktio koodinimen generointiin
function generateCodename() {
  const adjectives = ["Sneaky", "Electric", "Silent", "Hyper", "Cosmic"];
  const animals = ["Fox", "Panda", "Lizard", "Dragon", "Hawk"];
  const number = Math.floor(Math.random() * 3000);

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];

  return `${adj}${animal}${number}`;
}

function App() {
  const [codename, setCodename] = useState("");

  useEffect(() => {
    // 3.2. & 3.4. Tarkistetaan löytyykö Local Storagesta jo koodinimi
    const cachedName = localStorage.getItem("codename");

    if (cachedName) {
      setCodename(cachedName);
    } else {
      const newName = generateCodename();
      localStorage.setItem("codename", newName);
      setCodename(newName);
    }
  }, []);

  const handleReset = () => {
    const newName = generateCodename();
    localStorage.setItem("codename", newName);
    setCodename(newName);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "sans-serif" }}>
      <h1>Salainen Agentti -portaali</h1>
      <p>Tervetuloa järjestelmään!</p>
      
      <div style={{ background: "#f0f4f8", color: "#333", padding: "20px", display: "inline-block", borderRadius: "8px", marginTop: "20px" }}>
        <h3>Koodinimesi:</h3>
        <h2 style={{ color: "#0066cc" }}>{codename}</h2>
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={handleReset} style={{ padding: "10px 15px", cursor: "pointer" }}>
          Arvo uusi koodinimi
        </button>
      </div>
    </div>
  );
}

export default App;