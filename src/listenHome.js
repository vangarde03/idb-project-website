import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const ListenHome = () => {
  const location = useLocation();
  const { state } = location;
  const { username } = state;
  console.log(state.alphaNumID);

  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const query = `SELECT title, number_of_likes, playlist_id FROM playlist WHERE listener_id = '${state.alphaNumID}';`; // Modify the query to select only title and number_of_likes
        const response = await fetch('http://127.0.0.1:5000/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query }) // Send the query in the request body
        });
        const data = await response.json();
        setPlaylists(data);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    };

    fetchPlaylists();
  }, []);
  console.log(playlists);

  // const handleBack = () => {
  //   // Navigate back to the previous page with the same state
  //   history.goBack();
  // };

  return (
    <div>
      <h1>Hello, {username}!</h1>
      <div>
        {/* <Link to="/playlist"> */}
        <h2>My Playlists</h2>
        {/* </Link> */}
        <div className="playlist-box">
          {playlists.length > 0 ? (
            <ul>
              {playlists.map((playlist, index) => (
                <li key={index}>
                  <Link
                    to={{
                      pathname: `/playlist/${playlist[2]}`,
                      state: state,  // Pass the state object here
                    }}
                  >
                    {playlist[0]}
                  </Link> - Likes: {playlist[1]}

                </li>
              ))}
            </ul>
          ) : (
            <p>No playlists found</p>
          )}
        </div>
      </div>
      <div>
        {/* <Link to="/podcast"> */}
        <h2>Saved Playlists</h2>
        {/* </Link> */}
        <div className="podcast-box">
          {/* Display user's podcasts */}
          <p>To be added soon...</p>
        </div>
      </div>
      <div>
        {/* <Link to="/podcast"> */}
        <h2>Liked Podcasts</h2>
        {/* </Link> */}
        <div className="podcast-box">
          {/* Display user's podcasts */}
          <p>To be added soon...</p>
        </div>
      </div>
      <div>
        <h2>Who You Follow</h2>
        <div className="song-recs">
          {/* Display user's podcasts */}
          <p>Must be added...</p>
        </div>
      </div>
      <div>
        <h2>Your Followers</h2>
        <div className="song-recs">
          {/* Display user's podcasts */}
          <p>Must be added...</p>
        </div>
      </div>
      <div>
        <h2>Recommended Songs</h2>
        <div className="song-recs">
          {/* Display user's podcasts */}
          <p>To be added soon...</p>
        </div>
      </div>
      <div>
        <h2>Recommended Podcasts</h2>
        <div className="song-recs">
          {/* Display user's podcasts */}
          <p>To be added soon...</p>
        </div>
      </div>
      <button>
        <Link to="/create-playlist">Create Playlist</Link>
      </button>
      <div>
        <Link to="/search">
          <button>Search</button>
        </Link>
      </div>
    </div>
  );
};

export default ListenHome;
