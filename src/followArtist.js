import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const FollowArtist = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState('');
  const [selectedArtistName, setSelectedArtistName] = useState('');
  const [message, setMessage] = useState('');
  const { userId } = useParams();

  useEffect(() => {
    // Fetch artists based on the search query
    const fetchArtists = async () => {
      try {
        // Construct the SQL query
        // const query = `SELECT * FROM artist WHERE artist_id LIKE '%${searchQuery}%' OR name LIKE '%${searchQuery}%';`;
        const query = `SELECT * FROM artist WHERE (artist_id LIKE '%${searchQuery}%' OR name LIKE '%${searchQuery}%') 
                      AND artist_id NOT IN (SELECT followeeartist FROM followsBetweenArtists WHERE followerartist = '${userId}')
                      AND artist_id NOT IN (SELECT followeeartist FROM listenerFollowsArtist WHERE followerlistener = '${userId}');`;


        // Send a POST request to the server with the SQL query
        const response = await fetch('https://34.148.215.131:8111/query/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query })
        });

        // Parse the response data
        const data = await response.json();
        setArtists(data);
      } catch (error) {
        console.error('Error fetching artists:', error);
      }
    };

    // Only fetch artists if the search query is not empty
    if (searchQuery.trim() !== '') {
      fetchArtists();
    } else {
      setArtists([]);
    }
  }, [searchQuery]);




  const isInArtistTable = async (userId) => {
    try {
      const query = `SELECT artist_id FROM artist WHERE artist_id = '${userId}';`;
      const response = await fetch('https://34.148.215.131:8111/query/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });
      const data = await response.json();
      return data.length > 0; // If data is returned, the user ID exists in the artist table
    } catch (error) {
      console.error('Error checking if user is in artist table:', error);
      return false;
    }
  };

  const handleArtistSelection = (artistId, artistName) => {
    setSelectedArtist(artistId);
    setSelectedArtistName(artistName);
  };

  const handleFollow = async () => {
    try {
      // Determine if the user is in the artist table
      const isInArtist = await isInArtistTable(userId);
      const tableName = isInArtist ? 'followsbetweenartists' : 'listenerfollowsartist';

      console.log(userId);

      // Construct the SQL query based on the table name and user IDs
      const query = `INSERT INTO ${tableName} (follower${isInArtist ? 'artist' : 'listener'}, followeeartist) VALUES ('${userId}', '${selectedArtist}');`;

      // Send a POST request to the server to execute the query
      const response = await fetch('https://34.148.215.131:8111/query/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });

      if (response.ok) {
        setMessage(`Successfully followed artist ${selectedArtist}`);
      } else {
        setMessage('Failed to follow artist. Please try again.');
      }
    } catch (error) {
      console.error('Error following artist:', error);
      setMessage('An error occurred while following the artist.');
    }

  };



  return (
    <div>
      <h2>Follow an Artist</h2>
      <input
        type="text"
        placeholder="Search by ID or name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {artists.length > 0 && (
        <ul>
          {artists.map((artist) => (
            <li key={artist[0]}>
              <button onClick={() => handleArtistSelection(artist[0], artist[1])}>
                {artist[1]}
              </button>
            </li>
          ))}
        </ul>
      )}
      {selectedArtist && (
        <div>
          <p>Selected Artist ID: {selectedArtist} || Selected Artist Name: {selectedArtistName}</p>
          <button onClick={handleFollow}>Follow</button>
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default FollowArtist;
