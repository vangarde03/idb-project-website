import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const ArtistHome = () => {
  const location = useLocation();
  const { state } = location;
  const { username } = state;

  const [albums, setAlbums] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [followerListeners, setFollowerListeners] = useState([]);
  const [followerArtists, setFollowerArtists] = useState([]);
  const [followedListeners, setFollowedListeners] = useState([]);
  const [followedArtists, setFollowedArtists] = useState([]);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const query = `SELECT * FROM album WHERE artist_id = '${state.alphaNumID}';`;
        const response = await fetch('/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query })
        });
        const data = await response.json();
        setAlbums(data);
      } catch (error) {
        console.error('Error fetching albums:', error);
      }
    };

    const fetchPodcasts = async () => {
      try {
        const query = `SELECT * FROM podcasts WHERE artist_id = '${state.alphaNumID}';`;
        const response = await fetch('/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query })
        });
        const data = await response.json();
        setPodcasts(data);
      } catch (error) {
        console.error('Error fetching podcasts:', error);
      }
    };

    const fetchFollowerListeners = async () => {
      try {
        const query = `SELECT followerlistener FROM listenerfollowsartist WHERE followeeartist = '${state.alphaNumID}';`;
        const response = await fetch('/query', {
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
        const query = `SELECT followerartist FROM followsbetweenartists WHERE followeeartist = '${state.alphaNumID}';`;
        const response = await fetch('/query', {
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
        const query = `SELECT followeelistener FROM artistfollowslistener WHERE followerartist = '${state.alphaNumID}';`;
        const response = await fetch('/query', {
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
        const query = `SELECT followeeartist FROM followsbetweenartists WHERE followerartist = '${state.alphaNumID}';`;
        const response = await fetch('/query', {
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

    fetchAlbums();
    fetchPodcasts();
    fetchFollowerListeners();
    fetchFollowerArtists();
    fetchFollowedListeners();
    fetchFollowedArtists();
  }, []);

  // console.log(albums);
  // console.log(podcasts);


  return (
    <div>
      <h1>Hello, {username}!</h1>
      <div>
        <h2>My Albums</h2>
        <div className="album-box">
          {albums && albums.length > 0 ? (
            <ul>
              {albums.map((album, index) => (
                <li key={index}>
                  <Link to={{
                    pathname: `/album/${album[0]}`,
                    state: state,  // Pass the state object here
                  }}>{album[2]}</Link> - Genre: {album[3]}
                </li>
              ))}
            </ul>
          ) : (
            <p>No albums found</p>
          )}
        </div>
      </div>
      <div>
        <h2>My Podcasts</h2>
        <div className="podcast-box">
          {podcasts && podcasts.length > 0 ? (
            <ul>
              {podcasts.map((podcast, index) => (
                <li key={index}>
                  <Link to={{
                    pathname: `/podcast/${podcast[0]}`,
                    state: state,  // Pass the state object here
                  }}>{podcast[2]}</Link> - Followers: {podcast[6]}, Number of Episodes: {podcast[7]}
                </li>

              ))}
            </ul>
          ) : (
            <p>No podcasts found</p>
          )}
        </div>
      </div>
      <div>
        <h2>Who Follows You</h2>
        <div>
          <h3>Follower Listeners:</h3>
          {followerListeners.length > 0 ? (
            <ul>
              {followerListeners.map((listener, index) => (
                <li key={index}>
                  Follower Listener ID: {listener[0]}
                </li>
              ))}
            </ul>
          ) : (
            <p>No follower listeners found</p>
          )}
        </div>
        <div>
          <h3>Follower Artists:</h3>
          {followerArtists.length > 0 ? (
            <ul>
              {followerArtists.map((artist, index) => (
                <li key={index}>
                  Follower Artist ID: {artist[0]}
                </li>
              ))}
            </ul>
          ) : (
            <p>No follower artists found</p>
          )}
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
        <button>
          <Link to={`/followArtist/${state.alphaNumID}`}>Follow Artist</Link>
        </button>
        <button>
          <Link to={`/followListener/${state.alphaNumID}`}>Follow Listener</Link>
        </button>
        <button>
          <Link to={`/removeFoll/${state.alphaNumID}`}>Remove Follower/Followee</Link>
        </button>
      </div>
      <button>
        <Link to={`/createAlbum/${state.alphaNumID}`}>Create Album</Link>
      </button>
      <button>
        <Link to={`/createPodcast/${state.alphaNumID}`}>Create Podcast</Link>
      </button>
      <div>
        <Link to="/search">
          <button>Search</button>
        </Link>
      </div>
    </div >
  );
};

export default ArtistHome;
