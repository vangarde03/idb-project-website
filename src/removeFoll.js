import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const RemoveFoll = () => {
  const { userId } = useParams();
  const [followerArtists, setFollowerArtists] = useState([]);
  const [followeeArtists, setFolloweeArtists] = useState([]);
  const [followerListeners, setFollowerListeners] = useState([]);
  const [followeeListeners, setFolloweeListeners] = useState([]);

  useEffect(() => {
    const fetchFollowersAndFollowees = async () => {
      try {
        const isArtist = await isInArtistTable(userId);

        // if (isArtist) {
        // fetchArtistFollowers(userId);
        // fetchArtistFollowees(userId);
        // } else {
        if (isArtist) {
          fetchArtistFollowersA(userId);
          fetchArtistFolloweesA(userId);
          fetchListenerFollowersA(userId);
          fetchListenerFolloweesA(userId);

        } else {
          fetchArtistFollowers(userId);
          fetchArtistFollowees(userId);
          fetchListenerFollowers(userId);
          fetchListenerFollowees(userId);
        }

      } catch (error) {
        console.error('Error fetching followers and followees:', error);
      }
    };

    fetchFollowersAndFollowees();
  }, [userId]);

  const isInArtistTable = async (userId) => {
    try {
      const artistQuery = `SELECT * FROM artist WHERE artist_id = '${userId}';`;
      const artistResponse = await fetch('http://34.148.215.131:8111/query/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: artistQuery })
      });
      const artistData = await artistResponse.json();

      if (artistData.length > 0) {
        return true;
      }

      const listenerQuery = `SELECT * FROM listener WHERE listener_id = '${userId}';`;
      const listenerResponse = await fetch('http://34.148.215.131:8111/query/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: listenerQuery })
      });
      const listenerData = await listenerResponse.json();

      if (listenerData.length > 0) {
        return false;
      }

      throw new Error('User ID not found in artist or listener table.');
    } catch (error) {
      console.error('Error checking user table:', error);
      return false;
    }
  };

  const fetchArtistFollowersA = async (artistId) => {
    try {
      const query = `SELECT followerartist FROM followsbetweenartists WHERE followeeartist = '${artistId}';`;
      const response = await fetch('http://34.148.215.131:8111/query/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });
      const data = await response.json();
      setFollowerArtists(data);
    } catch (error) {
      console.error('Error fetching followers:', error);
    }
  };

  const fetchArtistFolloweesA = async (artistId) => {
    try {
      const query = `SELECT followeeartist FROM followsbetweenartists WHERE followerartist = '${artistId}';`;
      const response = await fetch('http://34.148.215.131:8111/query/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });
      const data = await response.json();
      setFolloweeArtists(data);
    } catch (error) {
      console.error('Error fetching followees:', error);
    }
  };

  const fetchListenerFollowersA = async (artistId) => {
    try {
      const query = `SELECT followerlistener FROM listenerfollowsartist WHERE followeeartist = '${artistId}';`;
      const response = await fetch('http://34.148.215.131:8111/query/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });
      const data = await response.json();
      setFollowerListeners(data);
    } catch (error) {
      console.error('Error fetching followers:', error);
    }
  };

  const fetchListenerFolloweesA = async (artistId) => {
    try {
      const query = `SELECT followeelistener FROM artistfollowslistener WHERE followerartist = '${artistId}';`;
      const response = await fetch('http://34.148.215.131:8111/query/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });
      const data = await response.json();
      setFolloweeListeners(data);
    } catch (error) {
      console.error('Error fetching followees:', error);
    }
  };

  const fetchArtistFollowers = async (artistId) => {
    try {
      const query = `SELECT followerartist FROM artistfollowslistener WHERE followeelistener = '${artistId}';`;
      const response = await fetch('http://34.148.215.131:8111/query/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });
      const data = await response.json();
      setFollowerArtists(data);
    } catch (error) {
      console.error('Error fetching followers:', error);
    }
  };

  const fetchArtistFollowees = async (listenerId) => {
    try {
      const query = `SELECT followeeartist FROM listenerfollowsartist WHERE followerlistener = '${listenerId}';`;
      const response = await fetch('http://34.148.215.131:8111/query/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });
      const data = await response.json();
      setFolloweeArtists(data);
    } catch (error) {
      console.error('Error fetching followees:', error);
    }
  };

  const fetchListenerFollowers = async (listenerId) => {
    try {
      const query = `SELECT followerlistener FROM followsbetweenlisteners WHERE followeelistener = '${listenerId}';`;
      const response = await fetch('http://34.148.215.131:8111/query/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });
      const data = await response.json();
      setFollowerListeners(data);
    } catch (error) {
      console.error('Error fetching followers:', error);
    }
  };

  const fetchListenerFollowees = async (listenerId) => {
    try {
      const query = `SELECT followeelistener FROM followsbetweenlisteners WHERE followerlistener = '${listenerId}';`;
      const response = await fetch('http://34.148.215.131:8111/query/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });
      const data = await response.json();
      setFolloweeListeners(data);
    } catch (error) {
      console.error('Error fetching followees:', error);
    }
  };





  const isInListenerTable = async (userId) => {
    try {
      const query = `SELECT * FROM listener WHERE listener_id = '${userId}';`;
      const response = await fetch('http://34.148.215.131:8111/query/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });
      const data = await response.json();
      return data.length > 0; // If data is returned, the user ID exists in the listener table
    } catch (error) {
      console.error('Error checking if user is in listener table:', error);
      return false;
    }
  };












  const removeRelationship = async (followerOrFolloweeId, isFollower, isArtist) => {
    try {
      const currentUserIsArtist = await isInArtistTable(userId);
      const currentUserIsListener = await isInListenerTable(userId);

      if (currentUserIsArtist) {
        if (isArtist) {
          if (!isFollower) {
            const query = `DELETE FROM followsbetweenartists WHERE followerartist = '${userId}' AND followeeartist = '${followerOrFolloweeId}';`;
            await fetch('http://34.148.215.131:8111/query/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ query })
            });
          } else {
            const query = `DELETE FROM followsbetweenartists WHERE followerartist = '${followerOrFolloweeId}' AND followeeartist = '${userId}';`;
            await fetch('http://34.148.215.131:8111/query/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ query })
            });
          }
        } else {
          if (isFollower) {
            const query = `DELETE FROM listenerfollowsartist WHERE followerlistener = '${followerOrFolloweeId}' AND followeeartist = '${userId}';`;
            await fetch('http://34.148.215.131:8111/query/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ query })
            });
          } else {
            const query = `DELETE FROM artistfollowslistener WHERE followeelistener = '${followerOrFolloweeId}' AND followerartist = '${userId}';`;
            await fetch('http://34.148.215.131:8111/query/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ query })
            });
          }
        }
      } else if (currentUserIsListener) {
        if (isArtist) {
          if (!isFollower) {
            const query = `DELETE FROM listenerfollowsartist WHERE followerlistener = '${userId}' AND followeeartist = '${followerOrFolloweeId}';`;
            await fetch('http://34.148.215.131:8111/query/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ query })
            });
          } else {
            const query = `DELETE FROM artistfollowslistener WHERE followeelistener = '${userId}' AND followerartist = '${followerOrFolloweeId}';`;
            await fetch('http://34.148.215.131:8111/query/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ query })
            });
          }
        } else {
          if (isFollower) {
            const query = `DELETE FROM followsbetweenlisteners WHERE followerlistener = '${followerOrFolloweeId}' AND followeelistener = '${userId}';`;
            await fetch('http://34.148.215.131:8111/query/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ query })
            });
          } else {
            const query = `DELETE FROM followsbetweenlisteners WHERE followeelistener = '${followerOrFolloweeId}' AND followerlistener = '${userId}';`;
            await fetch('http://34.148.215.131:8111/query/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ query })
            });
          }
        }
      } else {
        console.error('User ID not found in artist or listener table.');
      }
      window.location.reload();
    } catch (error) {
      console.error('Error removing relationship:', error);
    }
  };



  return (
    <div>
      <h2>List of Your Followers</h2>
      <h3>Artists:</h3>
      <ul>
        {followerArtists.map((followerId) => (
          <li key={followerId}>
            Follower (Artist): {followerId}{' '}
            <button onClick={() => removeRelationship(followerId, true, true)}>Remove</button>
          </li>
        ))}
      </ul>
      <h3>Listeners:</h3>
      <ul>
        {followerListeners.map((followerId) => (
          <li key={followerId}>
            Follower (Listener): {followerId}{' '}
            <button onClick={() => removeRelationship(followerId, true, false)}>Remove</button>
          </li>
        ))}
      </ul>

      <h2>List of Who You Follow</h2>
      <h3>Artists:</h3>
      <ul>
        {followeeArtists.map((followeeId) => (
          <li key={followeeId}>
            Followee (Artist): {followeeId}{' '}
            <button onClick={() => removeRelationship(followeeId, false, true)}>Remove</button>
          </li>
        ))}
      </ul>
      <h3>Listeners:</h3>
      <ul>
        {followeeListeners.map((followeeId) => (
          <li key={followeeId}>
            Followee (Listener): {followeeId}{' '}
            <button onClick={() => removeRelationship(followeeId, false, false)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RemoveFoll;
