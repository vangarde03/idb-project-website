import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const ListenHome = () => {
  const location = useLocation();
  const { state } = location;
  const { username } = state;
  console.log(state.alphaNumID);

  const [playlists, setPlaylists] = useState([]);
  const [followerListeners, setFollowerListeners] = useState([]);
  const [followerArtists, setFollowerArtists] = useState([]);

  const [followedListeners, setFollowedListeners] = useState([]);
  const [followedArtists, setFollowedArtists] = useState([]);


  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const query = `SELECT title, number_of_likes, playlist_id FROM playlist WHERE listener_id = '${state.alphaNumID}';`;
        const response = await fetch('http://127.0.0.1:5000/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query })
        });
        const data = await response.json();
        setPlaylists(data);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      }
    };

    const fetchFollowerListeners = async () => {
      try {
        const query = `SELECT followerlistener FROM followsbetweenlisteners WHERE followeelistener = '${state.alphaNumID}';`;
        const response = await fetch('http://127.0.0.1:5000/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query })
        });
        const data = await response.json();
        setFollowerListeners(data);
      } catch (error) {
        console.error('Error fetching follower listeners:', error);
      }
    };

    const fetchFollowerArtists = async () => {
      try {
        const query = `SELECT followerartist FROM artistfollowslistener WHERE followeelistener = '${state.alphaNumID}';`;
        const response = await fetch('http://127.0.0.1:5000/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query })
        });
        const data = await response.json();
        setFollowerArtists(data);
      } catch (error) {
        console.error('Error fetching follower artists:', error);
      }
    };

    const fetchFollowedListeners = async () => {
      try {
        const query = `SELECT followeelistener FROM followsbetweenlisteners WHERE followerlistener = '${state.alphaNumID}';`;
        const response = await fetch('http://127.0.0.1:5000/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query })
        });
        const data = await response.json();
        setFollowedListeners(data);
      } catch (error) {
        console.error('Error fetching followed listeners:', error);
      }
    };

    const fetchFollowedArtists = async () => {
      try {
        const query = `SELECT followeeartist FROM listenerfollowsartist WHERE followerlistener = '${state.alphaNumID}';`;
        const response = await fetch('http://127.0.0.1:5000/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query })
        });
        const data = await response.json();
        setFollowedArtists(data);
      } catch (error) {
        console.error('Error fetching followed artists:', error);
      }
    };



    fetchPlaylists();
    fetchFollowerListeners();
    fetchFollowerArtists();
    fetchFollowedListeners();
    fetchFollowedArtists();
  }, []);


  return (
    <div>
      <h1>Hello, {username}!</h1>
      <div>

        <h2>***Disclaimer***</h2>
        <h3>Recordings cannot be listened to yet as mp3 files are yet to be added to the database (functionality coming soon...)</h3>
        <h2>My Playlists</h2>

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
        <div>
          <h3>Followed Listeners:</h3>
          {followedListeners.length > 0 ? (
            <ul>
              {followedListeners.map((listener, index) => (
                <li key={index}>
                  Followed Listener ID: {listener[0]}
                </li>
              ))}
            </ul>
          ) : (
            <p>No followed listeners found</p>
          )}
        </div>
        <div>
          <h3>Followed Artists:</h3>
          {followedArtists.length > 0 ? (
            <ul>
              {followedArtists.map((artist, index) => (
                <li key={index}>
                  Followed Artist ID: {artist[0]}
                </li>
              ))}
            </ul>
          ) : (
            <p>No followed artists found</p>
          )}
        </div>
      </div>
      <div>
        <h2>Your Followers</h2>
        <div className="follower-list">
          <h3>Follower Listeners:</h3>
          {followerListeners.length > 0 ? (
            <ul>
              {followerListeners.map((follower, index) => (
                <li key={index}>
                  Follower Listener ID: {follower[0]}
                </li>
              ))}
            </ul>
          ) : (
            <p>No follower listeners found</p>
          )}
        </div>
        <div className="follower-list">
          <h3>Follower Artists:</h3>
          {followerArtists.length > 0 ? (
            <ul>
              {followerArtists.map((follower, index) => (
                <li key={index}>
                  Follower Artist ID: {follower[0]}
                </li>
              ))}
            </ul>
          ) : (
            <p>No follower artists found</p>
          )}
        </div>
      </div>
      <div>
        <button>
          <Link to={`/followArtist/${state.alphaNumID}`}>Follow Artist</Link>
        </button>
        <button>
          <Link to={`/followListener/${state.alphaNumID}`}>Follow Listener</Link>
        </button>
        <button>
          <Link to={`/removeFollower/${state.alphaNumID}`}>Remove Follower</Link>
        </button>
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
        <Link to={`/createPlaylist/${state.alphaNumID}`}>Create Playlist</Link>
      </button>
      <div>
        <Link to="/search">
          <button>Search</button>
        </Link>
      </div>
    </div >
  );
};

export default ListenHome;
