import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';

const Playlist = () => {
  const { playlistId } = useParams();
  const [playlistInfo, setPlaylistInfo] = useState(null);
  const [error, setError] = useState(null);
  const location = useLocation();
  // const state = location;
  // console.log(state);

  useEffect(() => {
    const fetchPlaylistInfo = async () => {
      try {
        const query = `SELECT title, number_of_likes, recording_ids FROM playlist WHERE playlist_id = '${playlistId}';`;
        const response = await fetch('http://34.148.215.131:8111/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query })
        });
        if (!response.ok) {
          throw new Error('Failed to fetch playlist information');
        }
        const data = await response.json();
        setPlaylistInfo(data);
      } catch (error) {
        console.error('Error fetching playlist:', error);
        setError(error.message);
      }
    };

    fetchPlaylistInfo();
  }, [playlistId]);

  useEffect(() => {
    const fetchRecordingDetails = async () => {
      if (playlistInfo && playlistInfo.length > 0) {
        const recordingIds = playlistInfo[0][2]; // Assuming recording_ids is an array of recording IDs
        const query = `SELECT * FROM recording WHERE recording_id IN (${recordingIds.map(id => `'${id}'`).join(',')});`;
        try {
          const response = await fetch('http://34.148.215.131:8111/query', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query })
          });
          if (!response.ok) {
            throw new Error('Failed to fetch recording details');
          }
          const data = await response.json();

          console.log(data);
          setPlaylistInfo(prevState => ({ ...prevState, recordings: data }));

        } catch (error) {
          console.error('Error fetching recording details:', error);
          setError(error.message);
        }

      }
    };

    fetchRecordingDetails();
  }, [playlistInfo]);

  // console.log(playlistInfo.recordings)

  if (error) {
    return <div>Error: {error}</div>;
  }
  // console.log(playlistInfo[0][0])
  return (
    <div>
      <h1>{playlistInfo ? (playlistInfo[0][0]) : console.log("Playlist not found")}</h1>
      {playlistInfo && playlistInfo[0] ? (
        <div>
          <p>Number of Likes: {playlistInfo[0][1]}</p>
          <p>Contents:</p>
          <ul>
            {/* {playlistInfo[0][2] && playlistInfo[0][2].map((recordingId, index) => (
              <li key={index}>{recordingId}</li>
            ))} */}
            {playlistInfo.recordings && playlistInfo.recordings.map((recording, index) => (
              <li key={index}>
                {recording[2]} - {recording[1] === 'song' ? 'Song' : 'Podcast Episode'}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <button>Back (use browser back for now)</button>

    </div>
  );
};

export default Playlist;
