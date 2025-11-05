import React, { useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [follows, setFollows] = useState([]);
  const [compareName, setCompareName] = useState("");
  const [mutuals, setMutuals] = useState([]);
  const [compareUser, setCompareUser] = useState(null);
  const [error, setError] = useState("");

  const API_BASE = "https://hightools-backend-production.up.railway.app";

  const handleSearch = () => {
    if (!username) return;
    setError("");
    fetch(`${API_BASE}/follows?username=${username}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUserData(data.user);
          setFollows(data.follows);
        } else {
          setError("User not found or no follows.");
        }
      })
      .catch(() => setError("Request failed."));
  };

  const handleCompare = () => {
    if (!username || !compareName) return;
    setError("");
    fetch(`${API_BASE}/compare?user1=${username}&user2=${compareName}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.mutuals) {
          setCompareUser(data.user2);
          setMutuals(data.mutuals);
        } else {
          setError("No mutuals found.");
        }
      })
      .catch(() => setError("Compare failed."));
  };

  return (
    <div className="App">
      <h1 className="logo">HIGHTOOLS</h1>

      <div className="search-section">
        <input
          type="text"
          placeholder="Enter Kick username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {error && <p className="error">{error}</p>}

      {userData && (
        <>
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
              <p>No follows found.</p>
            )}
          </div>

          <h3>Compare Follows</h3>
          <div className="search-section">
            <input
              type="text"
              placeholder="Compare with username"
              value={compareName}
              onChange={(e) => setCompareName(e.target.value)}
            />
            <button onClick={handleCompare}>Compare</button>
          </div>

          {compareUser && (
            <div className="compare-section">
              <h4>
                <span className="highlight">{username}</span> &{" "}
                <span className="highlight">{compareUser.username}</span> both follow:
              </h4>
              <div className="grid">
                {mutuals.length > 0 ? (
                  mutuals.map((ch) => (
                    <div key={ch.id} className="follow-card">
