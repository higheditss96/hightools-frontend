import React, { useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [follows, setFollows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE = "https://hightools-backend-production.up.railway.app";

  const handleSearch = () => {
    if (!username) return;
    setLoading(true);
    setError("");
    setUserData(null);
    setFollows([]);

    fetch(`${API_BASE}/follows?username=${username}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUserData(data.user);
          setFollows(data.follows);
        } else {
          setError("User not found or private profile.");
        }
      })
      .catch(() => setError("Request failed. Try again later."))
      .finally(() => setLoading(false));
  };

  return (
    <div className="App">
      <h1 className="logo">HIGHTOOLS</h1>

      {/* === Search Bar === */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search Kick username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {/* === User Info === */}
      {userData && (
        <div className="profile-card">
          <img
            src={
              userData.profile_pic
                ? `https://files.kick.com${userData.profile_pic}`
                : "https://via.placeholder.com/100"
            }
            alt={userData.username}
            className="avatar"
          />
          <h2>{userData.username}</h2>
        </div>
      )}

      {/* === Follows Grid === */}
      {follows.length > 0 && (
        <>
          <h3>Following</h3>
          <div className="grid">
            {follows.map((ch) => (
              <div key={ch.id} className="follow-card">
                <img
                  src={
                    ch.profile_pic
                      ? `https://files.kick.com${ch.profile_pic}`
                      : "https://via.placeholder.com/80"
                  }
                  alt={ch.username}
                />
                <p>{ch.username}</p>
              </div>
            ))}
          </div>
        </>
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
