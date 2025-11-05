import React, { useState } from "react";
import "./App.css";

const API_BASE = "https://hightools-backend-production.up.railway.app";

function App() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [follows, setFollows] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!username) return;
    setLoading(true);
    setError("");
    setUserData(null);
    setFollows([]);

    try {
      const res = await fetch(`${API_BASE}/follows?username=${username}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data?.detail || "Failed to fetch");

      setUserData(data.user);
      setFollows(data.follows || []);
      if (data.message) setError(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1 className="logo">HIGHTOOLS</h1>

      <div className="search-section">
        <input
          type="text"
          placeholder="Enter Kick username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading && (
        <div className="spinner">
          <div className="circle"></div>
          <p>Loading...</p>
        </div>
      )}

      {userData && !loading && (
        <div className="profile-card">
          <img
            src={
              userData.profile_pic
                ? userData.profile_pic
                : "https://via.placeholder.com/100"
            }
            alt="avatar"
            className="avatar"
          />
          <h2>
            <a
              href={`https://kick.com/${userData.slug || username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="profile-link"
            >
              {userData.slug || username}
            </a>
          </h2>
          <p className="bio">
            {userData.bio
              ? userData.bio
              : "No bio available. (Public Kick data only)"}
          </p>
          <p className="followers">
            👥 Followers: {userData.followers_count || "N/A"}
          </p>
        </div>
      )}

      {!loading && follows.length > 0 && (
        <>
          <h3>Following</h3>
          <div className="grid">
            {follows.map((ch) => (
              <div key={ch.id} className="follow-card">
                <img
                  src={
                    ch.profile_pic
                      ? ch.profile_pic
                      : "https://via.placeholder.com/80"
                  }
                  alt={ch.username}
                />
                <a
                  href={`https://kick.com/${ch.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {ch.username}
                </a>
              </div>
            ))}
          </div>
        </>
      )}

      {!loading && error && (
        <p className="error">
          {error.includes("privată")
            ? "⚠️ Kick a făcut lista de follows privată — date limitate disponibile."
            : error}
        </p>
      )}

      <footer>
        made by{" "}
        <a
          href="https://kick.com/highman-edits"
          target="_blank"
          rel="noopener noreferrer"
          className="author"
        >
          highman_edits
        </a>{" "}
        with 💚
      </footer>
    </div>
  );
}

export default App;
