import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [authUrl, setAuthUrl] = useState("");
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [follows, setFollows] = useState([]);
  const [error, setError] = useState("");

  // pentru comparare
  const [searchUser, setSearchUser] = useState("");
  const [compareUser, setCompareUser] = useState(null);
  const [mutuals, setMutuals] = useState([]);

  // === 1️⃣ GET LOGIN URL ===
  useEffect(() => {
    fetch("https://hightools-backend-production.up.railway.app/login")
      .then((res) => res.json())
      .then((data) => setAuthUrl(data.auth_url))
      .catch(() => setError("Cannot connect to backend."));
  }, []);

  // === 2️⃣ HANDLE CALLBACK ===
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      fetch(
        `https://hightools-backend-production.up.railway.app/callback?code=${code}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.access_token) {
            setToken(data.access_token);
            window.history.replaceState({}, document.title, "/");
          } else {
            setError("Login failed. Try again.");
          }
        })
        .catch(() => setError("Login request failed."));
    }
  }, []);

  // === 3️⃣ FETCH USER INFO ===
  useEffect(() => {
    if (token) {
      fetch(
        `https://hightools-backend-production.up.railway.app/me?token=${token}`
      )
        .then((res) => res.json())
        .then((data) => setUser(data))
        .catch(() => setError("Failed to load user info."));
    }
  }, [token]);

  // === 4️⃣ FETCH FOLLOWS ===
  useEffect(() => {
    if (user && token) {
      fetch(
        `https://hightools-backend-production.up.railway.app/follows?user_id=${user.id}&token=${token}`
      )
        .then((res) => res.json())
        .then((data) => setFollows(data))
        .catch(() => setError("Failed to load follows."));
    }
  }, [user, token]);

  // === 5️⃣ SEARCH & COMPARE ===
  const handleSearch = () => {
    if (!searchUser || !token) return;
    setCompareUser(null);
    setMutuals([]);
    setError("");

    fetch(
      `https://hightools-backend-production.up.railway.app/user?username=${searchUser}&token=${token}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.id) {
          setCompareUser(data);
          fetch(
            `https://hightools-backend-production.up.railway.app/compare?user1_id=${user.id}&user2_id=${data.id}&token=${token}`
          )
            .then((res) => res.json())
            .then((result) => {
              if (result.mutuals) {
                setMutuals(result.mutuals);
              } else {
                setMutuals([]);
              }
            });
        } else {
          setError("User not found.");
        }
      })
      .catch(() => setError("Search failed."));
  };

  return (
    <div className="App">
      <h1 className="logo">HIGHTOOLS</h1>

      {!token && authUrl && (
        <a href={authUrl} className="login-btn">
          Login with Kick
        </a>
      )}

      {error && <p className="error">{error}</p>}

      {user && (
        <>
          <div className="profile-card">
            <img
              src={
                user.profile_pic
                  ? `https://files.kick.com${user.profile_pic}`
                  : "https://via.placeholder.com/100"
              }
              alt="pfp"
              className="avatar"
            />
            <h2>{user.username}</h2>
          </div>

          <h3>Following</h3>
          <div className="grid">
            {follows.length > 0 ? (
              follows.map((ch) => (
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
              ))
            ) : (
              <p>No follows found or private account.</p>
            )}
          </div>

          <h3>Compare Follows</h3>
          <div className="search-section">
            <input
              type="text"
              placeholder="Enter Kick username"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
            />
            <button onClick={handleSearch}>Compare</button>
          </div>

          {compareUser && (
            <div className="compare-section">
              <h4>
                You & <span className="highlight">{compareUser.username}</span>{" "}
                both follow:
              </h4>
              <div className="grid">
                {mutuals.length > 0 ? (
                  mutuals.map((ch) => (
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
                  ))
                ) : (
                  <p>No mutual follows found.</p>
                )}
              </div>
            </div>
          )}
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
