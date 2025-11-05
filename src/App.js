import React, { useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setError("");
    setUserData(null);

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
    }
  };

  return (
    <div className="App">
      <h1>HIGHTOOLS</h1>
      <p>See who you follow on Kick — and since when.</p>

      <div className="search-box">
        <input
          type="text"
          placeholder="Enter Kick username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {error && <p className="error">{error}</p>}

      {userData && (
        <div className="user-card">
          <img
            src={
              userData.profile_pic
                ? `https://files.kick.com${userData.profile_pic}`
                : "https://via.placeholder.com/100"
            }
            alt="Profile"
            className="avatar"
          />
          <h2>{userData.username}</h2>
          <p>{userData.bio || "No bio available"}</p>
          <p>
            <strong>Followers:</strong> {userData.followers || 0}
          </p>
          <p>
            <strong>Country:</strong> {userData.country || "Unknown"}
          </p>
        </div>
      )}

      <footer>
        made by <span className="author">highman_edits</span> with 💚
      </footer>
    </div>
  );
}

export default App;
