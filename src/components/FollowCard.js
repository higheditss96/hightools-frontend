import React from "react";

function FollowCard({ follow }) {
  const profileUrl = `https://kick.com/${follow.username}`;
  const image = follow.profile_pic || "https://kick.com/assets/favicon-32x32.png";
  const date = follow.followed_at
    ? new Date(follow.followed_at).toLocaleDateString()
    : "—";

  return (
    <div className="follow-card">
      <img src={image} alt={follow.username} />
      <h3>
        <a href={profileUrl} target="_blank" rel="noreferrer">
          {follow.username}
        </a>
      </h3>
      <p>{date}</p>
    </div>
  );
}

export default FollowCard;
