import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const Podcast = () => {
  const { podcastId } = useParams();
  const [podcastInfo, setPodcastInfo] = useState(null);
  const [error, setError] = useState(null);

  console.log(podcastId);

  useEffect(() => {
    const fetchPodcastInfo = async () => {
      try {
        const query = `SELECT podcast_name, follower_count, episodes_count, recording_ids FROM podcasts WHERE podcast_id = '${podcastId}';`;
        const response = await fetch('http://127.0.0.1:5000/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query })
        });
        if (!response.ok) {
          throw new Error('Failed to fetch podcast information');
        }
        const data = await response.json();
        setPodcastInfo(data);
      } catch (error) {
        console.error('Error fetching podcast:', error);
        setError(error.message);
      }
    };

    fetchPodcastInfo();
  }, [podcastId]);



  useEffect(() => {
    const fetchRecordingDetails = async () => {
      if (podcastInfo && podcastInfo.length > 0) {
        const recordingIds = podcastInfo[0][3]; // Assuming recording_ids is an array of recording IDs
        console.log(recordingIds);
        const query = `SELECT * FROM recording WHERE recording_id IN (${recordingIds.map(id => `'${id}'`).join(',')});`;
        try {
          const response = await fetch('http://127.0.0.1:5000/query', {
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


          setPodcastInfo(prevState => ({ ...prevState, recordings: data }));

        } catch (error) {
          console.error('Error fetching recording details:', error);
          setError(error.message);
        }

      }
    };

    fetchRecordingDetails();
  }, [podcastInfo]);

  if (error) {
    return <div>Error: {error}</div>;
  }


  // console.log(podcastInfo.recordings);

  return (
    <div>
      <h1>{podcastInfo ? podcastInfo[0][0] : 'Podcast not found'}</h1>
      {podcastInfo && podcastInfo[0] ? (
        <div>
          <p>Number of Likes: {podcastInfo[0][1]}</p>
          <p>Number of Episodes: {podcastInfo[0][2]}</p>
          <p>Contents:</p>
          <ul>
            {podcastInfo.recordings && podcastInfo.recordings.map((recording, index) => (
              <li key={index}>
                {`${recording[2]}`} - Episode {recording[4]}
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

export default Podcast;
