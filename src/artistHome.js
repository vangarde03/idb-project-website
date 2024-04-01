import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const ArtistHome = () => {
  const location = useLocation();
  const { state } = location;
  const { username } = state;
  // console.log(state.alphaNumID);

  const [albums, setAlbums] = useState([]);
  const [podcasts, setPodcasts] = useState([]);


  // console.log(state.alphaNumID);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const query = `SELECT * FROM album WHERE artist_id = '${state.alphaNumID}';`;
        const response = await fetch('http://127.0.0.1:5000/query', {
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
        const response = await fetch('http://127.0.0.1:5000/query', {
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

    fetchAlbums();
    fetchPodcasts();
  }, []);

  console.log(albums);
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
      <button>
        <Link to="/create-album">Create Album</Link>
      </button>
      <button>
        <Link to="/create-podcast">Create Podcast</Link>
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
