import React, { useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setError("");
    setUserData(null);
    setLoading(true);

    try {
      const res = await fetch(
        `https://hightools-backend-production.up.railway.app/api/follows?username=${username}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "User not found");
      }

      setUserData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1 className="logo">HIGHTOOLS</h1>
      <p className="subtitle">Discover Kick profiles — clean and simple.</p>

      <div className="search-container">
        <input
          type="text"
          placeholder="Enter Kick username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-btn">
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {userData && (
        <div className="card fade-in">
          <div className="card-header">
            <img
              src={
                userData.profile_pic
                  ? `https://files.kick.com${userData.profile_pic}`
                  : "https://via.placeholder.com/120"
              }
              alt="Profile"
              className="avatar"
            />
            <div>
              <h2>{userData.username}</h2>
              <p className="bio">{userData.bio || "No bio available."}</p>
            </div>
          </div>

          <div className="card-info">
            <p>
              <strong>Followers:</strong>{" "}
              <span className="value">{userData.followers || 0}</span>
            </p>
            <p>
              <strong>Country:</strong>{" "}
              <span className="value">{userData.country || "Unknown"}</span>
            </p>
            <p>
              <strong>Joined:</strong>{" "}
              <span className="value">
                {new Date(userData.joined).toLocaleDateString()}
              </span>
            </p>
          </div>
        </div>
      )}

      <footer>
        made by <span className="author">highman_edits</span> with 💚
      </footer>
    </div>
  );
}

export default App;
