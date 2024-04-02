import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const CreatePlaylist = ({ }) => {
  const [title, setTitle] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [selectedRecordings, setSelectedRecordings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const { listenerId } = useParams();


  // Function to handle recording search
  const handleSearch = async () => {
    try {
      const query = `SELECT * FROM recording WHERE recording_name LIKE '%${searchTerm}%'`;
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
  // console.log(searchTerm);
  // console.log(searchResults);

  const handleAddRecording = (recordingId) => {
    setSelectedRecordings(prevState => [...prevState, recordingId]);
  };

  const handleRemoveRecording = (recordingId) => {
    console.log(recordingId);
    setSelectedRecordings(prevState => prevState.filter(id => id !== recordingId));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate input
    if (!title || selectedRecordings.length === 0) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      // Generate a random alphanumeric playlist ID
      const playlistId = generateRandomPlaylistId();

      // Check if the generated playlist ID already exists
      const isPlaylistIdExists = await checkPlaylistIdExists(playlistId);
      if (isPlaylistIdExists) {
        setError('Playlist ID already exists, please try again');
        return;
      }

      const response = await fetch('/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `INSERT INTO playlist (playlist_id, listener_id, number_of_likes, title, visibility, recording_ids) VALUES ('${playlistId}', '${listenerId}', 0, '${title}', '${visibility}', '{${selectedRecordings.map(id => `${id[0]}`).join(',')}}');`

        })
      });
      if (!response.ok) {
        throw new Error('Failed to create playlist');
      }
      // Redirect to listener home page
      // history.push('/listenHome');
    } catch (error) {
      setError(error.message);
    }
  };



  // Function to generate a random alphanumeric playlist ID
  const generateRandomPlaylistId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let playlistId = '';
    for (let i = 0; i < 30; i++) {
      playlistId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return playlistId;
  };

  // Function to check if the generated playlist ID already exists in the database
  const checkPlaylistIdExists = async (playlistId) => {
    try {
      const query = `SELECT COUNT(*) AS count FROM playlist WHERE playlist_id = '${playlistId}'`;
      const response = await fetch('/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });
      if (!response.ok) {
        throw new Error('Failed to check playlist ID existence');
      }
      const data = await response.json();
      // If count is greater than 0, playlist ID exists
      return data[0].count > 0;
    } catch (error) {
      console.error('Error checking playlist ID existence:', error);
      return false;
    }
  };

  return (
    <div>
      <h2>Create Playlist</h2>
      {error && <div>Error: {error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label>Visibility:</label>
          <select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
        <div>
          <h3>Search Recordings:</h3>
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <button type="button" onClick={handleSearch}>Search</button>
          {searchResults && searchResults.length > 0 && (
            <ul>
              {searchResults.map((recording, index) => (
                <li key={index}>
                  {recording[2]} - Genre: {recording[7]}
                  <button type="button" onClick={() => handleAddRecording(recording)}>Add</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h3>Selected Recordings:</h3>
          <ul>
            {selectedRecordings.map((recordingId, index) => (
              <li key={index}>
                {recordingId[2]}
                <button type="button" onClick={() => handleRemoveRecording(recordingId)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <button type="submit">Create Playlist</button>
        </div>
      </form>
    </div>
  );
};

export default CreatePlaylist;
