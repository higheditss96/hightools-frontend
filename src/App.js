import React, { useState } from "react";
import SearchBar from "./components/SearchBar";
import FollowsGrid from "./components/FollowsGrid";
import "./App.css";

function App() {
  const [follows, setFollows] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async (username) => {
    setError("");
    setLoading(true);
    setFollows([]);

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/follows?username=${username}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "An unknown error occurred.");
      } else if (!data || data.length === 0) {
        setError("No follows found for this user.");
      } else {
        setFollows(data);
      }
    } catch (err) {
      setError("Server not responding.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1 className="title">HIGHTOOLS</h1>
      <p className="subtitle">See who you follow on Kick — and since when.</p>

      <SearchBar onSearch={handleSearch} />

      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && follows.length > 0 && <FollowsGrid follows={follows} />}

      <footer className="footer">
  made by{" "}
  <a href="https://kick.com/highman-edits" target="_blank" rel="noreferrer">
    highman_edits
  </a>{" "}
  with <span>💚</span>
</footer>
    </div>
  );
}

export default App;
