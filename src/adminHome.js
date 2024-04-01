import React from 'react';
import { useLocation } from 'react-router-dom';




const AdminPage = ({ }) => {
  const location = useLocation();
  const { state } = location;
  const { username } = state;

  return (
    <div>
      <h1>Hello Admin!</h1>
      <h2>Your id is {state.user_id}</h2>
      <p>Your privileges will consist of moderating, maintaining, and manipulating different parts of this app.</p>
      <p>All these functionalities will be added soon...</p>
    </div>
  );
};

export default AdminPage;
