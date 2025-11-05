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
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(
            data?.detail || data?.message || "Request failed. Try again later."
          );
        }
        return data;
      })
      .then((data) => {
        setUserData(data.user);
        setFollows(data.follows || []);
        if (!data.follows || data.follows.length === 0) {
          setError("No follows found (private or hidden).");
        } else {
          setError("");
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  return (
    <div className="App">
      <h1 className="logo">HIGHTOOLS</h1>

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

      {loading && (
        <div className="spinner">
          <div className="circle"></div>
          <p>Loading...</p>
        </div>
      )}

      {error && !loading && <p className="error">{error}</p>}

      {userData && !loading && (
        <div className="profile-card">
          <img
            src={
              userData.user?.profile_pic
                ? `https://files.kick.com${userData.user.profile_pic}`
                : "https://via.placeholder.com/100"
            }
            alt={userData.slug}
            className="avatar"
          />
          <h2>{userData.slug}</h2>
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
