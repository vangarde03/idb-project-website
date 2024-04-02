import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const Album = () => {
  const { albumId } = useParams();
  const [albumInfo, setAlbumInfo] = useState(null);
  const [error, setError] = useState(null);

  const convertDataToArrayOfArrays = (data) => {
    return data.map(item => Object.values(item));
  };

  useEffect(() => {
    const fetchAlbumInfo = async () => {
      try {
        const query = `SELECT album_name, genre, releasedate, recording_ids FROM album WHERE album_id = '${albumId}';`;
        const response = await fetch('/query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query })
        });
        if (!response.ok) {
          throw new Error('Failed to fetch album information');
        }
        const data = convertDataToArrayOfArrays(await response.json());
        setAlbumInfo(data);
      } catch (error) {
        console.error('Error fetching album:', error);
        setError(error.message);
      }
    };

    fetchAlbumInfo();
  }, [albumId]);

  useEffect(() => {
    const fetchRecordingDetails = async () => {
      if (albumInfo && albumInfo.length > 0) {
        const recordingIds = albumInfo[0][3]; // Assuming recording_ids is an array of recording IDs
        const query = `SELECT * FROM recording WHERE recording_id IN (${recordingIds.map(id => `'${id}'`).join(',')});`;
        try {
          const response = await fetch('/query', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query })
          });
          if (!response.ok) {
            throw new Error('Failed to fetch recording details');
          }
          const data = convertDataToArrayOfArrays(await response.json());
          setAlbumInfo(prevState => ({ ...prevState, recordings: data }));
        } catch (error) {
          console.error('Error fetching recording details:', error);
          setError(error.message);
        }
      }
    };

    fetchRecordingDetails();
  }, [albumInfo]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Format release date
  const formatDate = (numericDate) => {
    const dateString = formatReleaseDate2(numericDate.toString());
    const day = dateString.substr(0, 2);
    const month = dateString.substr(2, 2);
    const year = dateString.substr(4, 4);
    return `${day}/${month}/${year}`;
  };

  const formatReleaseDate2 = (dateString) => {
    if (dateString.length < 8) {
      // Add leading zero if date string length is less than 8
      return '0' + dateString;
    }
    return dateString;
  };


  return (
    <div>
      <h1>{albumInfo ? albumInfo[0][0] : 'Album not found'}</h1>
      {albumInfo && albumInfo[0] ? (
        <div>
          <p>Genre: {albumInfo[0][1]}</p>
          <p>Original Release Date: {formatDate(albumInfo[0][2])}</p>
          <p>Contents:</p>
          <ul>
            {albumInfo.recordings && albumInfo.recordings.map((recording, index) => (
              <li key={index}>
                {`${recording[2]}`} || Latest Recording Release Date: {formatDate(recording[5])}
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

export default Album;
