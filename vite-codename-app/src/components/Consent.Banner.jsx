import React from "react";

function getConsent() {
  const value = localStorage.getItem("consent");
  if (value === null) return null;
  return value === "true";
}

function setConsent(value) {
  localStorage.setItem("consent", value.toString());
}

export default function ConsentBanner() {
  if (getConsent() !== null) return null;

  const acceptAnalytics = () => {
    setConsent(true);
    window.location.reload();
  };

  const declineAnalytics = () => {
    setConsent(false);
    window.location.reload();
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "1rem",
        backgroundColor: "#f5f5f5",
        color: "#333",
        borderTop: "1px solid #ccc",
        zIndex: 1000,
        textAlign: "center",
      }}
    >
      <p style={{ marginBottom: "0.5rem" }}>
        Tämä sovellus käyttää anonyymia analytiikkaa sovelluksen teknisen toimivuuden ja käytettävyyden arviointiin.
      </p>
      <button onClick={acceptAnalytics} style={{ marginRight: "0.5rem", padding: "6px 12px", cursor: "pointer" }}>
        Hyväksy analytiikka
      </button>
      <button onClick={declineAnalytics} style={{ padding: "6px 12px", cursor: "pointer" }}>
        Hylkää
      </button>
    </div>
  );
}s