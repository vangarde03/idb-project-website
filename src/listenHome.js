import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const ListenHome = () => {
  const location = useLocation();
  const { state } = location;
  const { email, user_id, user_type, username } = state;

  return (
    <div>
      <h1>Hello, {username}!</h1>
      <div>
        <Link to="/playlist">
          <h2>My Playlists</h2>
        </Link>
        <div className="playlist-box">
          {/* Display user's playlists */}
          <p>No playlists found</p>
        </div>
      </div>
      <div>
        <Link to="/podcast">
          <h2>My Podcasts</h2>
        </Link>
        <div className="podcast-box">
          {/* Display user's podcasts */}
          <p>No podcasts found</p>
        </div>
      </div>
      <div>
        <Link to="/search">
          <button>Search</button>
        </Link>
      </div>
    </div>
  );
};

export default ListenHome;
