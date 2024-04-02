import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

const CreateAlbum = () => {
  const [albumName, setAlbumName] = useState('');
  const [genre, setGenre] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const { artistId } = useParams();

  useEffect(() => {
    // Fetch initial search results when component mounts
    handleSearch();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate input
    if (!albumName || !genre || !releaseDate) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      // Generate a random alphanumeric album ID
      const albumId = generateRandomAlbumId();

      // Check if the generated album ID already exists
      const isAlbumIdExists = await checkAlbumIdExists(albumId);
      if (isAlbumIdExists) {
        setError('Album ID already exists, please try again');
        return;
      }

      // Extract recording IDs from selected songs
      const songIds = selectedSongs.map(song => song[0]);
      const songCount = songIds.length;

      const releaseDateFormatted = formatReleaseDate(releaseDate);

      const response = await fetch('/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `INSERT INTO album (album_id, artist_id, album_name, genre, releasedate, recording_ids) VALUES ('${albumId}', '${artistId}', '${albumName}', '${genre}', '${releaseDateFormatted}', '{${songIds.join(',')}}')`
        })
      });
      if (!response.ok) {
        throw new Error('Failed to create album');
      }
      // Redirect to artist home page or wherever appropriate

    } catch (error) {
      setError(error.message);
    }
  };

  const handleSearch = async () => {
    try {
      const query = `SELECT * FROM recording WHERE type = 'song' AND recording_name LIKE '%${searchTerm}%'`;
      const response = await fetch('/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAddSong = (song) => {
    setSelectedSongs(prevSongs => [...prevSongs, song]);
  };

  const handleRemoveSong = (songId) => {
    setSelectedSongs(prevSongs => prevSongs.filter(song => song[0] !== songId));
  };

  const handleCreateRecording = () => {
    window.alert("Hey there! 👋🏾 This functionality is yet to be added as it requires mp3 file uploads, which this website isn't capable of handling yet. We will hopefully have this done soon🤞🏾");
    console.log('Navigate to create recording page');
  };

  // Function to generate a random alphanumeric album ID
  const generateRandomAlbumId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let albumId = '';
    for (let i = 0; i < 10; i++) {
      albumId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return albumId;
  };

  // Function to check if the generated album ID already exists in the database
  const checkAlbumIdExists = async (albumId) => {
    try {
      const response = await fetch('/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `SELECT COUNT(*) AS count FROM albums WHERE album_id = '${albumId}'`
        })
      });
      if (!response.ok) {
        throw new Error('Failed to check album ID existence');
      }
      const data = await response.json();
      // If count is greater than 0, album ID exists
      return (data ? data[0].count : 0);
    } catch (error) {
      console.error('Error checking album ID existence:', error);
      return false;
    }
  };

  // Function to format the release date as DDMMYYYY
  const formatReleaseDate = (dateString) => {
    const parts = dateString.split('-'); // Split the date string by hyphens
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    // console.log(dateString);
    // console.log(day + month + year);
    return day + month + year;
  };



  return (
    <div>
      <h2>Create Album</h2>
      {error && <div>Error: {error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Album Name:</label>
          <input type="text" value={albumName} onChange={(e) => setAlbumName(e.target.value)} />
        </div>
        <div>
          <label>Genre:</label>
          <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} />
        </div>
        <div>
          <label>Release Date:</label>
          <input
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
          />
        </div>
        <div>
          <h3>Search Songs:</h3>
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <button type="button" onClick={handleSearch}>Search</button>
          {searchResults && searchResults.length > 0 && (
            <ul>
              {searchResults.map((song, index) => (
                <li key={index}>
                  {song[2]} - Genre: {song[7]}
                  <button type="button" onClick={() => handleAddSong(song)}>Add</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h3>Selected Songs:</h3>
          <ul>
            {selectedSongs.map((song, index) => (
              <li key={index}>
                {song[2]} - Genre: {song[7]}
                <button type="button" onClick={() => handleRemoveSong(song[0])}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <button type="submit">Create Album</button>
        </div>
        <div>
          <button type="button" onClick={handleCreateRecording}>Create New Recording</button>
        </div>
      </form>
    </div>
  );
};

export default CreateAlbum;
