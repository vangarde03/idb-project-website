import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const FollowListener = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [listeners, setListeners] = useState([]);
  const [selectedListener, setSelectedListener] = useState('');
  const [selectedListenerName, setSelectedListenerName] = useState('');
  const [message, setMessage] = useState('');
  const { userId } = useParams();

  useEffect(() => {
    // Fetch listeners based on the search query
    const fetchListeners = async () => {
      try {
        // Construct the SQL query to fetch listeners not followed by the current user
        const query = `SELECT * FROM listener WHERE (listener_id LIKE '%${searchQuery}%' OR display_name LIKE '%${searchQuery}%') 
                      AND listener_id NOT IN (
                        SELECT followeelistener FROM followsBetweenListeners WHERE followerlistener = '${userId}'
                      ) AND listener_id NOT IN (
                        SELECT followeelistener FROM artistFollowsListener WHERE followerartist = '${userId}');`;

        // Send a POST request to the server with the SQL query
        const response = await fetch('http://127.0.0.1:5000/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query })
        });

        // Parse the response data
        const data = await response.json();
        setListeners(data);
      } catch (error) {
        console.error('Error fetching listeners:', error);
      }
    };

    // Only fetch listeners if the search query is not empty
    if (searchQuery.trim() !== '') {
      fetchListeners();
    } else {
      setListeners([]);
    }
  }, [searchQuery]);

  const handleListenerSelection = (listenerId, listenerName) => {
    setSelectedListener(listenerId);
    setSelectedListenerName(listenerName);
  };

  const isInArtistTable = async (userId) => {
    try {
      const query = `SELECT artist_id FROM artist WHERE artist_id = '${userId}';`;
      const response = await fetch('http://127.0.0.1:5000/query', {
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


  const handleFollow = async () => {
    try {
      // Check if the follower is an artist
      const isArtist = await isInArtistTable(userId);

      // Construct the SQL query to follow the selected listener
      const queryFollowListener = `INSERT INTO followsbetweenlisteners (followerlistener, followeelistener) VALUES ('${userId}', '${selectedListener}');`;

      if (isArtist) {
        // If the follower is an artist, insert into the artistfollowslistener table
        const queryFollowArtist = `INSERT INTO artistfollowslistener (followerartist, followeelistener) VALUES ('${userId}', '${selectedListener}');`;

        // Send a POST request to the server to execute the query to follow the listener
        const responseFollowListener = await fetch('http://127.0.0.1:5000/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query: queryFollowListener })
        });

        // Send a POST request to the server to execute the query to insert into artistfollowslistener
        const responseFollowArtist = await fetch('http://127.0.0.1:5000/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query: queryFollowArtist })
        });

        if (responseFollowListener.ok && responseFollowArtist.ok) {
          setMessage(`Successfully followed listener ${selectedListener}`);
        } else {
          setMessage('Failed to follow listener. Please try again.');
        }
      } else {
        // If the follower is not an artist, only insert into followsbetweenlisteners table
        const response = await fetch('http://127.0.0.1:5000/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query: queryFollowListener })
        });

        if (response.ok) {
          setMessage(`Successfully followed listener ${selectedListener}`);
        } else {
          setMessage('Failed to follow listener. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error following listener:', error);
      setMessage('An error occurred while following the listener.');
    }
  };


  return (
    <div>
      <h2>Follow a Listener</h2>
      <input
        type="text"
        placeholder="Search by ID or name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {listeners.length > 0 && (
        <ul>
          {listeners.map((listener) => (
            <li key={listener[0]}>
              <button onClick={() => handleListenerSelection(listener[0], listener[1])}>
                {listener[1]}
              </button>
            </li>
          ))}
        </ul>
      )}
      {selectedListener && (
        <div>
          <p>Selected Listener ID: {selectedListener} || Selected Listener Name: {selectedListenerName}</p>
          <button onClick={handleFollow}>Follow</button>
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default FollowListener;
