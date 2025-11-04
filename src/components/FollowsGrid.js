import React from "react";
import FollowCard from "./FollowCard";

function FollowsGrid({ follows }) {
  return (
    <div className="follows-grid">
      {follows.map((follow) => (
        <FollowCard key={follow.id || follow.username} follow={follow} />
      ))}
    </div>
  );
}

export default FollowsGrid;
