import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';

const CreatePodcast = ({ }) => {
  const [podcastName, setPodcastName] = useState('');
  const [genre, setGenre] = useState('');
  const [host, setHost] = useState('');
  const [seasonNumber, setSeasonNumber] = useState('');
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedRecordings, setSelectedRecordings] = useState([]);
  const { artistId } = useParams();


  useEffect(() => {
    // Fetch initial search results when component mounts
    handleSearch();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate input
    if (!podcastName || !genre || !host || seasonNumber < 0) {
      setError('Please fill in all required fields and ensure season number is non-negative');
      return;
    }

    try {
      // Generate a random alphanumeric podcast ID
      const podcastId = generateRandomPodcastId();

      // Check if the generated podcast ID already exists
      const isPodcastIdExists = await checkPodcastIdExists(podcastId);
      if (isPodcastIdExists) {
        setError('Podcast ID already exists, please try again');
        return;
      }

      // Extract recording IDs from selected recordings
      const recordingIds = selectedRecordings.map(recording => recording[0]);
      const episodeCount = recordingIds.length;

      const response = await fetch('https://34.148.215.131:8111/query/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `INSERT INTO podcasts (podcast_id, artist_id, podcast_name, genre, season_number, hosts_authors, follower_count, episodes_count, recording_ids) VALUES ('${podcastId}', '${artistId}', '${podcastName}', '${genre}', '${seasonNumber}', '${host}', 0, ${episodeCount}, '{${recordingIds.join(',')}}')`
        })
      });
      if (!response.ok) {
        throw new Error('Failed to create podcast');
      }
      // Redirect to artist home page or wherever appropriate

    } catch (error) {
      setError(error.message);
    }
  };

  const handleSearch = async () => {
    try {
      const query = `SELECT * FROM recording WHERE type = 'podcastEpisode' AND recording_name LIKE '%${searchTerm}%'`;
      const response = await fetch('https://34.148.215.131:8111/query/', {
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

  const handleAddRecording = (recording) => {
    setSelectedRecordings(prevRecordings => [...prevRecordings, recording]);
  };

  const handleRemoveRecording = (recordingId) => {
    setSelectedRecordings(prevRecordings => prevRecordings.filter(recording => recording[0] !== recordingId));
  };

  const handleCreateRecording = () => {
    // Implement functionality to navigate to create recording page
    window.alert("Hey there! 👋🏾 This functionality is yet to be added as it requires mp3 file uploads, which this website isn't capable of handling yet. We will hopefully have this done soon🤞🏾");
    console.log('Navigate to create recording page');
  };

  // Function to generate a random alphanumeric podcast ID
  const generateRandomPodcastId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let podcastId = '';
    for (let i = 0; i < 10; i++) {
      podcastId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return podcastId;
  };

  // Function to check if the generated podcast ID already exists in the database
  const checkPodcastIdExists = async (podcastId) => {
    try {
      const response = await fetch('https://34.148.215.131:8111/query/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `SELECT COUNT(*) AS count FROM podcasts WHERE podcast_id = '${podcastId}'`
        })
      });
      if (!response.ok) {
        throw new Error('Failed to check podcast ID existence');
      }
      const data = await response.json();
      // If count is greater than 0, podcast ID exists
      return data[0].count > 0;
    } catch (error) {
      console.error('Error checking podcast ID existence:', error);
      return false;
    }
  };

  return (
    <div>
      <h2>Create Podcast</h2>
      {error && <div>Error: {error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Podcast Name:</label>
          <input type="text" value={podcastName} onChange={(e) => setPodcastName(e.target.value)} />
        </div>
        <div>
          <label>Genre:</label>
          <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} />
        </div>
        <div>
          <label>Host:</label>
          <input type="text" value={host} onChange={(e) => setHost(e.target.value)} />
        </div>
        <div>
          <label>Season Number:</label>
          <input type="number" value={seasonNumber} onChange={(e) => setSeasonNumber(e.target.value)} />
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
          <button type="button" onClick={handleCreateRecording}>Create New Recording</button>
        </div>
        <div>
          <h3>Selected Recordings:</h3>
          <ul>
            {selectedRecordings.map((recording, index) => (
              <li key={index}>
                {recording[2]} - Genre: {recording[7]}
                <button type="button" onClick={() => handleRemoveRecording(recording[0])}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <button type="submit">Create Podcast</button>
        </div>
      </form>
    </div>
  );
};

export default CreatePodcast;
